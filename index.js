// DOM 요소 가져오기
const xInput = document.getElementById("x");
const yInput = document.getElementById("y");
const zInput = document.getElementById("z");
const colorInput = document.getElementById("color");
const wrapContainer = document.getElementById("wrap-container");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // 밝은 회색 배경

// 카메라 생성
const aspect = window.innerWidth / window.innerHeight;
const size = 2; 
const camera = new THREE.OrthographicCamera(
  -size * aspect,  // left
  size * aspect,   // right
  size,            // top
  -size,           // bottom
  0.1,            // near
  1000            // far
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = true;  // 좌클릭 드래그로 회전 가능
controls.enableZoom = true;    // 마우스 휠로 줌 가능
controls.zoomSpeed = 0.5;      // 줌 속도 조절 (기본값: 1)
controls.rotateSpeed = 0.8;    // 회전 속도 조절 (기본값: 1)
controls.minZoom = 0.5;        // 최소 줌 (더 가까이 확대 방지)
controls.maxZoom = 3;          // 최대 줌 (너무 멀리 가지 않도록 제한)

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
  createBlock(x, y, z, color, 1);
});

// 조명 추가
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 전체적으로 밝기 증가
scene.add(ambientLight);

// 카메라 위치 설정
camera.position.set(100, 100, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();


createBlock(0, 0, 0, 0xffffff, 1);
createBlock(25, 0, 0, 0xffffff, 1);
createBlock(0, 25, 0, 0xffffff, 1);
createBlock(25, 25, 0, 0xffffff, 1);
createBlock(0, 0, 25, 0xffffff, 1);
createBlock(25, 0, 25, 0xffffff, 1);
createBlock(0, 25, 25, 0xffffff, 1);
createBlock(25, 25, 25, 0xffffff, 1);