/**
 * 路由守卫组件
 *
 * 包裹需要登录才能访问的页面，未登录时重定向到 /login。
 */
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';

interface Props {
  children: React.ReactNode;
}

function RequireAuth({ children }: Props) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // 保存当前路径，登录后可跳回
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;
