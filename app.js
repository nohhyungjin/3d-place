import * as THREE from './node_modules/three/build/three.module.js';


// 페이지가 로드되면 실행될 함수
window.addEventListener('load', init);

function init() {
  // canvas 엘리먼트 생성
  const canvas = document.createElement('canvas');

  // canvas 크기 설정
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

   // HTML 문서의 body 요소에 canvas 추가
   document.body.appendChild(canvas);
 
   // WebGLRenderer 생성 및 설정
   const renderer = new THREE.WebGLRenderer({ canvas });
   renderer.setSize(canvas.width, canvas.height);

  // 씬(Scene) 생성
  const scene = new THREE.Scene();

   // 카메라(Camera) 생성 (원근 투영 카메라)
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1,1000);
 
   // 카메라 위치 설정 (x, y, z 좌표)
   camera.position.z =5;
 
   // 큐브(Geometry) 생성
   const geometry = new THREE.BoxGeometry();
 
   // 재질(Material) 생성 (색상 지정)
   const material = new THREE.MeshBasicMaterial({ color:"red" });
 
   // 메쉬(Mesh) 생성 (큐브와 재질을 결합)
   const cube = new THREE.Mesh(geometry, material);
 
    // 씬에 메쉬 추가 
    scene.add(cube);
  
    function animate() {
      requestAnimationFrame(animate); 
    
      cube.rotation.x +=0.01;
      cube.rotation.y +=0.01;
   
      renderer.render(scene,camera); 
    }
  
    animate(); 
}