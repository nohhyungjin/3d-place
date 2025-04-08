// 3dplace.js 상단에 추가
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set, get, push } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import { firebaseConfig } from "../firebase-config.js";

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

let currentColor = "#8B4513";

const paletteColors = [
  "#000000",
  "#330019",
  "#330033",
  "#8B0000",
  "#CC5500",
  "#FFFFFF",
  "#FFF380",
  "#DFFF00",
  "#7FFF00",
  "#228B22",
  "#006400",
  "#013220",
  "#003333",
  "#006666",
  "#00CCCC",
  "#90EE90",
  "#B0E0E6",
  "#87CEEB",
  "#6495ED",
  "#00008B",
  "#000080",
  "#000033",
  "#111111",
  "#2E0854",
  "#663399",
  "#DA70D6",
  "#FFB6C1",
  "#FFC0CB",
  "#FAEBD7",
  "#F5F5DC",
  "#DEB887",
  "#A0522D",
  "#800000",
  "#4B0082",
  "#2F2F2F",
  "#696969",
  "#1C1C1C",
  "#333333",
  "#808080",
  "#A9A9A9",
  "#D3D3D3",
  "#F5F5F5",
];

const palette = document.getElementById("colorPalette");
const colorInput = document.getElementById("colorInput");
let selectedBox = null;

// 색상 박스 생성 및 클릭 이벤트
paletteColors.forEach((color) => {
  const box = document.createElement("div");
  box.className = "color-box";
  box.style.backgroundColor = color;
  box.dataset.color = color;

  box.addEventListener("click", () => {
    if (selectedBox) selectedBox.classList.remove("selected");
    box.classList.add("selected");
    selectedBox = box;

    currentColor = color;
    colorInput.value = color;
    colorInput.click(); // 컬러 피커 팝업 열기
  });

  palette.appendChild(box);
});

// 컬러 피커에서 색 선택 시 업데이트
colorInput.addEventListener("input", (e) => {
  currentColor = e.target.value;
  if (selectedBox) {
    selectedBox.style.backgroundColor = currentColor;
    selectedBox.dataset.color = currentColor;
  }
});

function getSelectedColor() {
  return new THREE.Color(currentColor);
}

const blocks = [];

function saveBlock(roomId, x, y, z, color) {
  const newBlockRef = push(ref(db, `rooms/${roomId}/blocks`));
  set(newBlockRef, {
    x,
    y,
    z,
    color,
  });
}

function loadBlocks(roomId) {
  const roomRef = ref(db, `rooms/${roomId}/blocks`);
  get(roomRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.values(data).forEach((block) => {
          const { x, y, z, color } = block;
          createBlock(x, y, z, new THREE.Color(color));
        });
      } else {
        console.log("불러올 블록 없음");
      }
    })
    .catch((error) => {
      console.error("블록 불러오기 실패:", error);
    });
}

function createBlock(x, y, z, color = 0x8b4513, size = 10) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color });
  const block = new THREE.Mesh(geometry, material);
  block.position.set(x, y, z);
  scene.add(block);
  blocks.push(block);
  const hexColor =
    typeof color === "string" ? color : `#${color.getHexString()}`;
  saveBlock(roomId, x, y, z, hexColor);
}

function createGrid(size, divisions) {
  const gridHelper = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);
  gridHelper.position.y = 0.5;
  scene.add(gridHelper);
}

createGrid(1000, 100);

renderer.domElement.addEventListener("click", (event) => {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(blocks);

  if (intersects.length > 0) {
    const selectedBlock = intersects[0].object;
    const normal = intersects[0].face.normal;
    const position = selectedBlock.position
      .clone()
      .add(normal.multiplyScalar(10));
    createBlock(position.x, position.y, position.z, getSelectedColor());
  } else {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    const gridSize = 10;
    const offset = gridSize / 2;
    const snappedX = Math.floor(intersection.x / gridSize) * gridSize + offset;
    const snappedY = 5;
    const snappedZ = Math.floor(intersection.z / gridSize) * gridSize + offset;

    createBlock(snappedX, snappedY, snappedZ, getSelectedColor());
  }
});

document.getElementById("settingsButton").addEventListener("click", () => {
  document.getElementById("authPanel").classList.toggle("show");
});

document.getElementById("loginButton").addEventListener("click", () => {
  window.location.href = "login.html";
});

document.getElementById("signupButton").addEventListener("click", () => {
  window.location.href = "signup.html";
});

const toggleModeBtn = document.getElementById("toggleMode");
let darkMode = false;
toggleModeBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.style.background = darkMode ? "#333" : "#fff";
  toggleModeBtn.textContent = darkMode ? "Light Mode" : "Dark Mode";
  scene.background = new THREE.Color(darkMode ? 0x222222 : 0xe0e0e0);
});

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.set(200, 200, 200);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 회원가입 버튼 클릭 시 signup.html로 이동
document.getElementById("signupButton").addEventListener("click", function () {
  window.location.href = "signup.html";
});

// 로그인 버튼 클릭 시 signin.html로 이동
document.getElementById("loginButton").addEventListener("click", function () {
  window.location.href = "./login/login.html";
});

// URL에서 ?room=3 같은 값을 가져오기
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("room");
if (roomId) {
  loadBlocks(roomId);
}

const titleElement = document.getElementById("title");
if (titleElement) {
  titleElement.innerText = `Room ${roomId}에 입장하셨습니다`;
}

// 예시: roomId 값에 따라 초기 블록 데이터 불러오거나, 다른 세팅 적용 가능
console.log(`현재 입장한 방 번호: ${roomId}`);
