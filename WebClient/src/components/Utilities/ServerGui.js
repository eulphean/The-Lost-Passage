/*
  Name: ServerGui.js
  Author: Amay Kataria
  Date: 09/24/2021
  Description: A tweakpane GUI implementation that stores and loads presets from a backend server. 
  The data is transmitted across using a Websocket connection that is maintained throughout the
  lifetime of the application. 
*/

import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import _, { times } from 'lodash';

import Websocket from './Websocket';

import { TargetParams } from '../Managers/PigeonManager';
import { PatternParams, PatternTypes, EllipseParams, EllipsePattern, RoseCurveParams } from '../Managers/PatternManager.js';
import { AgentParams } from '../Environment/Agent.js';
import { OrbitParams } from '../Managers/CameraControl.js'

// Local params for the GUI. 
// Presets is a dynamically populated prop (critical)
let GuiParams = {
    Preset: 'Global',
    Presets: ''
}
const PRESETS_IDX = 1; 
const PATTERN_TYPE_IDX =0; 

class ServerGui {
    constructor(containerComponent) {
        this.gui = new Pane({title: 'Pigeon GUI', container: containerComponent, expanded: false});
        this.gui.registerPlugin(EssentialsPlugin);

        // Preset name
        this.gui.addInput(GuiParams, 'Preset');
        
        // Presets.
        this.presetOptions = []; // Backup object of all the preset options. // Saves the truth. 
        this.buildPresets(); 

        // FPS
        this.fpsGraph = this.gui.addBlade({
            view: 'fpsgraph',
            label: 'FPS',
            lineCount: 2,
        });

        // Orbit controls. 
        let f0 = this.gui.addFolder({ title: 'Orbit Controls', expanded: true });
        f0.addInput(OrbitParams, 'EnableControls', {label: 'Enable Controls'});
        f0.addInput(OrbitParams, 'EnablePan', {label: 'Enable Panning'});
        f0.addInput(OrbitParams, 'AutoRotate', {label: 'Enable AutoRotate'});
        f0.addInput(OrbitParams, 'RotateSpeed', { label: 'Rotation Speed', min: 0.1, max: 1.0 });
        f0.addInput(OrbitParams, 'EnableKeys', {label: 'Enable Keys'});

        // World Parameters.
        let f1 = this.gui.addFolder({ title: 'Target Params', expanded: true });
        f1.addInput(TargetParams, 'ShowTarget', {label: 'Show Target'});

        // Pattern Parameters.
        this.patternFolder = this.gui.addFolder({ title: 'Pattern Params', expanded: true });
        this.buildPatternTypeOptions(PatternTypes.Ellipse); // Default pattern type.
        this.buildPatterns(); 

        // Ellipse Parameters. 
        this.ellipseParamsFolder = this.patternFolder.addFolder({ title: 'Ellipse Pattern Params', expanded: true });
        this.ellipseParamsFolder.addInput(EllipseParams, 'Origin');
        this.ellipseParamsFolder.addInput(EllipseParams, 'Radii', {
            x: { min: 0, max: 50 },
            y: { min: 0, max: 50 }
        });
        this.ellipseParamsFolder.addInput(EllipseParams, 'Amplitude', { min: 0, max: 10 });
        this.ellipseParamsFolder.addInput(EllipseParams, 'Speed', { min: 0, max: 2 });
        this.ellipseParamsFolder.addInput(EllipseParams, 'Direction'); 

        this.roseCurveParamsFolder = this.patternFolder.addFolder({ title: 'Rose-Curve Pattern Params', expanded: true });
        this.roseCurveParamsFolder.addInput(RoseCurveParams, 'Origin');
        this.roseCurveParamsFolder.addInput(RoseCurveParams, 'Radius', { min: 1, max: 50 });
        this.roseCurveParamsFolder.addInput(RoseCurveParams, 'Phase', { min: 0, max: 10 });
        this.roseCurveParamsFolder.addInput(RoseCurveParams, 'NumPetals', { min: 1, max: 10, step: 1 });
        this.roseCurveParamsFolder.addInput(RoseCurveParams, 'Amplitude', { min: 0, max: 10 });
        this.roseCurveParamsFolder.addInput(RoseCurveParams, 'Sinusoidal');
        this.roseCurveParamsFolder.addInput(RoseCurveParams, 'Direction');
        this.roseCurveParamsFolder.addInput(RoseCurveParams, 'Speed', { min: 0, max: 2 });

        let f2 = this.gui.addFolder({ title: 'Agent Params', expanded: true});
        f2.addInput(AgentParams, 'MaxForce', {label: 'Max Force', min: 0.005, max: 2, step: 0.005});
        f2.addInput(AgentParams, 'SmoothFactor', {label: 'Smooth Factor', min: 0.005, max: 0.1, step: 0.005});
        f2.addInput(AgentParams, 'SeperationForce', {label: 'Seperation Force', min: 0.5, max: 2, step: 0.1}); 
        f2.addInput(AgentParams, 'CohesionForce', {label: 'Cohesion Force', min: 0.1, max: 2, step: 0.1});
        f2.addInput(AgentParams, 'AlignmentForce', {label: 'Alignment Force', min: 0, max: 2, step: 0.1}); 

        // Save Preset button
        this.gui.addButton({title: 'Save Preset'}).on('click', this.onSavePreset.bind(this));       
        this.gui.addButton({title: 'Delete Preset'}).on('click', this.onDeletePreset.bind(this));
        this.gui.addButton({title: 'Show Panel'}).on('click', this.onShowPanel.bind(this)); 
        this.gui.addButton({title: 'Spawn Agents'}).on('click', this.onSpawnAgents.bind(this));

        // Read presets from the database. 
        Websocket.readAllPresets(this.onReceivePresets.bind(this)); 
    }

    onPresetSelected(event) {
        // The value of the select preset is the JSON value. 
        let guiJson = JSON.parse(event.value); 
        this.gui.importPreset(guiJson);
    }

    onReceivePresets(data) {
        console.log('All the presets received:');
        console.log(data);

        // If there are valid presets. 
        if (data.length > 0) {
            // Build preset options. 
            data.forEach(d => {
                let name = d['name'];
                let config = d['config'];
                // We push here rather than unshift because it's okay to just read this is in the order
                // the entries were pushed in the database. 
                this.presetOptions.push({ text: name, value: JSON.stringify(config)});
            }); 
            
            // Dispose pattern type list. 
            // this.patternTypeList.dispose();   

            // Get the first preset and set the GUI with that. 
            let defaultPresetJSON = data[0]['config'];
            this.gui.importPreset(defaultPresetJSON);

            // Rebuild the preset controller using this.presetOptions. 
            this.disposePresets();
            this.buildPresets();

            // Build Pattern type options. 
            this.currentPatternType = defaultPresetJSON['PatternType'];  
            this.buildPatternTypeOptions(); 
            this.disposePatterns();
            this.buildPatterns(); 
            this.showPatternParams(); 
        }
    }

    onSavePreset() {
        let presetName = GuiParams.Preset; 
        if (presetName.length > 0) {
            // Clear the presets first. 
            this.disposePresets(); 
            let json = this.gui.exportPreset(); 

            // Does this preset exist? 
            let preset = _.find(this.presetOptions, p => {
                return p.text === presetName;
            });

            if (preset) {
                // Update local json of the preset.
                console.log('Preset Exists. Updating database and local copy of the preset.');
                preset.value = JSON.stringify(json);
                // NOTE: Update the preset options array to maintain the order of the updated presets. 
                // Unfortunately, we need to rebuild the presets everytime and we want to make sure 
                // the order of presets doesn't change. 
                this.presetOptions = _.sortBy(this.presetOptions, ({text}) => { 
                    return text === presetName ? 0: 1;
                });
            } else {
                console.log('Preset doesnt exist. New entry in the database.');
                this.presetOptions.unshift({ text: presetName, value: JSON.stringify(json)} );
            }

            // Update database. 
            Websocket.saveGuiPreset(presetName, json); 

            // Rebuild the presets. 
            this.buildPresets(); 
        } else {
            alert('Not an empty entry please.');
        }
    }

    onDeletePreset() {
        if (this.presetOptions.length > 0) {
            let presetName = GuiParams.Preset; 
            console.log('Deleting preset: ' + presetName);

            // Remove that element from the array. 
            // Updates the original array. 
            _.remove(this.presetOptions, p => p.text === presetName); 

            // Delete the preset from the database. 
            Websocket.deletePreset(presetName); 

            // Rebuild the preset list. 
            this.disposePresets(); 
            this.buildPresets();

            // Maybe I'm the last entry in the database. 
            if (this.presetOptions.length > 0) {
                // Get preset options for the first preset options entry. 
                let presetJson = this.presetOptions[0].value; 
                this.gui.importPreset(JSON.parse(presetJson));
            }
        }
    }

    disposePresets() {
        GuiParams.Presets = '';
        this.presetList.dispose();
    }

    buildPresets() {
        this.presetList = this.gui.addInput(GuiParams, 'Presets', {
            index: PRESETS_IDX,
            options: this.presetOptions
        }); 
        this.presetList.on('change', this.onPresetSelected.bind(this));
    }

    buildPatternTypeOptions() {
        if (this.currentPatternType === PatternTypes.Ellipse) {
            this.patternTypeOptions = { Ellipse: PatternTypes.Ellipse, RoseCurve: PatternTypes.RoseCurve };
        } else if (this.currentPatternType === PatternTypes.RoseCurve) {
            this.patternTypeOptions = { RoseCurve: PatternTypes.RoseCurve, Ellipse: PatternTypes.Ellipse };
        } else {
            this.patternTypeOptions = { Ellipse: PatternTypes.Ellipse, RoseCurve: PatternTypes.RoseCurve }; // Default pattern type. 
        }
    }

    disposePatterns() {
        this.patternList.dispose();
    }

    buildPatterns() {
        this.patternList = this.patternFolder.addInput(PatternParams, 'PatternType', {
            label: 'Pattern Type',
            index: PATTERN_TYPE_IDX,
            options: this.patternTypeOptions
        }); 
        this.patternList.on('change', this.onPatternSelected.bind(this)); 
    }

    onPatternSelected(ev) {
        this.currentPatternType = ev.value;
        this.showPatternParams();

        // Fire the callback to notify that the pattern has changed.
        this.patternChangeUpdate(this.currentPatternType); 
    }

    showPatternParams() {
        if (this.currentPatternType === PatternTypes.Ellipse) {
            this.ellipseParamsFolder.hidden = false; 
            this.roseCurveParamsFolder.hidden = true; 
        } else if (this.currentPatternType === PatternTypes.RoseCurve) {
            this.ellipseParamsFolder.hidden = true; 
            this.roseCurveParamsFolder.hidden = false;
        }
    }

    subscribeForPatternChange(callback) {
        this.patternChangeUpdate = callback; 
    }

    subscribeShowPanel(callback) {
        this.onShowPanelCallback = callback; 
    }

    onShowPanel() {
        this.onShowPanelCallback(); 
    }  

    subscribeSpawnAgents(callback) {
        this.onSpawnAgentCallback = callback; 
    }

    onSpawnAgents() {
        this.onSpawnAgentCallback(); 
    }
} 

// Keep a singleton instance of this - through App.js
export default ServerGui;