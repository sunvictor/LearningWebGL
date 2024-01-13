function onLoad() {
  const canvas = document.getElementById("canvas");

  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get");
    return;
  }

  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
      gl_Position = a_Position;
      gl_PointSize = a_PointSize;
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

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    throw new Error(`a_Position is valid!`);
  }
  gl.vertexAttrib3f(a_Position, 0.5, 0, 0);

  const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  if (a_PointSize < 0) {
    throw new Error(`a_PointSize is valid!`);
  }
  gl.vertexAttrib1f(a_PointSize, 20.0);

  gl.drawArrays(gl.POINTS, 0, 1);

  const a_points = [];

  const click = (evt) => {
    const rect = evt.target.getBoundingClientRect();
    const width = canvas.width;
    const height = canvas.height;
    const x = evt.clientX;
    const y = evt.clientY;

    const x1 = x - rect.left;
    const y1 = y - rect.top;

    const x2 = x1 - width / 2;
    const y2 = -(y1 - height / 2);

    const x3 = x2 / (width / 2);
    const y3 = y2 / (height / 2);

    a_points.push([x3, y3]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const point of a_points) {
      gl.vertexAttrib3f(a_Position, ...point, 0);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  };

  canvas.addEventListener("mousedown", (evt) => {
    click(evt);
  });
}
