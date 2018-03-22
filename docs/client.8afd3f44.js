webpackJsonp([0],[,,function(t,e,n){"use strict";var a=n(20),i=n(33),s=n.n(i),u=n(34);e.a={components:{Sequencer:a.a,MidiOutSelect:u.a},data:function(){return{midiOut:null}},created:function(){this._synth=new s.a.FMSynth({attackNoise:1,harmonicity:.99,envelope:{attack:.01,decay:.04,sustain:.7,release:.3},modulation:{type:"sine"},oscillator:{type:"sine"},modulationIndex:13}).toMaster()},destroy:function(){this._synth.dispose()},methods:{attack:function(t){var e=s.a.Frequency(t).toMidi();switch(this._lastMidi=e,this.midiOut){case null:return this._synth.triggerAttack(t);default:this.midiOut.send([144,e,127])}},release:function(){switch(this.midiOut){case null:return this._synth.triggerRelease();default:this.midiOut.send([144,this._lastMidi,0])}},setMidiOut:function(t){this.release(),this.midiOut=t}}}},function(t,e,n){"use strict";var a=n(21),i=n(7),s=n(31),u=n(9),r=["C2","D2","Eb2","E2","F2","G2","Ab2","Bb2","C3","D3","Eb3","E3","F3","G3","Ab3","Bb3"];e.a={components:{Stage:a.a,LaunchpadCtrl:s.a,Checkbox:i.a},data:function(){return{clockTime:125,gateTime:.5,stage:0,subStage:0,numStages:8,manual:!1,gate:!1,stageSettings:[{active:!0,count:1,value:0,mode:u.a},{active:!0,count:1,value:0,mode:u.a},{active:!0,count:1,value:0,mode:u.a},{active:!0,count:1,value:0,mode:u.a},{active:!0,count:1,value:0,mode:u.a},{active:!0,count:1,value:0,mode:u.a},{active:!0,count:1,value:0,mode:u.a},{active:!0,count:1,value:0,mode:u.a}],destroyed:!1}},created:function(){this._interval=setInterval(this.clock,this.clockTime)},destroy:function(){clearInterval(this._interval)},computed:{displayStage:function(){return this.stage%8},currentStageSettings:function(){return this.stageSettings[this.displayStage]},skipAll:function(){return this.stageSettings.every(function(t){return!t.active})},currentNote:function(){var t=this.currentStageSettings.value;return r[Math.floor(t*(r.length-1))]}},methods:{clock:function(){this.advanceSubstage()},handleSubstageGate:function(){var t=this.currentStageSettings.count,e=this.currentStageSettings.mode,n=this.subStage,a=n===t-1,i=0===n;switch(e){case u.d:i&&this.openGate();break;case u.b:this.openGate();break;case u.a:this.openGate(a);break;case u.c:}},toggleManual:function(t){this.manual=t},openGate:function(){var t=this,e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.gate||this.$emit("attack",this.currentNote),this.gate=!0,clearInterval(this._gateTimeout),e&&(this._gateTimeout=setTimeout(function(){0!=t.gate&&t.$emit("release"),t.gate=!1},this.gateTime*this.clockTime))},goToStage:function(t){this.stage=t,this.subStage=0,(this.manual||this.currentStageSettings.active)&&this.handleSubstageGate()},advanceSubstage:function(){var t=this.currentStageSettings.count,e=this.subStage+1;if(e>=t){if(!this.manual)if(this.skipAll)this.goToStage(0);else do{this.advanceStage()}while(!this.currentStageSettings.active)}else this.subStage=e,this.handleSubstageGate()},advanceStage:function(){var t=this.stage+1;this.goToStage(t>=this.numStages?0:t)},errorHandler:function(){console.log("handle error"),this.destroyed=!0}}}},function(t,e,n){"use strict";var a=n(22),i=n(25),s=n(7),u=n(9),r=[{value:u.a,label:"●"},{value:u.b,label:"◍"},{value:u.d,label:"◖"},{value:u.c,label:"○"}];e.a={components:{Slider:a.a,DiscreteSlider:i.a,Checkbox:s.a},props:{active:{type:Boolean,required:!0},stage:{type:Object,required:!0},manual:{type:Boolean,required:!1}},computed:{modeOptions:function(){return r},stageButtonValue:function(){return this.manual?this.active:this.stage.active}},methods:{handleStageButton:function(){this.manual?this.$emit("trigger"):stage.active=!stage.active}}}},function(t,e,n){"use strict";e.a={props:{active:{type:Boolean,default:!1},value:{type:Number,required:!0}},computed:{position:function(){return Math.max(0,Math.min(1,this.value))},style:function(){return{transform:"translate(0, "+216*(1-this.position)+"px)"}}},methods:{click:function(t){var e=this.$refs.slider.getBoundingClientRect(),n=t.pageY,a=Math.max(0,Math.min(1,1-(n-e.top)/e.height));this.$emit("input",a),this._startY=t.pageY,this._startVal=a,document.addEventListener("mousemove",this.dragMove),document.addEventListener("mouseup",this.stopDrag)},startDrag:function(t){this._startY=t.pageY,this._startVal=this.value,document.addEventListener("mousemove",this.dragMove),document.addEventListener("mouseup",this.stopDrag)},dragMove:function(t){t.preventDefault();var e=this.$refs.slider.getBoundingClientRect(),n=t.pageY-this._startY,a=-n/e.height,i=Math.max(0,Math.min(1,this._startVal+a));this.$emit("input",i)},stopDrag:function(){event.preventDefault(),document.removeEventListener("mousemove",this.dragMove),document.removeEventListener("mouseup",this.stopDrag)}}}},function(t,e,n){"use strict";var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};e.a={props:{options:{type:Array,required:!0},value:{type:Number,required:!0}},methods:{optionValue:function(t){return"object"===(void 0===t?"undefined":a(t))?t.value:t},optionLabel:function(t){return"object"===(void 0===t?"undefined":a(t))?t.label:t}}}},function(t,e,n){"use strict";function a(t){n(28)}var i=n(8),s=n(29),u=n(0),r=a,o=u(i.a,s.a,!1,r,"data-v-61901621",null);e.a=o.exports},function(t,e,n){"use strict";e.a={props:{value:{type:Boolean,required:!0}}}},function(t,e,n){"use strict";n.d(e,"a",function(){return a}),n.d(e,"b",function(){return i}),n.d(e,"d",function(){return s}),n.d(e,"c",function(){return u});var a=0,i=1,s=2,u=3},function(t,e,n){"use strict";var a=n(11),i=function(){function t(t,e){var n=[],a=!0,i=!1,s=void 0;try{for(var u,r=t[Symbol.iterator]();!(a=(u=r.next()).done)&&(n.push(u.value),!e||n.length!==e);a=!0);}catch(t){i=!0,s=t}finally{try{!a&&r.return&&r.return()}finally{if(i)throw s}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();e.a={render:function(){return null},props:["stageSettings","displayStage","gate","subStage","manual"],data:function(){return{matrixState:Array.from({length:8},function(t){return Array.from({length:8},function(t){return!1})}),scene:0}},created:function(){this._colReleaseTimeouts=[],this._colPressTimeouts=[],a.a.then(this.onMIDISuccess,this.onMIDIFailure)},computed:{launchpadState:function(){for(var t=Array.from({length:9},function(t){return Array.from({length:9},function(t){return"-"})}),e=this.stageSettings,n=this.displayStage,a=this.gate,i=this.scene,s=0;s<8;s++){var u=e[s],r=n===s?a?"r":"R":"a";if(0===i){var o=Math.floor(14*u.value);t[8-(o>>1)][s]=r,t[8-(o+1>>1)][s]=r}else if(2===i){var c=2*u.mode;t[c+1][s]=r,t[c+2][s]=r}else if(1===i)for(var l=this.subStage,d=u.count,h=0;h<d;h++){var f=n===s?h===l?a?"r":"R":h>l?"a":"R":"a";t[h+1][s]=f}this.manual?t[0][s]=n===s?"r":"-":t[0][s]=u.active?"g":"-"}return this.manual&&(t[8][8]="r"),t[i+1][8]="g",t},launchpadStateSerialized:function(){return this.launchpadState.map(function(t){return t.join("")}).join("\n")}},watch:{launchpadState:function(t,e){this.sendCommands(this.collectCommands(t,e))}},methods:{collectCommands:function(t,e){for(var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=[],i=0;i<9;i++)for(var s=0;s<9;s++)if(0!==i||8!==s){var u=t[i][s];e&&u===e[i][s]||n&&"-"===u||a.push(this.synthesizeCommand(s,i,u))}return a},synthesizeCommand:function(t,e,n){var a=0===e;return[a?176:144,a?104+t:16*(e-1)+t,this.valueVelocity(n)]},valueVelocity:function(t){switch(t){case"r":return 15;case"R":return 13;case"g":return 60;case"a":return 63;default:return 12}},sendCommands:function(t){var e=this;this._currentOutput&&"connected"===this._currentOutput.state&&(t.forEach(function(t){e._currentOutput.send(t)}),this._currentOutput.clear&&this._currentOutput.clear())},onMIDISuccess:function(t){var e=this;t.outputs.forEach(this.handleOutput),t.inputs.forEach(this.handleInput),t.addEventListener("statechange",function(t){t.input&&e.handleInput(t.input),t.output&&e.handleOutput(t.output)})},onMIDIFailure:function(){console.error("FAIL")},handleOutput:function(t){"Launchpad Mini"===t.name&&(this.cleanupMidiOutput(),this._currentOutput=t,t.send([176,0,0]),t.send([176,0,33]),this.sendCommands(this.collectCommands(this.launchpadState,null,!0)))},handleInput:function(t){"Launchpad Mini"===t.name&&(this.cleanupMidiInput(),this._currentInput=t,t.addEventListener("midimessage",this.onMidiMessage))},cleanupMidiInput:function(){this._currentInput&&this._currentInput.removeEventListener("midimessage",this.onMidiMessage),this._currentInput=null},cleanupMidiOutput:function(){this._currentOutput,this._currentOutput=null},beforeDestroy:function(){this.cleanupMidiInput(),this.cleanupMidiOutput()},onMidiMessage:function(t){var e=i(t.data,3),n=e[0],a=e[1],s=e[2],u=s>0;if(144===n){var r=15&a,o=(-16&a)>>4;8===r?u?this.onSidePress(o):this.onSideRelease(o):u?this.onMatrixPress(r,o):this.onMatrixRelease(r,o)}else 176===n&&(u?this.onUpperPress(a-104):this.onUpperRelease(a-104))},onMatrixPress:function(t,e){var n=this;this.matrixState[t][e]=!0;var a=this.scene;if(0===a){var i=e>0&&!0===this.matrixState[t][e-1],s=e<7&&!0===this.matrixState[t][e+1],u=2*e,r=(s?-1:0)+(i?1:0),o=(14-u+r)/14;clearTimeout(this._colPressTimeouts[t]),this._colPressTimeouts[t]=setTimeout(function(){return n.stageSettings[t].value=o},20)}else 2===a?this.stageSettings[t].mode=Math.floor(e/2):1===a&&(this.stageSettings[t].count=e+1)},onMatrixRelease:function(t,e){var n=this;if(this.matrixState[t][e]=!1,0===this.scene){var a=e>0&&!0===this.matrixState[t][e-1],i=e<7&&!0===this.matrixState[t][e+1];if(clearTimeout(this._colReleaseTimeouts[t]),a||i&&(!a||!i)){var s=2*e,u=(i?-2:0)+(a?2:0),r=(14-s+u)/14;this._colReleaseTimeouts[t]=setTimeout(function(){return n.stageSettings[t].value=r},30)}}},onUpperPress:function(t){this.manual?this.$emit("manualStage",t):this.stageSettings[t].active=!this.stageSettings[t].active},onUpperRelease:function(t){},onSidePress:function(t){0===t&&(this.scene=0),1===t&&(this.scene=1),2===t&&(this.scene=2),7===t&&this.$emit("toggleManual",!this.manual)},onSideRelease:function(t){}}}},function(t,e,n){"use strict";n.d(e,"a",function(){return a});var a=navigator.requestMIDIAccess({sysex:!0})},function(t,e,n){"use strict";var a=n(11);e.a={data:function(){return{selection:null,outputs:[]}},computed:{selected:{get:function(){return this.selection},set:function(t){this.selection=t,this.$emit("select",t)}}},created:function(){a.a.then(this.onMIDISuccess)},methods:{onMIDISuccess:function(t){var e=this;this._midi=t,this.handleOutputs(),t.addEventListener("statechange",function(t){t.output&&e.handleOutputs()})},handleOutputs:function(){var t=[];this._midi.outputs.forEach(function(e){t.push(e)}),this.outputs=t,console.log(t),console.log(this.outputs)}}}},function(t,e,n){t.exports=n(14)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(15),i=n(19),s=n(37);n.n(s);a.a.config.errorHandler=function(t,e,n){var a=void 0,i=e;if(e.$options.errorHandler)a=e.$options.errorHandler;else for(;i.$parent&&(i=i.$parent,!(a=i.$options.errorHandler)););a?a.call(i,t,e,n):console.log(t)},new a.a({el:"#app",render:function(t){return t(i.a)}})},,,,,function(t,e,n){"use strict";var a=n(2),i=n(36),s=n(0),u=s(a.a,i.a,!1,null,null,null);e.a=u.exports},function(t,e,n){"use strict";var a=n(3),i=n(32),s=n(0),u=s(a.a,i.a,!1,null,null,null);e.a=u.exports},function(t,e,n){"use strict";var a=n(4),i=n(30),s=n(0),u=s(a.a,i.a,!1,null,null,null);e.a=u.exports},function(t,e,n){"use strict";function a(t){n(23)}var i=n(5),s=n(24),u=n(0),r=a,o=u(i.a,s.a,!1,r,"data-v-dc78fc30",null);e.a=o.exports},function(t,e){},function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"slider",staticClass:"slider",on:{mousedown:function(e){e.preventDefault(),t.click(e)}}},[n("div",{staticClass:"handle",class:{active:t.active},style:t.style,on:{mousedown:function(e){e.preventDefault(),e.stopPropagation(),t.startDrag(e)}}})])},i=[],s={render:a,staticRenderFns:i};e.a=s},function(t,e,n){"use strict";function a(t){n(26)}var i=n(6),s=n(27),u=n(0),r=a,o=u(i.a,s.a,!1,r,"data-v-6a6a23d3",null);e.a=o.exports},function(t,e){},function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"slider"},t._l(t.options,function(e,a){return n("div",{key:a,staticClass:"handle",class:{selected:t.value===t.optionValue(e)},attrs:{layout:"row center middle"},on:{click:function(n){t.$emit("input",t.optionValue(e))}}},[n("span",[t._v(t._s(t.optionLabel(e)))])])}))},i=[],s={render:a,staticRenderFns:i};e.a=s},function(t,e){},function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"handle",class:{active:!!t.value},on:{click:function(e){t.$emit("input",!t.value)}}})},i=[],s={render:a,staticRenderFns:i};e.a=s},function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{layout:"column u2"}},[n("Slider",{attrs:{active:t.active},model:{value:t.stage.value,callback:function(e){t.$set(t.stage,"value",e)},expression:"stage.value"}}),t._v(" "),n("DiscreteSlider",{attrs:{options:[1,2,3,4,5,6,7,8]},model:{value:t.stage.count,callback:function(e){t.$set(t.stage,"count",e)},expression:"stage.count"}}),t._v(" "),n("DiscreteSlider",{attrs:{options:t.modeOptions},model:{value:t.stage.mode,callback:function(e){t.$set(t.stage,"mode",e)},expression:"stage.mode"}}),t._v(" "),n("Checkbox",{attrs:{value:t.stageButtonValue},on:{input:t.handleStageButton}})],1)},i=[],s={render:a,staticRenderFns:i};e.a=s},function(t,e,n){"use strict";var a=n(10),i=n(0),s=i(a.a,null,!1,null,null,null);e.a=s.exports},function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{layout:"row u3"}},[t._l(t.stageSettings,function(e,a){return n("Stage",{key:a,attrs:{stage:e,active:t.gate&&a===t.displayStage,manual:t.manual},on:{trigger:function(e){t.goToStage(a)}}})}),t._v(" "),n("LaunchpadCtrl",{attrs:{gate:t.gate,displayStage:t.displayStage,subStage:t.subStage,stageSettings:t.stageSettings,manual:t.manual},on:{manualStage:t.goToStage,toggleManual:t.toggleManual}}),t._v(" "),n("Checkbox",{model:{value:t.manual,callback:function(e){t.manual=e},expression:"manual"}})],2)},i=[],s={render:a,staticRenderFns:i};e.a=s},,function(t,e,n){"use strict";var a=n(12),i=n(35),s=n(0),u=s(a.a,i.a,!1,null,null,null);e.a=u.exports},function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("select",{directives:[{name:"model",rawName:"v-model",value:t.selected,expression:"selected"}],on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.selected=e.target.multiple?n:n[0]}}},[n("option",{domProps:{value:null}},[t._v("builtin synth")]),t._v(" "),t._l(t.outputs,function(e){return n("option",{key:e.id,domProps:{value:e}},[t._v(t._s(e.name))])})],2)},i=[],s={render:a,staticRenderFns:i};e.a=s},function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{layout:"row u1"}},[n("Sequencer",{on:{attack:t.attack,release:t.release}}),t._v(" "),n("MidiOutSelect",{on:{select:t.setMidiOut}})],1)},i=[],s={render:a,staticRenderFns:i};e.a=s},function(t,e){}],[13]);
//# sourceMappingURL=client.8afd3f44.js.map