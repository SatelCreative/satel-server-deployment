import React, {
  ReactNode,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  FormikValues,
  FormikProvider,
  Form as FormikForm,
  FormikContextType,
} from 'formik';
import {
  Layout,
  PageActions,
  PageActionsProps,
  ComplexAction,
  ContextualSaveBarProps,
} from '@shopify/polaris';
import { ContextualSaveBar } from '@shopify/app-bridge/actions';
import { Modal, Loading, useAppBridge } from '@shopify/app-bridge-react';

interface FormProps {
  renderFormElement: boolean;
  children: ReactNode;
}

function Form(props: FormProps) {
  const { renderFormElement, children } = props;
  if (renderFormElement) {
    return <FormikForm>{children}</FormikForm>;
  }
  return <>{children}</>;
}

export type ContextualSaveBarOptions = Omit<
  ContextualSaveBarProps,
  'saveAction' | 'discardAction'
> & {
  /** Force the ContextualSaveBar to show or hide */
  open?: boolean;
};

export type DiscardAction = ContextualSaveBarProps['discardAction'] & {
  /** When discard is pressed on a new resource */
  onBack?: () => void;
};

export type DeleteAction = ComplexAction & {
  /** Modal title */
  confirmationModalTitle: string;
  /** Modal message */
  confirmationModalMessage: string;
};

export interface PageFormProps<Values extends FormikValues = FormikValues> {
  /**
   * A formik instance, likely created with `useFormik`
   */
  formik: FormikContextType<Values>;

  /**
   * Component tree to render into the main body of the form
   */
  children: ReactNode;

  /**
   * If the internal layout is sectioned
   */
  sectioned?: boolean;

  /**
   * If the form is being to edit an existing resource
   *
   * When editing existing resource, modifies behavior of discard action and enables deletion
   */
  existingResource?: boolean;

  /**
   * Override the default ContextualSaveBar
   */
  contextualSaveBar?: ContextualSaveBarOptions;

  /**
   * Override default save action in ContextualSaveBar and page actions
   */
  saveAction?: ContextualSaveBarProps['saveAction'];

  /**
   * Override default discard action in ContextualSaveBar
   */
  discardAction?: DiscardAction;

  /**
   * Adds a destructive button and confirmation to the page
   */
  deleteAction?: DeleteAction;

  /**
   * Pass through a secondary page action to the form
   */
  secondaryPageActions?: PageActionsProps['secondaryActions'];

  /**
   * If a <form> element should be rendered
   * @default true
   */
  renderFormElement?: boolean;
}

export function PageForm<Values extends FormikValues = FormikValues>(
  props: PageFormProps<Values>,
) {
  const {
    children,
    formik,
    existingResource = false,
    sectioned = false,
    contextualSaveBar = {},
    saveAction = {},
    discardAction = {},
    deleteAction,
    secondaryPageActions = [],
    renderFormElement = true,
  } = props;

  const handleSubmit = useCallback(() => {
    formik.submitForm();
  }, [formik]);

  const handleDiscard = useCallback(() => {
    if (existingResource) {
      formik.resetForm();
    } else if (discardAction.onBack) {
      discardAction.onBack();
    }
  }, [discardAction, existingResource, formik]);

  const polarisSaveAction: ContextualSaveBar.Options['saveAction'] = {
    content: 'Save',
    disabled: !formik.dirty,
    loading: formik.isSubmitting,
    onAction: handleSubmit,
    ...saveAction,
  };

  const polarisDiscardAction: ContextualSaveBar.Options['discardAction'] = {
    content: 'Discard',
    disabled: (!formik.dirty || formik.isSubmitting) && existingResource,
    onAction: handleDiscard,
    discardConfirmationModal: formik.dirty,
    ...discardAction,
  };

  const loading = formik.isSubmitting;

  const contextualSaveBarOptions = useMemo<ContextualSaveBar.Options>(
    () => ({
      saveAction: {
        disabled: polarisSaveAction.disabled,
        loading: polarisSaveAction.loading,
      },
      discardAction: {
        disabled: polarisDiscardAction.disabled,
        loading: polarisDiscardAction.loading,
        discardConfirmationModal: polarisDiscardAction.discardConfirmationModal,
      },
    }),
    [
      polarisDiscardAction.disabled,
      polarisDiscardAction.discardConfirmationModal,
      polarisDiscardAction.loading,
      polarisSaveAction.disabled,
      polarisSaveAction.loading,
    ],
  );

  const app = useAppBridge();
  const [saveBarDelayed, setSaveBarDelayed] = useState(true);
  const [saveBar] = useState(
    ContextualSaveBar.create(app, contextualSaveBarOptions),
  );

  // Have to give enough time for route
  // Change to propagate
  useEffect(() => {
    const t = setTimeout(() => {
      setSaveBarDelayed(false);
    }, 100);
    return () => {
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const shouldBeHidden =
      saveBarDelayed ||
      (existingResource && !formik.dirty && !formik.isSubmitting) ||
      contextualSaveBar.open === false;
    if (contextualSaveBar.open !== true && shouldBeHidden) {
      saveBar.dispatch(ContextualSaveBar.Action.HIDE);
    } else {
      saveBar.set(contextualSaveBarOptions);
    }
  }, [
    contextualSaveBar.open,
    contextualSaveBarOptions,
    existingResource,
    formik.dirty,
    formik.isSubmitting,
    saveBar,
    saveBarDelayed,
  ]);

  useEffect(() => {
    const discardUnsubscribe = saveBar.subscribe(
      ContextualSaveBar.Action.DISCARD,
      handleDiscard,
    );

    const saveUnsubscribe = saveBar.subscribe(
      ContextualSaveBar.Action.SAVE,
      handleSubmit,
    );

    return () => {
      discardUnsubscribe();
      saveUnsubscribe();
    };
  }, [handleDiscard, handleSubmit, saveBar]);

  // When component unmounts
  useEffect(
    () => () => {
      saveBar.dispatch(ContextualSaveBar.Action.HIDE);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const handleRequestDelete = () => {
    setDeleteConfirmationModalOpen(true);
  };
  const handleCancelDelete = () => {
    setDeleteConfirmationModalOpen(false);
  };

  const secondaryActions = useMemo(() => {
    if (!deleteAction || !existingResource) {
      return secondaryPageActions;
    }

    const polarisDeleteAction: ComplexAction = {
      content: 'Delete',
      destructive: true,
      ...deleteAction,
      onAction: handleRequestDelete,
    };

    return [polarisDeleteAction, ...secondaryPageActions];
  }, [deleteAction, existingResource, secondaryPageActions]);

  const deleteConfirmationModalMarkup = useMemo(() => {
    if (!deleteAction) {
      return null;
    }

    const { content, confirmationModalTitle, confirmationModalMessage } =
      deleteAction;

    const deleting = deleteAction.loading ?? false;

    return (
      <Modal
        open={deleteConfirmationModalOpen}
        title={confirmationModalTitle}
        message={confirmationModalMessage}
        primaryAction={{
          content: content ?? 'Delete',
          destructive: true,
          disabled: deleting,
          loading: deleting,
          onAction: deleteAction.onAction,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleCancelDelete,
            disabled: deleting,
          },
        ]}
        onClose={handleCancelDelete}
      />
    );
  }, [deleteAction, deleteConfirmationModalOpen]);

  return (
    <FormikProvider value={formik}>
      <Form renderFormElement={renderFormElement}>
        {loading && <Loading />}
        {deleteConfirmationModalMarkup}
        <Layout>
          {sectioned ? (
            <Layout.Section key="children-section">{children}</Layout.Section>
          ) : (
            children
          )}
          <Layout.Section key="page-actions-section">
            <PageActions
              primaryAction={polarisSaveAction}
              secondaryActions={secondaryActions}
            />
          </Layout.Section>
        </Layout>
      </Form>
    </FormikProvider>
  );
}

PageForm.Section = Layout.Section;
PageForm.AnnotatedSection = Layout.AnnotatedSection;
