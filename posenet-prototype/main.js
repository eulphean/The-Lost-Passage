// Description: A small posenet example, which can track multiple noses. I will integrate 
// this in The-Lost-Passage to interact with the pigeons. 
let video;
let poseNet;
let myNoses = []; 

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, 'multiple', modelReady);
  poseNet.on('pose', gotPoses);
}

function modelReady() {
  // When the machine learning model is ready to be used.
  console.log('Model Is Ready');
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    poses.forEach(p => {
      myNoses.push(p.pose.nose);
    })
  }
}

function draw() {  
  image(video, 0, 0);
  if (myNoses.length > 0) {
    myNoses.forEach(n => {
      fill(255, 0, 0);
      ellipse(n.x, n.y, 10); 
    })

    myNoses.length = 0;
  }
}