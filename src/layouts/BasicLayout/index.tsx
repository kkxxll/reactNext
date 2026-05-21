import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './index.module.scss';

interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon?: string;
}

const menus: MenuItem[] = [
  { key: 'dashboard', label: '仪表盘', path: '/dashboard', icon: '📊' },
  { key: 'users', label: '用户管理', path: '/users', icon: '👥' },
  { key: 'settings', label: '系统设置', path: '/settings', icon: '⚙️' },
];

function BasicLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: 清理登录态
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sider}>
        <div className={styles.logo}>后台管理系统</div>
        <nav className={styles.menu}>
          {menus.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                classNames(styles.menuItem, { [styles.menuItemActive]: isActive })
              }
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>管理后台</div>
          <div className={styles.headerActions}>
            <span className={styles.username}>Admin</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              退出登录
            </button>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default BasicLayout;
