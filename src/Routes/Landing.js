import React, { useState } from 'react'
import Navbar from '../Components/Navbar/Navbar';
import Three from '../Components/ThreeJS/Three';

import '../App.css';
import '../Components/Button.css';

// Creates a dot radio button
const Dot = ({ active, count, onClick }) => {
	return (
		<span onClick={onClick} className={active ? 'dot dot_active' : 'dot'}/>
	);
  };


function Landing() {
	// Chosen image
	const [imgID, setImgID] = useState(0);
	const listID = [0,1,2];

	return (
		<div id='landing-page'>
			<div className='webgl'>
				<Three id={imgID}/>
			</div>
			<div className='landing-wrap'>
				<h1>INTERACTIVE CONCERT EXPERIENCE</h1>
				<h2>Experience your favourite artists like never before and from the comfort of your own home.</h2>
				<a href="/" className="btn-cta">TRY IT NOW</a>
			</div>
			<div className = 'dot-wrap'>
				<div className='dot-container'>
					{listID.map(t => (
						<Dot
							key={t}
							count={t}
							active={t === imgID}
							onClick={() => setImgID(t)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default Landing;
