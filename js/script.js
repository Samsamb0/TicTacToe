let players;
let currentIndexPlayer;
let gameOver;
let gameboard;
let previousPlayerIndex;
const Gameboard = (() => {
  gameboard = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    let boardHtml = document.querySelector("#gameboard");
    let board = "";
    gameboard.forEach((item, index) => {
      board += `<div class="square" id ="${index}">${item}</div>`;
    });
    boardHtml.innerHTML = board;
    let square = document.querySelectorAll(".square");
    square.forEach((item, index) => {
      item.addEventListener("click", Game.clickPlay);
    });
    start.disabled = true;
  };

  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => {
    return gameboard;
  };
  return {
    render,
    update,
    getGameboard,
  };
})();

const createPlayers = (name, marker) => {
  return {
    name,
    marker,
  };
};

const Game = (() => {
  const start = () => {
    players = [
      createPlayers(document.querySelector("#player1").value, "X"),
      createPlayers(document.querySelector("#player2").value, "O"),
    ];
    currentIndexPlayer = 0;
    gameOver = false;
    Gameboard.render();
  };

  const restart = () => {
    let gameboard = Gameboard.getGameboard();
    gameboard.forEach((item, index) => {
      gameboard[index] = "";
      gameOver = false;
      currentIndexPlayer = 0;
      Gameboard.render();
    });
  };

  const clickPlay = (e) => {
    if (gameOver) {
      return;
    }

    let index = e.target.id;
    if (Gameboard.getGameboard()[index] !== "") {
      return;
    } else {
      Gameboard.update(index, players[currentIndexPlayer].marker);
      previousPlayerIndex = currentIndexPlayer; // Stocker la valeur précédente de currentIndexPlayer

      if (currentIndexPlayer == 0) {
        currentIndexPlayer = 1;
      } else {
        currentIndexPlayer = 0;
      }
    }
    if (Game.win(Gameboard.getGameboard())) {
      setTimeout(() => {
        winAlert(players[previousPlayerIndex]);
      }, 0);
    } else if (Game.tie(Gameboard.getGameboard())) {
      setTimeout(() => {
        tieAlert();
      }, 0);
    }
  };

  const win = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [0, 3, 6],
      [3, 4, 5],
      [6, 7, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [0, 4, 8],
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
      const combination = winningCombinations[i];
      if (
        board[combination[0]] !== "" &&
        board[combination[0]] === board[combination[1]] &&
        board[combination[0]] === board[combination[2]]
      ) {
        gameOver = true;

        return true;
      }
    }

    return false;
  };

  const tie = (board) => {
    let i = 0;
    for (let item of board) {
      if (item != "") {
        i++;
      }
    }
    if (i == 9) {
      return true;
    } else {
      return false;
    }
  };
  const winAlert = (players) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: `${players.name} won`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const tieAlert = () => {
    Swal.fire({
      position: "center",
      icon: "question",
      title: `It is a Tie`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return {
    clickPlay,
    start,
    win,
    tie,
    restart,
  };
})();

let start = document.querySelector("#start");
start.addEventListener("click", Game.start);

let restart = document.querySelector("#restart");
restart.addEventListener("click", Game.restart);
