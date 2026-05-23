import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { login } from '../../services/auth';
import styles from './index.module.scss';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('张三');
  const [password, setPassword] = useState('123456');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      message.warning('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      await login({ username: username.trim(), password });
      message.success('登录成功');
      navigate('/dashboard');
    } catch {
      // 错误已由 request.ts 拦截器统一处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2 className={styles.title}>后台管理登录</h2>
        <input
          className={styles.input}
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}

export default Login;
