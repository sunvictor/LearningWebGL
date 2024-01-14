const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform vec3 u_LightColor;
  uniform vec3 u_LightDirection;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;

    // 对法向量进行归一化
    vec3 normal = normalize(vec3(a_Normal));
    // 计算光线方向和法向量的点积
    float nDotL = max(dot(u_LightDirection, normal), 0.0);
    // 计算漫反射光的颜色
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    v_Color = vec4(diffuse, a_Color.a);
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`;

const initArrayBuffer = (gl, data, num, type, attribute) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const a_attribute = gl.getAttribLocation(gl.program, attribute)
  if(a_attribute < 0) {
    throw new Error(`Failed to get the ${attribute}`)
  }

  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute)
  return true
}

const initVertexBuffers = (gl) => {
  const vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
  ]);

  const colors = new Float32Array([     // Colors
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v1-v2-v3 front(white)
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v3-v4-v5 right(white)
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v5-v6-v1 up(white)
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v1-v6-v7-v2 left(white)
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down(white)
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0   // v4-v7-v6-v5 back(white)
  ]);

  const indices = new Uint8Array([       // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  const normals = new Float32Array([    // Normal
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
  ]);


  if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, "a_Position")) {
    throw new Error(`Failed to initArrayBuffer of a_Position`)
  }

  if(!initArrayBuffer(gl, colors, 3, gl.FLOAT, "a_Color")) {
    throw new Error(`Failed to initArrayBuffer of a_Color`)
  }

  if(!initArrayBuffer(gl, normals, 3, gl.FLOAT, "a_Normal")) {
    throw new Error(`Failed to initArrayBuffer of a_Normal`)
  }

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
  const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  if(!u_LightColor) {
    throw new Error(`Failed to get the u_LightColor!`)
  }
  const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection')
  if(!u_LightDirection) {
    throw new Error(`Failed to get the u_LightDirection!`)
  }

  // 设置光线颜色
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

  // 设置光线方向
  const lightDirection = new Vector3([0.5, 3.0, 4.0]);
  lightDirection.normalize();
  gl.uniform3fv(u_LightDirection, lightDirection.elements);

  const mvpMatrix = new Matrix4();
  const aspect = canvas.clientWidth / canvas.clientHeight
  mvpMatrix.setPerspective(30, aspect, 1, 100);
  mvpMatrix.lookAt(3,3,7, 0,0,0, 0,1,0);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const draw = (angle) => {
    const matrix = new Matrix4()
    matrix.set(mvpMatrix);
    matrix.rotate(angle, 1, 1, 1)
    gl.uniformMatrix4fv(u_MvpMatrix, false, matrix.elements)
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  }

  const ANGLE_STEP = 45;
  let currentAngle = 0;
  let lastTime = Date.now();
  const animate = (angle) => {
    const currentTime = Date.now();
    const elapsed = currentTime - lastTime;
    lastTime = currentTime;
    const newAngle = angle + (elapsed / 1000) * ANGLE_STEP;
    return newAngle % 360;
  }

  const tick = () => {
    currentAngle = animate(currentAngle);
    draw(currentAngle);
    requestAnimationFrame(tick)
  };
  tick();
};
