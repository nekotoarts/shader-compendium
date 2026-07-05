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
	float TIME = mod(u_time, 10.0);

	vec2 p = gl_FragCoord.xy;
	
	if (TIME < 2.0)
	{
		float d = distance(uv, vec2(0.5));
		float mask = 1.0 - step(0.25, d);
		vec2 dir = uv - vec2(0.5);
		float magnitude = 1.0 / dt;
		gl_FragColor = vec4(magnitude * dir * mask, 0.0, 0.0);
		return;
	}

	// Jos Stam Advection Scheme
	vec2 current_vel = T(p).xy;
	vec2 lookup_pos = p - current_vel * dt;
	vec2 new_vel = T(lookup_pos).xy;

	// Nekoto modification for zero-velocity pixels
	// if (dot(current_vel,current_vel) < 0.1)
	// {
	// 	// Gather all the neighboring velocities
	// 	vec2 n = T(p + vec2(0,1)).xy;
	// 	vec2 e = T(p + vec2(1,0)).xy;
	// 	vec2 s = T(p - vec2(0,1)).xy;
	// 	vec2 w = T(p - vec2(1,0)).xy;

	// 	// Find out where the neighboring velocities will end up on the next time-step
	// 	vec2 nt = p + vec2(0,1) + n*dt;
	// 	vec2 et = p + vec2(1,0) + e*dt;
	// 	vec2 st = p - vec2(0,1) + s*dt;
	// 	vec2 wt = p - vec2(1,0) + w*dt;

	// 	// Compare how "different" the location they are pointing to is from your current location
	// 	float d1 = distance(nt, p);
	// 	float d2 = distance(et, p);
	// 	float d3 = distance(st, p);
	// 	float d4 = distance(wt, p);

	// 	// Copy the value of the one that is most similar to your current position
	// 	float ld = min(min(min(d1,d2),d3),d4);
	// 	if (ld == d1) new_vel = nt;
	// 	else if (ld == d2) new_vel = et;
	// 	else if (ld == d3) new_vel = st;
	// 	else new_vel = wt;
	// }

	gl_FragColor = vec4(new_vel, 0.0, 0.0);
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