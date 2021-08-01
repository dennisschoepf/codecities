import { mp5 } from '../../main';
import { Player } from '../sketchObjects/Player';
import { colors } from '../constants/colors';
import { Edge } from '../sketchObjects/Edge';
import store from '../store';
import { generateEdges } from '../helpers';
import { Scenes } from './scenes';
import projectMetadata from '../../metadata/project.json';
import { playerHead$ } from '../area';
import { Area } from '../types';

export class OverviewScene {
  player: Player;
  playerHead: Area;
  edges: Edge[];

  constructor() {
    this.edges = generateEdges(projectMetadata.subprojects);
    this.player = new Player();
  }

  public draw() {
    mp5.background(mp5.color(colors.greyLighter));

    this.player.follow();
    this.drawLocations();
    this.player.move();
  }

  public onSceneClick() {
    this.edges.forEach((edge, i) => {
      const dist = mp5.dist(mp5.mouseX, mp5.mouseY, edge.x, edge.y);
      if (dist < edge.r) {
        store.getState().setProjectMetadata(edge.name);
        store.setState({ currentSubproject: edge.name, currentScene: Scenes.DETAIL });
      }
    });
  }

  private drawLocations() {
    this.edges.forEach((edgeShape) => {
      if (store.getState().finishedSubProjects.some((fsp) => fsp === edgeShape.name)) {
        edgeShape.finished = true;
      }

      edgeShape.draw();
    });
  }
}
