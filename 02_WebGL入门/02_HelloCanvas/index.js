function onLoad() {
  const canvas = document.getElementById("canvas");

  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get");
    return;
  }

  const VSHADER_SOURCE = `
    void main() {
      gl_Position = vec4(0.0,0.0,0.0,1.0);
      gl_PointSize = 10.0;
    }
  `;
  const FSHADER_SOURCE = `
    void main() {
      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
  `;

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    return;
  }

  gl.clearColor(0, 0, 1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 0, 1);
}
