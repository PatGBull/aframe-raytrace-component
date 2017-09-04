/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	if (typeof AFRAME === 'undefined') {
		throw new Error('Component attempted to register before AFRAME was available.');
	}

	AFRAME.registerComponent('raytrace', {
		
		schema: {
			shader:{type:'selector'},
			transparent:{type:'boolean',default:false},
			backside:{type:'boolean',default:false}
		},
		
		init: function () {
			this.myShaderMaterial = new THREE.ShaderMaterial({
				
				// inverse from https://github.com/glslify/glsl-inverse/blob/master/index.glsl
				// shame I can't just do this in JS, especially since it doesn't actually vary at all,
				// but afaik A-Frame doesn't expose this information easily within JS...
				vertexShader:
					"precision mediump float;\n"+
					"mat4 inverse(mat4 m) {\n"+
						"float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3], "+
							"a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3], "+
							"a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3], "+
							"a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3], "+
							"b00 = a00 * a11 - a01 * a10, "+
							"b01 = a00 * a12 - a02 * a10, "+
							"b02 = a00 * a13 - a03 * a10, "+
							"b03 = a01 * a12 - a02 * a11, "+
							"b04 = a01 * a13 - a03 * a11, "+
							"b05 = a02 * a13 - a03 * a12, "+
							"b06 = a20 * a31 - a21 * a30, "+
							"b07 = a20 * a32 - a22 * a30, "+
							"b08 = a20 * a33 - a23 * a30, "+
							"b09 = a21 * a32 - a22 * a31, "+
							"b10 = a21 * a33 - a23 * a31, "+
							"b11 = a22 * a33 - a23 * a32, "+
							"det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n"+
						"return mat4("+
							"a11 * b11 - a12 * b10 + a13 * b09, "+
							"a02 * b10 - a01 * b11 - a03 * b09, "+
							"a31 * b05 - a32 * b04 + a33 * b03, "+
							"a22 * b04 - a21 * b05 - a23 * b03, "+
							"a12 * b08 - a10 * b11 - a13 * b07, "+
							"a00 * b11 - a02 * b08 + a03 * b07, "+
							"a32 * b02 - a30 * b05 - a33 * b01, "+
							"a20 * b05 - a22 * b02 + a23 * b01, "+
							"a10 * b10 - a11 * b08 + a13 * b06, "+
							"a01 * b08 - a00 * b10 - a03 * b06, "+
							"a30 * b04 - a31 * b02 + a33 * b00, "+
							"a21 * b02 - a20 * b04 - a23 * b00, "+
							"a11 * b07 - a10 * b09 - a12 * b06, "+
							"a00 * b09 - a01 * b07 + a02 * b06, "+
							"a31 * b01 - a30 * b03 - a32 * b00, "+
							"a20 * b03 - a21 * b01 + a22 * b00) / det; "+
					"}\n"+
					"varying vec3 localCameraPos;\n"+
					"varying vec3 localSurfacePos;\n"+
					"void main() {\n"+
						"gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n"+
						"mat4 modelViewMatrixInverse = inverse(modelViewMatrix);\n"+
						"localCameraPos = vec3(modelViewMatrixInverse[3][0],modelViewMatrixInverse[3][1],modelViewMatrixInverse[3][2]);\n"+
						"localSurfacePos = position;\n"+
					"}",
					
				uniforms:{time:{value:0}},
				
			});
			this.el.getOrCreateObject3D('mesh').material = this.myShaderMaterial;
		},
		update: function (oldData) {
			this.myShaderMaterial.fragmentShader = this.data.shader.textContent;
			this.myShaderMaterial.side = this.data.backside?THREE.BackSide:THREE.FrontSide;
			this.myShaderMaterial.transparent = this.data.transparent;
		},
		tick: function (t) {
			this.myShaderMaterial.uniforms.time.value = t;
		}
	});


/***/ })
/******/ ]);