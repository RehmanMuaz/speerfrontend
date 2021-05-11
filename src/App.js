import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Landing from './Routes/Landing';

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <Navbar/>
                <Landing/>
            </header>
        </div>
    );
}

export default App;
