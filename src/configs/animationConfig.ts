export const PlayerAnimations = {
    walk: {
        down: {
            key: "walk-down",
            frames: { start: 0, end: 3 },
            frameRate: 8,
            repeat: -1,
        },
        up: {
            key: "walk-up",
            frames: { start: 4, end: 7 },
            frameRate: 8,
            repeat: -1,
        },
        left: {
            key: "walk-left",
            frames: { start: 8, end: 11 },
            frameRate: 8,
            repeat: -1,
        },
        right: {
            key: "walk-right",
            frames: { start: 12, end: 15 },
            frameRate: 8,
            repeat: -1,
        },
    },
    idle: {
        down: {
            key: "idle-down",
            frames: { start: 0, end: 0 },
            frameRate: 1,
            repeat: 0,
        },
        up: {
            key: "idle-up",
            frames: { start: 4, end: 4 },
            frameRate: 1,
            repeat: 0,
        },
        left: {
            key: "idle-left",
            frames: { start: 8, end: 8 },
            frameRate: 1,
            repeat: 0,
        },
        right: {
            key: "idle-right",
            frames: { start: 12, end: 12 },
            frameRate: 1,
            repeat: 0,
        },
    },
};

export const ChickenAnimations = {
    idle: {
        key: "chicken-idle",
        frames: { start: 0, end: 1 },
        frameRate: 2,
        repeat: -1,
    },
    walk: {
        key: "chicken-walk",
        frames: { start: 4, end: 7 },
        frameRate: 8,
        repeat: -1,
    },
};

export const CowAnimations = {
    idle: {
        key: "cow-idle",
        frames: { start: 0, end: 2 },
        frameRate: 2,
        repeat: -1,
    },
    walk: {
        key: "cow-walk",
        frames: { start: 3, end: 4 },
        frameRate: 8,
        repeat: -1,
    },
};

export const ChestAnimations = {
    openDown: {
        key: "chest-open-down",
        frames: { start: 0, end: 4 },
        frameRate: 10,
        repeat: 0,
    },
    openRight: {
        key: "chest-open-right",
        frames: { start: 5, end: 9 },
        frameRate: 10,
        repeat: 0,
    },
};
