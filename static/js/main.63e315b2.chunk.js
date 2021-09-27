(this["webpackJsonpVirtual-Companion"]=this["webpackJsonpVirtual-Companion"]||[]).push([[0],{112:function(e,t,n){e.exports=n(159)},117:function(e,t,n){},118:function(e,t,n){},159:function(e,t,n){"use strict";n.r(t);var i=n(3),a=n.n(i),s=n(76),r=n.n(s),o=(n(117),n(118),n(0)),l=n(2),u=n(4),h=n(5),c=n(7),d=n(1),p=n(33),f=n(77),m=n.n(f),g=new p.a,v=function(){function e(t){Object(o.a)(this,e),this.loadTerrain(t)}return Object(l.a)(e,[{key:"loadTerrain",value:function(e){var t=this;g.load(m.a,(function(n){t.terrain=n.scene,t.parent=new d.Group,t.parent.add(t.terrain),t.parent.frustumCulled=!1,t.parent.castShadow=!0,t.parent.receiveShadow=!0,t.terrainPosition=t.parent.position,t.terrainRotation=t.parent.rotation,t.terrainScale=t.parent.scale,t.terrainScale.set(100,100,100),e.add(t.parent)}),void 0,(function(e){console.error(e)}))}},{key:"getMesh",value:function(){return this.parent}}]),e}(),P=n(78),b=n.n(P)()(d),y={EnableControls:!1,EnablePan:!0,AutoRotate:!1,RotateSpeed:.1,EnableKeys:!0},k=function(){function e(){Object(o.a)(this,e),this.camera=new d.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.05,2e4),this.camera.position.set(0,125,50),this.camera.lookAt(new d.Vector3(0,0,0)),this.camera.frustumCulled=!0,this.controls=new b(this.camera)}return Object(l.a)(e,[{key:"update",value:function(){this.updateControls()}},{key:"updateControls",value:function(){this.controls.update(),this.controls.enablePan=y.EnablePan,this.controls.autoRotate=y.AutoRotate,this.controls.autoRotateSpeed=y.RotateSpeed,this.controls.enabled=y.EnableControls,this.controls.enableKeys=y.EnableKeys}},{key:"getCamera",value:function(){return this.camera}}]),e}(),w=function e(t){Object(o.a)(this,e);var n=new d.DirectionalLight(16777215);n.intensity=1,n.position.set(0,100,0).normalize(),t.add(n)},S=function(){function e(){Object(o.a)(this,e),this.renderer=new d.WebGLRenderer({antialias:!0}),this.renderer.setClearColor(741907,1),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.outputEncoding=d.sRGBEncoding}return Object(l.a)(e,[{key:"getDomElement",value:function(){return this.renderer.domElement}},{key:"render",value:function(e,t){this.renderer.render(e,t)}}]),e}(),O={PatternType:""},x=0,C=1,F={Origin:{x:0,y:6,z:0},Radii:{x:10,y:10},Amplitude:0,Speed:.3,Direction:!0},R={Origin:{x:0,y:6,z:0},Radius:5,Phase:.5,NumPetals:3,Amplitude:0,Sinusoidal:!0,Direction:!0,Speed:.3},j=function(){function e(t){Object(o.a)(this,e),this.theta_rad=0,this.amp=t.amp,this.isClockwise=t.dir,this.originPos=t.pos,this.moveFactor=t.move,this.targetPos=new d.Vector3(0,0,0)}return Object(l.a)(e,[{key:"updateTheta",value:function(e){this.theta_rad=this.isClockwise?this.theta_rad+this.moveFactor:this.theta_rad-this.moveFactor,this.theta_rad=this.theta_rad>=e?0:this.theta_rad}},{key:"cartesianX",value:function(e){return this.originPos.x+e*Math.cos(this.theta_rad)}},{key:"cartesianZ",value:function(e){return this.originPos.z+e*Math.sin(this.theta_rad)}},{key:"cartesianY",value:function(e){return this.originPos.y+this.amp*Math.sin(this.theta_rad)}},{key:"getTargetPos",value:function(){return this.targetPos}}]),e}(),E=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var i;return Object(o.a)(this,n),(i=t.call(this,e)).radX=e.radx,i.radZ=e.radz,i.maxTheta=2*Math.PI,i}return Object(l.a)(n,[{key:"update",value:function(){this.updateGuiParams();var e=this.cartesianX(this.radX),t=this.cartesianZ(this.radZ),n=this.cartesianY();this.targetPos.set(e,n,t),this.updateTheta(this.maxTheta)}},{key:"updateGuiParams",value:function(){this.originPos.set(F.Origin.x,F.Origin.y,F.Origin.z),this.radX=F.Radii.x,this.radZ=F.Radii.y,this.amp=F.Amplitude,this.moveFactor=d.Math.degToRad(F.Speed),this.isClockwise=F.Direction}}]),n}(j),T=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var i;return Object(o.a)(this,n),(i=t.call(this,e)).rad=e.rad,i.phase=e.ph,i.numPetals=e.numP,i.isSin=e.isSin,i.maxTheta=Math.PI,i}return Object(l.a)(n,[{key:"update",value:function(){var e,t,n;this.updateGuiParams();var i=this.isSin?this.rad*Math.sin(this.phase+this.numPetals*this.theta_rad):this.rad*Math.cos(this.phase+this.numPetals*this.theta_rad);e=this.cartesianX(i),n=this.cartesianZ(i),t=this.cartesianY(),this.targetPos.set(e,t,n),this.updateTheta(this.maxTheta)}},{key:"updateGuiParams",value:function(){this.originPos.set(R.Origin.x,R.Origin.y,R.Origin.z),this.rad=R.Radius,this.phase=R.Phase,this.amp=R.Amplitude,this.numPetals=R.NumPetals,this.isSin=R.Sinusoidal,this.isClockwise=R.Direction,this.moveFactor=d.Math.degToRad(R.Speed)}}]),n}(j),I=function(){function e(){Object(o.a)(this,e)}return Object(l.a)(e,[{key:"setTargetPattern",value:function(e){if(e===x){console.log("Creating Ellipse Pattern");var t=function(e,t,n,i,a,s){return{pos:e,radx:t,radz:n,amp:i,dir:a,move:s}}(new d.Vector3(0,6,0),10,10,0,!0,d.Math.degToRad(.3));this.curPattern=new E(t)}else if(e===C){console.log("Creating Rose-Curve Pattern");var n=function(e,t,n,i,a,s,r,o){return{pos:e,rad:t,ph:n,numP:i,amp:a,isSin:s,dir:r,move:o}}(new d.Vector3(0,6,0),10,.5,3,0,!0,!0,d.Math.degToRad(.3));this.curPattern=new T(n)}}},{key:"update",value:function(){if(this.curPattern)return this.curPattern.update(),this.curPattern.getTargetPos()}}]),e}(),M=n(6),A=n(111),z=function(){function e(t,n){Object(o.a)(this,e);var i=new M.c(0,0,0),a=new M.c(0,0,0);i.x=t.x-n,i.y=t.y-n,i.z=t.z-n,a.x=t.x+n,a.y=t.y+n,a.z=t.z+n,this.tree=new A.a(i,a,0,2)}return Object(l.a)(e,[{key:"insertPoint",value:function(e,t){this.tree.insert(e,t)}},{key:"scanForPoints",value:function(e,t){return this.tree.findPoints(e,t,!0)}},{key:"pointCount",value:function(){return this.tree.pointCount}}]),e}(),L=function(){function e(){Object(o.a)(this,e),this.flockOctree={}}return Object(l.a)(e,[{key:"update",value:function(e,t){this.setupOctree(e,t)}},{key:"setupOctree",value:function(e,t){var n=this;this.flockOctree=new z(e,20),t.forEach((function(e){n.flockOctree.insertPoint(e.position,e)}))}},{key:"getNeighbours",value:function(e){var t=[];return this.flockOctree.scanForPoints(e,5).forEach((function(e){var n=e.data;t.push(n)})),t}}]),e}(),D={MaxForce:.01,SmoothFactor:.01,SeperationForce:1.2,CohesionForce:.5,AlignmentForce:.2},G=(n(79),new p.a,function(){function e(t){Object(o.a)(this,e);var n=new d.SphereGeometry(.2,15,15),i=new d.MeshLambertMaterial({color:new d.Color(1,0,0),wireframe:!1});this.mesh=new d.Mesh(n,i),t.add(this.mesh)}return Object(l.a)(e,[{key:"getVector",value:function(){return this.mesh.position}},{key:"setVector",value:function(e){this.mesh.position.copy(e)}},{key:"setVisibility",value:function(e){this.mesh.visible=e}}]),e}()),N={ShowTarget:!0},_=function(){function e(){Object(o.a)(this,e),this.octreeManager=new L,this.patternManager=new I,this.pigeons=[],this.clock=new d.Clock}return Object(l.a)(e,[{key:"setup",value:function(e,t){console.log("Pigeon Manager Pattern: "+t),this.spawnPigeons(e),this.target=new G(e),this.patternManager.setTargetPattern(t)}},{key:"update",value:function(){var e=this;if(this.pigeons.length>0){var t=this.patternManager.update();if(t){this.target.setVector(t),this.target.setVisibility(N.ShowTarget),this.octreeManager.update(t,this.pigeons);var n=[],i=this.clock.getDelta();this.pigeons.forEach((function(a){a.setTarget(t),n=e.octreeManager.getNeighbours(a.position),a.update(i,n)}))}}}},{key:"setNewPatternType",value:function(e){this.patternManager.setTargetPattern(e)}},{key:"spawnPigeons",value:function(e){}}]),e}(),V=n(80),B=n(81),W=n(43),H=n.n(W),J=n(82),U=n.n(J),X=new(function(){function e(){Object(o.a)(this,e),this.siteURL="https://befantastic-martha.herokuapp.com/app",this.socket=U()(this.siteURL,{reconnection:!0,reconnectionDelay:500,reconnectionAttempts:1/0}),this.socket.once("connect",this.subscribe.bind(this)),this.handlePresetsCbk=""}return Object(l.a)(e,[{key:"subscribe",value:function(){console.log("Connected"),this.socket.on("time",this.logTime.bind(this)),this.socket.on("receivePresets",this.handlePresets.bind(this))}},{key:"handlePresets",value:function(e){this.handlePresetsCbk(e)}},{key:"saveGuiPreset",value:function(e,t){var n={name:e,data:t};this.socket.emit("savePreset",n)}},{key:"readAllPresets",value:function(e){this.socket.emit("getPresets"),this.handlePresetsCbk=e}},{key:"deletePreset",value:function(e){this.socket.emit("deletePreset",e)}},{key:"disconnect",value:function(){console.log("Socket Server Disconnected.")}},{key:"logTime",value:function(e){}}]),e}()),Z={Preset:"Global",Presets:""},K=function(){function e(t){Object(o.a)(this,e),this.gui=new V.Pane({title:"Pigeon GUI",container:t,expanded:!1}),this.gui.registerPlugin(B),this.gui.addInput(Z,"Preset"),this.presetOptions=[],this.buildPresets(),this.fpsGraph=this.gui.addBlade({view:"fpsgraph",label:"FPS",lineCount:2});var n=this.gui.addFolder({title:"Orbit Controls",expanded:!0});n.addInput(y,"EnableControls",{label:"Enable Controls"}),n.addInput(y,"EnablePan",{label:"Enable Panning"}),n.addInput(y,"AutoRotate",{label:"Enable AutoRotate"}),n.addInput(y,"RotateSpeed",{label:"Rotation Speed",min:.1,max:1}),n.addInput(y,"EnableKeys",{label:"Enable Keys"}),this.gui.addFolder({title:"Target Params",expanded:!0}).addInput(N,"ShowTarget",{label:"Show Target"}),this.patternFolder=this.gui.addFolder({title:"Pattern Params",expanded:!0}),this.buildPatternTypeOptions(x),this.buildPatterns(),this.ellipseParamsFolder=this.patternFolder.addFolder({title:"Ellipse Pattern Params",expanded:!0}),this.ellipseParamsFolder.addInput(F,"Origin"),this.ellipseParamsFolder.addInput(F,"Radii",{x:{min:0,max:50},y:{min:0,max:50}}),this.ellipseParamsFolder.addInput(F,"Amplitude",{min:0,max:10}),this.ellipseParamsFolder.addInput(F,"Speed",{min:0,max:2}),this.ellipseParamsFolder.addInput(F,"Direction"),this.roseCurveParamsFolder=this.patternFolder.addFolder({title:"Rose-Curve Pattern Params",expanded:!0}),this.roseCurveParamsFolder.addInput(R,"Origin"),this.roseCurveParamsFolder.addInput(R,"Radius",{min:1,max:50}),this.roseCurveParamsFolder.addInput(R,"Phase",{min:0,max:10}),this.roseCurveParamsFolder.addInput(R,"NumPetals",{min:1,max:10,step:1}),this.roseCurveParamsFolder.addInput(R,"Amplitude",{min:0,max:10}),this.roseCurveParamsFolder.addInput(R,"Sinusoidal"),this.roseCurveParamsFolder.addInput(R,"Direction"),this.roseCurveParamsFolder.addInput(R,"Speed",{min:0,max:2});var i=this.gui.addFolder({title:"Agent Params",expanded:!0});i.addInput(D,"MaxForce",{label:"Max Force",min:.005,max:2,step:.005}),i.addInput(D,"SmoothFactor",{label:"Smooth Factor",min:.005,max:.1,step:.005}),i.addInput(D,"SeperationForce",{label:"Seperation Force",min:.5,max:2,step:.1}),i.addInput(D,"CohesionForce",{label:"Cohesion Force",min:.1,max:2,step:.1}),i.addInput(D,"AlignmentForce",{label:"Alignment Force",min:0,max:2,step:.1}),this.gui.addButton({title:"Save Preset"}).on("click",this.onSavePreset.bind(this)),this.gui.addButton({title:"Delete Preset"}).on("click",this.onDeletePreset.bind(this)),this.gui.addButton({title:"Show Panel"}).on("click",this.onShowPanel.bind(this)),this.gui.addButton({title:"Spawn Agents"}).on("click",this.onSpawnAgents.bind(this)),X.readAllPresets(this.onReceivePresets.bind(this))}return Object(l.a)(e,[{key:"onPresetSelected",value:function(e){var t=JSON.parse(e.value);this.gui.importPreset(t)}},{key:"onReceivePresets",value:function(e){var t=this;if(console.log("All the presets received:"),console.log(e),e.length>0){e.forEach((function(e){var n=e.name,i=e.config;t.presetOptions.push({text:n,value:JSON.stringify(i)})}));var n=e[0].config;this.gui.importPreset(n),this.disposePresets(),this.buildPresets(),this.currentPatternType=n.PatternType,this.buildPatternTypeOptions(),this.disposePatterns(),this.buildPatterns(),this.showPatternParams()}}},{key:"onSavePreset",value:function(){var e=Z.Preset;if(e.length>0){this.disposePresets();var t=this.gui.exportPreset(),n=H.a.find(this.presetOptions,(function(t){return t.text===e}));n?(console.log("Preset Exists. Updating database and local copy of the preset."),n.value=JSON.stringify(t),this.presetOptions=H.a.sortBy(this.presetOptions,(function(t){return t.text===e?0:1}))):(console.log("Preset doesnt exist. New entry in the database."),this.presetOptions.unshift({text:e,value:JSON.stringify(t)})),X.saveGuiPreset(e,t),this.buildPresets()}else alert("Not an empty entry please.")}},{key:"onDeletePreset",value:function(){if(this.presetOptions.length>0){var e=Z.Preset;if(console.log("Deleting preset: "+e),H.a.remove(this.presetOptions,(function(t){return t.text===e})),X.deletePreset(e),this.disposePresets(),this.buildPresets(),this.presetOptions.length>0){var t=this.presetOptions[0].value;this.gui.importPreset(JSON.parse(t))}}}},{key:"disposePresets",value:function(){Z.Presets="",this.presetList.dispose()}},{key:"buildPresets",value:function(){this.presetList=this.gui.addInput(Z,"Presets",{index:1,options:this.presetOptions}),this.presetList.on("change",this.onPresetSelected.bind(this))}},{key:"buildPatternTypeOptions",value:function(){this.currentPatternType===x?this.patternTypeOptions={Ellipse:x,RoseCurve:C}:this.currentPatternType===C?this.patternTypeOptions={RoseCurve:C,Ellipse:x}:this.patternTypeOptions={Ellipse:x,RoseCurve:C}}},{key:"disposePatterns",value:function(){this.patternList.dispose()}},{key:"buildPatterns",value:function(){this.patternList=this.patternFolder.addInput(O,"PatternType",{label:"Pattern Type",index:0,options:this.patternTypeOptions}),this.patternList.on("change",this.onPatternSelected.bind(this))}},{key:"onPatternSelected",value:function(e){this.currentPatternType=e.value,this.showPatternParams(),this.patternChangeUpdate(this.currentPatternType)}},{key:"showPatternParams",value:function(){this.currentPatternType===x?(this.ellipseParamsFolder.hidden=!1,this.roseCurveParamsFolder.hidden=!0):this.currentPatternType===C&&(this.ellipseParamsFolder.hidden=!0,this.roseCurveParamsFolder.hidden=!1)}},{key:"subscribeForPatternChange",value:function(e){this.patternChangeUpdate=e}},{key:"subscribeShowPanel",value:function(e){this.onShowPanelCallback=e}},{key:"onShowPanel",value:function(){this.onShowPanelCallback()}},{key:"subscribeSpawnAgents",value:function(e){this.onSpawnAgentCallback=e}},{key:"onSpawnAgents",value:function(){this.onSpawnAgentCallback()}}]),e}(),Y={container:{position:"absolute",top:"150px",right:"20px"}},q=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var i;return Object(o.a)(this,n),(i=t.call(this,e)).state={},i.guiRef=a.a.createRef(),i}return Object(l.a)(n,[{key:"render",value:function(){return a.a.createElement("div",{ref:this.guiRef,style:Y.container})}},{key:"componentDidMount",value:function(){var e=this.guiRef.current;this.gui=new K(e),this.gui.subscribeShowPanel(this.onShowPanel.bind(this)),this.gui.subscribeSpawnAgents(this.onSpawnAgents.bind(this))}},{key:"getFpsGraph",value:function(){return this.gui.fpsGraph}},{key:"onShowPanel",value:function(){this.props.onShowInfoPanel()}},{key:"onSpawnAgents",value:function(){this.props.onSpawnAgents()}},{key:"subscribeForPatternChange",value:function(e){this.gui.subscribeForPatternChange(e)}},{key:"getCurPatternType",value:function(){return this.gui.currentPatternType}}]),n}(a.a.Component),Q=Object(c.a)(q),$="#ffffff",ee="#E7EFE0",te="24px",ne="44px",ie="28px",ae="36px",se="d-dinregular",re="warsaw_gothic",oe={container:{position:"absolute",top:"0%",width:"100vw",height:"100vh",backgroundColor:"rgb(0, 0, 0, 0.4)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:0},hide:{visibility:"hidden"},title:{fontFamily:re,fontSize:"52px",letterSpacing:5,opacity:1,color:$},loading:{fontFamily:se,fontSize:te,color:$},button:{fontFamily:se,color:$,fontSize:te,borderStyle:"solid",borderWidth:"2px",padding:"8px",paddingLeft:ie,paddingRight:ie,cursor:"default"}},le=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var i;return Object(o.a)(this,n),(i=t.call(this,e)).state={isHidden:!1,isLoading:!1},i}return Object(l.a)(n,[{key:"render",value:function(){var e=this.state.isHidden?[oe.container,oe.hide]:oe.container,t=this.state.isLoading?this.getLoader():this.getTitle();return a.a.createElement("div",{style:e},t)}},{key:"getLoader",value:function(){return a.a.createElement("div",{style:oe.loading},"Loading ...")}},{key:"getTitle",value:function(){return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{style:oe.title},"MARTHA.I"),a.a.createElement("div",{onClick:this.onEnter.bind(this),style:oe.button},"ENTER"))}},{key:"onEnter",value:function(){this.setState({isLoading:!0}),this.props.onEnterWorld(),setTimeout(this.hasFinishedLoading.bind(this),0)}},{key:"hasFinishedLoading",value:function(){this.setState({isHidden:!0}),this.props.onLoadComplete()}}]),n}(a.a.Component),ue=Object(c.a)(le),he={floatIn:c.a.keyframes({"0%":{top:"-100px"},"50%":{top:"-50px"},"100%":{top:"0px"}}),floatOut:c.a.keyframes({"0%":{top:"0"},"50%":{top:"-50px"},"100%":{top:"-100px"}})},ce={container:{position:"absolute",width:"100%",top:"-100px"},content:{display:"flex",flexDirection:"row",justifyContent:"space-between",padding:ae,alignSelf:"center"},animateIn:{animation:"x 2s linear 1 forwards",animationName:he.floatIn},animateOut:{animation:"x 2s linear 1 forwards",animationName:he.floatOut},title:{fontFamily:re,fontSize:ne,letterSpacing:5,opacity:1,color:$,cursor:"default"},about:{fontFamily:se,color:$,fontSize:ne,cursor:"default"}},de=0,pe=1,fe=2,me=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var i;return Object(o.a)(this,n),(i=t.call(this,e)).state={aniState:de},i}return Object(l.a)(n,[{key:"render",value:function(){var e=this.state.aniState===pe?[ce.container,ce.animateIn]:this.state.aniState===fe?[ce.container,ce.animateOut]:ce.container;return a.a.createElement("div",{style:e},a.a.createElement("div",{style:ce.content},a.a.createElement("div",{style:ce.title},"MARTHA.I"),a.a.createElement("div",{style:ce.title},"ABOUT")))}},{key:"updateTitle",value:function(){this.state.aniState===de?this.setState({aniState:pe}):this.state.aniState===pe?this.setState({aniState:fe}):this.state.aniState===fe&&this.setState({aniState:pe})}}]),n}(a.a.Component),ge=Object(c.a)(me),ve={slideIn:c.a.keyframes({"0%":{left:"-500px"},"50%":{left:"-250px"},"100%":{left:"0px"}}),slideOut:c.a.keyframes({"0%":{left:"0px"},"50%":{left:"-250px"},"100%":{left:"-500px"}})},Pe={container:{position:"absolute",top:"0%",width:"500px",height:"100%",left:"-500px",backgroundColor:ee},content:{display:"flex",flexDirection:"row",justifyContent:"space-between",padding:ae,alignSelf:"center"},animateIn:{animation:"x 2s linear 1 forwards",animationName:ve.slideIn},animateOut:{animation:"x 2s linear 1 forwards",animationName:ve.slideOut},title:{fontFamily:re,fontSize:ne,letterSpacing:5,opacity:1,color:$,cursor:"default"},about:{fontFamily:se,color:$,fontSize:ne,cursor:"default"}},be=0,ye=1,ke=2,we=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var i;return Object(o.a)(this,n),(i=t.call(this,e)).state={aniState:be},i}return Object(l.a)(n,[{key:"render",value:function(){var e=this.state.aniState===ye?[Pe.container,Pe.animateIn]:this.state.aniState===ke?[Pe.container,Pe.animateOut]:Pe.container;return a.a.createElement("div",{style:e},a.a.createElement("div",{style:Pe.content}))}},{key:"updatePanel",value:function(){this.state.aniState===be?this.setState({aniState:ye}):this.state.aniState===ye?this.setState({aniState:ke}):this.state.aniState===ke&&this.setState({aniState:ye})}}]),n}(a.a.Component),Se=Object(c.a)(we),Oe={container:{width:"100vw",height:"100vh",overflow:"hidden"}},xe=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var i;return Object(o.a)(this,n),(i=t.call(this,e)).state={},i.worldRef=a.a.createRef(),i.guiRef=a.a.createRef(),i.titleRef=a.a.createRef(),i.panelRef=a.a.createRef(),i.scene=new d.Scene,i.cameraControl=new k,i.lightingManager=new w(i.scene),i.pigeonManager=new _,i.terrain=new v(i.scene),i.rendererManager=new S,i}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=this.rendererManager.getDomElement();this.worldRef.current.appendChild(e),this.fpsGraph=this.guiRef.current.getFpsGraph(),this.guiRef.current.subscribeForPatternChange(this.onPatternChanged.bind(this)),this.initializeRender()}},{key:"render",value:function(){return a.a.createElement("div",{style:Oe.container,ref:this.worldRef},a.a.createElement(Q,{ref:this.guiRef,onShowInfoPanel:this.onShowInfoPanel.bind(this),onSpawnAgents:this.onSpawnAgents.bind(this)}),a.a.createElement(ue,{onEnterWorld:this.onEnterWorld.bind(this),onLoadComplete:this.onLoadComplete.bind(this)}),a.a.createElement(ge,{ref:this.titleRef}),a.a.createElement(Se,{ref:this.panelRef}))}},{key:"initializeRender",value:function(){this.fpsGraph.begin(),this.pigeonManager.update(),this.cameraControl.update(),this.rendererManager.render(this.scene,this.cameraControl.getCamera()),this.fpsGraph.end(),requestAnimationFrame(this.initializeRender.bind(this))}},{key:"onEnterWorld",value:function(){var e=this.guiRef.current.getCurPatternType();this.pigeonManager.setup(this.scene,e)}},{key:"onLoadComplete",value:function(){this.titleRef.current.updateTitle()}},{key:"onShowInfoPanel",value:function(){this.panelRef.current.updatePanel(),this.titleRef.current.updateTitle()}},{key:"onPatternChanged",value:function(e){this.pigeonManager.setNewPatternType(e)}},{key:"onSpawnAgents",value:function(){this.pigeonManager.spawnPigeons(this.scene)}}]),n}(a.a.Component),Ce=Object(c.a)(xe),Fe=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var i;return Object(o.a)(this,n),(i=t.call(this,e)).state={},i.worldRef=a.a.createRef(),i}return Object(l.a)(n,[{key:"render",value:function(){return a.a.createElement("div",null,a.a.createElement(Ce,{ref:this.worldRef}))}}]),n}(a.a.Component),Re=Object(c.a)(Fe),je=n(53);r.a.render(a.a.createElement(je.a,null,a.a.createElement(Re,null)),document.getElementById("root"))},77:function(e,t,n){e.exports=n.p+"static/media/world.9a0ad0bd.glb"},79:function(e,t,n){e.exports=n.p+"static/media/Bird_simple.d1d4aa0b.glb"}},[[112,1,2]]]);
//# sourceMappingURL=main.63e315b2.chunk.js.map