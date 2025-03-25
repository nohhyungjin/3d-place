// 로그인 및 회원가입 버튼 애니메이션 기능
const settingsButton = document.getElementById('settingsButton');
const authPanel = document.getElementById('authPanel');

settingsButton.addEventListener('click', () => {
    authPanel.classList.toggle('show');
});

// 기본 설정
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Three.js 기본 설정
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

// 블록 저장 배열
const blocks = [];
let selectedBlock = null;
// 블록 생성 함수
function createBlock(x, y, z, color = 0x8B4513, size = 1) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y, z);
    scene.add(block);
    blocks.push(block);
}
/*
**** canvas 에 정사각형 도면 추가
*/
function createGrid(size, divisions) {
    const gridHelper = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);
    gridHelper.position.y = 0.5; // 바닥에 약간 띄워 배치
    scene.add(gridHelper);
}
createGrid(1000, 100); // 1000픽셀 크기, 10픽셀 간격으로 그리드 추가

// 블록 클릭 이벤트 (선택 기능)
function onBlockClick(event) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(blocks);
    
    if (intersects.length > 0) {
        selectedBlock = intersects[0].object;
        selectedBlock.material.emissive = new THREE.Color(0xff0000);
    }
}

window.addEventListener('click', onBlockClick);

const controlPanel = document.createElement('div');
controlPanel.id = 'controlPanel';
controlPanel.innerHTML = `
    <label>X: <input type="number" id="xCoord" value="0"></label>
    <label>Y: <input type="number" id="yCoord" value="0"></label>
    <label>Z: <input type="number" id="zCoord" value="0"></label>
    <label>Color: <input type="color" id="Color" value="#8B4513"></label>
    <button id="addBlock">블록 추가</button>
    <button id="removeBlock">블록 삭제</button>
`;
document.body.appendChild(controlPanel);



document.getElementById('addBlock').addEventListener('click', () => {
    const x = parseFloat(document.getElementById('xCoord').value);
    const y = parseFloat(document.getElementById('yCoord').value);
    const z = parseFloat(document.getElementById('zCoord').value);
    const color = parseInt((document.getElementById('Color').value).slice(1), 16);
    createBlock(x, y, z, color, 10);
});
document.getElementById('loginButton').addEventListener('click', function() {
window.location.href = "login.html";
});
document.getElementById('signupButton').addEventListener('click', function() {
window.location.href = "signup.html";
});
document.getElementById('removeBlock').addEventListener('click', () => {
    if (selectedBlock) {
        scene.remove(selectedBlock);
        blocks.splice(blocks.indexOf(selectedBlock), 1);
        selectedBlock = null;
    }
});

function getMousePosition(event) {
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// 마우스 클릭 위치를 -1 ~ 1 범위로 변환
mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

// 카메라에서 광선을 쏨
raycaster.setFromCamera(mouse, camera);

// 광선과 평면(바닥) 교차 검사 (y=0 평면)
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const intersection = new THREE.Vector3();
raycaster.ray.intersectPlane(plane, intersection);

// 좌표를 10의 배수로 스냅 (격자 정렬)
const gridSize = 10; // 격자 크기
const snappedX = Math.round(intersection.x / gridSize) * gridSize + gridSize / 2;
const snappedY = Math.round(intersection.y / gridSize) * gridSize + gridSize / 2;
const snappedZ = Math.round(intersection.z / gridSize) * gridSize + gridSize / 2;

console.log(`마우스 클릭 위치 - X: ${snappedX}, Y: ${snappedY}, Z: ${snappedZ}`);

// 입력 필드 업데이트
document.getElementById('xCoord').value = snappedX;
document.getElementById('yCoord').value = snappedY;
document.getElementById('zCoord').value = snappedZ;

return { x: snappedX, y: snappedY, z: snappedZ };
}

// 마우스 클릭 이벤트 추가 (좌표 업데이트)
renderer.domElement.addEventListener('click', (event) => {
getMousePosition(event);
});

 // 다크 모드 기능
const toggleModeBtn = document.getElementById('toggleMode');
let darkMode = false;
toggleModeBtn.addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.style.background = darkMode ? '#333' : '#fff';
    toggleModeBtn.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
    scene.background = new THREE.Color(darkMode ? 0x222222 : 0xe0e0e0);
});

// 시계 업데이트 기능
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// 조명 추가
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 카메라 초기 위치 설정 및 애니메이션 루프 실행
camera.position.set(200, 200, 200);
controls.update();

let previewBlock = null;

// 미리보기 블록 생성
function createPreviewBlock() {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.5 
});
    previewBlock = new THREE.Mesh(geometry, material);
        scene.add(previewBlock);
}

createPreviewBlock();

// 미리보기 블록 위치 업데이트
function updatePreviewPosition(event) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

raycaster.setFromCamera(mouse, camera);

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const intersection = new THREE.Vector3();

if (raycaster.ray.intersectPlane(plane, intersection)) {
    const gridSize = 10; 
    const snappedX = Math.round(intersection.x / gridSize) * gridSize + gridSize / 2;
    const snappedY = Math.round(intersection.y / gridSize) * gridSize + gridSize / 2;
    const snappedZ = Math.round(intersection.z / gridSize) * gridSize + gridSize / 2;

    previewBlock.position.set(snappedX, snappedY, snappedZ);
}
}

// 마우스 이동 시 미리보기 블록 위치 업데이트
renderer.domElement.addEventListener('mousemove', updatePreviewPosition);
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();