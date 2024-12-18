import { Scene } from "phaser";
import { ChickenAnimations } from "../configs/animationConfig";

export class Chicken extends Phaser.Physics.Arcade.Sprite {
    private isColliding: boolean = false;
    private moveTimer!: Phaser.Time.TimerEvent;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "chicken");

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setupPhysics();
        this.setupAnimations();
        this.setupMovement();
    }

    private setupPhysics(): void {
        if (!this.body) return;

        this.setCollideWorldBounds(true);
        this.setScale(1);
        this.body.setSize(12, 12);
        this.body.setOffset(2, 2);
    }

    private setupAnimations(): void {
        Object.values(ChickenAnimations).forEach((anim) => {
            if (!this.scene.anims.exists(anim.key)) {
                this.scene.anims.create({
                    key: anim.key,
                    frames: this.scene.anims.generateFrameNumbers("chicken", anim.frames),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat,
                });
            }
        });
        this.play("chicken-idle");
    }

    private setupMovement(): void {
        this.moveTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000),
            callback: this.updateMovement,
            callbackScope: this,
            loop: true,
        });
    }

    private updateMovement(): void {
        if (!this.body || this.isColliding) return;

        const speed = 30;
        const chance = Math.random();

        if (chance < 0.3) {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.play("chicken-idle", true);
        } else {
            const angle = Math.random() * Math.PI * 2;
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;

            this.body.velocity.x = velocityX;
            this.body.velocity.y = velocityY;
            if (velocityX !== 0) {
                this.setFlipX(velocityX < 0);
            }
            this.play("chicken-walk", true);
        }
    }

    handleCollision(): void {
        if (!this.body) return;

        this.isColliding = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.play("chicken-idle", true);

        this.scene.time.delayedCall(1000, () => {
            this.isColliding = false;
            this.updateMovement();
        });
    }

    destroy(fromScene?: boolean): void {
        if (this.moveTimer) {
            this.moveTimer.destroy();
        }
        super.destroy(fromScene);
    }
}
