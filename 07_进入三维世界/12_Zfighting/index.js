const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewProjMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ViewProjMatrix * a_Position;
    v_Color = a_Color;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`;

const initVertexBuffers = (gl) => {
  const n = 6;
  const verties = new Float32Array([
    0.0, 2.5, -5.0, 0.0, 1.0, 0.0,

    -2.5, -2.5, -5.0, 0.0, 1.0, 0.0,

    2.5, -2.5, -5.0, 1.0, 0.0, 0.0,

    0.0, 3.0, -5.0, 1.0, 0.0, 0.0,

    -3.0, -3.0, -5.0, 1.0, 1.0, 0.0,

    3.0, -3.0, -5.0, 1.0, 1.0, 0.0,
  ]);
  const size = verties.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    throw new Error(`Failed to get the a_Position`);
  }

  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    throw new Error(`Failed to get the a_Color`);
  }

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size * 3);
  gl.enableVertexAttribArray(a_Color);

  return n;
};

const onLoad = () => {
  const canvas = document.getElementById("canvas");

  const gl = getWebGLContext(canvas);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    throw new Error(`Failed to init shaders!`);
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    throw new Error(`Failed to initVertexBuffers!`);
  }

  const u_ViewProjMatrix = gl.getUniformLocation(
    gl.program,
    "u_ViewProjMatrix"
  );
  if (!u_ViewProjMatrix) {
    throw new Error(`Failed to get the u_ViewProjMatrix!`);
  }

  var viewProjMatrix = new Matrix4();
  // Set the eye point, look-at point, and up vector.
  viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  viewProjMatrix.lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);

  // Pass the view projection matrix to u_ViewProjMatrix
  gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix.elements);

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n / 2);
  gl.polygonOffset(1.0, 1.0);
  gl.drawArrays(gl.TRIANGLES, n / 2, n / 2);
};
