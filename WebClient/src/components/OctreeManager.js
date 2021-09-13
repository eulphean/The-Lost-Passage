
/*
  Author: Amay Kataria
  Date: 09/13/2021
  Title: OctreeManager.js
  Description: Octree is a tree data structure where each parent can have uptill 8 children.
  We use this data structure to improve the performance of the flock. Now, every agent doesn't 
  have to test against every other agent. This data structure helps keep a list of neighbors for each
  agent. 
*/

import { Vector3 } from 'math-ds';
import { PointOctree } from 'sparse-octree'; 

const BIAS = 0.0; // No loose octree. 
const MAX_POINTS = 2.0; // Maximum points before the tree splits. 
export class Octree {
    constructor(origin, boundary) {
        let min = new Vector3(0, 0, 0);
        let max = new Vector3(0, 0, 0);

        min.x = origin.x - boundary; 
        min.y = origin.y - boundary; 
        min.z = origin.z - boundary; 

        max.x = origin.x + boundary; 
        max.y = origin.y + boundary; 
        max.z = origin.z + boundary;

        this.tree = new PointOctree(min, max, BIAS, MAX_POINTS); 
    }

    // Insert a point into the octree along with the data that should be retried. 
    insertPoint(position, agent) {
        this.tree.insert(position, agent); 
    }

    // Finds all the points in the octree within a given radius. 
    scanForPoints(position, radius) {
        return this.tree.findPoints(position, radius, true); 
    }

    pointCount() {
        return this.tree.pointCount; 
    } 
}

const OCTREE_HOOD_BOUNDARY = 20; 
const NEIGHBOUR_RADIUS = 5; // Radius from the origin.
export class OctreeManager {
    constructor() {
        this.flockOctree = {};
    }

    update(flockTarget, liarbirds) {
        this.setupOctree(flockTarget, liarbirds); 
    }

    setupOctree(flockTarget, liarbirds) {
        this.flockOctree = new Octree(flockTarget, OCTREE_HOOD_BOUNDARY); 
        liarbirds.forEach(l => {
            this.flockOctree.insertPoint(l.position, l); 
        }); 
    }

    // Neighbours around a point. 
    getNeighbours(origin) {
        let neighbours; let nAgents=[]; 
        neighbours = this.flockOctree.scanForPoints(origin, NEIGHBOUR_RADIUS);
        neighbours.forEach(n => {
            let a = n['data']; 
            nAgents.push(a); 
        }); 
        return nAgents; 
    }
}

          