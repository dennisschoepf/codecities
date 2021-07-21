import { mp5 } from '../main';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants/screen';
import { Edge } from './sketchObjects/Edge';
import { Coordinates, SubProject } from './types';

export function getEdgeDimensions({ size }: SubProject): number {
  const radius = size * 0.05;
  return radius > 150 ? 150 : radius;
}

export function generateRandomEdgeCoordinates(): Coordinates {
  return {
    x: mp5.random(150, SCREEN_WIDTH - 150),
    y: mp5.random(150, SCREEN_HEIGHT - 150),
  };
}

export function isColliding(
  coordinatesToTest: Coordinates,
  existingCoordinates: Coordinates[]
): boolean {
  return existingCoordinates.some(
    (existingCoordinate) =>
      mp5.dist(
        existingCoordinate.x,
        existingCoordinate.y,
        coordinatesToTest.x,
        coordinatesToTest.y
      ) < 300
  );
}

export function generateEdgeCoords(existingCoordinates: Coordinates[]): Coordinates {
  let newCoords: Coordinates;

  do {
    newCoords = generateRandomEdgeCoordinates();
  } while (isColliding(newCoords, existingCoordinates));

  return newCoords;
}

export function generateEdges(subprojects: SubProject[]): Edge[] {
  let edgeCoords = [];

  subprojects.forEach((subproject) => {
    const coordinates = generateEdgeCoords(edgeCoords);
    edgeCoords.push({
      x: coordinates.x,
      y: coordinates.y,
      r: getEdgeDimensions(subproject),
    });
  });

  return edgeCoords.map(
    (edgeCoord) =>
      new Edge({
        x: edgeCoord.x,
        y: edgeCoord.y,
        r: edgeCoord.r,
      })
  );
}
