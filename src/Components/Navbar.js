import '../App.css';
import { AiOutlineMenu } from 'react-icons/ai';

function Navbar() {
	return (
        <nav>
            <div className='nav-container'>
                <AiOutlineMenu id='burger' size={45}/>
                <h1 id='nav-title'>EXP|CON</h1>
            </div>
        </nav>
	);
}

export default Navbar;
