const fruits = [
    'https://i.pinimg.com/control/236x/19/1d/04/191d04d9f7e8f3b85270c6be387894c4.jpg',
    'https://i.pinimg.com/236x/be/23/40/be2340d60b231312ac08845631e19416.jpg',
    'https://i.pinimg.com/control/236x/0c/74/04/0c7404e782f9e45c2abcf596e642350f.jpg',
    'https://i.pinimg.com/236x/1b/b9/60/1bb9608e8c23a9f4f43985dfb96155d6.jpg',
    'https://i.pinimg.com/236x/39/36/ec/3936ec7d76f87ca6b759ed2c668c2b4f.jpg',
    'https://i.pinimg.com/control/236x/89/80/5d/89805df8afa49412e9b6d264bf0e71b6.jpg',
    'https://i.pinimg.com/236x/94/2f/e0/942fe00a4ccb54690a3e39f62746d627.jpg',
    'https://i.pinimg.com/control/236x/38/37/45/38374591deaf02682c856a85b6043833.jpg'
];

const boardSize = 8;
let score = 0;
let levelScore = 0;
let level = 1;
let selectedFruit = null;
let isPaused = false;
let timer = 100;
let timerInterval;
let isLevelingUp = false; // Prevent multiple level-ups
let isSoundOn = true; // Default sound state
let selectedLanguage = 'vi'; // Default language


// Event listeners for sound and language settings
document.getElementById('sound-toggle').addEventListener('change', function() {
    isSoundOn = this.checked;
});

document.getElementById('language-select').addEventListener('change', function() {
    selectedLanguage = this.value;
    updateLanguage();
});

// Open/Close settings modal
document.getElementById('settings-button').addEventListener('click', function() {
    document.getElementById('settings-modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('settings-modal').style.display = 'none';
});
// Pause and resume logic
// Pause and resume logic
document.getElementById('pause-button').addEventListener('click', function() {
    if (isPaused) {
        isPaused = false;
        this.innerText = 'Pause'; // Change button text to 'Pause'
        startTimer(); // Resume the timer
    } else {
        isPaused = true;
        this.innerText = 'Resume'; // Change button text to 'Resume'
        clearInterval(timerInterval); // Stop the timer but keep the current timer value
    }
});

// Restart the current level without affecting score and overall level
document.getElementById('reload-button').addEventListener('click', function() {
    resetLevel();
});
document.addEventListener("DOMContentLoaded", () => {
    const changeLevelButton = document.getElementById("change-level-button");

    // Sự kiện khi nhấn nút "Level"
    changeLevelButton.addEventListener("click", () => {
        window.location.href = "level.html"; // Chuyển sang file level.html
    });
});
document.getElementById('sound-toggle').addEventListener('change', function() {
    isSoundOn = this.checked;
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        if (isSoundOn) bgMusic.play();
        else bgMusic.pause();
    }
});


// Reset the current level
function resetLevel() {
    clearInterval(timerInterval); // Stop any ongoing timer
    levelScore = 0; // Reset the level score only
    timer = levelTimes[level - 1] || 30; // Reset the timer based on the current level

    // Update the UI
    document.getElementById('level-score').innerText = `Level Score: ${levelScore}`; // Reset the level score display
    document.getElementById('timer-bar-inner').style.width = '100%'; // Reset the timer bar

    createBoard(); // Recreate the game board for the current level
    startTimer(); // Restart the timer for the level
}


// Reset the level and game properly
function resetGame() {
    score = 0;
    levelScore = 0;
    level = 1;
    timer = 100;
    isPaused = false;

    document.getElementById('score').innerText = score;
    document.getElementById('level-score').innerText = `Level Score: ${levelScore}`;
    document.getElementById('level').innerText = `Level: ${level}`;
    document.getElementById('pause-button').innerText = 'Pause'; // Reset button state

    clearInterval(timerInterval); // Stop any ongoing timer
    createBoard(); // Create the initial board
    startTimer(); // Start the game timer
}

function selectFruit(e) {
    if (isPaused) return;
    if (selectedFruit) {
        selectedFruit.classList.remove('selected');
    }
    selectedFruit = e.target;
    selectedFruit.classList.add('selected');

    // Play sound for selecting a fruit
    playSound('select-sound');
}
function drop(e) {
    if (isPaused) return;
    e.preventDefault();
    const targetFruit = e.target;
    const selectedId = selectedFruit.getAttribute('data-id');
    const targetId = targetFruit.getAttribute('data-id');

    // Swap fruits
    const tempSrc = selectedFruit.src;
    selectedFruit.src = targetFruit.src;
    targetFruit.src = tempSrc;

    selectedFruit.classList.remove('selected');
    selectedFruit = null;

    // Play sound for swapping fruits
    playSound('swap-sound');

    // Check for matches
    checkAllMatches();
}



function playSound(soundId) {
    if (isSoundOn) { // Kiểm tra xem âm thanh có bật không
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0; // Đặt lại thời gian phát âm thanh về đầu
            sound.play(); // Phát âm thanh
        }
    }
}


// Language update function
function updateLanguage() {
    const instructions = document.getElementById('instructions');
    if (selectedLanguage === 'vi') {
        instructions.innerHTML = `
            <h2>Hướng Dẫn</h2>
            <p>Cách chơi:
            Chọn trái cây: Nhấp chuột vào một trái cây trên bảng để chọn nó.
            Hoán đổi trái cây: Sau khi chọn một trái cây, nhấp vào trái cây liền kề (ngang hoặc dọc) để hoán đổi vị trí của chúng. Mục tiêu là tạo thành dãy 3 trái cây giống nhau.
            Kết hợp giống nhau: Bạn cần tạo ra ít nhất 3 trái cây cùng loại xếp thành một hàng (ngang hoặc dọc). Những trái cây này sẽ biến mất và bạn nhận điểm.
            Cấp độ (Level):
            Mỗi cấp độ có một điểm số mục tiêu. Khi bạn đạt đủ số điểm yêu cầu của cấp độ hiện tại, bạn sẽ lên cấp.
            Các cấp độ càng cao, thời gian sẽ càng giảm và yêu cầu ghi điểm càng khó hơn.</p>
        `;
    } else {
        instructions.innerHTML = `
            <h2>Instructions</h2>
            <p>How to Play:
            Select a Fruit: Click on a fruit on the board to select it.
            Swap Fruits: After selecting a fruit, click on an adjacent fruit (horizontal or vertical) to swap their positions. The goal is to create a row of 3 identical fruits.
            Match Identical Fruits: You need to create at least 3 identical fruits in a row (horizontal or vertical). These fruits will disappear, and you will earn points.
            Level:
            Each level has a target score. When you reach the required score for the current level, you will level up.
            Higher levels will have less time and harder scoring requirements.</p>
        `;
    }
}
function selectLevel(selectedLevel) {
    level = selectedLevel; // Đặt cấp độ hiện tại
    levelScore = 0; // Đặt điểm ban đầu cho cấp độ
    timer = levelTimes[level - 1] || 30; // Đặt thời gian cho cấp độ
    isPaused = false; // Bỏ trạng thái tạm dừng

    // Ẩn giao diện chọn level và hiển thị giao diện game
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Cập nhật thông tin hiển thị
    document.getElementById('level').innerText = `Level: ${level}`;
    document.getElementById('level-score').innerText = `Level Score: ${levelScore}`;
    document.getElementById('score').innerText = score;

    // Khởi động bảng và bộ đếm thời gian cho level mới
    createBoard();
    startTimer();
}

// Toggle instructions visibility
const helpButton = document.getElementById('help-button');
const instructions = document.getElementById('instructions');
helpButton.addEventListener('click', function() {
    instructions.style.display = (instructions.style.display === 'none' || instructions.style.display === '') ? 'block' : 'none';
});

// Close settings modal
const closeModalButton = document.querySelector('.close');
closeModalButton.addEventListener('click', function() {
    document.getElementById('settings-modal').style.display = 'none';
});

// Thresholds and timer settings for each level
const levelThresholds = [50, 100, 150, 200, 250, 300, 400, 500, 600, 700];
const levelTimes = [60, 55, 50, 45, 40, 35, 30, 25, 20, 15]; // Adjust time as needed

function checkLevelUp() {
    // Check if the current level score has met or exceeded the threshold
    if (!isLevelingUp && levelScore >= levelThresholds[level - 1]) {
        isLevelingUp = true; // Mark that we are leveling up

        // Move to the next level
        level++;
        levelScore = 0; // Reset level score

        // If exceeded level 10, the game ends
        if (level > 10) {
            alert('Congratulations! You have completed all levels!');
            resetGame();
            return;
        }

        // Update UI after leveling up
        document.getElementById('level').innerText = `Level: ${level}`;
        document.getElementById('level-score').innerText = `Level Score: ${levelScore}`;

        // Reset timer for the new level
        timer = levelTimes[level - 1]; // Set timer based on the current level
        document.getElementById('timer-bar-inner').style.width = '100%';

        setTimeout(() => {
            createBoard(); // Create a new board for the new level
            isLevelingUp = false; // Reset leveling up state
        }, 500);
    }
}

function createBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    const fruitsOnBoard = []; // Array to keep track of fruits placed on the board

    for (let i = 0; i < boardSize * boardSize; i++) {
        let fruit;

        // Generate a fruit and ensure it is not the same as its neighbors
        do {
            fruit = fruits[Math.floor(Math.random() * fruits.length)];
        } while (
            (i >= boardSize && fruit === fruitsOnBoard[i - boardSize]) || // Check the fruit above
            (i % boardSize !== 0 && fruit === fruitsOnBoard[i - 1]) // Check the fruit to the left
        );

        // Create and set up the fruit image
        const img = document.createElement('img');
        img.src = fruit;
        img.setAttribute('data-id', i);
        img.setAttribute('draggable', true);
        img.addEventListener('dragstart', dragStart);
        img.addEventListener('dragover', dragOver);
        img.addEventListener('drop', drop);
        img.addEventListener('click', selectFruit);
        board.appendChild(img);
        
        // Add the fruit to the tracking array
        fruitsOnBoard.push(fruit);
    }

    // Check for matches after the board is created
    checkAllMatches();
}


function selectFruit(e) {
    if (isPaused) return;
    if (selectedFruit) {
        selectedFruit.classList.remove('selected');
    }
    selectedFruit = e.target;
    selectedFruit.classList.add('selected');

    playSound('select-sound'); // Add sound when selecting a fruit
}


function dragStart(e) {
    if (isPaused) return;
    selectedFruit = e.target;
    selectedFruit.classList.add('selected');
}

function dragOver(e) {
    if (isPaused) return;
    e.preventDefault();
}

function drop(e) {
    if (isPaused) return;
    e.preventDefault();
    const targetFruit = e.target;
    const selectedId = selectedFruit.getAttribute('data-id');
    const targetId = targetFruit.getAttribute('data-id');

    // Swap fruits
    const tempSrc = selectedFruit.src;
    selectedFruit.src = targetFruit.src;
    targetFruit.src = tempSrc;

    selectedFruit.classList.remove('selected');
    selectedFruit = null;

    // Check for matches
    checkAllMatches();
}

function checkMatch(row, col) {
    const board = document.getElementById('game-board');
    const cells = board.getElementsByTagName('img');
    const id = row * boardSize + col;
    const fruit = cells[id].src;

    // Horizontal match
    let match = [id];
    for (let i = col - 1; i >= 0; i--) {
        if (cells[row * boardSize + i].src === fruit) {
            match.push(row * boardSize + i);
        } else {
            break;
        }
    }
    for (let i = col + 1; i < boardSize; i++) {
        if (cells[row * boardSize + i].src === fruit) {
            match.push(row * boardSize + i);
        } else {
            break;
        }
    }
    if (match.length >= 3) {
        return match;
    }

    // Vertical match
    match = [id];
    for (let i = row - 1; i >= 0; i--) {
        if (cells[i * boardSize + col].src === fruit) {
            match.push(i * boardSize + col);
        } else {
            break;
        }
    }
    for (let i = row + 1; i < boardSize; i++) {
        if (cells[i * boardSize + col].src === fruit) {
            match.push(i * boardSize + col);
        } else {
            break;
        }
    }
    if (match.length >= 3) {
        return match;
    }

    return null;
}

function removeMatch(match) {
    const board = document.getElementById('game-board');
    const cells = board.getElementsByTagName('img');

    // Add points for the match
    const matchPoints = match.length; // Number of matched fruits
    score += matchPoints; // Update the total score
    levelScore += matchPoints; // Update the level score

    // Highlight matched fruits
    match.forEach(id => {
        cells[id].classList.add('matched');
    });

    // Play sound for matching fruits
    playSound('match-sound');

    setTimeout(() => {
        // Replace matched fruits with new random fruits
        match.forEach(id => {
            cells[id].src = fruits[Math.floor(Math.random() * fruits.length)];
            cells[id].classList.remove('matched');
        });

        // Update the displayed scores after the match has been processed
        document.getElementById('score').innerText = score;
        document.getElementById('level-score').innerText = `Level Score: ${levelScore}`;

        // Check all matches again after removing the matched fruits
        checkAllMatches(); // Check for new matches that may have formed
        checkLevelUp(); // Check if the player has leveled up
    }, 500);
}


function checkAllMatches() {
    let hasMatch = false;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const match = checkMatch(row, col);
            if (match) {
                removeMatch(match);
                hasMatch = true;
            }
        }
    }

    // No need to check for level up here, since we will do that after all matches have been removed
}


function checkLevelUp() {
    if (!isLevelingUp && levelScore >= levelThresholds[level - 1]) {
        isLevelingUp = true; // Mark that we are leveling up

        // Move to the next level
        level++;
        levelScore = 0; // Reset level score

        // Play sound for leveling up
        playSound('level-up-sound');

        // Check if game ends
        if (level > 10) {
            playSound('game-over-sound');
            alert('Congratulations! You have completed all levels!');
            resetGame();
            return;
        }

        // Update UI after leveling up
        document.getElementById('level').innerText = `Level: ${level}`;
        document.getElementById('level-score').innerText = `Level Score: ${levelScore}`;

        // Reset timer for the new level
        timer = levelTimes[level - 1]; // Set timer based on the current level
        document.getElementById('timer-bar-inner').style.width = '100%';

        setTimeout(() => {
            createBoard(); // Create a new board for the new level
            isLevelingUp = false; // Reset leveling up state
        }, 500);
    }
}
// Hàm để cập nhật trạng thái mở khóa cấp độ
function unlockLevel(level) {
    // Lấy cấp độ đã mở từ localStorage
    let unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

    // Nếu cấp độ hiện tại lớn hơn cấp độ đã mở, cập nhật
    if (level > unlockedLevel) {
        localStorage.setItem("unlockedLevel", level);
        alert(`Bạn đã mở khóa Level ${level}!`);
    }
}

// Giả sử hàm này được gọi khi người chơi hoàn thành cấp độ
function completeLevel(level) {
    // Logic hoàn thành cấp độ
    console.log(`Cấp độ ${level} đã hoàn thành!`);
    
    // Mở khóa cấp độ tiếp theo
    unlockLevel(level + 1); // Mở khóa cấp độ tiếp theo
}

// Đảm bảo rằng nút hoàn thành có trong DOM
document.addEventListener('DOMContentLoaded', () => {
    const completeButton = document.getElementById('complete-level');
    
    if (completeButton) {
        // Ví dụ: khi người chơi nhấn nút hoàn thành
        completeButton.addEventListener('click', () => {
            // Giả sử bạn đang ở cấp độ 1 (có thể thay đổi theo cấp độ hiện tại)
            completeLevel(1); // Thay đổi số này theo cấp độ hiện tại
        });
    } else {
        console.error('Nút hoàn thành không tìm thấy trong DOM.');
    }
});


function resetGame() {
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.pause(); // Stop music
        bgMusic.currentTime = 0; // Reset music to the beginning
    }
    playSound('game-over-sound'); // Play game over sound
    // Other reset logic...
}



function startGame() {
    createBoard(); // Initialize the board
    timer = levelTimes[level - 1]; // Set timer for level 1
    startTimer(); // Start the timer

    // Play background music
    const bgMusic = document.getElementById('background-music');
    if (isSoundOn && bgMusic) {
        bgMusic.volume = 0.5; // Adjust volume
        bgMusic.play();
    }
}


function playSound(soundId) {
    if (isSoundOn) { // Check if sound is enabled
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0; // Reset sound to start
            sound.play(); // Play the sound
        }
    }
}


function startTimer() {
    clearInterval(timerInterval); // Clear any existing timer
    timerInterval = setInterval(() => {
        if (!isPaused) {
            if (timer <= 0) {
                clearInterval(timerInterval); // Stop the timer
                alert('Hết giờ! Game Over.'); // Notify the user
                resetGame(); // Reset the game
            } else {
                timer--; // Decrease the timer
                const timerBar = document.getElementById('timer-bar-inner');
                const width = (timer / (levelTimes[level - 1] || 30)) * 100; // Calculate width for timer bar
                timerBar.style.width = `${width}%`; // Update the timer bar display
            }
        }
    }, 1000); // Update every second
}
// Function to load leaderboard data from the server
function loadLeaderboard() {
    const leaderboardTable = document.getElementById("leaderboard-table");

    // Clear existing rows in the leaderboard
    leaderboardTable.innerHTML = "";

    // Fetch leaderboard data from the server
    fetch('/api/leaderboard')
        .then(response => response.json())
        .then(data => {
            // Loop through the data and create a row for each player
            data.forEach((player, index) => {
                const row = leaderboardTable.insertRow();
                row.insertCell(0).textContent = index + 1; // Rank
                row.insertCell(1).textContent = player.username; // Player name
                row.insertCell(2).textContent = player.score; // Score
            });
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
        });
}

// Show leaderboard when the leaderboard button is clicked
const leaderboardButton = document.getElementById("leaderboard-button");
const leaderboardModal = document.getElementById("leaderboard-modal");
const closeLeaderboardButton = document.querySelector(".close-leaderboard");

leaderboardButton.addEventListener("click", () => {
    leaderboardModal.style.display = "block";
    loadLeaderboard(); // Load leaderboard when the modal is opened
});

// Close the leaderboard modal when the close button is clicked
closeLeaderboardButton.addEventListener("click", () => {
    leaderboardModal.style.display = "none";
});


// Start the game when page is loaded
startGame();
