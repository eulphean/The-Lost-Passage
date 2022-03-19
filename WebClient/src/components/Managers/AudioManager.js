/*
  Name: AudioManager.js
  Author: Amay Kataria
  Date: 08/19/2021
  Description: This is where the p5 engine is integrated into the system. The class exposes an 
  object called p5 that we can use to call into the methods. Please keep in mind we don't 
  create a canvas and just use it to get the audio functionality. If we want to draw somehting 
  in 2D, let's talk about it. 
*/

// NOTE: p5 library is loaded through index.html script tags.
// We assign it to a variable that we want to use.

import soundscape from '../../assets/skybox/soundscape.mp3'
// import gunshot from '../../assets/skybox/gunshot.mp3'

let p5 = window.p5;  

export let MicParams = {
    Bass: 0,
    Mid: 0,
    Treble: 0,
    LowMid: 0,
    HighMid: 0
}

class Audio {
    constructor(soundObj, env) {
        this.soundObject = soundObj;
        this.adsr = env; 
    }

    setAdsr(attackTime, attackLevel, decayTime, decayLevel, releaseTime, releaseLevel) {
        // ADSR parameters
        this.adsr.set(attackTime, attackLevel, decayTime, decayLevel, releaseTime, releaseLevel); 
    }

    play() {
        this.soundObject.play();
        this.adsr.play(this.soundObject); 
    }

    trigger() {
        this.soundObject.play();
        this.adsr.triggerAttack(this.soundObject); 
        this.soundObject.loop();
    }

    release() {
        this.soundObject.pause();
        this.adsr.triggerRelease(this.soundObject);
    }
}

// Use this p5 sketch to load all audio. 
var sketch = (s) => {
    // Single array that holds all the audio files. 
    let soundObject = '';
    let audioManagerCbk; 
    let mic = '';
    let fft = '';
    let canAnalyze = false; 

    s.preload = () => {
        // Soundscape 
        let sound = s.loadSound(soundscape, () => {
            let env = new p5.Envelope(5.0, 0.2, 2.5, 0.1, 1.5, 0.);
            soundObject = new Audio(sound, env); 
            // Audio manager is ready now. 
            audioManagerCbk();
        }); 
    }

    s.audioCallback = (audioCbk) => {
        audioManagerCbk = audioCbk;
    }

    s.setup = () => {
        s.noCanvas(); // Don't creat a canvas
    };

    s.initMic = () => {
        console.log(navigator);
        navigator.mediaDevices.getUserMedia({audio: true})
        .then(() => {
            // Once the user gives the permission, then we setup the microphone.
            canAnalyze = true;
            mic = new p5.AudioIn();
            mic.start();
            fft = new p5.FFT();
            fft.setInput(mic);
            
            mic.getSources().then(devices => {
                // Enumerate devices to see what input devices are present. 
                devices.forEach(d => {
                    console.log(d.kind + ": " + d.label + " id = " + d.deviceId);
                });
            }); 
        });

    }

    s.draw = () => {
        if (canAnalyze) {
            fft.analyze();
            let bass = s.map(fft.getEnergy('bass'), 0, 255, 0, 1); 
            let mid = s.map(fft.getEnergy('mid'), 0, 255, 0, 1);
            let treble = s.map(fft.getEnergy('treble'), 0, 255, 0, 1);
            let lowMid = s.map(fft.getEnergy('lowMid'), 0, 255, 0, 1);
            let highMid = s.map(fft.getEnergy('highMid'), 0, 255, 0, 1);

            console.log(fft.getCentroid());

            // Bind the fft outputs to these variables.  
            MicParams.Bass = bass;
            MicParams.Mid = mid; 
            MicParams.Treble = treble;
            MicParams.LowMid = lowMid;
            MicParams.HighMid = highMid;
        }
    };

    s.trigger = () => {
        soundObject.trigger(); 
    }

    s.release = () => {
        soundObject.release();
    }
};

class AudioManager {
    constructor() {
        this.myP5 = new p5(sketch);
        this.myP5.audioCallback(this.audioManagerReady.bind(this));
        this.isPermanentlyMute = false; 
        this.isAudioManagerReady = false; 
    }

    audioManagerReady() {
        this.isAudioManagerReady = true;
        console.log('Audio Manager Ready'); 
    }

    micOn() {
        this.myP5.initMic();
    }

    reset() {
        this.myP5.reset();
    }

    trigger() {
        this.myP5.trigger(); 
    }

    release() {
        this.myP5.release();
    }
}

// Singleton - Only a single instance please.
export default new AudioManager();