import { BallCoordinates } from "./services/ball.service.types";

export const GAME_SCREEN_WIDTH = 10;
export const GAME_SCREEN_HEIGHT = 24;
export const APP_SCREEN_WIDTH = GAME_SCREEN_WIDTH;
export const APP_SCREEN_HEIGHT = GAME_SCREEN_HEIGHT;
type BricksInRow = {
    x: { [key: number]: boolean }
}
export type Bricks = {
    y: {
        [key: number]: BricksInRow;
    }
}
export const BRICKS: Bricks = {
    y: {
        5: { x: { 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true } },
        6: { x: { 3: true, 4: true, 5: true, 6: true, 7: true, 8: true } }, 
        7: { x: { 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true } },
        8: { x: { 3: true, 4: true, 5: true, 6: true, 7: true, 8: true } }, 
    }
}

export const INITIAL_BALL_COORDINATES: BallCoordinates = [
    { x: 2, y: 24 },
    { x: 3, y: 23 }
];