// Xử lý sự kiện khi nhấn vào nút bắt đầu
document.querySelector('.start-button').addEventListener('click', function() {
    window.location.href = "game.html"; // Điều hướng sang trang chơi game
});

// Xử lý bật/tắt âm thanh
let isSoundOn = true;
document.getElementById('sound-toggle').addEventListener('click', function() {
    isSoundOn = !isSoundOn;
    this.classList.toggle('off'); // Thêm hoặc bỏ lớp 'off' để thay đổi giao diện nút
});
// Xử lý sự kiện khi nhấn vào nút bắt đầu
document.querySelector('.start-button').addEventListener('click', function() {
    window.location.href = "index.html"; // Điều hướng sang trang index.html (trang chính của game)
});
document.querySelector('.start-button').addEventListener('click', function() {
    // Phát âm thanh khi nhấn nút bắt đầu
    const startSound = document.getElementById('start-sound');
    startSound.play();
    
    // Sau khi phát âm thanh một lúc, chuyển đến trang index.html
    setTimeout(function() {
        window.location.href = "index.html";
    }, 1000); // Chờ 1 giây (đủ để âm thanh phát)
});
// Lấy phần tử âm thanh từ HTML
const backgroundMusic = document.getElementById("background-music");
const musicButton = document.querySelector(".music-button i"); // Lấy phần tử biểu tượng
// Lấy phần tử modal và nút đóng
const instructionsModal = document.getElementById("game-instructions-modal");
const closeInstructionsButton = document.querySelector(".close-instructions");

// Khi người dùng nhấn vào biểu tượng fa-info-circle
document.querySelector(".info-button").addEventListener("click", function() {
    instructionsModal.style.display = "block";
});

// Khi người dùng nhấn vào nút đóng
closeInstructionsButton.addEventListener("click", function() {
    instructionsModal.style.display = "none";
});

// Khi người dùng nhấn ra ngoài modal
window.addEventListener("click", function(event) {
    if (event.target === instructionsModal) {
        instructionsModal.style.display = "none";
    }
});

// Lắng nghe sự kiện nhấp vào nút "Bắt đầu"
document.getElementById('start-button').addEventListener('click', function() {
    // Chuyển hướng tới file dangky.html
    window.location.href = 'dangky.html';
});

// Biến để kiểm tra trạng thái của âm nhạc
let isMusicPlaying = false;

// Hàm bật/tắt nhạc khi nhấn nút
function toggleMusic() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicButton.classList.remove("fa-stop");
        musicButton.classList.add("fa-music"); // Đổi biểu tượng về nốt nhạc khi tắt
    } else {
        backgroundMusic.play();
        musicButton.classList.remove("fa-music");
        musicButton.classList.add("fa-stop"); // Đổi biểu tượng thành nút dừng khi bật
    }
    isMusicPlaying = !isMusicPlaying; // Đảo trạng thái
}

// Gán sự kiện click cho nút nhạc
document.querySelector(".music-button").addEventListener("click", toggleMusic);

