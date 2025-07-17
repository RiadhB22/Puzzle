const container = document.getElementById("puzzle-container");
const message = document.getElementById("message");
const clickSound = document.getElementById("click-sound");
const swapSound = document.getElementById("swap-sound");
const winSound = document.getElementById("win-sound");

const gridSize = 3;
const pieces = [];

function shuffleArray(array) {
  let newArr = array.slice();
  do {
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
  } while (newArr.every((val, index) => val === index));
  return newArr;
}

function createPuzzle() {
  container.innerHTML = "";
  let indexes = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  let shuffled = shuffleArray(indexes);

  shuffled.forEach((index, i) => {
    const piece = document.createElement("button");
    piece.classList.add("piece");
    piece.style.backgroundImage = "url('files/image1.jpg')";
    piece.style.backgroundPosition = `-${(index % gridSize) * 100}px -${Math.floor(index / gridSize) * 100}px`;
    piece.dataset.index = index;
    piece.dataset.current = i;
    piece.addEventListener("click", () => handlePieceClick(piece));
    container.appendChild(piece);
    pieces.push(piece);
  });
}

let firstPiece = null;

function handlePieceClick(piece) {
  clickSound.play();
  if (!firstPiece) {
    firstPiece = piece;
    piece.style.outline = "3px solid #3498db";
  } else if (piece !== firstPiece) {
    swapSound.play();
    piece.style.outline = "3px solid #e74c3c";

    setTimeout(() => {
      swapPieces(firstPiece, piece);
      firstPiece.style.outline = "";
      piece.style.outline = "";
      firstPiece = null;
      checkWin();
    }, 400);
  }
}

function swapPieces(p1, p2) {
  const temp = p1.dataset.index;
  p1.dataset.index = p2.dataset.index;
  p2.dataset.index = temp;

  p1.style.backgroundPosition = getPosition(p1.dataset.index);
  p2.style.backgroundPosition = getPosition(p2.dataset.index);
}

function getPosition(index) {
  const x = (index % gridSize) * 100;
  const y = Math.floor(index / gridSize) * 100;
  return `-${x}px -${y}px`;
}

function checkWin() {
  const correct = pieces.every((p, i) => parseInt(p.dataset.index) === i);
  if (correct) {
    winSound.play();
    message.style.display = "block";
    container.style.pointerEvents = "none";

    setTimeout(() => {
      message.style.display = "none";
      container.style.pointerEvents = "auto";
      nextLevel(); // À personnaliser
    }, 3000);
  }
}

function nextLevel() {
  alert("🚀 Passage au niveau suivant (non encore implémenté) !");
  // Tu peux charger une nouvelle image ici pour le niveau 2
}

createPuzzle();
