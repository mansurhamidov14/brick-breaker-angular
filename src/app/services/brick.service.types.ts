import { BallDirection, Coordinates } from "./ball.service.types";

export type BrickCollision = {
    coordinates: Coordinates;
    nextDirection: BallDirection;
}

export type PotentiallyTouchedBricks = {
    sideBricks: BrickCollision[];
    cornerBrick: BrickCollision;
}