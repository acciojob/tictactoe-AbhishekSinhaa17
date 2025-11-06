//your JS code here. If required.
 (function () {
      const submitBtn = document.getElementById("submit");
      const entryDiv = document.getElementById("entry");
      const boardView = document.getElementById("boardView");
      const msgDiv = document.getElementById("message");
      const player1Input = document.getElementById("player-1");
      const player2Input = document.getElementById("player-2");
      const board = document.getElementById("board");
      const restartBtn = document.getElementById("restartBtn");
      const changePlayersBtn = document.getElementById("changePlayersBtn");

      let players = { x: "", o: "" };
      let turn = "x"; 
      let cells = Array(9).fill(null); 
      let gameOver = false;

      const winCombos = [
        [0,1,2],[3,4,5],[6,7,8], 
        [0,3,6],[1,4,7],[2,5,8], 
        [0,4,8],[2,4,6]          
      ];

      function updateMessage() {
        if (gameOver) return;
        const who = (turn === "x") ? players.x : players.o;
        msgDiv.textContent = `${who}, you're up`;
      }

      function showWin(winnerMark) {
        const winnerName = winnerMark === "x" ? players.x : players.o;
        msgDiv.textContent = `${winnerName} congratulations you won!`;
        gameOver = true;
        document.querySelectorAll(".cell").forEach(c => c.classList.add("disabled"));
      }

      function checkWin() {
        for (let combo of winCombos) {
          const [a,b,c] = combo;
          if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            return cells[a]; // 'x' or 'o'
          }
        }
        return null;
      }

      function checkDraw() {
        return cells.every(cell => cell !== null);
      }

      function handleCellClick(e) {
        if (gameOver) return;
        const el = e.currentTarget;
        const idx = Number(el.getAttribute("data-index"));

        if (cells[idx]) return;

        cells[idx] = turn;
        el.textContent = turn === "x" ? "X" : "O";
        el.classList.add("disabled");

        const winner = checkWin();
        if (winner) {
          showWin(winner);
          return;
        }

        if (checkDraw()) {
          msgDiv.textContent = "It's a draw!";
          gameOver = true;
          return;
        }

        turn = (turn === "x") ? "o" : "x";
        updateMessage();
      }

      function attachCellListeners() {
        document.querySelectorAll(".cell").forEach(cell => {
          cell.addEventListener("click", handleCellClick);
        });
      }

      function detachCellListeners() {
        document.querySelectorAll(".cell").forEach(cell => {
          cell.removeEventListener("click", handleCellClick);
        });
      }

      function resetBoard() {
        cells = Array(9).fill(null);
        gameOver = false;
        turn = "x";
        document.querySelectorAll(".cell").forEach(c => {
          c.textContent = "";
          c.classList.remove("disabled");
        });
        updateMessage();
      }

      function startGame() {
        const p1 = player1Input.value.trim() || "Player 1";
        const p2 = player2Input.value.trim() || "Player 2";
        players = { x: p1, o: p2 };

        entryDiv.style.display = "none";
        boardView.style.display = "block";
        boardView.setAttribute("aria-hidden", "false");

        // initialize board
        resetBoard();
      }

      submitBtn.addEventListener("click", function (ev) {
        ev.preventDefault();
        startGame();
      });

      restartBtn.addEventListener("click", function () {
        resetBoard();
      });

      changePlayersBtn.addEventListener("click", function () {
        entryDiv.style.display = "flex";
        boardView.style.display = "none";
        boardView.setAttribute("aria-hidden", "true");
      });

      attachCellListeners();

      [player1Input, player2Input].forEach(inp => {
        inp.addEventListener("keypress", function (ev) {
          if (ev.key === "Enter") {
            ev.preventDefault();
            submitBtn.click();
          }
        });
      });

      window.__ticTacToe = {
        resetBoard,
        getState: () => ({ players, turn, cells, gameOver })
      };
})();