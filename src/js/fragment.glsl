uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;
uniform vec2 accel;
uniform vec2 mouse;
uniform float velocity;
uniform float alpha;

varying vec2 vUv;
varying vec2 vUv1;
varying vec4 vPosition;


vec2 mirrored(vec2 v) {
	vec2 m = mod(v,2.);
	return mix(m,2.0 - m, step(1.0 ,m));
}



void main()	{
	vec2 uv = gl_FragCoord.xy/pixels.xy;

	vec2 uv1 = vUv1;
	uv1.y += sin(uv1.y * 5.005 + time * 0.8) * 0.0022;
	uv1.x += sin(uv1.x * 10.005 + time * 0.6) * 0.0032;


	float dist = 10.*distance(vec2(mouse.x, ((1. - mouse.y) - 0.5)*uvRate1.y + 0.5 ),vUv1);


	uv1.x = (uv1.x - 0.5)*(1.-progress) + 0.5;



	
	

	if(dist<1.){
		//rgba1 = vec4(1.,0.,0.,1.);
		float abs = 1. - dist;
		float time1 = time * 3.3;
		float time2 = time * 1.8;

		uv1.x += sin(gl_FragCoord.y * 0.04 + time2) * 0.005 * abs * velocity;
		uv1.x += sin(gl_FragCoord.y * 0.036 + (time1 * 1.5)) * 0.003 * abs * velocity;

		uv1.y += sin(gl_FragCoord.x * 0.06 + time1) * 0.006 * abs * velocity;
		uv1.y += sin(gl_FragCoord.x * 0.046 + (time1 * 2.)) * 0.004 * abs * velocity;
	}
	vec4 rgba1 = texture2D(texture1,mirrored(uv1));

	if(dist<1.){
		rgba1 *= 1. + 2.*(1. - dist)*(1. - dist);
		// rgba1 = vec4(1.,0.,0.,1.);
	}

	gl_FragColor = rgba1*alpha;
	// gl_FragColor = vec4(dist);
	
}