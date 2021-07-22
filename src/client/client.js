import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import fragment from '../shaders/fragment.glsl'
import fragmentSun from '../shaders/shaderSun/fragment.glsl'
import fragmentAroundSun from '../shaders/shaderAroundSun/fragment.glsl'

import vertex from '../shaders/vertex.glsl'
import vertexSun from '../shaders/shaderSun/vertex.glsl'
import vertexAroundSun from '../shaders/shaderAroundSun/vertex.glsl'

let scene, camera, renderer, controls, time, geometry, material, geometryPerlin, materialPerlin;
let cubeRenderTarget1, cubeCamera1, scene1, perlin, materialSun, sun;

function init(){
  
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 2);

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0xeeeeee, 1);
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement);
  time = 0;

  addBrightnessAroundSun();
  addTexture();
  addObjects();
}

 function addBrightnessAroundSun(){

  const geometryAround = new THREE.SphereBufferGeometry(1.2, 30,30);
  const materialAround = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.BackSide,
    uniforms: {
      time: {value: 0},
      uPerlin: {value: null},
      resolution: { value: new THREE.Vector4() }
    },
    vertexShader: vertexAroundSun,
    fragmentShader: fragmentAroundSun
  });

  const sunAround = new THREE.Mesh(geometryAround, materialAround)
  scene.add(sunAround)

 }
function addTexture(){
  scene1 = new THREE.Scene()
  cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget
  ( 256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipMapLinearFilter,
    encoding: THREE.sRGBEncoding

  });

  cubeCamera1 = new THREE.CubeCamera(0.1, 10, cubeRenderTarget1);

  geometryPerlin = new THREE.SphereBufferGeometry(1, 30,30);
  materialPerlin = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: {value: 0},
      resolution: { value: new THREE.Vector4() }
    },
    vertexShader: vertex,
    fragmentShader: fragment
  });

  perlin = new THREE.Mesh(geometryPerlin, materialPerlin)
  scene1.add(perlin)
}
function addObjects(){
  geometry = new THREE.SphereBufferGeometry(1, 30,30);
  materialSun = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: {value: 0},
      uPerlin: {value: null},
      resolution: { value: new THREE.Vector4() }
    },
    vertexShader: vertexSun,
    fragmentShader: fragmentSun
  });

  sun = new THREE.Mesh(geometry, materialSun)
  scene.add(sun)

}




window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()

    cubeCamera1.update(renderer, scene1);
    materialSun.uniforms.uPerlin.value = cubeRenderTarget1.texture;
    // material.envMap = cubeRenderTarget2.texture

    time += 0.05;
    materialSun.uniforms.time.value = time;

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    render()
}

function render() {
    renderer.render(scene, camera)
}

init();
animate();












// import fragment from '../shaders/fragment.glsl'
// import vertex from '../shaders/vertex.glsl'

// let scene, plane, camera, renderer, controls, time, geometry, material, sun;

// function init() {
//   const scene = new THREE.Scene();

//   renderer = new THREE.WebGLRenderer();
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   // renderer.setClearColor(0xeeeeee, 1);
//   renderer.physicallyCorrectLights = true;
//   renderer.outputEncoding = THREE.sRGBEncoding;

//   document.body.appendChild(renderer.domElement);

//   camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 1000);
//   camera.position.set(0, 0, 3);

//   controls = new OrbitControls(camera, renderer.domElement);


//   // material = new THREE.ShaderMaterial({
//   //   extensions: {
//   //     derivatives: "#extension GL_OES_standard_derivatives : enable"
//   //   },
//   //   side: THREE.DoubleSide,
//   //   uniforms: {
//   //     // time: {value: 0},
//   //     resolution: { value: new THREE.Vector4() }
//   //   },
//   //   vertexShader: vertex,
//   //   fragmentShader: fragment
//   // });

//   // geometry = new THREE.SphereBufferGeometry(3, 30,30);

//   // sun = new THREE.Mesh(geometry, material);
//   // // sun.position.x = 30;
//   // scene.add(sun);
//   // // time = 0;

//   geometry = new THREE.SphereGeometry(3, 32, 32);
//   material = new THREE.MeshBasicMaterial( {color: 0xfff9d4} );
//   sun = new THREE.Mesh(geometry, material);
//   scene.add(sun);
  
//   // material = new THREE.ShaderMaterial({
//   //   extensions: {
//   //     derivatives: "#extension GL_OES_standard_derivatives : enable"
//   //   },
//   //   side: THREE.DoubleSide,
//   //   uniforms: {
//   //     time: {value: 0},
//   //     resolution: { value: new THREE.Vector4() }
//   //   },
//   //   vertexShader: vertex,
//   //   fragmentShader: fragment
//   // });

//   // geometry = new THREE.SphereBufferGeometry(3, 30,30);

//   // geometry = new THREE.SphereGeometry(3, 32, 32);
//   // material = new THREE.MeshBasicMaterial( {color: 0xfff9d4} );
//   // sun = new THREE.Mesh(geometry, material);
//   // scene.add(sun);

//   // addObjects();
// }

// // function addObjects() {
// //   material = new THREE.ShaderMaterial({
// //     extensions: {
// //       derivatives: "#extension GL_OES_standard_derivatives : enable"
// //     },
// //     side: THREE.DoubleSide,
// //     uniforms: {
// //       // time: {value: 0},
// //       resolution: { value: new THREE.Vector4() }
// //     },
// //     vertexShader: vertex,
// //     fragmentShader: fragment
// //   });

// //   geometry = new THREE.SphereBufferGeometry(3, 30,30);

// //   sun = new THREE.Mesh(geometry, material);
// //   // sun.position.x = 30;
// //   scene.add(sun);
// // }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight
//   camera.updateProjectionMatrix()
//   renderer.setSize(window.innerWidth, window.innerHeight)
// }

// window.addEventListener('resize', onWindowResize, false);

// function animate() {
//   requestAnimationFrame(animate);
//   // controls.update();

//   // time += 0.05;
//   // material.uniforms.time.value = time;
  
//   renderer.render(scene, camera);
// }

// init();
// animate();