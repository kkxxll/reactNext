import classNames from 'classnames'
import './App.css';
function App() {
  return (
    <div className="App">
      <header className='App-header'>
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
