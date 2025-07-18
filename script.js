const puzzleContainer = document.getElementById("puzzle-container");
const victoryMessage = document.getElementById("victory-message");
const nameDisplay = document.getElementById("nameDisplay");
const scoreSpan = document.getElementById("score");
const movesSpan = document.getElementById("moves");
const timerSpan = document.getElementById("timer");
const nextLevelBtn = document.getElementById("nextLevelBtn");

let pieces = [];
let moveCount = 0;
let timer = null;
let seconds = 0;
let selected = [];

const clickSound = new Audio("Files/click.mp3");
const swapSound = new Audio("Files/swap.mp3");
const winSound = new Audio("Files/win.mp3");

function startGame() {
  const playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Entrez votre nom");
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-info").style.display = "block";
  nameDisplay.textContent = playerName;
  victoryMessage.style.display = "none";
  moveCount = 0;
  movesSpan.textContent = "0";
  scoreSpan.textContent = "0";
  selected = [];
  seconds = 0;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
  generatePuzzle();
}

function updateTimer() {
  seconds++;
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  timerSpan.textContent = `${min}:${sec}`;
}

function generatePuzzle() {
  puzzleContainer.innerHTML = "";
  pieces = [];

  for (let i = 0; i < 9; i++) {
    pieces.push(i);
  }

  do {
    shuffleArray(pieces);
  } while (pieces.some((val, idx) => val === idx)); // éviter toute pièce à la bonne place

  for (let i = 0; i < 9; i++) {
    const div = document.createElement("div");
    div.classList.add("puzzle-piece");
    div.style.backgroundImage = "url('Files/cat.jpg')";
    div.style.backgroundPosition = `${(pieces[i] % 3) * -100}% ${(Math.floor(pieces[i] / 3)) * -100}%`;
    div.dataset.index = i;
    div.addEventListener("click", () => selectPiece(div));
    puzzleContainer.appendChild(div);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function selectPiece(piece) {
  clickSound.play();
  if (selected.length < 2 && !selected.includes(piece)) {
    selected.push(piece);
    piece.style.outline = "2px solid red";
    if (selected.length === 2) {
      setTimeout(() => {
        swapSound.play();
        swapPieces(selected[0], selected[1]);
        selected[0].style.outline = "none";
        selected[1].style.outline = "none";
        selected = [];
        moveCount++;
        movesSpan.textContent = moveCount;
        checkWin();
      }, 300);
    }
  }
}

function swapPieces(p1, p2) {
  const idx1 = p1.dataset.index;
  const idx2 = p2.dataset.index;
  const bg1 = p1.style.backgroundPosition;
  const bg2 = p2.style.backgroundPosition;
  p1.style.backgroundPosition = bg2;
  p2.style.backgroundPosition = bg1;
  [pieces[idx1], pieces[idx2]] = [pieces[idx2], pieces[idx1]];
}

function checkWin() {
  const win = pieces.every((val, idx) => val === idx);
  if (win) {
    clearInterval(timer);
    victoryMessage.style.display = "block";
    winSound.play();
    scoreSpan.textContent = 100 - moveCount;
    nextLevelBtn.disabled = false;
  }
}

function restartGame() {
  nextLevelBtn.disabled = true;
  startGame();
}

function goToNextLevel() {
  alert("Niveau 2 non encore prêt !");
}
