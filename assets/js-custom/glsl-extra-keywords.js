// Adds keywords not recognized by rouge highlighter

window.addEventListener("DOMContentLoaded", () => {
	const keywords = [
		"texelFetch",
		"imageLoad",
		"imageStore",
		"atomicAdd",
		"texture2D",
		"texture",
		"restrict",
		"buffer"
	];

	const keywords_reserved = [
		"gl_GlobalInvocationID"
	];

	document.querySelectorAll("pre code span").forEach(span => {
		const text = span.textContent || "";
		if (keywords.some(word => text.includes(word))) {
			span.className = "k";
		}
		if (keywords_reserved.some(word => text.includes(word))) {
			span.className = "kr";
		}
	});
});