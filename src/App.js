import logo from './logo.svg';
import './App.css';
import Three from './Components/ThreeJS/Three';
import { FaBars } from 'react-icons/fa';


function App() {
  return (
    <div className="app">
      <header className="app-header">
        <nav>
          <div className='nav-container'>
            <FaBars id='burger'/>
            <plaintext id='nav-title'>EXP|CON</plaintext>
         </div>
        </nav>
        <Three/>
      </header>
    </div>
  );
}

export default App;
