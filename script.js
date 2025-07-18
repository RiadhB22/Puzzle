let playerName = "";
let timerInterval;
let seconds = 0;
let moves = 0;
let score = 0;
const size = 3;
const image = "Puzzle/Files/cat.jpg";
const clickSound = new Audio("Puzzle/Files/click.mp3");
const swapSound = new Audio("Puzzle/Files/swap.mp3");
const winSound = new Audio("Puzzle/Files/win.mp3");

function startGame() {
  playerName = document.getElementById("player-name").value.trim();
  if (!playerName) return alert("Entrez votre nom !");
  document.getElementById("name-display").textContent = playerName;
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-ui").classList.remove("hidden");
  initPuzzle();
  startTimer();
}

function initPuzzle() {
  const board = document.getElementById("puzzle-board");
  board.innerHTML = "";
  let positions = Array.from({ length: size * size }, (_, i) => i);
  do {
    shuffleArray(positions);
  } while (positions.some((val, idx) => val === idx));

  positions.forEach((pos, idx) => {
    const x = pos % size;
    const y = Math.floor(pos / size);
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.index = idx;
    piece.style.backgroundImage = `url(${image})`;
    piece.style.backgroundPosition = `${(x * 100) / (size - 1)}% ${(y * 100) / (size - 1)}%`;
    piece.addEventListener("click", handlePieceClick);
    board.appendChild(piece);
  });

  moves = 0;
  score = 0;
  seconds = 0;
  updateUI();
}

let firstPiece = null;

function handlePieceClick(e) {
  clickSound.play();
  const clicked = e.currentTarget;
  if (firstPiece === null) {
    firstPiece = clicked;
    clicked.style.outline = "2px solid red";
  } else if (clicked !== firstPiece) {
    swapSound.play();
    const i1 = [...clicked.parentNode.children].indexOf(firstPiece);
    const i2 = [...clicked.parentNode.children].indexOf(clicked);

    const temp = firstPiece.style.backgroundPosition;
    firstPiece.style.backgroundPosition = clicked.style.backgroundPosition;
    clicked.style.backgroundPosition = temp;

    firstPiece.style.outline = "none";
    firstPiece = null;
    moves++;
    updateUI();
    checkWin();
  }
}

function checkWin() {
  const pieces = document.querySelectorAll(".piece");
  const correct = Array.from(pieces).every((piece, idx) => {
    const x = idx % size;
    const y = Math.floor(idx / size);
    const expected = `${(x * 100) / (size - 1)}% ${(y * 100) / (size - 1)}%`;
    return piece.style.backgroundPosition === expected;
  });

  if (correct) {
    winSound.play();
    document.getElementById("message").classList.remove("hidden");
    document.getElementById("nextBtn").disabled = false;
    score = 1000 - moves * 10;
    updateUI();
    clearInterval(timerInterval);
  }
}

function restartGame() {
  document.getElementById("message").classList.add("hidden");
  document.getElementById("nextBtn").disabled = true;
  firstPiece = null;
  initPuzzle();
  startTimer();
}

function goToLevel2() {
  alert("Passage au niveau 2 (à implémenter).");
}

function updateUI() {
  document.getElementById("moves").textContent = moves;
  document.getElementById("score").textContent = score;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${m}:${s}`;
  }, 1000);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
