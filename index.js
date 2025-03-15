// DOM 요소 가져오기
const xInput = document.getElementById('x');
const yInput = document.getElementById('y');
const zInput = document.getElementById('z');
const setCoordinateBtn = document.getElementById('set-coordinate-btn');
const wrapContainer = document.getElementById('wrap-container');

// 공간 크기 정의 (100x100x100)
const SPACE_SIZE = 100;

// 복셀 생성 함수
function createVoxel(x, y, z) {
    // 복셀 요소 생성
    const voxel = document.createElement('div');
    voxel.className = 'voxel';
    voxel.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    wrapContainer.appendChild(voxel);
}

// 좌표 설정 버튼 클릭 이벤트
setCoordinateBtn.addEventListener('click', () => {
    const x = parseInt(xInput.value, 10);
    const y = parseInt(yInput.value, 10);
    const z = parseInt(zInput.value, 10);

    // 입력값 검증
    if (
        isNaN(x) || isNaN(y) || isNaN(z) ||
        x < 0 || x >= SPACE_SIZE ||
        y < 0 || y >= SPACE_SIZE ||
        z < 0 || z >= SPACE_SIZE
    ) {
        alert(`좌표는 0에서 ${SPACE_SIZE - 1} 사이의 숫자여야 합니다.`);
        return;
    }

    // 복셀 생성
    createVoxel(x, y, z);
});