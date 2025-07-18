const puzzle = document.getElementById("puzzle");
const timerEl = document.getElementById("timer");
const playerDisplay = document.getElementById("displayName");
const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const winMessage = document.getElementById("winMessage");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const gameInfo = document.querySelector(".game-info");
const buttons = document.querySelector(".buttons");

let pieces = [];
let emptyIndex = 8;
let moveCount = 0;
let score = 0;
let startTime;
let timerInterval;
let playerName = "";

const clickSound = new Audio("Puzzle/Files/click.mp3");
const swapSound = new Audio("Puzzle/Files/swap.mp3");
const winSound = new Audio("Puzzle/Files/win.mp3");

function startGame() {
  const nameInput = document.getElementById("playerName").value.trim();
  if (!nameInput) return alert("Entrez un nom");
  playerName = nameInput;
  playerDisplay.textContent = playerName;
  gameInfo.style.display = "block";
  buttons.style.display = "block";
  document.querySelector(".player-input").style.display = "none";

  initPuzzle();
  startTimer();
}

function initPuzzle() {
  pieces = Array.from({ length: 9 }, (_, i) => i);
  do {
    shuffleArray(pieces);
  } while (isSolved(pieces));

  puzzle.innerHTML = "";
  pieces.forEach((num, idx) => {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.style.backgroundImage = "url('Puzzle/Files/cat.jpg')";
    piece.style.backgroundPosition = `${(num % 3) * -100}% ${(Math.floor(num / 3)) * -100}%`;
    piece.addEventListener("click", () => handleClick(idx));
    puzzle.appendChild(piece);
  });

  moveCount = 0;
  score = 0;
  updateStats();
  winMessage.textContent = "";
  nextLevelBtn.disabled = true;
}

function handleClick(index) {
  clickSound.play();
  if (isAdjacent(index, emptyIndex)) {
    swapSound.play();
    [pieces[index], pieces[emptyIndex]] = [pieces[emptyIndex], pieces[index]];
    updateGrid();
    emptyIndex = index;
    moveCount++;
    updateStats();
    if (isSolved(pieces)) {
      win();
    }
  }
}

function updateGrid() {
  const allPieces = document.querySelectorAll(".piece");
  allPieces.forEach((el, idx) => {
    const num = pieces[idx];
    el.style.backgroundPosition = `${(num % 3) * -100}% ${(Math.floor(num / 3)) * -100}%`;
  });
}

function updateStats() {
  movesEl.textContent = moveCount;
  scoreEl.textContent = 100 - moveCount * 2;
}

function isSolved(arr) {
  return arr.every((v, i) => v === i);
}

function isAdjacent(i1, i2) {
  const x1 = i1 % 3, y1 = Math.floor(i1 / 3);
  const x2 = i2 % 3, y2 = Math.floor(i2 / 3);
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function win() {
  winSound.play();
  winMessage.textContent = "🎉 Bravo ! Puzzle réussi 🎉";
  clearInterval(timerInterval);
  nextLevelBtn.disabled = false;
}

function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const min = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const sec = String(elapsed % 60).padStart(2, "0");
    timerEl.textContent = `${min}:${sec}`;
  }, 1000);
}

function resetGame() {
  initPuzzle();
  startTimer();
}

function goToNextLevel() {
  alert("Le niveau 2 sera ajouté bientôt !");
}
