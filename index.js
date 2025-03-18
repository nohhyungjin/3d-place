import * as THREE from './node_modules/three/build/three.module.js';

// DOM 요소 가져오기
const xInput = document.getElementById("x");
const yInput = document.getElementById("y");
const zInput = document.getElementById("z");
const colorInput = document.getElementById("color");
const wrapContainer = document.getElementById("wrap-container");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // 밝은 회색 배경

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 블록 저장 배열
const blocks = [];

// 색상을 지정하여 블록 생성
function createBlock(x, y, z, color = 0x8b4513, size = 1) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color: color });
  const block = new THREE.Mesh(geometry, material);
  block.position.set(x, y, z);
  scene.add(block);
  blocks.push(block);
}

// 키보드 입력으로 블록 추가
document.getElementById("set-coordinate-btn").addEventListener("click", () => {
  const x = parseFloat(xInput.value);
  const y = parseFloat(yInput.value);
  const z = parseFloat(zInput.value);
  const color = parseInt(colorInput.value.slice(1), 16);
  createBlock(x, y, z, color, 10);
});

// 조명 추가
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 전체적으로 밝기 증가
scene.add(ambientLight);

// 카메라 위치 설정
camera.position.set(50, 50, 150);
camera.lookAt(new THREE.Vector3(50, 50, 50));

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
