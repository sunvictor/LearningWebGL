const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_CosB, u_SinB;
  void main() {

    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
    gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
    gl_Position.z = a_Position.z;
    gl_Position.w = a_Position.w;

    // gl_Position = a_Position;
    // gl_PointSize = 10.0;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = vec4(1.0,0.0,1.0,1.0);
  }
`;

const initVertexBuffers = (gl) => {
  const n = 3;
  const verties = new Float32Array([0, 0.5, -0.5, -0.2, 0.8, -0.8]);

  // 1、创建缓冲区对象
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    throw new Error("Failed to create the buffer object!");
  }

  // 2、将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // 3、向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);

  // 4、将缓冲区对象分配给 a_Position 变量
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    throw new Error("Failed to get a_Position");
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // 5、连接 a_Position 对象与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  return n;
};

const onLoad = () => {
  const canvas = document.getElementById("canvas");

  const gl = getWebGLContext(canvas);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    throw new Error("Failed to create shaders");
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    throw new Error("Failed to set the positions of the verties!");
  }

  const ANGLE = 90;
  const radian = (ANGLE * Math.PI) / 180;
  const cosB = Math.cos(radian);
  const sinB = Math.sin(radian);
  const u_CosB = gl.getUniformLocation(gl.program, "u_CosB");
  if (!u_CosB) {
    throw new Error(`Failed to get the u_CosB!`);
  }
  const u_SinB = gl.getUniformLocation(gl.program, "u_SinB");
  if (!u_SinB) {
    throw new Error(`Failed to get the u_SinB!`);
  }
  gl.uniform1f(u_CosB, cosB);
  gl.uniform1f(u_SinB, sinB);

  gl.clearColor(0, 0, 1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
};
