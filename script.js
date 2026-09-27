const imageInput = document.getElementById('imageInput');
const cropCanvas = document.getElementById('cropCanvas');
const ctx = cropCanvas.getContext('2d');
const zoomRange = document.getElementById('zoomRange');
const cropBtn = document.getElementById('cropBtn');
const overlayText = document.getElementById('overlayText');
const cropWrapper = document.getElementById('cropWrapper');

let img = new Image();
let imgScale = 1;
let imgX = 0;
let imgY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

// Handle File Selection
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Image Loaded
img.onload = () => {
  overlayText.style.display = 'none';
  zoomRange.disabled = false;
  cropBtn.disabled = false;

  // Reset zoom & position image in center
  imgScale = Math.max(512 / img.width, 512 / img.height);
  zoomRange.value = imgScale;
  
  imgX = (512 - img.width * imgScale) / 2;
  imgY = (512 - img.height * imgScale) / 2;

  drawCanvas();
};

// Draw Canvas Frame
function drawCanvas() {
  ctx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
  ctx.drawImage(
    img, 
    imgX, 
    imgY, 
    img.width * imgScale, 
    img.height * imgScale
  );
}

// Drag functionality (Mouse)
cropWrapper.addEventListener('mousedown', (e) => {
  if (!img.src) return;
  isDragging = true;
  startX = e.clientX - imgX;
  startY = e.clientY - imgY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  imgX = e.clientX - startX;
  imgY = e.clientY - startY;
  drawCanvas();
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Zoom functionality
zoomRange.addEventListener('input', (e) => {
  const newScale = parseFloat(e.target.value);
  
  // Keep zooming centered around the center of the canvas
  const centerX = 512 / 2;
  const centerY = 512 / 2;
  
  imgX = centerX - (centerX - imgX) * (newScale / imgScale);
  imgY = centerY - (centerY - imgY) * (newScale / imgScale);
  imgScale = newScale;

  drawCanvas();
});

// Crop and Save as 512x512 PNG
cropBtn.addEventListener('click', () => {
  const dataURL = cropCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'cropped-512x512.png';
  link.href = dataURL;
  link.click();
});