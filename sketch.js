//A postcard generator that allow cam, brush, text, and frame
//A fun way to capture photo with people you love 

  //Selfie cam stuff
let video;
let ditherType = 'bayer';
const PIXEL_JUMP = 1;
let isCaptured = false;
let captureImage;

  //Drawing canvas stuff
let brushSize = 3;
let brushSlider;
let brushOn = false;

let bgColor = ["#E91E63", "rgb(94,200,229)", "rgb(255, 232, 0)", "rgb(255, 116, 119)", "#8ACE00"];
let colorIndex = 0;
let brushColor = ["#E91E63", "rgb(94,200,229)", "rgb(255, 232, 0)", "rgb(255, 116, 119)","rgb(255,255,255)"];
let brushIndex = 0;
let fkCoolEmoji = ["✨", "💔", "🌈", "🍒","💗", "💐", "🌸", "🌻"];

let drawLayer; 
let font;

let margin = 150;
let frameLayer;
let currentFrameIndex = -1; // no frame
let frames = []; 


function preload(){
  font = loadFont("Bonbon.ttf");
  font2 = loadFont("Ojuju.ttf");
  stk1 = loadImage("stk1.png");
  stk2 = loadImage("stk2.png");
  stk3 = loadImage("stk3.png");
  stk4 = loadImage("stk4.png");
  stk5 = loadImage("stk5.png");
  stk6 = loadImage("stk6.png")

  frame1 = loadImage("frame1.png");
  frame2 = loadImage("frame2.png");
  frame3 = loadImage("frame3.png");
  frame4 = loadImage("frame4.png");
}

function setup() {
  createCanvas(320 * 3 - 30, 240 * 3);
  pixelDensity(1);
  drawLayer = createGraphics(width, height);
  drawLayer.clear();
  frameLayer = createGraphics(width, height);
  frameLayer.clear();
  frames = [frame1, frame2, frame3, frame4];

  // Selfie set up cam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  noStroke();

  // Buttons
  capture = createButton('Snap!');
  capture.size(100)
  capture.position(margin, 300);
  capture.mousePressed(captureFrame);

  brushBt = createButton('Brush');
  brushBt.position(margin, 450);
  brushBt.size(100)
   brushBt.mousePressed(() => {
    brushOn = true;
    brushIndex = floor(random(brushColor.length));
  });
  
  brushSlider = createSlider(0, 2, 0); // 3 levels only
  brushSlider.position(margin+140, 490);  
  brushSlider.style('width', '80px');

  coolEmoji = createButton('Emoji')
  coolEmoji.position(margin, 600);
  coolEmoji.size(100);
  coolEmoji.mousePressed(randomEmoji);

  frame = createButton('Frame')
  frame.position(margin, 750);
  frame.size(100);
  frame.mousePressed(frameRadu);

  input = createInput("text here ;)")
  input.position(1500, 300);
  input.size(100);
  input.style('height', '40px');
  textAlign(CENTER, BASELINE);  
  
  retake = createButton('Again!');
  retake.position(1500, 450);
  retake.size(100);
  retake.mousePressed(retakeCam);

  save = createButton('Save');
  save.position(1500, 600);
  save.size(100);
  save.style('background-color', 'rgb(225,225,225)');
  save.style('color', '#E91E63');
  save.mousePressed(saveArtwork);

}

function draw() {
  if (isCaptured && captureImage) {
    image(captureImage, 0, 0); // captured photo here 
    image(drawLayer, 0, 0); // brush layer 
    image(frameLayer, 0, 0); // frame layer
    brushDraw(); // allow brush drawing              
    forYouMsg(); // add text
    return;
  }
  

// Selfie filter
  background(255); 
  video.loadPixels();

  let dither = map(mouseX, 0, width, 0, 255);

  push();
  translate(width, 0); // flip cam (mirror)
  scale(-1, 1); 

  //brightness mirror but make it bayer dithering

  for (let y = 0; y < video.height; y += PIXEL_JUMP) {
    for (let x = 0; x < video.width; x += PIXEL_JUMP) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let avg = (r + g + b) / 3;

      let newVal = applyDither(avg, x, y, dither);
      if (newVal === 0) {
        fill(bgColor[colorIndex]);
        square(x, y, PIXEL_JUMP, PIXEL_JUMP);
      }
    }
  }

  pop();

}

function applyDither(val, x, y, threshold1) {
  switch (ditherType) {
    case 'none':
      return val;

    case 'bayer':
      let bayerMatrix = [
        [15, 135, 45, 165],
        [195, 75, 225, 105],
        [60, 180, 30, 150],
        [240, 120, 210, 90]
      ];
      let i = x % 4;
      let j = y % 4;
      return val < bayerMatrix[j][i] ? 0 : 255;

    default:
      return val;
  }
}

function captureFrame() {
  isCaptured = true;
  captureImage = get(); 
  video.remove();      
}

function brushDraw() {
  if (brushOn && mouseIsPressed) {
    let sizes = [3, 10, 20];
    brushSize = sizes[brushSlider.value()];

    drawLayer.stroke(brushColor[brushIndex]);
    drawLayer.strokeWeight(brushSize);
    drawLayer.line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function saveArtwork() {
  clear();
  image(captureImage, 0, 0);
  image(drawLayer, 0, 0);
  image(frameLayer, 0, 0);

  let forYou = input.value();
  push();
  fill(0);
  textFont(font2);
  textSize(45);
  textAlign(CENTER, BASELINE);
  text(forYou, width / 2, height - 30);
  pop();
  
  saveCanvas('Thats Dope Gorl', 'png');
}

function forYouMsg(){
  let forYou = input.value();
  push();
  fill(0);
  textFont(font2);
  textSize(45);
  text(forYou, width/2, height - 30);
  textAlign(CENTER)
  pop();
}

function randomEmoji(){
  let x = random(20, width - 20);
  let y = random(20, height - 20);
  

  let raduradu = floor(random(7)); 

  if (raduradu === 0) {
    drawLayer.image(stk2, x, y);
  } else if (raduradu === 1) {
    drawLayer.image(stk3, x, y);
  } else if (raduradu === 3) {
    drawLayer.image(stk4, x, y);
  } else if (raduradu === 4) {
    drawLayer.image(stk6, x, y);
  } else {
    let emoji = random(fkCoolEmoji);
    push();
    drawLayer.textSize(random(24, 36));
    drawLayer.textFont("Arial");
    drawLayer.textAlign(CENTER, CENTER);
    drawLayer.text(emoji, x, y);
    pop();
  }
}

function frameRadu() {
  currentFrameIndex = (currentFrameIndex + 1) % frames.length;
  // Clear just the frame layer, not the drawing layer
  frameLayer.clear();
  frameLayer.image(frames[currentFrameIndex], 0, 0);
}


function retakeCam(){
  drawLayer.clear();
  isCaptured = false;
  colorIndex = (colorIndex + 1) % bgColor.length;
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

}

