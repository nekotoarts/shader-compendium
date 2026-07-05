#ifdef GL_ES
precision mediump float;
#endif

#define dt 0.15
#define nu 0.5

#define PI 3.141592653589793

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_buffer0;

vec4 T(vec2 p)
{
	return texture2D(u_buffer0, p / u_resolution, 0.0);
}

#ifdef BUFFER_0

void main()
{
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;

	vec2 p = gl_FragCoord.xy;
	
	if (u_time < 2.0)
	{
		float d = distance(uv, vec2(0.5));
		float mask = 1.0 - step(0.25, d);
		vec2 dir = uv - vec2(0.5);
		gl_FragColor = vec4(dir * mask, 0.0, 0.0);
		return;
	}

	vec4 c = T(p);
	vec4 n = T(p + vec2(0,1));
	vec4 e = T(p + vec2(1,0));
	vec4 s = T(p - vec2(0,1));
	vec4 w = T(p - vec2(1,0));

	// Jos Stam Advection Scheme
	vec2 current_vel = c.xy;
	vec2 lookup_pos = p - current_vel * dt;
	vec2 new_vel = T(lookup_pos).xy;
	c.xy = new_vel;

	// Viscous Diffusion (explicit step using Laplacian calculation)
	// this is unstable at large time-steps
	vec4 laplacian = (n + e + s + w - 4.0*c);
	c.xy += dt * nu * laplacian.xy;

	gl_FragColor = vec4(c.xy, 0.0, 0.0);
}

#else

void main()
{
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;

	vec4 color = texture2D(u_buffer0, uv, 0.0);
	color.rg = abs(color.rg);
	color.a = 1.0;
	gl_FragColor = color;
}

#endif