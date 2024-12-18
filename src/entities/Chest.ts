import { Scene } from "phaser";
import { ChestAnimations } from "../configs/animationConfig";

export class Chest extends Phaser.Physics.Arcade.Sprite {
    private isOpening: boolean = false;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "chest");

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setupPhysics();
        this.setupAnimations();
    }

    private setupPhysics(): void {
        this.setCollideWorldBounds(true);
        if (this.body) {
            this.body.setSize(16, 16);
            this.body.setOffset(16, 16);
        }
    }

    private setupAnimations(): void {
        Object.values(ChestAnimations).forEach((anim) => {
            if (!this.scene.anims.exists(anim.key)) {
                this.scene.anims.create({
                    key: anim.key,
                    frames: this.scene.anims.generateFrameNumbers("chest", anim.frames),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat,
                });
            }
        });
        this.setFrame(0);
    }

    open(playerDirection: string): Promise<void> {
        return new Promise((resolve) => {
            if (this.isOpening) return;
            this.isOpening = true;

            // Reset flip before starting new animation
            this.setFlipX(false);

            // Determine animation based on player direction
            let animKey: string;
            if (playerDirection === "up" || playerDirection === "down") {
                animKey = "chest-open-down";
            } else if (playerDirection === "right") {
                animKey = "chest-open-right";
            } else {
                // left
                animKey = "chest-open-right";
                this.setFlipX(true); // Flip the sprite horizontally for left direction
            }

            this.play(animKey);

            this.once("animationcomplete", () => {
                this.isOpening = false;
                resolve();
            });
        });
    }

    reset(): void {
        this.isOpening = false;
        this.setFlipX(false); // Reset flip when resetting chest
        this.setFrame(0);
    }
}
