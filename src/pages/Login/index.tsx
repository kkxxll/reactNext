import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 接入真实登录接口
    navigate('/dashboard');
  };

  return (
    <div className={styles.login}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2 className={styles.title}>后台管理登录</h2>
        <input
          className={styles.input}
          type="text"
          placeholder="用户名"
          defaultValue="admin"
        />
        <input
          className={styles.input}
          type="password"
          placeholder="密码"
          defaultValue="123456"
        />
        <button className={styles.submit} type="submit">
          登录
        </button>
      </form>
    </div>
  );
}

export default Login;
