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
import gunshot from '../../assets/skybox/gunshot.mp3'

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

    play() {
        this.soundObject.play();
        this.adsr.play(this.soundObject); 
        console.log('Hello play shoot');
    }

    trigger() {
        if (this.soundObject.isPlaying()) {
            this.soundObject.stop();
        }
        // this.soundObject.playMode('restart');
        this.soundObject.play();
        this.adsr.triggerAttack(this.soundObject); 
        this.soundObject.loop();
        this.isActive = true; 
    }

    release() {
        // this.soundObject.stop();
        this.soundObject.pause();
        this.adsr.triggerRelease(this.soundObject);
        this.isActive = false; 
    }
}

// Use this p5 sketch to load all audio. 
var sketch = (s) => {
    // Single array that holds all the audio files. 
    let soundObject = '';
    let gunObject = '';
    let audioManagerCbk; 

    s.preload = () => {
        // Soundscape 
        let sound = s.loadSound(soundscape); 
        let env = new p5.Envelope(5.0, 0.2, 2.5, 0.1, 1.5, 0.);
        soundObject = new Audio(sound, env); 

        // Gunshot
        sound = s.loadSound(gunshot); 
        env = new p5.Envelope(0.5, 1.0, 0.5, 0.6, 2, 0.);
        gunObject = new Audio(sound, env); 

        // Audio manager is ready now. 
        audioManagerCbk();
    }

    s.audioCallback = (audioCbk) => {
        audioManagerCbk = audioCbk;
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

    s.shoot = () => {
        gunObject.play(); 
    }
};

export let IsAudioManagerReady = false; 
class AudioManager {
    constructor() {
        this.myP5 = new p5(sketch);
        this.myP5.audioCallback(this.audioManagerReady.bind(this));
        this.isPermanentlyMute = false; 
    }

    audioManagerReady() {
        IsAudioManagerReady = true;
        console.log('Audio Manager Ready'); 
    }

    trigger() {
        this.myP5.trigger(); 
    }

    release() {
        this.myP5.release();
    }

    shoot() {
        this.myP5.shoot();
    }
}

// Singleton - Only a single instance please.
export default new AudioManager();