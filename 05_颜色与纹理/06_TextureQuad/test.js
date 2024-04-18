const loadTexture = (gl, n, texture, u_Sampler, image) => {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
};

const texture = gl.createTexture();
const u_Sampler = gl.getUniformLocationn(gl.program, "u_Sampler");
const image = new Image();
image.onload = function () {
  loadTexture(gl, n, texture, u_Sampler, image);
};
