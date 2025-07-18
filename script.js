const container = document.getElementById("puzzle-container");
const message = document.getElementById("message");
const scoreSpan = document.getElementById("score");
const movesSpan = document.getElementById("moves");
const timerSpan = document.getElementById("timer");

let pieces = [];
let firstPiece = null;
let moves = 0;
let score = 0;
let timer = 0;
let interval;

function createPuzzle() {
  const indices = [...Array(9).keys()];

  // Mélange en s'assurant qu'aucune pièce ne soit à sa position correcte
  let shuffled;
  do {
    shuffled = indices.slice().sort(() => Math.random() - 0.5);
  } while (shuffled.some((val, i) => val === i));

  container.innerHTML = "";

  shuffled.forEach((index) => {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.index = index;
    piece.style.backgroundImage = "url('files/cat.jpg')";
    const row = Math.floor(index / 3);
    const col = index % 3;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
    container.appendChild(piece);
  });

  pieces = Array.from(document.getElementsByClassName("piece"));
  pieces.forEach(p => p.addEventListener("click", () => handleClick(p)));

  // Reset
  moves = 0;
  score = 0;
  timer = 0;
  updateDisplay();
  clearInterval(interval);
  interval = setInterval(updateTimer, 1000);
  message.style.display = "none";
}

function handleClick(piece) {
  if (!firstPiece) {
    firstPiece = piece;
    piece.style.outline = "2px solid blue";
  } else if (piece !== firstPiece) {
    piece.style.outline = "2px solid red";
    swap(firstPiece, piece);
    firstPiece.style.outline = "";
    piece.style.outline = "";
    firstPiece = null;
    moves++;
    checkWin();
    updateDisplay();
  }
}

function swap(p1, p2) {
  const tempIndex = p1.dataset.index;
  p1.dataset.index = p2.dataset.index;
  p2.dataset.index = tempIndex;

  const tempStyle = p1.style.backgroundPosition;
  p1.style.backgroundPosition = p2.style.backgroundPosition;
  p2.style.backgroundPosition = tempStyle;
}

function checkWin() {
  let correct = 0;
  pieces.forEach((piece, i) => {
    if (parseInt(piece.dataset.index) === i) correct++;
  });

  score = correct;

  if (correct === 9) {
    clearInterval(interval);
    message.style.display = "block";
  }
}

function updateTimer() {
  timer++;
  const min = String(Math.floor(timer / 60)).padStart(2, "0");
  const sec = String(timer % 60).padStart(2, "0");
  timerSpan.textContent = `${min}:${sec}`;
}

function updateDisplay() {
  scoreSpan.textContent = score;
  movesSpan.textContent = moves;
}

window.onload = createPuzzle;
