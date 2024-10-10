import { Center, Loader } from '@mantine/core';
import { colors } from '@novu/design-system';
import { useSegment } from '@novu/shared-web';
import { useEffect } from 'react';
import PageContainer from '../../components/layout/components/PageContainer';
import PageHeader from '../../components/layout/components/PageHeader';
import { useAuthContext } from '../../components/providers/AuthProvider';
import { usePageViewTracking } from '../../hooks/usePageViewTracking';
import { css } from '../../styled-system/css';
import { EchoTab } from './components/get-started-tabs/EchoTab';

const PAGE_TITLE = 'Get started';

export function GetStartedPage() {
  const { currentOrganization } = useAuthContext();
  const segment = useSegment();

  usePageViewTracking();

  useEffect(() => {
    segment.track('Page visit - [Get Started]');
  }, [segment]);

  return (
    <PageContainer title={PAGE_TITLE}>
      <PageHeader title={PAGE_TITLE} />
      {currentOrganization ? (
        <EchoTab
          className={css({ marginTop: '-100', paddingLeft: '150', paddingRight: '150', paddingBottom: '100' })}
        />
      ) : (
        <Center>
          <Loader color={colors.error} size={32} />
        </Center>
      )}
    </PageContainer>
  );
}
