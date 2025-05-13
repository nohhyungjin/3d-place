import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";



// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAkMgmpn_uMOUSQoK-Wfg5hLHGAe-eNe_E",
  authDomain: "d-place-auth.firebaseapp.com",
  databaseURL: "https://d-place-auth-default-rtdb.firebaseio.com",
  projectId: "d-place-auth",
  storageBucket: "d-place-auth.firebasestorage.app",
  messagingSenderId: "377526371183",
  appId: "1:377526371183:web:077d196b9f8da6764cde9a",
  measurementId: "G-TTPH9YZCYL"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);


// HTML 요소 가져오기
const roomListContainer = document.getElementById("roomListContainer");

// 방 목록 불러오기 함수
function loadRooms() {
  const roomsRef = ref(database, 'rooms');

  onValue(roomsRef, (snapshot) => {
    roomListContainer.innerHTML = ""; // 기존 목록 초기화

    const rooms = snapshot.val();
    if (rooms) {
      Object.entries(rooms).forEach(([roomId, roomData]) => {
        const roomItem = document.createElement("div");
        roomItem.className = "room-item";
        roomItem.textContent = roomData.name;

        // roomId를 data 속성으로 저장
        roomItem.dataset.roomId = roomId;

        // 클릭 이벤트에서 roomId 사용
        roomItem.addEventListener("click", () => {
          const id = roomItem.dataset.roomId;
          window.location.href = `../3dplace/3dplace.html?roomId=${id}`;
        });

        roomListContainer.appendChild(roomItem);
      });
    } else {
      const msg = document.createElement("p");
      msg.textContent = "방이 없습니다.";
      roomListContainer.appendChild(msg);
    }
  });
}

// 페이지 로드 시 실행
window.addEventListener("DOMContentLoaded", loadRooms);

const createRoomButton = document.getElementById("createRoomButton");
const roomNameInput = document.getElementById("roomNameInput");

createRoomButton.addEventListener("click", () => {
  const roomName = roomNameInput.value.trim();

  if (!roomName) {
    alert("방 이름을 입력하세요.");
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const roomsRef = ref(database, "rooms");
      const newRoomRef = push(roomsRef); // 고유 ID 자동 생성

      const newRoom = {
        name: roomName,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        blocks: {} // 초기엔 빈 블록
      };

      set(newRoomRef, newRoom)
        .then(() => {
          alert("방이 생성되었습니다.");
          roomNameInput.value = "";
        })
        .catch((error) => {
          console.error("방 생성 오류:", error);
          alert("방 생성에 실패했습니다.");
        });
    } else {
      alert("로그인해야 방을 생성할 수 있습니다.");
    }
  });
});

// 네비게이션 메뉴 요소
const navbarMenu = document.querySelector(".navbar_menu");

onAuthStateChanged(auth, (user) => {
  navbarMenu.innerHTML = ""; // 기존 메뉴 초기화

  if (user) {
    // 로그인 상태일 때
    const logoutItem = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.textContent = "로그아웃";
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      signOut(auth).then(() => {
        window.location.reload(); // 로그아웃 후 새로고침
      });
    });
    logoutItem.appendChild(logoutLink);

    const homeItem = document.createElement("li");
    homeItem.innerHTML = `<a href="../index.html">홈</a>`;

    const myRoomsItem = document.createElement("li");
    myRoomsItem.innerHTML = `<a href="#">내 전시관</a>`; // 추후 구현 가능

    navbarMenu.appendChild(logoutItem);
    navbarMenu.appendChild(myRoomsItem);
    navbarMenu.appendChild(homeItem);

  } else {
    // 비로그인 상태일 때
    const loginItem = document.createElement("li");
    loginItem.innerHTML = `<a href="../login/login.html">로그인</a>`;

    const signupItem = document.createElement("li");
    signupItem.innerHTML = `<a href="../signup/signup.html">회원가입</a>`;

    const homeItem = document.createElement("li");
    homeItem.innerHTML = `<a href="../index.html">홈</a>`;

    navbarMenu.appendChild(loginItem);
    navbarMenu.appendChild(signupItem);
    navbarMenu.appendChild(homeItem);
  }
});