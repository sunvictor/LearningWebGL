const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
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
  const verties = new Float32Array([
    // Vertex coordinates and color
     1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
    -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
    -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
     1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
     1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
     1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
    -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
    -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
  ]);

  const indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    0, 3, 4,   0, 4, 5,    // right
    0, 5, 6,   0, 6, 1,    // up
    1, 6, 7,   1, 7, 2,    // left
    7, 4, 3,   7, 3, 2,    // down
    4, 7, 6,   4, 6, 5     // back
 ]);

  const size = verties.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    throw new Error(`Failed to get the a_Position!`);
  }

  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    throw new Error(`Failed to get the a_Color!`);
  }

  const vertexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size * 3);
  gl.enableVertexAttribArray(a_Color);

  // 将顶点索引数据写入缓冲区对象
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  return indices.length;
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

  const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if(!u_MvpMatrix) {
    throw new Error(`Failed to get the u_MvpMatrix!`)
  }

  const mvpMatrix = new Matrix4();
  const aspect = canvas.clientWidth / canvas.clientHeight
  mvpMatrix.setPerspective(30, aspect, 1, 100);
  mvpMatrix.lookAt(3,3,7, 0,0,0, 0,1,0);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // gl.drawArrays(gl.TRIANGLES, 0, n);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
};
