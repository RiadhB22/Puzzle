let playerName = "";
let startTime, timerInterval;
let score = 0;
let moves = 0;
let gridSize = 3;
let pieces = [];
let emptyIndex = -1;
let isStarted = false;
let isWon = false;

// Sons
const clickSound = new Audio("Puzzle/Files/click.mp3");
const swapSound = new Audio("Puzzle/Files/swap.mp3");
const winSound = new Audio("Puzzle/Files/win.mp3");

function $(id) {
  return document.getElementById(id);
}

function startGame() {
  const nameInput = $("name-input").value.trim();
  if (!nameInput) return;
  playerName = nameInput;
  $("player-name").textContent = playerName;
  $("start-screen").classList.add("hidden");
  $("game-screen").classList.remove("hidden");

  isStarted = true;
  isWon = false;
  moves = 0;
  score = 0;
  $("moves").textContent = moves;
  $("score").textContent = score;
  $("win-message").classList.add("hidden");
  $("next-btn").disabled = true;

  startTimer();
  initPuzzle();
}

function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    $("timer").textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function initPuzzle() {
  const container = $("puzzle-container");
  container.innerHTML = "";
  const indices = shuffle(Array.from({ length: gridSize * gridSize }, (_, i) => i));
  while (!isValidShuffle(indices)) {
    indices = shuffle(indices);
  }
  pieces = indices;

  const bgSize = `${gridSize * 100}%`;
  indices.forEach((index, i) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    const piece = document.createElement("div");
    piece.className = "piece";
    piece.style.backgroundImage = 'url("Puzzle/Files/cat.jpg")';
    piece.style.backgroundSize = bgSize;
    piece.style.backgroundPosition = `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`;
    piece.dataset.index = i;
    piece.addEventListener("click", onPieceClick);
    container.appendChild(piece);
  });
}

function shuffle(array) {
  let a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isValidShuffle(arr) {
  return arr.some((val, idx) => val !== idx);
}

let selectedIndex = null;

function onPieceClick(e) {
  if (!isStarted || isWon) return;
  clickSound.play();

  const index = parseInt(e.target.dataset.index);
  if (selectedIndex === null) {
    selectedIndex = index;
    highlightPiece(index);
  } else if (selectedIndex !== index) {
    swapSound.play();
    swapPieces(selectedIndex, index);
    moves++;
    $("moves").textContent = moves;
    selectedIndex = null;
    updatePuzzle();

    if (checkWin()) {
      isWon = true;
      winSound.play();
      $("win-message").classList.remove("hidden");
      clearInterval(timerInterval);
      $("score").textContent = 100 - moves;
      $("next-btn").disabled = false;
    }
  } else {
    selectedIndex = null;
    clearHighlights();
  }
}

function highlightPiece(index) {
  clearHighlights();
  const piece = document.querySelector(`.piece[data-index='${index}']`);
  if (piece) piece.style.border = "2px solid red";
}

function clearHighlights() {
  document.querySelectorAll(".piece").forEach(p => {
    p.style.border = "1px solid #ccc";
  });
}

function swapPieces(i, j) {
  [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
}

function updatePuzzle() {
  const container = $("puzzle-container");
  container.childNodes.forEach((piece, i) => {
    const index = pieces[i];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    piece.style.backgroundPosition = `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`;
  });
}

function checkWin() {
  return pieces.every((val, idx) => val === idx);
}

function resetGame() {
  $("name-input").value = "";
  $("start-screen").classList.remove("hidden");
  $("game-screen").classList.add("hidden");
  clearInterval(timerInterval);
  $("timer").textContent = "00:00";
}

function goToLevel2() {
  alert("🚧 Niveau 2 en développement !");
}

window.addEventListener("DOMContentLoaded", () => {
  $("start-btn").addEventListener("click", startGame);
  $("replay-btn").addEventListener("click", startGame);
  $("next-btn").addEventListener("click", goToLevel2);
});
