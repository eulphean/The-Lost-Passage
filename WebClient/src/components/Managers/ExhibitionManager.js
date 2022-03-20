/*
  Name: ExhibitionManager.js
  Author: Amay Kataria
  Date: 03/20/2021
  Description: Manager used to control the exhibition mode. 
*/

class ExhibitionManager {
    constructor() {
        this.isExhibition = false; 
        this.subscribers = []; 

        window.addEventListener('keypress', (e) => {
            if (e.key === 'e') {
                this.isExhibition = !this.isExhibition; 
                this.subscribers.forEach(listener => {
                    listener(); 
                });
            }
        }); 
    }

    subscribe(listener) {
        this.subscribers.push(listener); 
    }
} 

// Keep a single instance. 
export default new ExhibitionManager();

// On button press - Update camera (simple rotation), audio manager (setup mic), now the bird 
// responds to audio. 
// Simple. 