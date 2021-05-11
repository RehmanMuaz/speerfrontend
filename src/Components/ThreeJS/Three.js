import React, { useRef, useState } from 'react'
import { Vector2, TextureLoader, GLSL3 } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

function Three(props) {
    return (
		<Canvas orthographic camera={{ zoom: 1, position: [0, 0, 100] }}>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<Container position={[0, 0, 0]} url1='./images/img1.png' url2='./images/img2.png' url3='./images/img3.png' id={props.id}/>
	 	</Canvas>
    )
}

function Container({url1, url2, url3, id, ...props}) {
  	// This reference will give us direct access to the mesh
  	const mesh = useRef();

	// GL vertex shader code
	const vertexShader = `
	varying vec2 vUv;

	void main(void)	{
		vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
		
		vUv = uv;
		gl_Position = projectionMatrix * modelViewPosition;
	}
	`

	// GL fragment shader code
	const fragmentShader = `
	precision highp float;
	
	uniform bool animate;
	uniform float time; // TODO: Use
	uniform vec2 resolution;
	uniform vec2 center;
	uniform float force;
	uniform float size;
	uniform float thickness;
	uniform float blendB;
	uniform float blendC;
	
	varying vec2 vUv;
	uniform sampler2D image0;
	uniform sampler2D image1;
	uniform sampler2D image2;

	out vec4 fragColor;
	
	void main(void) {
		vec2 uv = vUv;

		float ratio = resolution.x / resolution.y;
		vec2 scaledUV = (uv - vec2(0.5, 0.0)) / vec2(ratio, 1.0) + vec2(0.5, 0.0);
		float mask = (1.0 - smoothstep(size - 0.1, size, length(scaledUV - center))) *
					smoothstep(size - thickness, size - 0.1, length(scaledUV - center));
		vec2 disp = normalize(scaledUV - center) * force * mask;
	
		vec2 finalUv = uv - disp;

		//vec4 color = vec4(mask);
		vec4 tex0 = texture2D(image0, finalUv);
		vec4 tex1 = texture2D(image1, finalUv);
		vec4 tex2 = texture2D(image2, finalUv);

		vec4 blend01 = mix(tex0, tex1, blendB);
		vec4 blend02 = mix(blend01, tex2, blendC);

		fragColor = blend02 * vec4(0.36,0.36,0.36,1);
	}
	`
	const textures = [];
	let selection = 0;

	textures.push(new TextureLoader().load(url1))
	textures.push(new TextureLoader().load(url2))
	textures.push(new TextureLoader().load(url3))

	// GL Shader Uniforms
	const uniforms = {
		resolution: { value: new Vector2(1920, 1195) }, // TODO: Make this the size of the canvas
		center: { value: new Vector2(0.5,0.5)},
		force: { value: 0.06 },
		size: { value: 0 },
		thickness: { value: 0.32 },
		blendB: { value: 0 },
		blendC: { value: 0 },
		image0: { type: 't', value: textures[0] },
		image1: { type: 't', value: textures[1] },
		image2: { type: 't', value: textures[2] },
	}
		

	// Per frame event
	useFrame((state, delta) => {
		animateShockwave(mesh, selection, id);	
	});

    return (
		<group>
			<mesh
				{...props}
				ref={mesh}
				scale={active ? 1 : 1}
				//onClick={(event) => setActive(!active)}
				//onPointerOver={(event) => setHover(true)}
				//onPointerOut={(event) => setHover(false)}
				>
				<planeGeometry args={[ 1920 , 1195 ]}/>
				<shaderMaterial uniforms={uniforms} fragmentShader={fragmentShader} vertexShader={vertexShader} glslVersion={GLSL3} needsUpdate='true'/>
			</mesh>
	  </group>
    )
}

// Animated Shockwave effect and changes picture
// TODO needs animation logic for each picture
function animateShockwave(ref, id, idNew)
{
	if(idNew == 0) {
		if(ref.current.material.uniforms.blendB.value < 1) {
			ref.current.material.uniforms.blendB.value += 0.01;
			if(ref.current.material.uniforms.blendC.value > 0) {
				ref.current.material.uniforms.blendC.value -= 0.01;
			}
			ref.current.material.uniforms.size.value += 0.01;
		}
		else{
			ref.current.material.uniforms.size.value = 0;
		}
	}

}

// Interpolates between two values
function lerp (start, end, amt){
	return (1-amt)*start+amt*end
}

export default Three;


