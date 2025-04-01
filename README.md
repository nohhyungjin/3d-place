<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Art Museum Room List</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            text-align: center;
        }

        a {
            text-decoration: none;
            color: white;
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgb(47, 97, 163);
            padding: 12px 20px;
            color: white;
        }

        .navbar_logo a {
            font-size: 28px;
            font-weight: bold;
            color: white;
        }

        .navbar_menu {
            display: flex;
            align-items: center;
            list-style: none;
            padding-left: 0;
            margin: 0;
        }

        .navbar_menu li {
            padding: 8px 16px;
            margin: 0;
        }

        .navbar_menu li a {
            text-decoration: none;
            color: white;
            font-size: 16px;
            font-weight: bold;
        }

        .navbar_menu li:hover {
            background-color: rgb(28, 201, 181);
            border-radius: 4px;
        }

        .room-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 크기 키우기 */
            gap: 16px;
            padding: 20px;
            max-width: 900px;
            margin: 20px auto;
        }

        .room {
            background: white;
            padding: 20px;  /* 방 크기 확장 */
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: 0.3s ease-in-out;
        }

        .room:hover {
            transform: scale(1.05);
        }

        .room button {
            margin-top: 10px;
            padding: 8px 12px;
            background: #4285F4;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            width: 100%;
        }

        .add-room {
            margin-top: 20px;
            padding: 10px;
            width: 200px;
            background: #34A853;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }

        .user-count {
            margin-top: 10px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>

<body>
    <nav class="navbar">
        <div class="navbar_logo">
            <a href="#">Art Museum</a>
        </div>
        <ul class="navbar_menu">
            <li><a href="#">로그인</a></li>
            <li><a href="#">환경설정</a></li>
            <li><a href="#">깃허브</a></li>
            <li><a href="#">Home</a></li>
            <li><a href="#">임시메뉴</a></li>
        </ul>
    </nav>

    <section>
        <h2>Art Museum Rooms</h2>
        <div class="room-list" id="roomList">
            <div class="room" id="room1">
                <span>Room 1</span>
                <div class="user-count" id="userCount1">Users: 0</div>
                <button onclick="joinRoom('Room 1', 1)">Join</button>
            </div>
            <div class="room" id="room2">
                <span>Room 2</span>
                <div class="user-count" id="userCount2">Users: 0</div>
                <button onclick="joinRoom('Room 2', 2)">Join</button>
            </div>
        </div>
        <button class="add-room" id="addRoomButton">Add Room</button>
    </section>

    <script>
        let roomCount = 2; // 기존 방 개수
        let roomUsers = {1: 0, 2: 0}; // 각 방의 접속자 수

        document.getElementById('addRoomButton').addEventListener('click', function () {
            roomCount++;
            const roomList = document.getElementById('roomList');
            const newRoom = document.createElement('div');
            newRoom.classList.add('room');
            newRoom.id = `room${roomCount}`;
            newRoom.innerHTML = `<span>Room ${roomCount}</span>
                                 <div class="user-count" id="userCount${roomCount}">Users: 0</div>
                                 <button onclick="joinRoom('Room ${roomCount}', ${roomCount})">Join</button>`;
            roomList.appendChild(newRoom);
            roomUsers[roomCount] = 0;  // 새로운 방에 사용자 수 0으로 설정
        });

        function joinRoom(roomName, roomId) {
            roomUsers[roomId]++;
            document.getElementById(`userCount${roomId}`).innerText = `Users: ${roomUsers[roomId]}`;
            alert(`Entering ${roomName}`);
        }
    </script>
</body>

</html>
