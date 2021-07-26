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

export function shapeCollision(
  firstShape: { x: number; y: number; w: number },
  secondShape: { x: number; y: number; w: number }
) {
  return mp5.dist(firstShape.x, firstShape.y, secondShape.x, secondShape.y) < secondShape.w - 150;
}

export function generateEdgeCoords(existingEdges: Edge[]): Coordinates {
  let newCoords: Coordinates;
  const existingCoordinates = existingEdges.map(({ x, y }) => ({ x, y }));

  do {
    newCoords = generateRandomEdgeCoordinates();
  } while (isColliding(newCoords, existingCoordinates));

  return newCoords;
}

export function generateEdges(subprojects: SubProject[]): Edge[] {
  let edges = [];

  subprojects.forEach((subproject) => {
    const coordinates = generateEdgeCoords(edges);
    edges.push({
      x: coordinates.x,
      y: coordinates.y,
      r: getEdgeDimensions(subproject),
      name: subproject.name,
    });
  });

  return edges.map(
    (edge) =>
      new Edge({
        x: edge.x,
        y: edge.y,
        r: edge.r,
        name: edge.name,
      })
  );
}

export function getSubproject(name: string, projects: SubProject[]): SubProject {
  return projects.filter((project) => project.name === name)[0];
}
