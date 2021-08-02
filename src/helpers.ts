import { mp5 } from '../main';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants/screen';
import { Edge } from './sketchObjects/Edge';
import { RevealableInterface, RevealableTypes } from './sketchObjects/Revealable';
import { Coordinates, JSONSubproject, SubProject } from './types';

export function getEdgeDimensions({ size }: JSONSubproject): number {
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

export function generateEdgeCoords(existingEdges: Edge[]): Coordinates {
  let newCoords: Coordinates;
  const existingCoordinates = existingEdges.map(({ x, y }) => ({ x, y }));

  do {
    newCoords = generateRandomEdgeCoordinates();
  } while (isColliding(newCoords, existingCoordinates));

  return newCoords;
}

export function generateEdges(subprojects: JSONSubproject[]): Edge[] {
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

export function getTypedSubproject(name: string, projects: JSONSubproject[]): SubProject {
  return projects
    .filter((project) => project.name === name)
    .map((project) => ({
      ...project,
      revealables: project.revealables.map((revealable) => ({
        ...revealable,
        type: RevealableTypes[revealable.type],
      })),
    }))[0];
}

export function getRevealablesforSubproject(
  subProjectName: string,
  subProjects: JSONSubproject[]
): RevealableInterface[] {
  return subProjects
    .filter((subproject) => subproject.name === subProjectName)[0]
    .revealables.map((revealable) => ({
      ...revealable,
      type: RevealableTypes[revealable.type],
    }));
}

export function generateRevealableCoords(): Coordinates[] {
  const areaWidth = mp5.width / 3;
  const rowHeight = mp5.height / 2;

  // Max. 6 revealables one in each area
  return [
    { x: mp5.random(25, areaWidth), y: mp5.random(25, rowHeight) },
    { x: mp5.random(areaWidth, areaWidth * 2), y: mp5.random(25, rowHeight) },
    { x: mp5.random(areaWidth * 2, areaWidth * 3), y: mp5.random(25, rowHeight) },
    { x: mp5.random(25, areaWidth), y: mp5.random(rowHeight, rowHeight * 2) },
    { x: mp5.random(areaWidth, areaWidth * 2), y: mp5.random(rowHeight, rowHeight * 2) },
    { x: mp5.random(areaWidth * 2, areaWidth * 3), y: mp5.random(rowHeight, rowHeight * 2) },
  ];
}
