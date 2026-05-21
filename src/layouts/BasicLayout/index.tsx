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
    const match = menuItems?.find(
      (item) => item && location.pathname.startsWith(item.key as string),
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
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div
          className={`flex items-center justify-center h-14 font-semibold text-white bg-white/5 ${
            collapsed ? 'text-sm' : 'text-base'
          }`}
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
          className="flex items-center justify-between px-4 border-b border-gray-100"
          style={{ background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="!w-12 !h-12 !text-base"
          />
          <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
            <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
              <Avatar size="small" icon={<UserOutlined />} />
              <span>Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          className="m-4 p-6 min-h-[280px]"
          style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
