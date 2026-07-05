#ifdef GL_ES
precision mediump float;
#endif

#define dt 0.15
#define nu 0.2

#define PI 3.141592653589793

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_buffer0;

vec4 T(vec2 p)
{
	return texture2D(u_buffer0, p / u_resolution, 0.0);
}

const float poisson_filter[7] = float[](
    .57843719174,
    .36519596949,
    .23187988879,
    .14529589353,
    .08816487385,
    .05184872885,
    .02906462467
);

float gaussian(float w, float s) {
    return exp(-(w*w) / (2.*s*s)) / (s * sqrt(radians(360.)));
}

#if defined( BUFFER_0 )

void main()
{
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;

	vec2 p = gl_FragCoord.xy;
}

#elif defined( BUFFER_1 )

void main()
{
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;

	vec2 p = gl_FragCoord.xy;
}

#else

void main()
{
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;
}

#endif