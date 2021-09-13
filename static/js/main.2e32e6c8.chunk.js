(this["webpackJsonpVirtual-Companion"]=this["webpackJsonpVirtual-Companion"]||[]).push([[0],{43:function(t,e,i){t.exports=i.p+"static/media/Bird_simple.d1d4aa0b.glb"},73:function(t,e,i){t.exports=i(91)},78:function(t,e,i){},79:function(t,e,i){},91:function(t,e,i){"use strict";i.r(e);var n=i(5),a=i.n(n),s=i(38),r=i.n(s),o=(i(78),i(79),i(1)),h=i(2),c=i(3),u=i(4),l=i(19),d=i(0),p=i(39),f=i.n(p),v=i(40),m=i.n(v),y=i(41),g=i(42),w=function(t,e,i,n,a){var s=Math.sqrt(t*t+e*e+i*i);t/=s,e/=s,i/=s;var r=Math.cos(n/2),o=Math.sin(n/2);a.set(t*o,e*o,i*o,r)},k=function(){function t(e){Object(o.a)(this,t),this.theta_rad=0,this.amp=e.amp,this.isClockwise=e.dir,this.originPos=e.pos,this.moveFactor=e.move,this.targetPos=new d.Vector3(0,0,0)}return Object(h.a)(t,[{key:"updateTheta",value:function(t){this.theta_rad=this.isClockwise?this.theta_rad+this.moveFactor:this.theta_rad-this.moveFactor,this.theta_rad=this.theta_rad>=t?0:this.theta_rad}},{key:"cartesianX",value:function(t){return this.originPos.x+t*Math.cos(this.theta_rad)}},{key:"cartesianZ",value:function(t){return this.originPos.z+t*Math.sin(this.theta_rad)}},{key:"cartesianY",value:function(t){return this.originPos.y+this.amp*Math.sin(this.theta_rad)}},{key:"getTargetPos",value:function(){return this.targetPos}},{key:"syncPatternObj",value:function(){}}]),t}(),b=function(t){Object(c.a)(i,t);var e=Object(u.a)(i);function i(t){var n;return Object(o.a)(this,i),(n=e.call(this,t)).radX=t.radx,n.radZ=t.radz,n.maxTheta=2*Math.PI,n}return Object(h.a)(i,[{key:"update",value:function(){var t=this.cartesianX(this.radX),e=this.cartesianZ(this.radZ),i=this.cartesianY();this.targetPos.set(t,i,e),this.updateTheta(this.maxTheta)}}]),i}(k),S=.8,P=.5,V=.2,O=function(){function t(){Object(o.a)(this,t),this.position=new d.Vector3(20*Math.random(),2,0),this.velocity=new d.Vector3(.1,.1,.1),this.acceleration=new d.Vector3(0,0,0),this.rotationA=new d.Quaternion,this.rotationB=new d.Quaternion,this.fSteer=new d.Vector3(0,0,0),this.vDesired=new d.Vector3(0,0,0),this.sumVec=new d.Vector3(0,0,0),this.diffVec=new d.Vector3(0,0,0),this.maxForce=.01,this.maxSpeed=this.getRandomArbitrary(.015,.025),this.maxSlowDownSpeed=0,this.slowDownTolerance=.2*.2,this.arriveTolerance=1e-4,this.smoothFactor=.01,this.target=new d.Vector3(0,0,0)}return Object(h.a)(t,[{key:"updateAgent",value:function(t){this.seekTarget(),this.flock(t),this.updatePosition()}},{key:"seekTarget",value:function(){this.seek(),this.applyForce()}},{key:"flock",value:function(t){t.length>0&&(this.seperation(t),this.applyForce(),this.cohesion(t),this.applyForce(),this.align(t),this.applyForce())}},{key:"updatePosition",value:function(){this.sumVec.addVectors(this.velocity,this.acceleration),this.velocity=this.velocity.lerp(this.sumVec,this.smoothFactor),this.velocity.clampLength(-9999,this.maxSpeed),this.position.add(this.velocity),this.acceleration.multiplyScalar(0)}},{key:"applyForce",value:function(){this.acceleration.add(this.fSteer)}},{key:"seek",value:function(){this.vDesired.subVectors(this.target,this.position),this.vDesired.normalize();var t,e,i,n,a,s=this.vDesired.lengthSq();if(s<this.slowDownTolerance&&s>this.arriveTolerance){var r=(t=s,e=this.slowDownTolerance,i=this.arriveTolerance,n=this.maxSpeed,a=this.maxSlowDownSpeed,n+(a-n)*(t-e)/(i-e));this.vDesired.multiplyScalar(r)}else this.vDesired.multiplyScalar(this.maxSpeed);this.fSteer.subVectors(this.vDesired,this.velocity),this.fSteer.clampLength(-99999,this.maxForce)}},{key:"seperation",value:function(t){var e=this;this.fSteer.set(0,0,0),this.sumVec.set(0,0,0),t.length>0&&(t.forEach((function(t){e.diffVec.subVectors(e.position,t.position),e.diffVec.normalize(),e.diffVec.divideScalar(e.diffVec.length()),e.sumVec.add(e.diffVec)})),this.sumVec.divideScalar(t.length),this.sumVec.lengthSq()>0&&(this.sumVec.normalize(),this.sumVec.clampLength(-99999,this.maxSpeed),this.fSteer.subVectors(this.sumVec,this.velocity),this.fSteer.clampLength(-99999,this.maxForce),this.fSteer.multiplyScalar(S)))}},{key:"cohesion",value:function(t){var e=this;this.target.set(0,0,0),this.fSteer.set(0,0,0),t.length>0&&(t.forEach((function(t){e.target.add(t.position)})),this.target.divideScalar(t.length),this.seek(),this.fSteer.multiplyScalar(P))}},{key:"align",value:function(t){var e=this;this.fSteer.set(0,0,0),t.length>0&&(t.forEach((function(t){e.fSteer.add(t.velocity)})),this.fSteer.divideScalar(t.length),this.fSteer.normalize(),this.fSteer.multiplyScalar(this.maxSpeed),this.fSteer.sub(this.velocity),this.fSteer.clampLength(-99999,this.maxForce),this.fSteer.multiplyScalar(V))}},{key:"setTarget",value:function(t){this.target.copy(t)}},{key:"getRandomArbitrary",value:function(t,e){return Math.random()*(e-t)+t}}]),t}(),x=i(43),M=i.n(x),j=new g.a,R=function(t){Object(c.a)(i,t);var e=Object(u.a)(i);function i(t){var n;return Object(o.a)(this,i),(n=e.call(this)).loadPigeon(t),n}return Object(h.a)(i,[{key:"loadPigeon",value:function(t){var e=this;j.load(M.a,(function(i){e.pigeon=i.scene,e.parent=new d.Group,e.parent.add(e.pigeon),e.parent.frustumCulled=!1,e.parent.castShadow=!0,e.parent.receiveShadow=!0,e.agentPosition=e.parent.position,e.agentRotation=e.parent.rotation,e.agentScale=e.parent.scale,e.agentAnimations=i.animations,e.agentScale.set(.25,.25,.25),e.animationMixer=new d.AnimationMixer(e.parent),e.animationMixer.clipAction(e.agentAnimations[0]).play(),t.add(e.parent)}),void 0,(function(t){console.error(t)}))}},{key:"update",value:function(t,e){this.animationMixer&&(this.animationMixer.update(t),this.updateAgent(e),this.syncPosition(),this.syncRotation())}},{key:"syncPosition",value:function(){this.parent.position.copy(this.position)}},{key:"syncRotation",value:function(){var t,e,i;i=this.velocity,t=Math.atan2(i.x,i.z),e=function(t){return Math.acos(t.y/t.length())}(this.velocity),w(0,1,0,t,this.rotationA),w(0,0,1,e-Math.PI/2,this.rotationB),this.rotationA.multiply(this.rotationB),this.parent.setRotationFromQuaternion(this.rotationA)}}]),i}(O),T=function(){function t(e){Object(o.a)(this,t);var i=new d.SphereGeometry(.2,15,15),n=new d.MeshLambertMaterial({color:new d.Color(1,0,0),wireframe:!1});this.mesh=new d.Mesh(i,n),e.add(this.mesh)}return Object(h.a)(t,[{key:"getVector",value:function(){return this.mesh.position}},{key:"setVector",value:function(t){this.mesh.position.copy(t)}},{key:"setVisibility",value:function(t){this.mesh.visible=t}}]),t}(),C=i(6),A=i(72),F=function(){function t(e,i){Object(o.a)(this,t);var n=new C.c(0,0,0),a=new C.c(0,0,0);n.x=e.x-i,n.y=e.y-i,n.z=e.z-i,a.x=e.x+i,a.y=e.y+i,a.z=e.z+i,this.tree=new A.a(n,a,0,2)}return Object(h.a)(t,[{key:"insertPoint",value:function(t,e){this.tree.insert(t,e)}},{key:"scanForPoints",value:function(t,e){return this.tree.findPoints(t,e,!0)}},{key:"pointCount",value:function(){return this.tree.pointCount}}]),t}(),D=function(){function t(){Object(o.a)(this,t),this.flockOctree={}}return Object(h.a)(t,[{key:"update",value:function(t,e){this.setupOctree(t,e)}},{key:"setupOctree",value:function(t,e){var i=this;this.flockOctree=new F(t,20),e.forEach((function(t){i.flockOctree.insertPoint(t.position,t)}))}},{key:"getNeighbours",value:function(t){var e=[];return this.flockOctree.scanForPoints(t,5).forEach((function(t){var i=t.data;e.push(i)})),e}}]),t}(),z=f()(d),E={container:{zIndex:0,top:"0%",overflowX:"hidden",overflowY:"auto"}},G={showGrid:!0,showTarget:!0},L=function(t){Object(c.a)(i,t);var e=Object(u.a)(i);function i(t){var n;return Object(o.a)(this,i),(n=e.call(this,t)).state={},n.ref=a.a.createRef(),n.scene=new d.Scene,n.setupCamera(),n.setupProps(),n.setupGui(),n.setupLighting(),n.setupRenderer(),n.setupOrbitControls(),n.target=new T(n.scene),n.stats=new m.a,n.clock=new d.Clock,n.setupPattern(),n.octreeManager=new D,n.pigeons=[],n}return Object(h.a)(i,[{key:"componentDidMount",value:function(){this.ref.current.appendChild(this.renderer.domElement),this.ref.current.appendChild(this.stats.dom);for(var t=0;t<50;t++){var e=new R(this.scene);this.pigeons.push(e)}this.initThreeRender()}},{key:"update",value:function(){var t=this;this.grid.visible=G.showGrid,this.target.setVisibility(G.showTarget);var e=this.clock.getDelta();this.ellipsePattern.update();var i=this.ellipsePattern.getTargetPos();this.octreeManager.update(i,this.pigeons);var n=[];this.pigeons.forEach((function(a){a.setTarget(i),n=t.octreeManager.getNeighbours(a.position),a.update(e,n)})),this.target.setVector(i)}},{key:"render",value:function(){return a.a.createElement("div",{style:E.container,ref:this.ref})}},{key:"initThreeRender",value:function(){this.stats.begin(),this.update(),this.controls.update(),this.renderer.render(this.scene,this.camera),this.stats.end(),requestAnimationFrame(this.initThreeRender.bind(this))}},{key:"setupRenderer",value:function(){this.renderer=new d.WebGLRenderer({antialias:!0}),this.renderer.setClearColor(1149471,1),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.outputEncoding=d.sRGBEncoding}},{key:"setupOrbitControls",value:function(){this.controls=new z(this.camera),this.controls.enablePan=!0,this.controls.enabled=!0,this.controls.enableKeys=!0}},{key:"setupCamera",value:function(){this.camera=new d.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.05,2e4),this.camera.position.set(4,4,4),this.camera.lookAt(new d.Vector3(0,0,0)),this.camera.frustumCulled=!1}},{key:"setupProps",value:function(){for(var t=0;t<100;t++){var e=new d.BoxGeometry(.5,.5,.5),i=new d.MeshBasicMaterial({color:6368300}),n=new d.Mesh(e,i),a=8*this.getRandomArbitrary(-1,1),s=8*this.getRandomArbitrary(-1,1);n.position.x=a,n.position.z=s,n.position.y=.25,this.scene.add(n)}var r=new d.PlaneGeometry(20,20),o=new d.MeshBasicMaterial({color:5429092,side:d.DoubleSide}),h=new d.Mesh(r,o);h.rotation.x=Math.PI/2,this.scene.add(h),this.scene.add(new d.AxesHelper(30)),this.grid=new d.GridHelper(30,10),this.scene.add(this.grid)}},{key:"setupLighting",value:function(){var t=new d.AmbientLight(14144467);t.intensity=1.5;var e=new d.DirectionalLight(16777215);e.intensity=3,e.position.set(0,50,50).normalize(),this.scene.add(t),this.scene.add(e)}},{key:"setupGui",value:function(){this.gui=new y.a,this.gui.add(G,"showGrid").name("Show Grid"),this.gui.add(G,"showTarget").name("Show Target")}},{key:"getRandomArbitrary",value:function(t,e){return Math.random()*(e-t)+t}},{key:"setupPattern",value:function(){var t=function(t,e,i,n,a,s){return{pos:t,radx:e,radz:i,amp:n,dir:a,move:s}}(new d.Vector3(0,6,0),10,10,0,!0,d.Math.degToRad(.3));this.ellipsePattern=new b(t)}},{key:"updatePattern",value:function(){this.ellipsePattern.update()}}]),i}(a.a.Component),_=Object(l.a)(L),B=function(t){Object(c.a)(i,t);var e=Object(u.a)(i);function i(t){var n;return Object(o.a)(this,i),(n=e.call(this,t)).state={},n.totalRef=a.a.createRef(),n.worldRef=a.a.createRef(),n}return Object(h.a)(i,[{key:"render",value:function(){return a.a.createElement("div",null,a.a.createElement(_,{ref:this.worldRef}))}},{key:"componentDidUpdate",value:function(){console.log(this.totalRef.current.scrollHeight)}}]),i}(a.a.Component),H=Object(l.a)(B),I=i(32);r.a.render(a.a.createElement(I.a,null,a.a.createElement(H,null)),document.getElementById("root"))}},[[73,1,2]]]);
//# sourceMappingURL=main.2e32e6c8.chunk.js.map