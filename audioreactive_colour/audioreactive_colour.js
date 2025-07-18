let mic;
let r = 0;
let g = 0;
let b = 255;

function setup() {
  createCanvas(windowWidth, windowHeight);
  getAudioContext().suspend(); 
  mic = new p5.AudioIn();
  mic.start(); 
}

function draw() {
  let volume = mic.getLevel(); //(range is ~0.0 to ~0.3)


  let targetR = map(volume, 0, 0.3, 0, 255, true);
  let targetB = map(volume, 0, 0.3, 255, 0, true);


  r = lerp(r, targetR, 0.1); // adjust 0.05 for faster/slower easing
  b = lerp(b, targetB, 0.1);


  background(r, g, b); 
}

function mousePressed() {
  getAudioContext().resume();
}
