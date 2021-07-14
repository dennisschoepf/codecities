import { mp5 } from '../../main';
import { Player } from '../Player';
import { colors } from '../constants/colors';
import { Edge } from '../Edge';

export class OverviewScene {
  player: Player;
  edgeData: Array<{ x: number; y: number; r: number }>;
  edges: Edge[];

  constructor() {
    this.edgeData = [
      { x: 100, y: 100, r: 50 },
      { x: 900, y: 400, r: 100 },
      { x: 300, y: 600, r: 75 },
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
    console.log('Click on scene');
    this.edges.forEach((edgeShape, i) => {
      const dist = mp5.dist(mp5.mouseX, mp5.mouseY, edgeShape.x, edgeShape.y);
      if (dist < edgeShape.r) {
        console.log(`Click on edge ${i}`);
      }
    });
  }

  private drawLocations() {
    this.edges.forEach((edgeShape) => edgeShape.draw());
  }
}
