const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
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
  const n = 9;
  const verties = new Float32Array([
    0.0, 1.0, -4.0, 0.4, 1.0, 0.4,
    -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
    0.5, -1.0, -4.0, 1.0, 0.4, 0.4,

    0.0, 1.0, -2.0, 1.0, 1.0, 0.4,
    -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
    0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

    0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
    -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
    0.5, -1.0, 0.0, 1.0, 0.4, 0.4
  ]);
  const size = verties.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if(a_Position < 0) {
    throw new Error(`Failed to get the a_Position`)
  }

  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if(a_Color < 0) {
    throw new Error(`Failed to get the a_Color`);
  }

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size * 3)
  gl.enableVertexAttribArray(a_Color)

  return n;
};

const onLoad = () => {
  const canvas = document.getElementById("canvas");

  const gl = getWebGLContext(canvas);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    throw new Error(`Failed to init shaders!`);
  }

  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  const n = initVertexBuffers(gl);
  if(n < 0) {
    throw new Error(`Failed to initVertexBuffers!`)
  }

  const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if(!u_ProjMatrix) {
    throw new Error(`Failed to get the u_ProjMatrix`)
  }

  const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix) {
    throw new Error(`Failed to get the u_ViewMatrix`)
  }

  const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix")
  if(!u_ModelMatrix) {
    throw new Error(`Failed to get the u_ModelMatrix`)
  }

  const projMatrix = new Matrix4();
  const viewMatrix = new Matrix4();
  const modelMatrix = new Matrix4();

  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  const aspect = canvas.clientWidth / canvas.clientHeight;
  projMatrix.setPerspective(30, aspect, 1, 100)
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements)

  gl.clear(gl.COLOR_BUFFER_BIT);

  // 画右边的三角形组 
  modelMatrix.setTranslate(0.75, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, n);

  // 画左边的三角形组
  modelMatrix.setTranslate(-0.75, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 0, n);
};
