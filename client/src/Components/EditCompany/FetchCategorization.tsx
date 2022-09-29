import React, { useCallback, useState, useEffect } from 'react';
import { Button, Card } from '@shopify/polaris';
import { getData } from '../../Data';
import { useToast } from '../../BridgeHooks';

interface CategorizationDataReponse {
  progress: number;
  downloadError: { error: boolean; downloadErrorMessage: string };
}

function FetchCategorization() {
  const showToast = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const handleStartDownload = useCallback(async () => {
    setLoading(true);
    const categorizationData: any = await getData<CategorizationDataReponse>(
      '/pim/categorizations/pim1',
    )
      .then(() => {
        showToast({ message: 'Categorization download done', error: false });
        setLoading(false);
        return categorizationData;
      })
      .catch((e) => {
        showToast({ message: 'Failed to fetch data from PIM1', error: true });
        setLoading(false);
      });
  }, [showToast]);

  return (
    <Card.Section>
      <Button onClick={handleStartDownload} loading={loading}>
        Download categorization data from PIM1
      </Button>
    </Card.Section>
  );
}

export default FetchCategorization;
