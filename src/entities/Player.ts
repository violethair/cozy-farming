import { Scene } from "phaser";
import { PlayerAnimations } from "../configs/animationConfig";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly speed: number = 130;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "rabbit");

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setupPhysics();
        this.setupAnimations();
        this.setupControls();
    }

    private setupPhysics(): void {
        if (this.body) {
            this.body.setSize(16, 16);
            this.body.setOffset(16, 24);
        }
        this.setCollideWorldBounds(true);
        this.setDepth(10);
    }

    private setupAnimations(): void {
        Object.values(PlayerAnimations.walk).forEach((anim) => {
            if (!this.scene.anims.exists(anim.key)) {
                this.scene.anims.create({
                    key: anim.key,
                    frames: this.scene.anims.generateFrameNumbers("rabbit", anim.frames),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat,
                });
            }
        });
    }

    private setupControls(): void {
        if (this.scene.input && this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        }
    }

    update(): void {
        if (!this.cursors) return;

        const { left, right, up, down } = this.cursors;
        let velocityX = 0;
        let velocityY = 0;
        let animation = "idle-down";

        // Handle horizontal movement
        if (left.isDown) {
            velocityX = -this.speed;
            animation = "walk-left";
        } else if (right.isDown) {
            velocityX = this.speed;
            animation = "walk-right";
        }

        // Handle vertical movement
        if (up.isDown) {
            velocityY = -this.speed;
            animation = "walk-up";
        } else if (down.isDown) {
            velocityY = this.speed;
            animation = "walk-down";
        }

        // Apply velocity
        this.setVelocity(velocityX, velocityY);

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            const normalizedSpeed = this.speed / Math.sqrt(2);
            this.setVelocity(velocityX > 0 ? normalizedSpeed : -normalizedSpeed, velocityY > 0 ? normalizedSpeed : -normalizedSpeed);
        }

        // Play animation
        if (velocityX === 0 && velocityY === 0) {
            const currentAnim = this.anims.currentAnim;
            if (currentAnim) {
                const direction = currentAnim.key.split("-")[1];
                this.play(`idle-${direction}`, true);
            }
        } else {
            this.play(animation, true);
        }
    }
}
