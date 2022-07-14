import { Bricks } from "../consts";

export type Coordinates = {
    x: number;
    y: number;
}

export type BallCoordinates = Coordinates[];
export type HorizontalDirection = 'RIGHT' | 'LEFT';
export type VerticalDirection = 'UP' | 'DOWN';
export type BallDirection = {
    horizontal: HorizontalDirection;
    vertical: VerticalDirection;
};
export type CollisionDirection = {
    horizontal: HorizontalDirection | null;
    vertical: VerticalDirection | null;
}
export type BrokenBricksResult = {
    brokenBricks: Coordinates[];
    nextDirection: BallDirection;
}
export type MoveBallResult = {
    nextCoordinates: BallCoordinates;
    brokenBricks: Coordinates[]
}