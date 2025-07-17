const puzzleSize = 3;
let pieces = [];
let emptyIndex = null;
let moves = 0;
let score = 0;
let timerInterval;
let seconds = 0;

const clickSound = document.getElementById("clickSound");
const swapSound = document.getElementById("swapSound");
const winSound = document.getElementById("winSound");

function startGame() {
  const name = document.getElementById("playerNameInput").value || "Joueur";
  document.getElementById("playerName").textContent = name;
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("gameInfo").classList.remove("hidden");
  document.getElementById("puzzleContainer").classList.remove("hidden");
  document.getElementById("message").classList.add("hidden");

  score = 0;
  moves = 0;
  seconds = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("moves").textContent = moves;
  document.getElementById("timer").textContent = "00:00";

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  initPuzzle();
}

function updateTimer() {
  seconds++;
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${min}:${sec}`;
}

function initPuzzle() {
  const container = document.getElementById("puzzleContainer");
  container.innerHTML = "";
  pieces = [];

  for (let i = 0; i < puzzleSize * puzzleSize; i++) {
    pieces.push(i);
  }

  do {
    shuffleArray(pieces);
  } while (pieces.every((val, idx) => val === idx)); // S'assurer que ce n’est pas déjà bon

  pieces.forEach((val, idx) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    const x = val % puzzleSize;
    const y = Math.floor(val / puzzleSize);
    tile.style.backgroundPosition = `-${x * 100}px -${y * 100}px`;
    tile.dataset.index = idx;
    tile.dataset.value = val;
    tile.addEventListener("click", handleClick);
    container.appendChild(tile);
  });
}

let firstTile = null;

function handleClick(e) {
  clickSound.play();
  const tile = e.currentTarget;
  if (!firstTile) {
    firstTile = tile;
    tile.style.outline = "2px solid red";
  } else if (tile !== firstTile) {
    swapSound.play();
    const idx1 = +firstTile.dataset.index;
    const idx2 = +tile.dataset.index;
    const val1 = firstTile.dataset.value;
    const val2 = tile.dataset.value;

    // Échanger les positions
    [pieces[idx1], pieces[idx2]] = [pieces[idx2], pieces[idx1]];
    firstTile.dataset.value = val2;
    tile.dataset.value = val1;

    updateTiles();
    moves++;
    document.getElementById("moves").textContent = moves;
    checkWin();

    firstTile.style.outline = "none";
    firstTile = null;
  }
}

function updateTiles() {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile, idx) => {
    const val = pieces[idx];
    const x = val % puzzleSize;
    const y = Math.floor(val / puzzleSize);
    tile.style.backgroundPosition = `-${x * 100}px -${y * 100}px`;
    tile.dataset.value = val;
  });
}

function checkWin() {
  const won = pieces.every((val, idx) => val === idx);
  if (won) {
    clearInterval(timerInterval);
    score = 1000 - moves * 10 + Math.max(0, 600 - seconds);
    document.getElementById("score").textContent = score;
    document.getElementById("message").classList.remove("hidden");
    winSound.play();
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
