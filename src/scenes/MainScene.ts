import { Player } from "../entities/Player";
import { Chicken } from "../entities/Chicken";
import { Cow } from "../entities/Cow";
import { Chest } from "../entities/Chest";
import { MapManager } from "../managers/MapManager";

export default class MainScene extends Phaser.Scene {
    private player!: Player;
    private mapManager!: MapManager;
    private chickens: Chicken[] = [];
    private cows: Cow[] = [];
    private chest!: Chest;
    private readonly CHICKEN_COUNT = Phaser.Math.Between(4, 6);
    private readonly COW_COUNT = Phaser.Math.Between(2, 4);
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private canMove: boolean = true;
    private readonly SCORE_FOR_CHEST = 10;
    private hasChest: boolean = false;

    constructor() {
        super({ key: "MainScene" });
    }

    preload() {
        // Load map (JSON format)
        this.load.tilemapTiledJSON("map", "assets/maps/my_map.json");

        // Load tileset images
        this.load.image("Tilled_Dirt_Wide_v2", "assets/tilesets/Tilled_Dirt_Wide_v2.png");
        this.load.image("Grass", "assets/tilesets/Grass.png");
        this.load.image("Fences", "assets/tilesets/Fences.png");
        this.load.image("Water", "assets/tilesets/Water.png");
        this.load.image("Tree", "assets/tilesets/Tree.png");

        // Load sprites
        this.load.spritesheet("rabbit", "assets/characters/rabbit.png", {
            frameWidth: 48,
            frameHeight: 48,
        });

        this.load.spritesheet("chicken", "assets/characters/chicken.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet("cow", "assets/characters/cow.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.spritesheet("chest", "assets/objects/chest.png", {
            frameWidth: 48,
            frameHeight: 48,
        });
    }

    create() {
        // Create map
        this.mapManager = new MapManager(this);
        this.mapManager.createMap();

        // Create player at center
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        this.player = new Player(this, centerX, centerY);

        // Setup camera to follow player
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(100, 100);

        // Create animals
        this.createChickens();
        this.createCows();

        // Create initial chest
        this.createChest();

        // Create score display
        this.createScore();

        // Setup collisions
        this.setupCollisions();
    }

    private createChickens(): void {
        for (let i = 0; i < this.CHICKEN_COUNT; i++) {
            this.time.delayedCall(i * 500, () => {
                const position = this.findRandomPosition();
                const chicken = new Chicken(this, position.x, position.y);
                this.chickens.push(chicken);

                // Add collisions immediately
                const layers = this.mapManager.getLayers();
                this.physics.add.collider(chicken, layers.fences, () => chicken.handleCollision());
                this.physics.add.collider(chicken, layers.water, () => chicken.handleCollision());
                this.physics.add.collider(chicken, layers.tree, () => chicken.handleCollision());

                // Add collision with player
                this.physics.add.overlap(this.player, chicken, () => this.handleChickenCollision(chicken));
            });
        }
    }

    private createCows(): void {
        for (let i = 0; i < this.COW_COUNT; i++) {
            this.time.delayedCall(i * 700, () => {
                const position = this.findRandomPosition();
                const cow = new Cow(this, position.x, position.y);
                this.cows.push(cow);

                // Add collisions immediately
                const layers = this.mapManager.getLayers();
                this.physics.add.collider(cow, layers.fences, () => cow.handleCollision());
                this.physics.add.collider(cow, layers.water, () => cow.handleCollision());
                this.physics.add.collider(cow, layers.tree, () => cow.handleCollision());

                // Add collision with player
                this.physics.add.overlap(this.player, cow, () => this.handleCowCollision(cow));
            });
        }
    }

    private findRandomPosition(): { x: number; y: number } {
        const margin = 100;
        return {
            x: Phaser.Math.Between(margin, this.scale.width - margin),
            y: Phaser.Math.Between(margin, this.scale.height - margin),
        };
    }

    private createScore(): void {
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontSize: "32px",
            color: "#000",
        });
        this.scoreText.setScrollFactor(0);
    }

    private setupCollisions(): void {
        const layers = this.mapManager.getLayers();

        // Player collisions
        this.physics.add.collider(this.player, layers.fences);
        this.physics.add.collider(this.player, layers.water);
        this.physics.add.collider(this.player, layers.tree);

        // Note: Chicken and cow collisions are now handled in their respective create functions
    }

    private createChest(): void {
        const position = this.findRandomPosition();
        this.chest = new Chest(this, position.x, position.y);
        this.hasChest = true;

        // Add collision with player
        this.physics.add.overlap(this.player, this.chest, () => this.handleChestCollision());
    }

    private checkAndCreateChest(): void {
        if (!this.hasChest && this.score > 0 && this.score % this.SCORE_FOR_CHEST === 0) {
            this.createChest();
        }
    }

    private handleChickenCollision(chicken: Chicken): void {
        // Increase score (1 point)
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);

        // Check if we should spawn a chest
        this.checkAndCreateChest();

        // Remove old chicken
        this.chickens = this.chickens.filter((c) => c !== chicken);
        chicken.destroy();

        // Create new chicken after delay
        this.time.delayedCall(1000, () => {
            const position = this.findRandomPosition();
            const newChicken = new Chicken(this, position.x, position.y);
            this.chickens.push(newChicken);

            // Add collisions for new chicken
            const layers = this.mapManager.getLayers();
            this.physics.add.collider(newChicken, layers.fences, () => newChicken.handleCollision());
            this.physics.add.collider(newChicken, layers.water, () => newChicken.handleCollision());
            this.physics.add.collider(newChicken, layers.tree, () => newChicken.handleCollision());
            this.physics.add.overlap(this.player, newChicken, () => this.handleChickenCollision(newChicken));
        });
    }

    private handleCowCollision(cow: Cow): void {
        // Increase score (1 point)
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);

        // Check if we should spawn a chest
        this.checkAndCreateChest();

        // Remove old cow
        this.cows = this.cows.filter((c) => c !== cow);
        cow.destroy();

        // Create new cow after delay
        this.time.delayedCall(1000, () => {
            const position = this.findRandomPosition();
            const newCow = new Cow(this, position.x, position.y);
            this.cows.push(newCow);

            // Add collisions for new cow
            const layers = this.mapManager.getLayers();
            this.physics.add.collider(newCow, layers.fences, () => newCow.handleCollision());
            this.physics.add.collider(newCow, layers.water, () => newCow.handleCollision());
            this.physics.add.collider(newCow, layers.tree, () => newCow.handleCollision());
            this.physics.add.overlap(this.player, newCow, () => this.handleCowCollision(newCow));
        });
    }

    private async handleChestCollision(): Promise<void> {
        if (!this.canMove) return;
        this.canMove = false;

        // Stop player movement
        this.player.setVelocity(0, 0);
        const currentAnim = this.player.anims.currentAnim;
        const direction = currentAnim ? currentAnim.key.split("-")[1] : "down";

        // Open chest and wait for animation
        await this.chest.open(direction);

        // Create celebration effect
        this.createCelebrationEffect(this.chest.x, this.chest.y);

        // Add bonus points (45 points)
        this.score += 45;
        this.scoreText.setText(`Score: ${this.score}`);

        // Destroy the chest
        this.chest.destroy();
        this.hasChest = false;

        // Enable movement
        this.canMove = true;

        // Check if we should spawn a new chest
        this.checkAndCreateChest();
    }

    private createCelebrationEffect(x: number, y: number): void {
        // Show score text
        const scoreText = this.add.text(x, y - 20, "+45", {
            fontSize: "24px",
            color: "#FFD700",
            stroke: "#000",
            strokeThickness: 4,
        });
        scoreText.setOrigin(0.5);

        // Animate score text
        this.tweens.add({
            targets: scoreText,
            y: y - 50,
            alpha: 0,
            duration: 400,
            ease: "Power2",
            onComplete: () => scoreText.destroy(),
        });

        // Create star burst effect
        const numStars = 8;
        const colors = [0xffd700, 0xff0000, 0x00ff00, 0x0000ff];

        for (let i = 0; i < numStars; i++) {
            const angle = (i * Math.PI * 2) / numStars;
            const star = this.add.star(x, y, 5, 6, 12, Phaser.Utils.Array.GetRandom(colors));
            star.setOrigin(0.5);
            star.setScale(0.5);

            const distance = 50;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;

            this.tweens.add({
                targets: star,
                x: targetX,
                y: targetY,
                scaleX: 0,
                scaleY: 0,
                angle: 360,
                alpha: 0,
                duration: 400,
                ease: "Cubic.easeOut",
                onComplete: () => star.destroy(),
            });

            // Add trailing star
            const trailStar = this.add.star(x, y, 5, 4, 8, star.fillColor);
            trailStar.setOrigin(0.5);
            trailStar.setScale(0.3);

            this.tweens.add({
                targets: trailStar,
                x: targetX,
                y: targetY,
                scaleX: 0,
                scaleY: 0,
                angle: -360,
                alpha: 0,
                duration: 300,
                ease: "Cubic.easeOut",
                delay: 50,
                onComplete: () => trailStar.destroy(),
            });
        }

        // Add central glow
        const circle = this.add.circle(x, y, 20, 0xffffff, 0.5);
        this.tweens.add({
            targets: circle,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            ease: "Cubic.easeOut",
            onComplete: () => circle.destroy(),
        });
    }

    update() {
        if (this.canMove) {
            this.player.update();
        }
    }
}
