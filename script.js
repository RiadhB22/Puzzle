const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("playerName");
const puzzleContainer = document.getElementById("puzzle");
const playerNameDisplay = document.getElementById("name");
const scoreDisplay = document.getElementById("score");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");
const replayBtn = document.getElementById("replayBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");

let playerName = "";
let score = 0;
let moves = 0;
let timer;
let seconds = 0;
let pieces = [];
let emptyIndex = 8;
let gameStarted = false;

const clickSound = new Audio("files/click.mp3");
const swapSound = new Audio("files/swap.mp3");
const winSound = new Audio("files/win.mp3");

startBtn.addEventListener("click", () => {
  if (!nameInput.value.trim()) return;
  playerName = nameInput.value;
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  playerNameDisplay.textContent = playerName;
  startGame();
});

function startGame() {
  resetGame();
  createPuzzle();
  startTimer();
  gameStarted = true;
}

function resetGame() {
  puzzleContainer.innerHTML = "";
  pieces = [];
  emptyIndex = 8;
  score = 0;
  moves = 0;
  seconds = 0;
  clearInterval(timer);
  scoreDisplay.textContent = score;
  movesDisplay.textContent = moves;
  timerDisplay.textContent = "00:00";
  message.style.display = "none";
}

function createPuzzle() {
  const positions = [...Array(9).keys()];
  do {
    shuffleArray(positions);
  } while (positions.some((pos, i) => pos === i));

  for (let i = 0; i < 9; i++) {
    if (positions[i] === 8) {
      pieces[i] = null;
      emptyIndex = i;
      continue;
    }

    const piece = document.createElement("div");
    piece.className = "piece";
    const x = positions[i] % 3;
    const y = Math.floor(positions[i] / 3);
    piece.style.backgroundImage = "url('files/cat.jpg')";
    piece.style.backgroundPosition = `${-x * 100}px ${-y * 100}px`;
    piece.dataset.index = i;

    piece.addEventListener("click", () => {
      if (!gameStarted) return;
      clickSound.play();
      const idx = parseInt(piece.dataset.index);
      if (isAdjacent(idx, emptyIndex)) {
        swapSound.play();
        swapPieces(idx, emptyIndex);
        moves++;
        movesDisplay.textContent = moves;
        checkWin();
      }
    });

    pieces[i] = piece;
    puzzleContainer.appendChild(piece);
  }
}

function swapPieces(fromIdx, toIdx) {
  const piece = pieces[fromIdx];
  pieces[toIdx] = piece;
  pieces[fromIdx] = null;
  emptyIndex = fromIdx;
  updatePuzzle();
}

function updatePuzzle() {
  puzzleContainer.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    if (pieces[i]) {
      pieces[i].dataset.index = i;
      puzzleContainer.appendChild(pieces[i]);
    } else {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "piece empty";
      puzzleContainer.appendChild(emptyDiv);
    }
  }
}

function isAdjacent(i, j) {
  const x1 = i % 3, y1 = Math.floor(i / 3);
  const x2 = j % 3, y2 = Math.floor(j / 3);
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

function checkWin() {
  let won = true;
  for (let i = 0; i < 8; i++) {
    const piece = pieces[i];
    if (!piece) { won = false; break; }
    const bgPos = piece.style.backgroundPosition.split(" ");
    const x = -parseInt(bgPos[0]) / 100;
    const y = -parseInt(bgPos[1]) / 100;
    const correctIndex = y * 3 + x;
    if (correctIndex !== i) {
      won = false;
      break;
    }
  }

  if (won) {
    gameStarted = false;
    clearInterval(timer);
    score = 1000 - moves * 10;
    scoreDisplay.textContent = score;
    message.style.display = "block";
    winSound.play();
  }
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    timerDisplay.textContent = `${min}:${sec}`;
  }, 1000);
}

replayBtn.addEventListener("click", startGame);
nextLevelBtn.addEventListener("click", () => {
  alert("Niveau 2 bientôt !");
});

// utilitaire : mélange tableau
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
