document.addEventListener("DOMContentLoaded", function () {
  const board = document.getElementById("puzzle-board");
  const startButton = document.getElementById("start-btn");
  const restartButton = document.getElementById("restart-btn");
  const nextButton = document.getElementById("next-btn");
  const messageBox = document.getElementById("message-box");
  const playerNameInput = document.getElementById("player-name");
  const playerInfo = document.getElementById("player-info");

  const gridSize = 3; // 3x3 pour niveau 1
  const imageSrc = "Files/cat.jpg";
  let score = 0;
  let firstSelection = null;
  let pieces = [];

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function updateScore(isCorrect) {
    score += isCorrect ? 5 : -1;
    if (score < 0) score = 0;
    playerInfo.textContent = `${playerNameInput.value} | Score : ${score}`;
  }

  function checkCompletion() {
    const correct = pieces.every((piece, index) => +piece.dataset.index === index);
    if (correct) {
      messageBox.textContent = "Bravo ! Niveau terminé.";
      messageBox.style.display = "block";
      nextButton.disabled = false;
      restartButton.disabled = false;
      board.style.pointerEvents = "none";
    }
  }

  function swapPieces(piece1, piece2) {
    const tempIndex = piece1.dataset.index;
    piece1.dataset.index = piece2.dataset.index;
    piece2.dataset.index = tempIndex;

    const tempBg = piece1.style.backgroundPosition;
    piece1.style.backgroundPosition = piece2.style.backgroundPosition;
    piece2.style.backgroundPosition = tempBg;

    board.insertBefore(piece1, piece2);
    board.insertBefore(piece2, piece1);
  }

  function createBoard() {
    board.innerHTML = "";
    pieces = [];
    const total = gridSize * gridSize;
    let positions = Array.from({ length: total }, (_, i) => i);
    positions = shuffle(positions);

    for (let i = 0; i < total; i++) {
      const piece = document.createElement("div");
      const x = i % gridSize;
      const y = Math.floor(i / gridSize);

      piece.classList.add("piece");
      piece.style.backgroundImage = `url('${imageSrc}')`;
      piece.style.backgroundSize = `${gridSize * 100}%`;
      piece.style.backgroundPosition = `-${(positions[i] % gridSize) * 100}% -${Math.floor(positions[i] / gridSize) * 100}%`;
      piece.dataset.index = positions[i];

      piece.addEventListener("click", function () {
        if (!firstSelection) {
          firstSelection = piece;
          piece.style.outline = "2px solid red";
        } else if (piece !== firstSelection) {
          swapPieces(firstSelection, piece);
          updateScore(+firstSelection.dataset.index === +piece.dataset.index);
          firstSelection.style.outline = "none";
          firstSelection = null;
          checkCompletion();
        }
      });

      board.appendChild(piece);
      pieces.push(piece);
    }
  }

  startButton.addEventListener("click", function () {
    if (!playerNameInput.value.trim()) {
      alert("Veuillez entrer votre nom.");
      return;
    }
    startButton.style.display = "none";
    playerNameInput.style.display = "none";
    playerInfo.textContent = `${playerNameInput.value} | Score : 0`;
    score = 0;
    createBoard();
    restartButton.disabled = false;
    nextButton.disabled = true;
    board.style.pointerEvents = "auto";
    messageBox.style.display = "none";
  });

  restartButton.addEventListener("click", function () {
    firstSelection = null;
    messageBox.style.display = "none";
    score = 0;
    playerInfo.textContent = `${playerNameInput.value} | Score : 0`;
    createBoard();
    nextButton.disabled = true;
    board.style.pointerEvents = "auto";
  });

  nextButton.addEventListener("click", function () {
    alert("Prochaine étape à venir...");
    // redirection ou changement de niveau ici si souhaité
  });
});
