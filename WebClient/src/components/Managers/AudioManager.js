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

let p5 = window.p5;  

class Audio {
    constructor(soundObj, env) {
        this.soundObject = soundObj;
        this.adsr = env; 
        this.isActive = false; 
    }

    setAdsr(attackTime, attackLevel, decayTime, decayLevel, releaseTime, releaseLevel) {
        // ADSR parameters
        this.adsr.set(attackTime, attackLevel, decayTime, decayLevel, releaseTime, releaseLevel); 
    }

    trigger() {
        // if (isLeft) {
        //     this.soundObject.pan(1); 
        // } else {
        //     this.soundObject.pan(-1); 
        // }

        if (this.soundObject.isPlaying()) {
            this.soundObject.stop();
        }
        this.soundObject.playMode('restart');
        this.adsr.triggerAttack(this.soundObject); 
        this.soundObject.loop();
        this.isActive = true; 
    }

    release() {
        // this.soundObject.stop();
        this.adsr.triggerRelease(this.soundObject);
        this.isActive = false; 
    }
}

// Use this p5 sketch to load all audio. 
var sketch = (s) => {
    // Single array that holds all the audio files. 
    let soundObject = ''; 
    s.preload = () => {
        let sound = s.loadSound(soundscape); 
        let env = new p5.Envelope(0.8, 0.3, 0.5, 0.3, 1, 0.);
        soundObject = new Audio(sound, env); 
        // Load any sounds here. 
        // for (let i = 0; i < audioFiles.length; i++) {
        //     let sound = s.loadSound(audioFiles[i]); 
        //     let env = new p5.Envelope(0.1, 0.5, 0.1, 0.5); // Default envelope. 
        //     let a = new Audio(sound, env); 
        //     audio.push(a);
        // }
    }

    s.setup = () => {
        s.noCanvas(); // Don't creat a canvas
    };

    s.draw = () => {
        s.noLoop(); // We don't want to loop either.
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