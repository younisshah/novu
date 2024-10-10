import { Container, Tabs } from '@mantine/core';
import { IconConnectedTv } from '@novu/design-system';
import { Outlet } from 'react-router-dom';
import { OnboardingUseCasesTabsEnum } from '../../consts/OnboardingUseCasesTabsEnum';
import { UseCasesConst } from '../../consts/UseCases.const';
import { GetStartedTab } from '../../layout/GetStartedTab';
import { GetStartedTabConfig, ICON_STYLE, TAB_CONFIGS } from './GetStartedTabs.const';
import useStyles from './GetStartedTabs.style';
import { useGetStartedTabs } from './useGetStartedTabs';
import { useGetStartedTabView } from './useGetStartedTabView';
import { EchoTab } from './EchoTab';

interface IGetStartedTabsProps extends ReturnType<typeof useGetStartedTabs> {
  tabConfigs?: GetStartedTabConfig[];
}

export const GetStartedTabs: React.FC<IGetStartedTabsProps> = ({ tabConfigs = TAB_CONFIGS, currentTab, setTab }) => {
  const { classes } = useStyles();
  const { currentView, setView } = useGetStartedTabView();

  return (
    <Container fluid mt={15} ml={5}>
      <Tabs
        orientation="horizontal"
        // must disable, otherwise causes memory leaks with animations!
        keepMounted={false}
        onTabChange={(tabValue: OnboardingUseCasesTabsEnum) => {
          // reset the view when changing tabs
          setView(null);
          setTab(tabValue);
        }}
        variant="default"
        value={currentTab}
        classNames={classes}
        mb={15}
      >
        <Tabs.List>
          <Tabs.Tab
            key={`tab-${OnboardingUseCasesTabsEnum.ECHO}`}
            value={OnboardingUseCasesTabsEnum.ECHO}
            icon={<IconConnectedTv style={ICON_STYLE} />}
          >
            Workflows
          </Tabs.Tab>
          {tabConfigs.map(({ value, icon, title }) => (
            <Tabs.Tab key={`tab-${value}`} value={value} icon={icon}>
              {title}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {tabConfigs.map(({ value }) => (
          <Tabs.Panel key={`tab-panel-${value}`} value={value}>
            <GetStartedTab setView={setView} currentView={currentView} {...UseCasesConst[value]} />
          </Tabs.Panel>
        ))}
        <Tabs.Panel key={`tab-panel-${OnboardingUseCasesTabsEnum.ECHO}`} value={OnboardingUseCasesTabsEnum.ECHO}>
          <EchoTab />
        </Tabs.Panel>
      </Tabs>
      <Outlet />
    </Container>
  );
};
