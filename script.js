let playerName = "";
let score = 0;
let moves = 0;
let timer;
let timeElapsed = 0;
let pieces = [];
let emptyPos = { row: 2, col: 2 };
const size = 3;

function shufflePieces() {
    let positions;
    do {
        positions = [];
        for (let i = 0; i < size * size; i++) positions.push(i);
        positions.sort(() => Math.random() - 0.5);
    } while (positions.some((v, i) => v === i));
    return positions;
}

function startGame() {
    const nameInput = document.getElementById("nameInput");
    playerName = nameInput.value.trim();
    if (!playerName) return;

    document.getElementById("welcome").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("playerName").textContent = playerName;
    document.getElementById("nextLevel").disabled = true;

    score = 0;
    moves = 0;
    timeElapsed = 0;
    updateStats();
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    initPuzzle();
}

function updateStats() {
    document.getElementById("score").textContent = score;
    document.getElementById("moves").textContent = moves;
}

function updateTimer() {
    timeElapsed++;
    const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
    const seconds = String(timeElapsed % 60).padStart(2, '0');
    document.getElementById("timer").textContent = `${minutes}:${seconds}`;
}

function initPuzzle() {
    const container = document.getElementById("puzzle");
    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    const positions = shufflePieces();
    pieces = [];

    for (let i = 0; i < size * size; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        const row = Math.floor(i / size);
        const col = i % size;
        const value = positions[i];
        tile.dataset.index = i;
        tile.dataset.value = value;
        tile.style.backgroundImage = value < size * size - 1 ? `url('Files/cat.jpg')` : "none";
        if (value < size * size - 1) {
            const bgRow = Math.floor(value / size);
            const bgCol = value % size;
            tile.style.backgroundPosition = `${-bgCol * 100}% ${-bgRow * 100}%`;
        } else {
            tile.classList.add("empty");
            emptyPos = { row, col };
        }
        tile.addEventListener("click", () => handleClick(row, col));
        container.appendChild(tile);
        pieces.push(tile);
    }
}

function playSound(name) {
    const audio = new Audio(`Files/${name}.mp3`);
    audio.play();
}

function handleClick(row, col) {
    if (Math.abs(row - emptyPos.row) + Math.abs(col - emptyPos.col) === 1) {
        const clickedIndex = row * size + col;
        const emptyIndex = emptyPos.row * size + emptyPos.col;
        swapTiles(clickedIndex, emptyIndex);
        playSound("swap");
        moves++;
        updateStats();
        checkWin();
    } else {
        playSound("click");
    }
}

function swapTiles(i1, i2) {
    const container = document.getElementById("puzzle");
    const temp = pieces[i1].dataset.value;
    pieces[i1].dataset.value = pieces[i2].dataset.value;
    pieces[i2].dataset.value = temp;

    const tempClass = pieces[i1].className;
    pieces[i1].className = pieces[i2].className;
    pieces[i2].className = tempClass;

    const tempBG = pieces[i1].style.backgroundImage;
    const tempPos = pieces[i1].style.backgroundPosition;
    pieces[i1].style.backgroundImage = pieces[i2].style.backgroundImage;
    pieces[i1].style.backgroundPosition = pieces[i2].style.backgroundPosition;
    pieces[i2].style.backgroundImage = tempBG;
    pieces[i2].style.backgroundPosition = tempPos;

    [pieces[i1], pieces[i2]] = [pieces[i2], pieces[i1]];
    emptyPos = { row: Math.floor(i1 / size), col: i1 % size };
}

function checkWin() {
    for (let i = 0; i < pieces.length; i++) {
        if (parseInt(pieces[i].dataset.value) !== i) return;
    }

    clearInterval(timer);
    document.getElementById("message").style.display = "block";
    playSound("win");
    document.getElementById("nextLevel").disabled = false;
}

function restartGame() {
    document.getElementById("message").style.display = "none";
    startGame();
}
