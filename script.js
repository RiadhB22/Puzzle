<script>
    const board = document.getElementById("puzzle-board");
    const startBtn = document.getElementById("start-button");
    const restartBtn = document.getElementById("restart-button");
    const nextLevelBtn = document.getElementById("next-level-button");
    const playerNameInput = document.getElementById("player-name");
    const playerDisplay = document.getElementById("player-display");
    const playerInfo = document.getElementById("player-info");
    const levelControls = document.querySelector(".level-controls");
    const startSection = document.getElementById("start-section");
    const congratsMessage = document.getElementById("congrats-message");
    const scoreDisplay = document.getElementById("score");

    const gridSize = 3;
    const imageSrc = "Files/cat.jpg";
    let pieces = [];
    let firstClick = null;
    let score = 0;

    function createPuzzlePieces() {
      board.innerHTML = "";
      pieces = [];
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const piece = document.createElement("img");
          piece.classList.add("puzzle-piece");
          const x = (100 / (gridSize - 1)) * col;
          const y = (100 / (gridSize - 1)) * row;
          piece.style.objectPosition = `-${x}% -${y}%`;
          piece.dataset.index = row * gridSize + col;
          piece.src = imageSrc;
          pieces.push(piece);
        }
      }

      shuffleArray(pieces);
      pieces.forEach(p => board.appendChild(p));
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function checkWin() {
      for (let i = 0; i < pieces.length; i++) {
        if (parseInt(pieces[i].dataset.index) !== i) return false;
      }
      return true;
    }

    function showCongrats() {
      congratsMessage.style.display = "block";
      nextLevelBtn.disabled = false;
    }

    function swapPieces(p1, p2) {
      const temp = document.createElement("div");
      board.replaceChild(temp, p1);
      board.replaceChild(p1, p2);
      board.replaceChild(p2, temp);
    }

    board.addEventListener("click", (e) => {
      if (!e.target.classList.contains("puzzle-piece") || congratsMessage.style.display !== "none") return;
      if (!firstClick) {
        firstClick = e.target;
        e.target.style.border = "2px solid red";
      } else {
        const secondClick = e.target;
        firstClick.style.border = "none";
        if (firstClick !== secondClick) {
          swapPieces(firstClick, secondClick);
          const children = Array.from(board.children);
          children.forEach((child, idx) => child.dataset.indexCurrent = idx);
          score += parseInt(firstClick.dataset.index) === children.indexOf(firstClick) ? 5 : -1;
          scoreDisplay.textContent = `Score : ${score}`;
        }
        firstClick = null;

        if (checkWin()) {
          showCongrats();
        }
      }
    });

    startBtn.onclick = () => {
      const name = playerNameInput.value.trim();
      if (!name) return;
      playerDisplay.textContent = `👤 ${name}`;
      startSection.style.display = "none";
      playerInfo.style.display = "flex";
      levelControls.style.display = "flex";
      score = 0;
      scoreDisplay.textContent = "Score : 0";
      createPuzzlePieces();
    };

    restartBtn.onclick = () => {
      score = 0;
      scoreDisplay.textContent = "Score : 0";
      congratsMessage.style.display = "none";
      nextLevelBtn.disabled = true;
      createPuzzlePieces();
    };

    nextLevelBtn.onclick = () => {
      alert("Niveau 2 non encore disponible");
    };
  </script>
