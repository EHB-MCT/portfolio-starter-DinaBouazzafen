console.log("worksB4");
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
  
// Sizes
const width = window.innerWidth;
const height = window.innerHeight;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
camera.position.set(0, 0, 10);

// Renderer
const renderer = new THREE.WebGL1Renderer({ alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// Add renderer to DOM
const container = document.querySelector('#threejs-container');
container.append(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 1, 1); // Adjust as needed
scene.add(directionalLight);

// Declare model variable at a higher scope
let model;

// Load GLB model
const loader = new GLTFLoader();
loader.load('./3js/demon.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(1.8, 1.8, 1.8);
    model.position.set(-2.5, -2, 0); // Centered in the scene
    model.rotation.set(0, 0, 0);

    scene.add(model);

    // Start animation loop
    animate();
}, undefined, (error) => {
    console.error(error);
});

// Animation loop
const animate = function () {
    requestAnimationFrame(animate);

    // Rotate the model
    if (model) {
        model.rotation.y += 0.001; // Adjust the speed of rotation as needed
    }

    // Render the scene with the updated model
    renderer.render(scene, camera);
};





// <!-- Creation cube as scene code works  -->
// <!-- <!DOCTYPE html>
// <html lang="en">
//    <head>
//       <meta charset="UTF-8" />
//       <meta http-equiv="X-UA-Compatible" content="ie=edge" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <title>Makeup</title>
//       <style>
//          * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//             font-family: -applesystem, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
//             Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//          }
//          html,
//          body {
//             height: 100vh;
//             overflow: hidden;
//             width: 100vw;
//          }
//          #threejs-container {
//             position: block;
//             width: 100%;
//             height: 100%;
//          }
//       </style>
//       <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
//    </head>
//    <body>
//       <div id="threejs-container"></div>
//       <script type="module">
//          // Hello Cube App
//          // Your first Three.js application
//          // sizes
//          const width = window.innerWidth
//          const height = window.innerHeight
//          // scene
//          const scene = new THREE.Scene()
//          scene.background = new THREE.Color(0)
//          // camera
//          const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
//          camera.position.set(0, 0, 10)
//          // cube
//          const geometry = new THREE.BoxGeometry(3, 2, 5)
//          const material = new THREE.MeshBasicMaterial({
//             color: 0xfffeff,
//             wireframe: true
//          })
//          const cube = new THREE.Mesh(geometry, material)
//          scene.add(cube)
//          // renderer
//          const renderer = new THREE.WebGL1Renderer()
//          renderer.setSize(width, height)
//          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//          // rendering the scene
//          const container = document.querySelector('#threejs-container')
//          container.append(renderer.domElement)
//          renderer.render(scene, camera)
//       </script>
//    </body>
// </html> -->