import { mp5 } from '../../main';
import { Player } from '../sketchObjects/Player';
import { colors } from '../constants/colors';
import { Edge } from '../sketchObjects/Edge';
import { Scenes } from './scenes';
import store from '../store';

export class OverviewScene {
  player: Player;
  edgeData: Array<{ x: number; y: number; r: number; scene: Scenes }>;
  edges: Edge[];

  constructor() {
    this.edgeData = [
      { x: 100, y: 100, r: 50, scene: Scenes.LEGACY },
      { x: 900, y: 400, r: 100, scene: Scenes.LEGACY },
      { x: 300, y: 600, r: 75, scene: Scenes.LEGACY },
    ];
    this.edges = this.edgeData.map((edge) => new Edge(edge.x, edge.y, edge.r));
    this.player = new Player();
  }

  public draw() {
    mp5.background(mp5.color(colors.greyLighter));

    this.player.follow();
    this.drawLocations();
    this.player.move();
  }

  public onSceneClick() {
    this.edgeData.forEach((edge, i) => {
      const dist = mp5.dist(mp5.mouseX, mp5.mouseY, edge.x, edge.y);
      if (dist < edge.r) {
        store.setState({ currentScene: edge.scene });
      }
    });
  }

  private drawLocations() {
    this.edges.forEach((edgeShape) => edgeShape.draw());
  }
}
