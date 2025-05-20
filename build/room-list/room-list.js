import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
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
  measurementId: "G-TTPH9YZCYL",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);

// HTML 요소
const roomListContainer = document.getElementById("roomListContainer");
const createRoomButton = document.getElementById("createRoomButton");
const roomNameInput = document.getElementById("roomNameInput");
const navbarMenu = document.querySelector(".navbar_menu");

// 상태 플래그
let showingMyRooms = false;

// 전체 방 불러오기
function loadRooms() {
  const roomsRef = ref(database, "rooms");

  onValue(roomsRef, (snapshot) => {
    roomListContainer.innerHTML = "";
    const rooms = snapshot.val();

    onAuthStateChanged(auth, (user) => {
      if (rooms) {
        Object.entries(rooms).forEach(([roomId, roomData]) => {
          const roomItem = document.createElement("div");
          roomItem.className = "room-item";
          roomItem.textContent = roomData.name;
          roomItem.dataset.roomId = roomId;

          // 클릭 시 3dplace.html로 이동
          roomItem.addEventListener("click", () => {
            window.location.href = `../3dplace/3dplace.html?roomId=${roomId}`;
          });

          // 🔒 로그인 상태이며 자신이 만든 방이면 삭제 버튼 추가
          if (user && user.uid === roomData.createdBy) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "삭제";
            deleteBtn.className = "delete-room-button";

            deleteBtn.addEventListener("click", (e) => {
              e.stopPropagation(); // 방 클릭 이벤트 방지
              const confirmDelete = confirm(
                `'${roomData.name}' 방을 삭제하시겠습니까?`
              );
              if (confirmDelete) {
                const roomRef = ref(database, `rooms/${roomId}`);
                set(roomRef, null)
                  .then(() => {
                    alert("방이 삭제되었습니다.");
                    loadRooms(); // 목록 갱신
                  })
                  .catch((err) => {
                    alert("삭제 중 오류 발생: " + err.message);
                  });
              }
            });

            roomItem.appendChild(deleteBtn);
          }

          roomListContainer.appendChild(roomItem);
        });
      } else {
        const msg = document.createElement("p");
        msg.textContent = "방이 없습니다.";
        roomListContainer.appendChild(msg);
      }
    });
  });
}

// 내 방만 불러오기
function loadMyRooms(uid) {
  const roomsRef = ref(database, "rooms");

  onValue(roomsRef, (snapshot) => {
    roomListContainer.innerHTML = "";
    const rooms = snapshot.val();
    let found = false;

    if (rooms) {
      Object.entries(rooms).forEach(([roomId, roomData]) => {
        if (roomData.createdBy === uid) {
          const roomItem = document.createElement("div");
          roomItem.className = "room-item";
          roomItem.textContent = roomData.name;
          roomItem.dataset.roomId = roomId;

          // 클릭 시 3dplace.html로 이동
          roomItem.addEventListener("click", () => {
            window.location.href = `../3dplace/3dplace.html?roomId=${roomId}`;
          });

          // 🔥 삭제 버튼 추가
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "삭제";
          deleteBtn.className = "delete-room-button";

          deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // 방 이동 방지
            const confirmDelete = confirm(
              `'${roomData.name}' 방을 삭제하시겠습니까?`
            );
            if (confirmDelete) {
              const roomRef = ref(database, `rooms/${roomId}`);
              set(roomRef, null)
                .then(() => {
                  alert("방이 삭제되었습니다.");
                  loadMyRooms(uid); // 목록 갱신
                })
                .catch((err) => {
                  alert("삭제 중 오류 발생: " + err.message);
                });
            }
          });

          roomItem.appendChild(deleteBtn);
          roomListContainer.appendChild(roomItem);
          found = true;
        }
      });
    }

    if (!found) {
      const msg = document.createElement("p");
      msg.textContent = "내가 만든 전시관이 없습니다.";
      roomListContainer.appendChild(msg);
    }
  });
}

// 초기 로딩: 전체 방 목록
window.addEventListener("DOMContentLoaded", loadRooms);

// 방 생성
createRoomButton.addEventListener("click", () => {
  const roomName = roomNameInput.value.trim();

  if (!roomName) {
    alert("방 이름을 입력하세요.");
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const roomsRef = ref(database, "rooms");
      const newRoomRef = push(roomsRef);

      const newRoom = {
        name: roomName,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        blocks: {},
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

// 로그인 상태 감지 및 네비게이션 메뉴 설정
onAuthStateChanged(auth, (user) => {
  navbarMenu.innerHTML = ""; // 기존 메뉴 초기화

  // 공통 메뉴: 도움말 & 홈
  const helpItem = document.createElement("li");
  helpItem.innerHTML = `<a href="../help/help.html">도움말</a>`;

  const homeItem = document.createElement("li");
  homeItem.innerHTML = `<a href="../index.html">홈</a>`;

  if (user) {
    // 로그인 상태일 때 메뉴

    const logoutItem = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.textContent = "로그아웃";
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      signOut(auth).then(() => window.location.reload());
    });
    logoutItem.appendChild(logoutLink);

    const roomToggleItem = document.createElement("li");
    const roomToggleLink = document.createElement("a");
    roomToggleLink.href = "#";
    roomToggleLink.textContent = "내 전시관";
    roomToggleItem.appendChild(roomToggleLink);

    navbarMenu.appendChild(logoutItem);
    navbarMenu.appendChild(homeItem);
    navbarMenu.appendChild(helpItem);
    navbarMenu.appendChild(roomToggleItem);

    showingMyRooms = false;
    roomToggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (showingMyRooms) {
        loadRooms();
        roomToggleLink.textContent = "내 전시관";
        showingMyRooms = false;
      } else {
        loadMyRooms(user.uid);
        roomToggleLink.textContent = "전체 전시관";
        showingMyRooms = true;
      }
    });
  } else {
    // 비로그인 상태 메뉴
    const loginItem = document.createElement("li");
    loginItem.innerHTML = `<a href="../login/login.html">로그인</a>`;

    const signupItem = document.createElement("li");
    signupItem.innerHTML = `<a href="../signup/signup.html">회원가입</a>`;

    navbarMenu.appendChild(loginItem);
    navbarMenu.appendChild(signupItem);
    navbarMenu.appendChild(homeItem);
    navbarMenu.appendChild(helpItem);
  }
});
