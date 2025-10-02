#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main()
{
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);
    
	// Full vector field with divergence and curl
	vec2 v = vec2(2.0*uv.x - uv.y, uv.x);
	v = normalize(v);
	color.rg = v;

    gl_FragColor = vec4(color, 1.0);
}