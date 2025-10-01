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
    color = vec3(uv.x, uv.y, sin(u_time) * 0.5 + 0.5);

    gl_FragColor = vec4(color, 1.0);
}