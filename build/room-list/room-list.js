import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

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
          window.location.href = `/build/3dplace/3dplace.html?roomId=${id}`;
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
