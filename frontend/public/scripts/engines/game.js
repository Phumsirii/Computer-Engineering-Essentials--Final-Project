import { drawing, startGame } from "../api/rooms.js";
import { BACKEND_URL } from "../config.js";
import {
  displayPlayersInRoom,
  renderRoomStatus,
  renderWord,
  renderPlayerScoreSummary,
  renderGuessedWord,
  renderStartButton,
} from "../eventListeners/handleRoom.js";
import { getProfile } from "../api/authentication.js";

export let roomInfo = {};

export let isDrawer = false;

export const setRoomInfo = (info) => {
  roomInfo = info;
};

export const setDrawer = (drawer) => {
  isDrawer = drawer;
};

export const initializeGame = (roomId) => {
  let drawLog = [];
  let newDrawing = [];
  let currentRound = -1;
  let clearCanvas = false;

  document.querySelector("#start-game-button").addEventListener("click", () => {
    startGame(roomId);
  });

  class Game {
    constructor(config = {}) {
      this.phaserConfig = {
        type: Phaser.AUTO,
        parent: config.id ? config.id : "game",
        width: config.width ? config.width : 1280,
        height: config.height ? config.height : 720,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        backgroundColor: "f1f1f1",
        scene: {
          key: "default",
          init: this.initScene,
          create: this.createScene,
          update: this.updateScene,
        },
      };
    }

    async initScene(data) {
      this.strokes = [];
      this.isDrawing = false;
    }
    async createScene() {
      this.graphics = this.add.graphics();
      this.graphics.lineStyle(4, 0x000000);
    }
    async updateScene() {
      if (clearCanvas) {
        this.graphics.clear();
        clearCanvas = false;
      }

      if (isDrawer) {
        if (!this.input.activePointer.isDown && this.isDrawing) {
          this.isDrawing = false;
          drawing(roomId, drawLog);
          drawLog = [];
        } else if (this.input.activePointer.isDown) {
          if (!this.isDrawing) {
            this.path = new Phaser.Curves.Path(
              this.input.activePointer.position.x,
              this.input.activePointer.position.y
            );
            drawLog.push({
              type: "start",
              x: this.input.activePointer.position.x,
              y: this.input.activePointer.position.y,
            });
            this.isDrawing = true;
          } else {
            this.path.lineTo(
              this.input.activePointer.position.x,
              this.input.activePointer.position.y
            );
            drawLog.push({
              type: "continue",
              x: this.input.activePointer.position.x,
              y: this.input.activePointer.position.y,
            });
          }

          this.path.draw(this.graphics);
        }
      } else {
        if (newDrawing.length > 0) {
          newDrawing.forEach((drawing) => {
            if (drawing.type === "start") {
              this.path = new Phaser.Curves.Path(drawing.x, drawing.y);
            } else if (drawing.type === "continue") {
              this.path.lineTo(drawing.x, drawing.y);
              this.path.draw(this.game.scene.scenes[0].graphics);
            }
          });

          newDrawing = [];
        }
      }
    }

    async authenticate() {}
    async joinOrCreateGame(id) {}
    async joinGame(id, authId) {}
    async createGame(id, authId) {
      this.game = new Phaser.Game(this.phaserConfig);
    }
  }

  const game = new Game();
  game.createGame();

  const sse = new EventSource(`${BACKEND_URL}/room/${roomId}/subscribe`);

  sse.onmessage = async (e) => {
    const streamData = JSON.parse(e.data);

    switch (streamData.type) {
      case "status":
        const playerList = streamData.data.playerList;
        displayPlayersInRoom(playerList);

        // Word Management
        const rounds = streamData.data.rounds;
        const status = streamData.data.status;

        if (status === "waiting") renderStartButton(playerList.length, roomId);

        if (rounds.length == 0) return;
        if (currentRound != rounds.length - 1) {
          currentRound = rounds.length - 1;

          const gameContainer = document.getElementById("game-frame-container");
          document.getElementById("game-frame-container").style.height =
            gameContainer.offsetHeight + 1 + "px";

          if (currentRound != -1 && status !== "gameover") {
            document.querySelector("#start-newround-modal").style.display =
              "block";
            setTimeout(() => {
              document.querySelector("#start-newround-modal").style.display =
                "none";
            }, 1000);
          }
        }

        const lastRound = rounds[rounds.length - 1];

        setDrawer(lastRound.drawer.username === (await getProfile()).username);

        // Add Word to DOM
        if (isDrawer) {
          renderWord(lastRound.word.word);
        }

        // Render From Game State
        renderRoomStatus(status, isDrawer);
        if (status === "gameover") renderPlayerScoreSummary(playerList);

        // Render guessed words
        const playerId = (await getProfile())._id;
        const filteredGuessFromPlayer = lastRound.guesses.filter(
          (guess) => guess.player === playerId
        );
        if (!isDrawer) {
          if (filteredGuessFromPlayer.length > 0) {
            renderGuessedWord(true, filteredGuessFromPlayer[0].guess);
          } else {
            renderGuessedWord(false, "");
          }
        }

        break;
      case "draw":
        newDrawing = [...newDrawing, ...streamData.data];
        break;
      case "clear":
        clearCanvas = true;
        drawLog = [];
        newDrawing = [];
        break;
      default:
    }
  };

  sse.onerror = () => {
    sse.close();
  };
};
