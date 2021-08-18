// browser-sync start --server -f -w (Run this command in the folder)
let font; 
let mic;
let fft; // Use fft to analyze the incoming sound. 
let canAnalyze = false; 

let sounds = {
  0 : {
    'sound': 'arctic.mp3', // File index. 
    'adsr': [3.0, 0.5, 1.0, 0.25, 3.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
  },
  1 : {
    'sound': 'swing.mp3',
    'adsr': [2.5, 0.4, 1.0, 0.2, 3.0, 0.0]
  },
  2: {
    'sound': 'taktak.mp3',
    'adsr': [3.5, 0.5, 1.0, 0.25, 2.5, 0.0]
  },
  3: {
    'sound': 'warbler.mp3',
    'adsr': [3.0, 0.5, 1.0, 0.25, 2.0, 0.0]
  }
};
// Sounds.
let soundFactory = [];
let env; 
let cur_sound_idx = -1; 

// Images
let images = ['birdA.jpg', 'birdB.jpg', 'birdC.jpg', 'birdD.jpg'];
let imageFactory = [];

let spectrum; 

function preload() {
  font = loadFont('solid.otf');

  // Load sounds. 
  loadSounds(); 

  // Load images. 
  loadImages(); 
}

function loadImages() {
  for (let i = 0; i < images.length; i++) {
    let imgPath = './images/' + images[i]; 
    let img = loadImage(imgPath);
    imageFactory.push(img);
  }
}

function loadSounds() {
  let keys = Object.keys(sounds); 
  for (let i=0; i < keys.length; i++) {
    let key = keys[i]; 
    let soundPath = './audio/' + sounds[key]['sound']; 
    let s = loadSound(soundPath);
    soundFactory.push(s); 
  }
}

function setup() {
  // Default canvas setup. 
  createCanvas(displayWidth, displayHeight);
  console.log(soundFactory);
}

function draw() {  
  background(0);

  if (canAnalyze) {
    spectrum = fft.analyze(); 
    
  }
  
  if (cur_sound_idx >= 0) {
    let img = imageFactory[0];
    image(img, 0, 0); 
  } else {
    if (canAnalyze) {
      // Draw energy 
      let e = fft.getEnergy('mid') + fft.getEnergy('treble');
      circle(width/2, height/2, e);
    }
  }

  // Draw spectogram of my sound or bird's sound. 
  if (canAnalyze) {
      drawAnalysis(); 
  }
}

function drawAnalysis() {
  push();
    scale(0.5, 0.5); 
    translate(0, height/1.5);
    noStroke();
    fill(255, 0, 255);
    for (let i = 0; i< spectrum.length; i++){
      let x = map(i, 0, spectrum.length, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      rect(x, height, width / spectrum.length, h )
    }
  // pop();
}

function mousePressed() {
  // Audio setup after mouse press. 
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  env = new p5.Envelope(0.1, 0.5, 0.1, 0.5, 0.5, 1.0); // Default audio envelope.
  mic.start();
  fft.setInput(mic);
  canAnalyze = true;

  // Print sources. 
  mic.getSources().then(devices => {
    // Enumerate devices to see what input devices are present. 
    devices.forEach(d => {
      console.log(d.kind + ": " + d.label + " id = " + d.deviceId);
    });
  }); 
}

function keyPressed() {
  console.log('Key Pressed');
  if (keyCode === LEFT_ARROW) {
    cur_sound_idx = 0;
    triggerAttack(); 
  }

  if (keyCode === RIGHT_ARROW) {
    cur_sound_idx = 1; 
    triggerAttack(1);
  }

  if (keyCode === UP_ARROW) {
    cur_sound_idx = 2;
    triggerAttack(2);
  }

  if (keyCode === DOWN_ARROW) {
    cur_sound_idx = 3; 
    triggerAttack(3);
  }
}

function triggerAttack() {
  let adsr = sounds[cur_sound_idx]['adsr'];
  env.set(adsr[0], adsr[1], adsr[2], adsr[3], adsr[4], adsr[5]);

  let soundObject = soundFactory[cur_sound_idx]; 
  fft.setInput(soundObject); // Update fft input. 
  soundObject.stop(); 
  env.triggerAttack(soundObject);
  soundObject.loop();
}

function keyReleased() {
  console.log('Key Released');
  let soundObject = soundFactory[cur_sound_idx];
  env.triggerRelease(soundObject);
  let adsr = sounds[cur_sound_idx]['adsr'];
  let releaseTime = adsr[4];
  setTimeout(release, parseInt(releaseTime) * 1000); 
}

function release() {
  let soundObject = soundFactory[cur_sound_idx];
  soundObject.stop(); 
  cur_sound_idx = -1;
  fft.setInput(mic);
}