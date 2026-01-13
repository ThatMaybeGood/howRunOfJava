import React, { useState } from 'react';
import { Layout, Menu, theme, ConfigProvider, message } from 'antd';
import {
    HomeOutlined,
    ApartmentOutlined,
    DatabaseOutlined,
    SettingOutlined,
    PlayCircleOutlined,
    SearchOutlined
} from '@ant-design/icons';
import ProcessList from './pages/ProcessList';
import ProcessDesign from './pages/ProcessDesign';
import ProcessRun from './pages/ProcessRun';
import DataPool from './pages/DataPool';
import RuleLibrary from './pages/RuleLibrary';
import './App.css';

const { Header, Content, Sider } = Layout;

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('process-list');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: 'process-list',
            icon: <HomeOutlined />,
            label: '流程列表',
        },
        {
            key: 'process-design',
            icon: <ApartmentOutlined />,
            label: '流程设计',
        },
        {
            key: 'process-run',
            icon: <PlayCircleOutlined />,
            label: '流程运行',
        },
        {
            key: 'search-flow',
            icon: <SearchOutlined />,
            label: '路径查询',
        },
        {
            key: 'rule-library',
            icon: <SettingOutlined />,
            label: '规则库',
        },
        {
            key: 'data-pool',
            icon: <DatabaseOutlined />,
            label: '数据池',
        },
    ];

    const renderContent = () => {
        switch (selectedMenu) {
            case 'process-list':
                return <ProcessList />;
            case 'process-design':
                return <ProcessDesign />;
            case 'process-run':
                return <ProcessRun />;
            case 'rule-library':
                return <RuleLibrary />;
            case 'data-pool':
                return <DataPool />;
            case 'search-flow':
                return <ProcessSearch />;
            default:
                return <ProcessList />;
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 6,
                },
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    theme="light"
                >
                    <div className="demo-logo-vertical" style={{ padding: '16px' }}>
                        <h3 style={{ margin: 0, textAlign: 'center', color: '#1890ff' }}>
                            {collapsed ? 'BP' : '业务流程平台'}
                        </h3>
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        items={menuItems}
                        onClick={({ key }) => setSelectedMenu(key)}
                    />
                </Sider>
                <Layout>
                    <Header style={{
                        padding: '0 24px',
                        background: colorBgContainer,
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <h2 style={{ margin: 0 }}>
                            {menuItems.find(item => item.key === selectedMenu)?.label}
                        </h2>
                    </Header>
                    <Content style={{ margin: '16px' }}>
                        <div style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}>
                            {renderContent()}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default App;