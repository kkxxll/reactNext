import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <h1 style={{ fontSize: 48, margin: 0 }}>404</h1>
      <p>抱歉，你访问的页面不存在。</p>
      <Link to="/dashboard">返回首页</Link>
    </div>
  );
}

export default NotFound;
