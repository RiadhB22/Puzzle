const puzzleBoard = document.getElementById("puzzle-board");
const message = document.getElementById("message");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const displayName = document.getElementById("display-name");
const startBtn = document.getElementById("start-btn");
const playerNameInput = document.getElementById("player-name");
const startScreen = document.getElementById("start-screen");
const gameUI = document.getElementById("game-ui");
const replayBtn = document.getElementById("replay-btn");
const nextBtn = document.getElementById("next-btn");

let pieces = [];
let emptyIndex;
let moves = 0;
let score = 0;
let startTime;
let timerInterval;
let selectedPiece = null;

const imageURL = "files/cat.jpg"; // assure-toi que ce fichier existe
const size = 3; // 3x3 puzzle

function startGame() {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Entrez votre nom pour commencer !");
    return;
  }

  displayName.textContent = name;
  startScreen.classList.add("hidden");
  gameUI.classList.remove("hidden");

  resetGame();
}

function resetGame() {
  clearInterval(timerInterval);
  startTime = new Date();
  timerInterval = setInterval(updateTimer, 1000);

  moves = 0;
  score = 0;
  updateScoreMoves();

  pieces = [];
  puzzleBoard.innerHTML = "";
  for (let i = 0; i < size * size; i++) {
    pieces.push(i);
  }

  do {
    shuffleArray(pieces);
  } while (!ensureNotSolved());

  pieces.forEach((val, i) => {
    const div = document.createElement("div");
    div.classList.add("piece");
    div.dataset.index = i;
    div.dataset.value = val;
    setPieceBackground(div, val);
    div.addEventListener("click", () => onPieceClick(div));
    puzzleBoard.appendChild(div);
  });

  message.classList.add("hidden");
}

function setPieceBackground(div, index) {
  const x = index % size;
  const y = Math.floor(index / size);
  div.style.backgroundImage = `url(${imageURL})`;
  div.style.backgroundPosition = `${(-x * 100) / (size - 1)}% ${(-y * 100) / (size - 1)}%`;
}

function onPieceClick(div) {
  if (message.classList.contains("hidden") === false) return;

  playSound("click");

  if (!selectedPiece) {
    selectedPiece = div;
    div.style.border = "2px solid red";
  } else {
    if (selectedPiece === div) return;

    playSound("swap");
    swapPieces(selectedPiece, div);
    selectedPiece.style.border = "1px solid #ccc";
    selectedPiece = null;

    moves++;
    updateScoreMoves();

    if (checkWin()) {
      clearInterval(timerInterval);
      message.classList.remove("hidden");
      playSound("win");
    }
  }
}

function swapPieces(div1, div2) {
  const val1 = div1.dataset.value;
  const val2 = div2.dataset.value;

  div1.dataset.value = val2;
  div2.dataset.value = val1;

  setPieceBackground(div1, val2);
  setPieceBackground(div2, val1);
}

function updateScoreMoves() {
  scoreEl.textContent = score;
  movesEl.textContent = moves;
}

function updateTimer() {
  const now = new Date();
  const diff = Math.floor((now - startTime) / 1000);
  const min = String(Math.floor(diff / 60)).padStart(2, "0");
  const sec = String(diff % 60).padStart(2, "0");
  timerEl.textContent = `${min}:${sec}`;
}

function checkWin() {
  const all = document.querySelectorAll(".piece");
  for (let i = 0; i < all.length; i++) {
    if (parseInt(all[i].dataset.value) !== i) return false;
  }
  return true;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function ensureNotSolved() {
  return pieces.some((val, index) => val !== index);
}

function playSound(type) {
  const sound = new Audio();
  if (type === "click") sound.src = "files/click.mp3";
  else if (type === "swap") sound.src = "files/swap.mp3";
  else if (type === "win") sound.src = "files/win.mp3";
  sound.play();
}

startBtn.addEventListener("click", startGame);
replayBtn.addEventListener("click", resetGame);
nextBtn.addEventListener("click", () => alert("Niveau 2 en cours de développement !"));
