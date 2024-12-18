import Phaser from "phaser";
import MainScene from "./scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 480,
    height: 480,
    scene: MainScene,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            debugShowBody: false,
            debugShowStaticBody: false,
            debugBodyColor: 0xff00ff,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game",
    },
    backgroundColor: "#e9cfa7",
};

new Phaser.Game(config);
