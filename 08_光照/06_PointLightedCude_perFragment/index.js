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

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute vec4 a_Normal;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_ModelMatrix;

    varying vec4 v_Color;
    varying vec3 v_Normal;
    varying vec3 v_Position;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;

        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
        v_Position = normalize(vec3(u_ModelMatrix * a_Position));
        v_Color = a_Color;

        // vec4 vertexPosition = u_ModelMatrix * a_Position;
        // vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));

        // float nDotL = max(dot(lightDirection, normal), 0.0);
        // vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
        // vec3 ambient = u_AmbientLight * vec3(a_Color);
        // v_Color = vec4(diffuse + ambient, a_Color.a);
  
    }
`

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec3 u_LightColor;
    uniform vec3 u_LightPosition;
    uniform vec3 u_AmbientLight;

    varying vec3 v_Normal;
    varying vec3 v_Position;
    varying vec4 v_Color;
    void main() {
        vec3 normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPosition - v_Position);
        float nDotL = max(dot(lightDirection, normal), 0.0);

        vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;
        vec3 ambient = u_AmbientLight * v_Color.rgb;

        gl_FragColor = vec4(diffuse + ambient, v_Color.a);
    }
`

const initArrayBuffer = (gl, data, attribute, num, type) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    const a_attribute = gl.getAttribLocation(gl.program, attribute);
    if(a_attribute < 0) {
        throw new Error(`Failed to get the ${attribute}`)
    }

    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0)
    gl.enableVertexAttribArray(a_attribute)
    return true
}

const initVertexBuffers = (gl) => {
    if(!initArrayBuffer(gl, vertices, 'a_Position', 3, gl.FLOAT)) {
        throw new Error(`Failed to initArrayBuffer of a_Position`)
    }

    if(!initArrayBuffer(gl, colors, 'a_Color', 3, gl.FLOAT)) {
        throw new Error(`Failed to initArrayBuffer of a_Color`)
    }

    if(!initArrayBuffer(gl, normals, 'a_Normal', 3, gl.FLOAT)) {
        throw new Error(`Failed to initArrayBuffer of a_Normal`)
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    return indices.length;
}


const ANGLE_STEP = 30.0;
let g_last = Date.now()
const animate = (angle) => {
    const now = Date.now();
    const elapsed = now - g_last;
    g_last = now;
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
}

const onLoad = () => {

    const canvas = document.getElementById("canvas")
    const gl = getWebGLContext(canvas, true);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        throw new Error('初始化着色器程序失败')
    }

    const n = initVertexBuffers(gl);
    if (n < 0) {
      throw new Error(`Failed to initVertexBuffers!`);
    }

    gl.clearColor(0, 0, 0, 1)
    gl.enable(gl.DEPTH_TEST)

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    if(u_MvpMatrix < 0) {
        console.log('Failed to get the storage location');
    }

    const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
    if(u_NormalMatrix < 0) {
        console.log('Failed to get the storage location');
    }

    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
    if(u_ModelMatrix < 0) {
        console.log('Failed to get the storage location');
    }

    const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor')
    if(u_LightColor < 0) {
        console.log('Failed to get the storage location');
    }

    const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition')
    if(u_LightPosition < 0) {
        console.log('Failed to get the storage location');
    }

    const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight')
    if(u_AmbientLight < 0) {
        console.log('Failed to get the storage location');
    }

    const vpMatrix = new Matrix4()
    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100)
    vpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)

    // 设置光线颜色
    const lightColor = new Vector3([1.0, 1.0, 1.0])
    gl.uniform3fv(u_LightColor, lightColor.elements)

    // 设置点光源位置
    const lightPosition = new Vector3([1.0, 2.0, 3.0])
    gl.uniform3fv(u_LightPosition, lightPosition.elements)

    // 设置环境光颜色
    const ambientLightColor = new Vector3([0.2,0.2,0.2])
    gl.uniform3fv(u_AmbientLight, ambientLightColor.elements)

    let currentAngle = 0.0;
    const modelMatrix = new Matrix4()
    const mvpMatrix = new Matrix4()
    const normalMatrix = new Matrix4()

    const tick = () => {
 
        currentAngle = animate(currentAngle)
        
        modelMatrix.setRotate(currentAngle, 0,1,0)
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

        mvpMatrix.set(vpMatrix).multiply(modelMatrix)
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

        normalMatrix.setInverseOf(modelMatrix)
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
        requestAnimationFrame(tick)
    }
    tick()
}