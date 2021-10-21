// Loads the pigeon and makes everything else available pertaining to pigeon.  
// Manages everything related to the pigeons. 
// Maybe we'll have the GPUComputationRenderer here. 

import Pigeon from "./Pigeon";

class PigeonManager {
    constructor() {
        this.pigeon = new Pigeon();
    }
}

export default PigeonManager; 