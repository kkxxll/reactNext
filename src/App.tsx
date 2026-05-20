import classNames from 'classnames'
import './App.css';
import styles from './app.module.scss'

function App() {
  return (
    <div className="App">
      <header className={styles.box}>
        <p className={classNames('btn', {
          'btn-active': true
        })}>
          123
        </p>
      </header>
    </div>
  );
}

export default App;
