const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ProjMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_ProjMatrix * a_Position;
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
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, 
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4, 
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, 
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4, 
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0, 
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0, 
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ]);

  const n = 9;
  const SIZE = verties.BYTES_PER_ELEMENT;

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

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, SIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, SIZE * 6, SIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return n;
};

const onLoad = () => {
  const canvas = document.getElementById("canvas");
  const nf = document.getElementById("nearFar");

  const gl = getWebGLContext(canvas);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    throw new Error(`Failed to initShaders`);
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    throw new Error(`Failed to initVertexBuffers`);
  }

  const u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");

  let near = 0,
    far = 0.5;
  const projMatrix = new Matrix4();

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const draw = () => {
    projMatrix.setOrtho(-0.3, 0.3, -1, 1, near, far);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    nf.innerHTML = `near: ${near}, far: ${far}`;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  };

  draw()

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowRight":
        near += 0.01;
        break;
      case "ArrowLeft":
        near -= 0.01;
        break;
      case "ArrowUp":
        far += 0.01;
        break;
      case "ArrowDown":
        far -= 0.01;
        break;
      default:
        return;
    }
    draw();
  });
};
