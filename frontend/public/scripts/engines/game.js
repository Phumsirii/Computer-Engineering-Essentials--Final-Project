import { drawing } from "../api/rooms.js";

export const isDrawer = (roomId) => {
  // TODO: Get Drawer from the server
  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);

  if (profile.username === "boom2") return true;
  return false;
};

export const initializeGame = (roomId) => {
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
      } else if (this.input.activePointer.isDown) {
        if (!this.isDrawing) {
          this.path = new Phaser.Curves.Path(
            this.input.activePointer.position.x,
            this.input.activePointer.position.y
          );

          drawing(roomId, {
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

          drawing(roomId, {
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
      if (newDrawing.type === "start") {
        this.path = new Phaser.Curves.Path(newDrawing.x, newDrawing.y);
      } else if (newDrawing.type === "continue") {
        this.path.lineTo(newDrawing.x, newDrawing.y);
        this.path.draw(this.game.scene.scenes[0].graphics);
      }
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

      const sse = new EventSource(
        `http://localhost:3000/room/${roomId}/subscribe`
      );

      sse.onmessage = (e) => {
        const newDrawing = JSON.parse(e.data);
        if (newDrawing.type === "draw") {
          this.updateScene(newDrawing.data);
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
