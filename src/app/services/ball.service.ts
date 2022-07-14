import { Injectable } from '@angular/core';
import {
  Bricks,
  GAME_SCREEN_HEIGHT,
  GAME_SCREEN_WIDTH
} from '../consts';
import {
  BallCoordinates,
  BallDirection,
  BrokenBricksResult,
  CollisionDirection,
  Coordinates,
  HorizontalDirection,
  MoveBallResult,
  VerticalDirection
} from './ball.service.types';
import { BrickService } from './brick.service';
import { BrickCollision, PotentiallyTouchedBricks } from './brick.service.types';

@Injectable({
  providedIn: 'root'
})
export class BallService {

  constructor(public brickService: BrickService) { }

  moveBall(coordinates: BallCoordinates, bricks: Bricks): MoveBallResult {
    const [,currentCoordinates] = coordinates;
    const currentDirection = this.getBallMovementDirection(coordinates);
    const breakBricksResult = this.getBrokenBricks(currentCoordinates, currentDirection, bricks);
    const direction = this.getNextDirection(currentCoordinates, breakBricksResult.nextDirection);
    const nextCoordinates = {
      x: direction.horizontal === 'LEFT' ? currentCoordinates.x - 1 : currentCoordinates.x + 1,
      y: direction.vertical === 'UP' ? currentCoordinates.y - 1 : currentCoordinates.y + 1
    };
    
    return {
      nextCoordinates: [currentCoordinates, nextCoordinates],
      brokenBricks: breakBricksResult.brokenBricks
    };
  }

  getBallMovementDirection(coordinates: BallCoordinates): BallDirection {
    const [prevCoordinates, currentCoordinates] = coordinates;
    let horizontal: HorizontalDirection = 'LEFT';
    let vertical: VerticalDirection = 'UP';

    if (currentCoordinates.x > prevCoordinates.x) {
      horizontal = 'RIGHT';
    }

    if (currentCoordinates.y > prevCoordinates.y) {
      vertical = 'DOWN';
    }

    return { vertical, horizontal };
  }

  getNextDirection(currentCoordinates: Coordinates, currentDirection: BallDirection): BallDirection {
    const wallTouchSide = this.getWallTouchingSide(currentCoordinates);
    let { horizontal, vertical } = currentDirection;

    if (wallTouchSide.horizontal === horizontal) {
      horizontal = this.getOppositeHorizontalDirection(horizontal);
    }

    if (wallTouchSide.vertical === vertical) {
      vertical = this.getOppositeVerticalDirection(vertical);
    }

    return { vertical, horizontal };
  }

  getWallTouchingSide(currentCoordinates: Coordinates): CollisionDirection {
    let horizontal: HorizontalDirection | null = null;
    let vertical: VerticalDirection | null = null;

    if (currentCoordinates.x === GAME_SCREEN_WIDTH) {
      horizontal = 'RIGHT';
    } else if (currentCoordinates.x === 1) {
      horizontal = 'LEFT';
    }

    if (currentCoordinates.y === GAME_SCREEN_HEIGHT) {
      vertical = 'DOWN';
    } else if (currentCoordinates.y === 1) {
      vertical = 'UP';
    }
    return { vertical, horizontal };
  }

  getBrokenBricks(
    currentCoordinates: Coordinates,
    direction: BallDirection,
    bricks: Bricks,
    previouslyBrokenBricks: Coordinates[] = []
  ): BrokenBricksResult {
    const potentiallyTouchedBricks = this.getPotentiallyTouchedBricks(currentCoordinates, direction);
    const brokenSideBricks: BrickCollision[] = potentiallyTouchedBricks.sideBricks.filter((sideBrick) => {
      return !previouslyBrokenBricks.some((brick) => (brick.x === sideBrick.coordinates.x && brick.y === sideBrick.coordinates.y)) &&
        this.brickService.existsAt(bricks, sideBrick.coordinates);
    });
    const brokenCornerBrick = (
      brokenSideBricks.length ||
      previouslyBrokenBricks.some((brick) => (
          brick.x === potentiallyTouchedBricks.cornerBrick.coordinates.x &&
          brick.y === potentiallyTouchedBricks.cornerBrick.coordinates.x
        )
      ) ||
      !this.brickService.existsAt(bricks, potentiallyTouchedBricks.cornerBrick.coordinates)
    ) ? [] : [potentiallyTouchedBricks.cornerBrick.coordinates];
    const brokenBricks: Coordinates[] = brokenSideBricks.length
      ? brokenSideBricks.map(({ coordinates }) => coordinates)
      : brokenCornerBrick;

    const nextDirection = !brokenBricks.length
      ? direction
      : brokenSideBricks.length === 1
        ? brokenSideBricks[0].nextDirection
        : potentiallyTouchedBricks.cornerBrick.nextDirection;

    const result = { brokenBricks, nextDirection };
    
    if (brokenBricks.length) {
      const reboundData = this.calculateReboundData(currentCoordinates, result.nextDirection, bricks, result.brokenBricks);
      if (reboundData.brokenBricks.length) {
        result.brokenBricks = result.brokenBricks.concat(reboundData.brokenBricks);
      }
      result.nextDirection = reboundData.nextDirection;
    }
   
    return result;
  }

  private getOppositeHorizontalDirection(direction: HorizontalDirection): HorizontalDirection {
    const opposites: Record<HorizontalDirection, HorizontalDirection> = {
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    }

    return opposites[direction];
  }

  private getOppositeVerticalDirection(direction: VerticalDirection): VerticalDirection {
    const opposites: Record<VerticalDirection, VerticalDirection> = {
      UP: 'DOWN',
      DOWN: 'UP'
    }

    return opposites[direction];
  }

  private getPotentiallyTouchedBricks(
    currentCoordinates: Coordinates,
    direction: BallDirection
  ): PotentiallyTouchedBricks {
    const potentialXCoordinatesMap: Record<HorizontalDirection, number> = {
      LEFT: currentCoordinates.x - 1,
      RIGHT: currentCoordinates.x + 1
    };

    const potentialYCoordinatesMap: Record<VerticalDirection, number> = {
      DOWN: currentCoordinates.y + 1,
      UP: currentCoordinates.y - 1
    };
    const potentialCoordinates = {
      x: potentialXCoordinatesMap[direction.horizontal],
      y: potentialYCoordinatesMap[direction.vertical]
    }
    const oppositeDirections = {
      horizontal: this.getOppositeHorizontalDirection(direction.horizontal),
      vertical: this.getOppositeVerticalDirection(direction.vertical)
    }

    return {
      sideBricks: [
        {
          coordinates: { x: currentCoordinates.x, y: potentialCoordinates.y },
          nextDirection: {
            horizontal: direction.horizontal,
            vertical: oppositeDirections.vertical
          }
        },
        {
          coordinates: { x: potentialCoordinates.x, y: currentCoordinates.y },
          nextDirection: {
            horizontal: oppositeDirections.horizontal,
            vertical: direction.vertical
          }
        }
      ],
      cornerBrick: {
        coordinates: potentialCoordinates,
        nextDirection: oppositeDirections
      }
    }
  }

  private calculateReboundData(
    ballCoordinates: Coordinates,
    ballDirection: BallDirection,
    bricks: Bricks,
    previouslyBrokenBricks: Coordinates[]
  ): BrokenBricksResult  {
    const breakBricksResult = this.getBrokenBricks(ballCoordinates, ballDirection, bricks, previouslyBrokenBricks);
    const direction = this.getNextDirection(ballCoordinates, breakBricksResult.nextDirection);

    return {
      brokenBricks: breakBricksResult.brokenBricks,
      nextDirection: direction
    };
  }
}
