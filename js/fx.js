// Hero background FX: volumetric smoke + teal light (WebGL shader)
(() => {
  const canvas = document.getElementById("fx-canvas");
  if (!canvas) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    canvas.remove();
    return;
  }

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) {
    canvas.remove();
    return;
  }

  const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

  const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0) * 2.4;
  float t = u_time * 0.045;

  // domain-warped fbm => living smoke
  vec2 q = vec2(
    fbm(p + vec2(t * 0.9, t * 0.25)),
    fbm(p + vec2(5.2, 1.3) - vec2(t * 0.5, 0.0))
  );
  vec2 r = vec2(
    fbm(p + 3.0 * q + vec2(1.7, 9.2) + vec2(t * 0.6, 0.0)),
    fbm(p + 3.0 * q + vec2(8.3, 2.8) - vec2(0.0, t * 0.4))
  );
  float f = fbm(p + 2.6 * r);
  float smoke = smoothstep(0.48, 1.15, f);

  // teal glow pools (roughly around headlights / sides)
  vec2 gl1 = uv - vec2(0.36, 0.40);
  vec2 gl2 = uv - vec2(0.68, 0.42);
  float glowL = exp(-10.0 * dot(gl1, gl1));
  float glowR = exp(-10.0 * dot(gl2, gl2));

  // wide soft backlight from top
  float top = exp(-4.5 * pow(1.0 - uv.y, 2.0)) * 0.35;

  // slow diagonal light shaft
  float shaft = sin((uv.x - uv.y) * 5.0 + t * 2.0) * 0.5 + 0.5;
  shaft = pow(shaft, 6.0) * 0.30;

  vec3 teal = vec3(0.21, 0.84, 0.82);
  vec3 deep = vec3(0.04, 0.16, 0.18);

  vec3 col = deep * smoke * 0.7;
  col += teal * smoke * (0.22 * glowL + 0.28 * glowR + 0.05);
  col += teal * (top + shaft) * smoke * 0.45;

  // vignette: keep the center (car + title) clean, smoke lives at the edges
  float edge = smoothstep(0.18, 0.62, length(uv - vec2(0.5, 0.45)));
  col *= 0.25 + 0.75 * edge;

  // fade out at the bottom so the section blends into the page
  col *= smoothstep(0.0, 0.30, uv.y);
  // gentle fade at the very top under the header
  col *= 0.55 + 0.45 * smoothstep(1.0, 0.85, uv.y);

  gl_FragColor = vec4(col, 1.0);
}`;

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("fx shader:", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) {
    canvas.remove();
    return;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // fullscreen triangle
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");

  // render at reduced resolution: smoke is soft anyway, huge perf win
  const SCALE = 0.5;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr * SCALE));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr * SCALE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  let visible = true;
  let raf = 0;
  const start = performance.now();

  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }

  function play() {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    play();
  }).observe(canvas);

  document.addEventListener("visibilitychange", play);
  play();
})();
