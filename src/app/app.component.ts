import { Component } from '@angular/core';
import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH, BRICKS, INITIAL_BALL_COORDINATES } from './consts';
import { BallService } from './services/ball.service';
import { Coordinates } from './services/ball.service.types';
import { BrickService } from './services/brick.service';
import { range } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'brick-breaker';
  rows = range(APP_SCREEN_HEIGHT);
  pointsPerRow = range(APP_SCREEN_WIDTH);
  bricks = BRICKS;
  ballCoordinates = INITIAL_BALL_COORDINATES;
  unpaused?: any;
  ballMoveInterval = 70;

  constructor(public ballService: BallService, public brickService: BrickService) { }

  isElementActive(coordinates: Coordinates) {
    return this.isBallAtPoint(coordinates.y, coordinates.x) || this.brickService.existsAt(this.bricks, coordinates);
  }

  isBallAtPoint(row: number, point: number) {
    const [, currentCoordinates] = this.ballCoordinates;
    return currentCoordinates.x === point && currentCoordinates.y === row;
  }

  resumeGame = () => {
    const moveBallResult = this.ballService.moveBall(this.ballCoordinates, this.bricks);
    this.ballCoordinates = moveBallResult.nextCoordinates;
    moveBallResult.brokenBricks.forEach((brick) => {
      if (this.brickService.existsAt(this.bricks, brick)) {
        this.bricks.y[brick.y].x[brick.x] = false;
      }
    });
  }

  pauseGame = () => {
    clearInterval(this.unpaused);
    this.unpaused = undefined;
  }

  ngOnInit(): void {
    this.unpaused = setInterval(this.resumeGame, this.ballMoveInterval);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.unpaused ? this.pauseGame() : this.unpaused = setInterval(this.resumeGame, this.ballMoveInterval);
      }
    });
  }
}
