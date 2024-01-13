function onLoad() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(0,0,255,1)";
  ctx.fillRect(120, 10, 150, 150);
}
