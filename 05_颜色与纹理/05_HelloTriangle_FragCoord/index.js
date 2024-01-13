const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
        v_Color = a_Color;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform float u_Width;
    uniform float u_Height;
    void main() {
        gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
    }
`;

/**
 *
 * @param {*} gl
 * @description
 * 1、创建缓冲区对象
 * 2、将缓冲区对象绑定到目标对象
 * 3、将数据写入缓冲区对象
 * 4、将缓冲区对象分配给 attribute 变量
 * 5、开启 attribute 变量访问缓冲区数据
 * @returns
 */
const initVertexBuffers = (gl) => {
  const n = 3;
  const verties = new Float32Array([
    0, 0.5, 10.0, 1.0, 0.0, 0.0, -0.5, -0.5, 20.0, 0.0, 1.0, 0.0, 0.5, -0.5,
    30.0, 0.0, 0.0, 1.0,
  ]);
  const vertexStride = verties.BYTES_PER_ELEMENT * 6;

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    throw new Error("Failed to get a_Position!");
  }

  const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  if (a_PointSize < 0) {
    throw new Error("Failed to get a_PointSize!");
  }

  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    throw new Error("Failed to get a_Color!");
  }

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);

  // a_Position
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, vertexStride, 0);
  gl.enableVertexAttribArray(a_Position);

  // a_PointSize
  gl.vertexAttribPointer(
    a_PointSize,
    1,
    gl.FLOAT,
    false,
    vertexStride,
    verties.BYTES_PER_ELEMENT * 2
  );
  gl.enableVertexAttribArray(a_PointSize);

  // a_Color
  gl.vertexAttribPointer(
    a_Color,
    3,
    gl.FLOAT,
    false,
    vertexStride,
    verties.BYTES_PER_ELEMENT * 3
  );
  gl.enableVertexAttribArray(a_Color);

  return n;
};

const onLoad = () => {
  const canvas = document.getElementById("canvas");

  const gl = getWebGLContext(canvas);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    throw new Error(`Failed to create shaders!`);
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    throw new Error(`Failed to set the data of the buffer`);
  }

  const u_Width = gl.getUniformLocation(gl.program, "u_Width");
  if (!u_Width) {
    throw new Error(`Failed to get the u_Width`);
  }
  gl.uniform1f(u_Width, gl.drawingBufferWidth);

  const u_Height = gl.getUniformLocation(gl.program, "u_Height");
  if (!u_Height) {
    throw new Error(`Failed to get the u_Height`);
  }
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  gl.clearColor(0.5, 0.5, 0.5, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
};
