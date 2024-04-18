function onLoad() {
  const canvas = document.getElementById("canvas");

  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get");
    return;
  }

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 1024, gl.STATIC_DRAW);
  console.log("111 vertexBuffer:", vertexBuffer);

  // gl.bindBuffer(gl.ARRAY_BUFFER, null);
  // console.log("222 vertexBuffer:", vertexBuffer);
}
