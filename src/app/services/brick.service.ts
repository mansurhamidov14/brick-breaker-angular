import { Injectable } from '@angular/core';
import { Bricks } from '../consts';
import { Coordinates } from './ball.service.types';

@Injectable({
  providedIn: 'root'
})
export class BrickService {

  constructor() { }

  public existsAt(bricks: Bricks, coordinates: Coordinates) {
    return Boolean(bricks.y?.[coordinates.y]?.x?.[coordinates.x])
  }
}
