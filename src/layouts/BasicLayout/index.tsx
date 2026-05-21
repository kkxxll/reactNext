import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps['items'] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
];

function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const selectedKeys = useMemo(() => {
    const match = menuItems?.find((item) =>
      item && location.pathname.startsWith(item.key as string),
    );
    return match ? [match.key as string] : ['/dashboard'];
  }, [location.pathname]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const userMenu: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => navigate('/login'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div
          style={{
            height: 56,
            margin: 0,
            color: '#fff',
            fontWeight: 600,
            fontSize: collapsed ? 14 : 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          {collapsed ? '后台' : '后台管理系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 48, height: 48 }}
          />
          <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
              <Avatar size="small" icon={<UserOutlined />} />
              <span>Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 16,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
