import { Scene } from "phaser";
import { CowAnimations } from "../configs/animationConfig";

export class Cow extends Phaser.Physics.Arcade.Sprite {
    private isColliding: boolean = false;
    private moveTimer!: Phaser.Time.TimerEvent;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "cow");

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setupPhysics();
        this.setupAnimations();
        this.setupMovement();
    }

    private setupPhysics(): void {
        this.setCollideWorldBounds(true);
        this.setScale(1);

        if (this.body) {
            this.body.setSize(24, 24);
            this.body.setOffset(4, 4);
        }
    }

    private setupAnimations(): void {
        Object.values(CowAnimations).forEach((anim) => {
            if (!this.scene.anims.exists(anim.key)) {
                this.scene.anims.create({
                    key: anim.key,
                    frames: this.scene.anims.generateFrameNumbers("cow", anim.frames),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat,
                });
            }
        });
        this.play("cow-idle");
    }

    private setupMovement(): void {
        this.moveTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(3000, 6000),
            callback: this.updateMovement,
            callbackScope: this,
            loop: true,
        });
    }

    private updateMovement(): void {
        if (!this.body || this.isColliding) return;

        const speed = 20;
        const chance = Math.random();

        if (chance < 0.4) {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.play("cow-idle", true);
        } else {
            const angle = Math.random() * Math.PI * 2;
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;

            this.body.velocity.x = velocityX;
            this.body.velocity.y = velocityY;
            if (velocityX !== 0) {
                this.setFlipX(velocityX < 0);
            }
            this.play("cow-walk", true);
        }
    }

    onCollide(): void {
        if (!this.body) return;

        this.setVelocity(0, 0);
        const currentVelocityX = this.body.velocity.x;
        const currentVelocityY = this.body.velocity.y;
        this.setVelocity(-currentVelocityX, -currentVelocityY);
        this.play("cow-idle", true);
    }

    handleCollision(): void {
        if (!this.body) return;

        this.isColliding = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.play("cow-idle", true);

        this.scene.time.delayedCall(1500, () => {
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
