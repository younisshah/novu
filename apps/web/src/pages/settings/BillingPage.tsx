import { FC } from 'react';
import { BillingRoutes } from '../BillingPages';
import { SettingsPageContainer } from './SettingsPageContainer';

export const BillingPage: FC = () => {
  return (
    <SettingsPageContainer title={'Billing'}>
      <BillingRoutes />
    </SettingsPageContainer>
  );
};
