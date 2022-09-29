import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import { Card } from '@shopify/polaris';
import { FieldArray, ArrayHelpers, connect, FormikProps } from 'formik';
import { Omit } from '@reach/router';
import { StickyContainer, Sticky } from 'react-sticky';
import { ProductPart } from '../../types';
import SinglePartEdit from './SinglePartEdit';
import PartsEdit, { PartsEditProps } from './PartsEdit';
import PartsAdd from './PartsAdd';
import PartsReplacements from './PartsReplacements';
import { CompanyContext } from '../../Context';

interface PartsLayoutProps {
  header: ReactNode;
  children: ReactNode;
}

export function PartsLayout(props: PartsLayoutProps) {
  const { header, children } = props;

  return (
    <StickyContainer>
      <Card>
        <Sticky>
          {({ style, isSticky }) => (
            <div
              style={{
                ...style,
                zIndex: 60,
                background: 'white',
                boxShadow: isSticky ? '0px 4px 5px -5px rgba(0,0,0,0.28)' : '',
              }}
            >
              <Card.Section>{header}</Card.Section>
            </div>
          )}
        </Sticky>
        <Card.Section>{children}</Card.Section>
      </Card>
    </StickyContainer>
  );
}

enum PartsView {
  Adding,
  Editing,
  SingleView,
}

interface InternalPartsProps extends Omit<PartsEditProps, 'onRequestAdd'> {
  onAddParts: (parts: ProductPart[]) => void;
  parts: ProductPart[];
}

function InternalParts(props: InternalPartsProps) {
  const { parts } = props;
  const [view, setView] = useState(PartsView.Editing);
  useEffect(() => {
    if (parts.length === 1) {
      setView(PartsView.SingleView);
    } else {
      setView(PartsView.Editing);
    }
  }, [parts.length]);
  const handleRequestEdit = useCallback(() => {
    if (parts.length === 1) {
      setView(PartsView.SingleView);
    } else {
      setView(PartsView.Editing);
    }
  }, [parts.length]);

  const handleRequestAdd = useCallback(() => {
    setView(PartsView.Adding);
  }, []);

  switch (view) {
    case PartsView.SingleView: {
      return (
        <SinglePartEdit
          {...props}
          part={parts[0]}
          onRequestAdd={handleRequestAdd}
        />
      );
    }
    case PartsView.Editing: {
      return <PartsEdit {...props} onRequestAdd={handleRequestAdd} />;
    }
    case PartsView.Adding: {
      return <PartsAdd {...props} onCancel={handleRequestEdit} />;
    }
    default:
      throw new Error('Not implemented');
  }
}

interface PartsProps {
  disabled: boolean;
}
function Parts(props: PartsProps & { formik: FormikProps<any> }) {
  const { formik, ...rest } = props;
  const {
    parts,
    option1,
    option2,
    option3,
  }: {
    parts: ProductPart[];
    option1: string;
    option2: string;
    option3: string;
  } = formik.values;
  const options = { option1, option2, option3 };

  const { features } = useContext(CompanyContext);

  return (
    <FieldArray name="parts">
      {({ move, remove, push }: ArrayHelpers) => (
        <>
          <InternalParts
            {...rest}
            parts={parts}
            options={options}
            onMovePart={move}
            onAddParts={(ps) => {
              ps.forEach(push);
            }}
            onDeletePart={remove}
          />
          {features.PRODUCTS_REPLACEMENTS && (
            <PartsReplacements {...props} parts={parts} />
          )}
        </>
      )}
    </FieldArray>
  );
}

export default connect<PartsProps>(Parts);
