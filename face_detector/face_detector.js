let faceMesh;
let video;
let faces = [];

let serial;
let serialOptions = { baudRate: 9600 };
let isConnected = false;
let lastSent = "";

const eyeIndices = [
  33, 133, 159, 145, 153, 144,
  362, 263, 386, 374, 380, 373
];

function preload() {
  faceMesh = ml5.faceMesh({ maxFaces: 1 });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  serial = new Serial();

  serial.on(SerialEvents.CONNECTION_OPENED, () => {
    console.log("✅ Serial connected!");
    isConnected = true;
  });

  serial.on(SerialEvents.ERROR_OCCURRED, (_, err) => {
    console.error("Serial error:", err);
  });

  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  image(video, 0, 0, width, height);

  // Eye dots
  for (let i = 0; i < faces.length; i++) {
    let keypoints = faces[i].keypoints;
    for (let j = 0; j < eyeIndices.length; j++) {
      let pt = keypoints[eyeIndices[j]];
      fill(255, 128, 0);
      noStroke();
      circle(pt.x, pt.y, 2);
    }
  }


  let currentState = faces.length > 0 ? "1" : "0";
  if (serial.isOpen() && currentState !== lastSent) {
    serial.writeLine(currentState);
    lastSent = currentState;
    console.log("Sent to Arduino:", currentState);
  }

 
  fill(255);
  textSize(16);
  text(isConnected ? "Connected" : "Click to Connect", 10, height - 10);
}

async function mousePressed() {
  if (!serial.isOpen()) {
    try {
      await serial.connect();
      await serial.open(serialOptions);
      console.log("✅ Serial connected manually!");
      isConnected = true;
    } catch (err) {
      console.error("❌ Could not open serial:", err);
    }
  }
}

function gotFaces(results) {
  faces = results;
}
