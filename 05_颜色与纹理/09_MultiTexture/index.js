const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    varying vec2 v_TexCoord;
    void main() {
        vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
        vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
        gl_FragColor = color0 * color1;
    }
`;

const initVertexBuffers = (gl) => {
  const verties = new Float32Array([
    -0.5, 0.5, 0.0, 1.0, -0.5, -0.5, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, 0.5, -0.5,
    1.0, 0.0,
  ]);
  const n = 4;
  const stride = verties.BYTES_PER_ELEMENT * n;

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    throw new Error(`Failed to get a_Position`);
  }

  const a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
  if (a_TexCoord < 0) {
    throw new Error(`Failed to get a_TexCoord`);
  }

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);

  // 将顶点坐标写入缓冲区对象
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(a_Position);

  // 将纹理坐标写入缓冲区对象
  gl.vertexAttribPointer(
    a_TexCoord,
    2,
    gl.FLOAT,
    false,
    stride,
    verties.BYTES_PER_ELEMENT * 2
  );
  gl.enableVertexAttribArray(a_TexCoord);

  return n;
};

/**
 * 如何为 WebGL 配置纹理
 * @param {*} gl
 * @param {*} n
 * @description
 * 1. 图像 Y 轴反转
 * 2. 激活纹理单元
 * 3. 绑定纹理对象
 * 4. 配置纹理对象参数
 * 5. 将纹理图像分配给纹理对象
 */
const loadTexture = (gl, texUnit, texture, u_Sampler, image) => {
  // 图像坐标 Y 轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // 开启 0 号纹理单元
  gl.activeTexture(gl[`TEXTURE${texUnit}`]);
  // 向 target 绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // 配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // 将纹理单元编号传递给片元着色器
  gl.uniform1i(u_Sampler, texUnit);
};

const initTextures = async (gl, n) => {
  const texture0 = gl.createTexture();
  const texture1 = gl.createTexture();

  const u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0) {
    throw new Error("Failed to get the u_Sampler0!");
  }

  const u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1) {
    throw new Error("Failed to get the u_Sampler1!");
  }

  const image0 = await loadedImage(
    "http://localhost:3000/public/assets/images/redflower.jpg"
  );
  loadTexture(gl, 0, texture0, u_Sampler0, image0);

  const image1 = await loadedImage(
    "http://localhost:3000/public/assets/images/circle.gif"
  );
  loadTexture(gl, 1, texture1, u_Sampler1, image1);

  // 清除重新绘制
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  return true;
};

const onLoad = () => {
  const canvas = document.getElementById("canvas");

  const gl = getWebGLContext(canvas);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    throw new Error(`Failed to init shaders!`);
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    throw new Error(`Failed to init textures!`);
  }

  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  initTextures(gl, n);
};
