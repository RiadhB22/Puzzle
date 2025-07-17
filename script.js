const container = document.getElementById("container");
const message = document.getElementById("message");
const imagePath = "files/puzzle.jpg"; // Ton image dans le dossier files/
const size = 3; // 3x3

let pieces = [];
let firstPiece = null;

function createPieces() {
  const order = [...Array(size * size).keys()];
  shuffle(order);

  for (let i = 0; i < order.length; i++) {
    const piece = document.createElement("div");
    piece.classList.add("piece");

    const row = Math.floor(order[i] / size);
    const col = order[i] % size;

    piece.style.backgroundImage = `url('${imagePath}')`;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
    piece.dataset.index = i;

    container.appendChild(piece);
    pieces.push(piece);

    piece.addEventListener("click", () => handlePieceClick(piece));
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  // Re-shuffle si une pièce est à sa bonne place
  if (array.some((val, i) => val === i)) {
    shuffle(array);
  }
}

function handlePieceClick(piece) {
  if (!firstPiece) {
    firstPiece = piece;
    piece.style.outline = "3px solid #3498db";
  } else if (piece !== firstPiece) {
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
  const temp = p1.style.backgroundPosition;
  p1.style.backgroundPosition = p2.style.backgroundPosition;
  p2.style.backgroundPosition = temp;

  const tempIndex = p1.dataset.index;
  p1.dataset.index = p2.dataset.index;
  p2.dataset.index = tempIndex;
}

function checkWin() {
  const correct = pieces.every((p, i) => parseInt(p.dataset.index) === i);
  if (correct) {
    message.style.display = "block";
    container.style.pointerEvents = "none";
  }
}

createPieces();
