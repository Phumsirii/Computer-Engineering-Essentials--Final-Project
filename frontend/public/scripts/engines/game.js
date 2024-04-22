import { drawing } from "../api/rooms.js";
import { BACKEND_URL } from "../config.js";
import {
  displayPlayersInRoom,
  renderRoomStatus,
  renderWord,
  renderPlayerScoreSummary,
} from "../eventListeners/handleRoom.js";
import { roomId } from "../pages/rooms/[id]/index.js";
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

  const sse = new EventSource(`${BACKEND_URL}/room/${roomId}/subscribe`);

  sse.onmessage = async (e) => {
    const streamData = JSON.parse(e.data);

    switch (streamData.type) {
      case "status":
        const playerList = streamData.data.playerList;
        displayPlayersInRoom(playerList);

        // Word Management
        const rounds = streamData.data.rounds;

        if (rounds.length == 0) return;
        const lastRound = rounds[rounds.length - 1];

        setDrawer(lastRound.drawer.username === (await getProfile()).username);

        // Add Word to DOM
        if (isDrawer) {
          renderWord(lastRound.word.word);
        }

        // Render From Game State
        const status = streamData.data.status;
        renderRoomStatus(status, isDrawer);
        if (status === "gameover") renderPlayerScoreSummary(playerList);

        break;
      case "draw":
        newDrawing = streamData.data;
        break;
      case "clear":
        const scene = game.game.scene.scenes[0];
        scene.graphics.clear();
        break;
      default:
    }
  };

  sse.onerror = () => {
    sse.close();
  };

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
        backgroundColor: "ffffff",
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
      // const board = document.querySelector("#game");
      this.game = new Phaser.Game(this.phaserConfig);
      // setTimeout(() => {
      //   board.appendChild(this.game.canvas);
      // }, 1000);
    }
  }

  const game = new Game();
  game.createGame();
};
