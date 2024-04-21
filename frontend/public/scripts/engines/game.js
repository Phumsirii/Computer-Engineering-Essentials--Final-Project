import { drawing } from "../api/rooms.js";
import { BACKEND_URL } from "../config.js";
import { setWord } from "../pages/rooms/[id]/index.js";
import { isDrawer } from "../utils/user.js";

export const initializeGame = (roomId) => {
  const drawLog = [];
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
          update: isDrawer(roomId) ? this.drawScene : null,
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
    async drawScene() {
      if (!this.input.activePointer.isDown && this.isDrawing) {
        this.isDrawing = false;
        drawing(roomId, drawLog);
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
        console.log(this.graphics);
        this.path.draw(this.graphics);
      }
    }
    async updateScene(newDrawing) {
      newDrawing.forEach((drawing) => {
        if (drawing.type === "start") {
          this.path = new Phaser.Curves.Path(drawing.x, drawing.y);
        } else if (drawing.type === "continue") {
          this.path.lineTo(drawing.x, drawing.y);
          this.path.draw(this.game.scene.scenes[0].graphics);
        }
      });
    }

    async authenticate() {}
    async joinOrCreateGame(id) {}
    async joinGame(id, authId) {}
    async createGame(id, authId) {
      const board = document.querySelector("#game");
      this.game = new Phaser.Game(this.phaserConfig);
      setTimeout(() => {
        board.appendChild(this.game.canvas);
      }, 1000);

      if (isDrawer(roomId)) return;

      const sse = new EventSource(`${BACKEND_URL}/room/${roomId}/subscribe`);

      sse.onmessage = (e) => {
        const streamData = JSON.parse(e.data);
        if (streamData.type === "draw") {
          this.updateScene(streamData.data);
        } else if (streamData.type === "word") {
          console.log(streamData.data);
          setWord(streamData.data);
        }
      };

      sse.onerror = () => {
        sse.close();
      };
    }
  }

  const game = new Game();
  game.createGame();
};
