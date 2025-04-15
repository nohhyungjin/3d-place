// 3dplace.js 맨 위
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import {
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAkMgmpn_uMOUSQoK-Wfg5hLHGAe-eNe_E",
  authDomain: "d-place-auth.firebaseapp.com",
  databaseURL: "https://d-place-auth-default-rtdb.firebaseio.com",
  projectId: "d-place-auth",
  storageBucket: "d-place-auth.appspot.com",
  messagingSenderId: "377526371183",
  appId: "1:377526371183:web:077d196b9f8da6764cde9a",
  measurementId: "G-TTPH9YZCYL",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const settingsButton = document.getElementById("settingsButton");
const authPanel = document.getElementById("authPanel");

settingsButton.addEventListener("click", () => {
  authPanel.classList.toggle("show");
});

document.getElementById("loginButton").addEventListener("click", function () {
  window.location.href = "../login/login.html";
});
document.getElementById("signupButton").addEventListener("click", function () {
  window.location.href = "../signup/signup.html";
});

function loadBlocksFromFirebase(roomId) {
  const dbRef = ref(database);
  get(child(dbRef, `rooms/${roomId}/blocks`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const blocksData = snapshot.val();
        Object.values(blocksData).forEach((block) => {
          const { x, y, z, color, size } = block;
          createBlockFromFirebase(x, y, z, color, size);
        });
        console.log("Blocks loaded from Firebase:", blocksData);
      } else {
        console.log("No blocks found for this room.");
      }
    })
    .catch((error) => {
      console.error("Error loading blocks from Firebase:", error);
    });
}

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

const blocks = [];
let currentColor = "#8B4513";
let selectedBox = null;
let mode = "default";
let selectedBlocks = [];

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

const pickr = Pickr.create({
  el: "#colorPickerContainer",
  theme: "classic",
  default: currentColor,
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      hex: true,
      rgba: true,
      input: true,
      save: true,
    },
  },
});

pickr.on("save", (color) => {
  currentColor = color.toHEXA().toString();
  if (selectedBox) {
    selectedBox.style.backgroundColor = currentColor;
    selectedBox.dataset.color = currentColor;
  }
  pickr.hide();
});

const palette = document.getElementById("colorPalette");
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
    pickr.setColor(currentColor);
  });

  box.addEventListener("dblclick", () => {
    pickr.setColor(currentColor);
    pickr.show();
  });

  palette.appendChild(box);
});

function createBlock(x, y, z, color = 0x8b4513, size = 10) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color });
  const block = new THREE.Mesh(geometry, material);
  block.position.set(x, y, z);
  block.userData.movable = true;
  scene.add(block);
  blocks.push(block);

  const roomId = getRoomIdFromUrl();
  saveBlockToFirebase(roomId, x, y, z, color, size);
}

function createBlockFromFirebase(x, y, z, color = "8b4513", size = 10) {
  const formattedColor =
    typeof color === "string" && !color.startsWith("#") ? `#${color}` : color;

  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(formattedColor),
  });

  const block = new THREE.Mesh(geometry, material);
  block.position.set(x, y, z);
  block.userData.movable = true;
  scene.add(block);
  blocks.push(block);
}

function saveBlockToFirebase(roomId, x, y, z, color, size) {
  const blockData = {
    x,
    y,
    z,
    color: color instanceof THREE.Color ? color.getHexString() : color,
    size,
  };

  const blocksRef = ref(database, `rooms/${roomId}/blocks`);
  push(blocksRef, blockData)
    .then(() => {
      console.log("Block data saved to Firebase:", blockData);
    })
    .catch((error) => {
      console.error("Error saving block data to Firebase:", error);
    });
}

function getRoomIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("roomId");
  if (!roomId) {
    console.warn("No roomId found in URL. Using defaultRoomId.");
  }
  return roomId || "defaultRoomId";
}

function clearSelection() {
  selectedBlocks.forEach((b) => b.material.emissive.set(0x000000));
  selectedBlocks = [];
}

renderer.domElement.addEventListener("click", (event) => {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(blocks);

  if (mode === "erase") {
    if (intersects.length > 0) {
      const block = intersects[0].object;
      scene.remove(block);
      const index = blocks.indexOf(block);
      if (index > -1) blocks.splice(index, 1);
    }
  } else if (mode === "select") {
    if (intersects.length > 0) {
      const block = intersects[0].object;
      const isCtrl = event.ctrlKey || event.metaKey;

      if (!isCtrl) clearSelection();

      if (!selectedBlocks.includes(block)) {
        selectedBlocks.push(block);
        block.material.emissive.set(0x555555);
      } else if (isCtrl) {
        block.material.emissive.set(0x000000);
        selectedBlocks = selectedBlocks.filter((b) => b !== block);
      }
    } else {
      clearSelection();
    }
  } else {
    if (intersects.length > 0) {
      const target = intersects[0].object;
      const normal = intersects[0].face.normal;
      const pos = target.position.clone().add(normal.multiplyScalar(10));
      createBlock(pos.x, pos.y, pos.z, new THREE.Color(currentColor));
    } else {
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      const gridSize = 10;
      const snappedX =
        Math.floor(intersection.x / gridSize) * gridSize + gridSize / 2;
      const snappedZ =
        Math.floor(intersection.z / gridSize) * gridSize + gridSize / 2;
      createBlock(snappedX, 5, snappedZ, new THREE.Color(currentColor));
    }
  }
});

document.getElementById("toggleColorPicker").addEventListener("click", () => {
  const container = document.getElementById("colorPickerContainer");
  container.style.display =
    container.style.display === "none" ? "block" : "none";
});

document.getElementById("togglePalette").addEventListener("click", () => {
  palette.style.display = palette.style.display === "none" ? "grid" : "none";
});

document.getElementById("eraserBtn").addEventListener("click", function () {
  mode = mode === "erase" ? "default" : "erase";
  this.classList.toggle("active");
  document.getElementById("selectBtn").classList.remove("active");
  clearSelection();
});

document.getElementById("selectBtn").addEventListener("click", function () {
  mode = mode === "select" ? "default" : "select";
  this.classList.toggle("active");
  document.getElementById("eraserBtn").classList.remove("active");
  clearSelection();
});

document.getElementById("applyColorBtn").addEventListener("click", () => {
  selectedBlocks.forEach((block) => {
    block.material.color.set(currentColor);
  });
});

document.getElementById("deleteSelectedBtn").addEventListener("click", () => {
  selectedBlocks.forEach((block) => {
    scene.remove(block);
    const index = blocks.indexOf(block);
    if (index > -1) blocks.splice(index, 1);
  });
  clearSelection();
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
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

camera.position.set(100, 100, 100);
const roomId = getRoomIdFromUrl();
loadBlocksFromFirebase(roomId);

controls.update();

const gridHelper = new THREE.GridHelper(1000, 100);
scene.add(gridHelper);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
