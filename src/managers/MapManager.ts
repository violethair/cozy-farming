export class MapManager {
    private scene: Phaser.Scene;
    private map!: Phaser.Tilemaps.Tilemap;
    private layers: { [key: string]: Phaser.Tilemaps.TilemapLayer } = {};

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    createMap(): void {
        this.map = this.scene.make.tilemap({ key: "map" });

        const tilesets = this.loadTilesets();
        this.createLayers(tilesets);
        this.centerMap();
    }

    private loadTilesets(): Phaser.Tilemaps.Tileset[] {
        const dirtTileset = this.map.addTilesetImage("Tilled_Dirt_Wide_v2", "Tilled_Dirt_Wide_v2");
        const grassTileset = this.map.addTilesetImage("Grass", "Grass");
        const fenceTileset = this.map.addTilesetImage("Fences", "Fences");
        const waterTileset = this.map.addTilesetImage("Water", "Water");
        const treeTileset = this.map.addTilesetImage("Tree", "Tree", 16, 16);

        if (!dirtTileset || !grassTileset || !fenceTileset || !waterTileset || !treeTileset) {
            throw new Error("Failed to load tilesets");
        }

        return [dirtTileset, grassTileset, fenceTileset, waterTileset, treeTileset];
    }

    private createLayers(tilesets: Phaser.Tilemaps.Tileset[]): void {
        const [dirtTileset, grassTileset, fenceTileset, waterTileset, treeTileset] = tilesets;

        this.layers.dirt = this.map.createLayer("Dirt", dirtTileset)!;
        this.layers.terrain = this.map.createLayer("Terrain", dirtTileset)!;
        this.layers.grassBase = this.map.createLayer("GrassBase", grassTileset)!;
        this.layers.water = this.map.createLayer("Water", waterTileset)!;
        this.layers.grass = this.map.createLayer("Grass", grassTileset)!;
        this.layers.fences = this.map.createLayer("Fences", fenceTileset)!;
        this.layers.tree = this.map.createLayer("Tree", treeTileset)!;
        this.layers.mushroom = this.map.createLayer("Mushroom", treeTileset)!;

        if (!Object.values(this.layers).every((layer) => layer)) {
            throw new Error("Failed to create some layers");
        }

        // Set collisions
        this.layers.fences.setCollisionByExclusion([-1]);
        this.layers.water.setCollisionByExclusion([-1]);
        this.layers.tree.setCollisionByExclusion([-1]);
    }

    private centerMap(): void {
        const gameWidth = this.scene.scale.width;
        const gameHeight = this.scene.scale.height;
        const mapWidth = this.map.widthInPixels;
        const mapHeight = this.map.heightInPixels;

        const offsetX = (gameWidth - mapWidth) / 2;
        const offsetY = (gameHeight - mapHeight) / 2;

        Object.values(this.layers).forEach((layer) => {
            layer.setPosition(offsetX, offsetY);
        });

        // Set up camera
        this.scene.cameras.main.setBounds(offsetX, offsetY, mapWidth, mapHeight);
        this.scene.cameras.main.setBackgroundColor("#e9cfa7");
        this.scene.cameras.main.setZoom(1);

        // Set world bounds
        this.scene.physics.world.setBounds(offsetX, offsetY, mapWidth, mapHeight);
    }

    getLayers(): { [key: string]: Phaser.Tilemaps.TilemapLayer } {
        return this.layers;
    }
}
