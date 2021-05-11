import React, { useRef, useState, useEffect } from 'react'
import { ShaderMaterial, Vector2, Texture, TextureLoader, GLSL3, Clock } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from 'react-spring';

function Three() {
    return (
		<Canvas orthographic camera={{ zoom: 1, position: [0, 0, 100] }}>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<Container position={[0, 0, 0]} url1='./images/img1.png' url2='./images/img2.png' url3='./images/img3.png'/>
	 	</Canvas>
    )
}

function Container({url1, url2, url3, ...props}) {
  	// This reference will give us direct access to the mesh
  	const mesh = useRef();

	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false)
	const [active, setActive] = useState(false)

	const vertexShader = `
	varying vec2 vUv;

	void main(void)	{
		vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
		
		vUv = uv;
		gl_Position = projectionMatrix * modelViewPosition;
	}
	`

	const fragmentShader = `
	precision highp float;
	
	uniform bool animate;
	uniform float time; // TODO: Use
	uniform vec2 resolution;
	uniform vec2 center;
	uniform float force;
	uniform float size;
	uniform float thickness;
	
	varying vec2 vUv;
	uniform sampler2D image;

	out vec4 fragColor;

	
	void main(void) {
		vec2 uv = vUv;

		float ratio = resolution.x / resolution.y;
		vec2 scaledUV = (uv - vec2(0.5, 0.0)) / vec2(ratio, 1.0) + vec2(0.5, 0.0);
		float mask = (1.0 - smoothstep(size - 0.1, size, length(scaledUV - center))) *
					smoothstep(size - thickness, size - 0.1, length(scaledUV - center));
		vec2 disp = normalize(scaledUV - center) * force * mask;
	
		//vec4 color = vec4(mask);
		vec4 color = texture(image, uv - disp);
		fragColor = color;
	}
	`

	const textures = [];
	textures.push(new TextureLoader().load(url1))
	textures.push(new TextureLoader().load(url2))
	textures.push(new TextureLoader().load(url3))

	const uniforms = {
		resolution: { value: new Vector2(1920, 1195) }, // TODO: Make this the size of the canvas
		center: { value: new Vector2(0.5,0.5)},
		force: { value: 0.06 },
		size: { value: 0 },
		thickness: { value: 0.32 },
		image: { type: 't', value: textures[0] }
	}
	

	useFrame((state, delta) => {
		if(mesh.current.material.uniforms.size.value < 1){
			mesh.current.material.uniforms.size.value += 0.01;
			//console.log(mesh.current.material.uniforms.size.value);
		}
	});

    return (
		<mesh
		{...props}
		ref={mesh}
		scale={active ? 1 : 1}
		//onClick={(event) => setActive(!active)}
		//onPointerOver={(event) => setHover(true)}
		onPointerOut={(event) => setHover(false)}>
		<planeGeometry args={[ 1920 , 1195 ]}/>
		<shaderMaterial uniforms={uniforms} fragmentShader={fragmentShader} vertexShader={vertexShader} glslVersion={GLSL3}/>
	  </mesh>
    )
}

export default Three;


