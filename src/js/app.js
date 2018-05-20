import * as THREE from 'three';
import {TimelineMax} from 'gsap';
var OrbitControls = require('three-orbit-controls')(THREE);
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';


let gallery = [
  THREE.ImageUtils.loadTexture('img/4.jpg'),
  THREE.ImageUtils.loadTexture('img/2.jpg'),
  THREE.ImageUtils.loadTexture('img/3.jpg'),
  THREE.ImageUtils.loadTexture('img/1.jpg')
];

let camera, pos, controls, scene, renderer, geometry, geometry1, material,plane,tex1,tex2;
let destination = {x:0,y:0};
let textures = [];

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001, 100
  );
  camera.position.set( 0, 0, 1 );


  // controls = new OrbitControls(camera, renderer.domElement);


  material = new THREE.ShaderMaterial( {
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: 'f', value: 0 },
      pixels: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
      mouse: {type: 'v2', value: new THREE.Vector2(0,0)},
      velocity: {type: 'f', value: 0},
      accel: {type: 'v2', value: new THREE.Vector2(0.5,2)},
      progress: {type: 'f', value: 0},
      alpha: {type: 'f', value: 1},
      uvRate1: {
        value: new THREE.Vector2(1,1)
      },
      texture1: {
        value: gallery[0]
      },
    },
    // wireframe: true,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  plane = new THREE.Mesh(new THREE.PlaneGeometry( 1,1, 1, 1 ),material);
  scene.add(plane);

  resize();

 
}


let prevX = 0,prevY = 0;
let currentX = 0,currentY = 0;
let shaderX=0,shaderY=0;

window.addEventListener('mousemove', function(e) {
  currentX = e.clientX;
  currentY = e.clientY;
}); 


window.addEventListener('resize', resize); 
function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  renderer.setSize( w, h );
  camera.aspect = w / h;

  material.uniforms.uvRate1.value.y = h / w;

  // calculate scene
  let dist  = camera.position.z - plane.position.z;
  let height = 1;
  camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

  // if(w/h>1) {
  plane.scale.x = w/h;
  // }



  camera.updateProjectionMatrix();
}

let time = 0;
function animate() {
  time = time+0.05;
  material.uniforms.time.value = time;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}


init();
animate();




let currentSpeed = 0;
let tl1 = new TimelineMax();
function raf() {

  material.uniforms.mouse.value.x += (currentX/$(window).width() - material.uniforms.mouse.value.x)*0.05;
  material.uniforms.mouse.value.y += (currentY/$(window).height() - material.uniforms.mouse.value.y)*0.05;



  let speed = Math.sqrt( (currentX - prevX)*(currentX - prevX) + (currentY - prevY)*(currentY - prevY));

  speed = Math.min(speed,10);


  material.uniforms.velocity.value = speed/10;

  prevX = currentX;
  prevY = currentY;

  // console.log(speed,position);
  window.requestAnimationFrame(raf);
}

raf();

let index = 0;
let running = false;
$('body').on('click',() => {
  if(running) return;
  running = true;
  let tl = new TimelineMax();
  tl.to(material.uniforms.progress,0.3,{
    value: 0.8
  })
    .fromTo(material.uniforms.alpha,0.3,{
      value: 1,
    },{
      value: 0,
      onComplete: function() {
        index = (index+ 1)%gallery.length;
        material.uniforms.texture1.value = gallery[index];
        material.needsUpdate = true;
        console.log(material.uniforms.texture1.value);
        let tl1 = new TimelineMax({onComplete: function() {running = false;}});
        tl1.fromTo(material.uniforms.alpha,0.3,{
          value: 0
        },
        {
          value: 1
        })
          .to(material.uniforms.progress,0.3,{
            value: 0
          },0);
      }
    },0);
});




