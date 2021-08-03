import { mp5 } from '../../main';
import { Player } from '../sketchObjects/Player';
import { colors } from '../constants/colors';
import { Edge } from '../sketchObjects/Edge';
import store from '../store';
import { generateEdges } from '../helpers';
import { Scenes } from './scenes';
import projectMetadata from '../../metadata/project.json';
import { Area } from '../types';
import { logger } from '../logger';

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
        logger.log({
          type: 'OC',
          timestamp: Date.now(),
          message: 'Click outside edge',
        });

        store.getState().setProjectMetadata(edge.name);
        store.setState({
          showScore: true,
          currentSubproject: edge.name,
          currentScene: Scenes.DETAIL,
        });
      } else {
        logger.log({
          type: 'OC',
          timestamp: Date.now(),
          message: 'Click on edge',
        });
      }
    });
  }

  private drawLocations() {
    if (
      store.getState().finishedSubProjects.every((fsp) => {
        const edge = this.edges.filter((edge) => edge.name === fsp)[0];
        return edge.finished;
      }) &&
      !store.getState().finishedGame &&
      store.getState().finishedSubProjects.length > 0
    ) {
      store.setState({ finishedGame: true });

      setTimeout(() => {
        logger.log({
          timestamp: Date.now(),
          type: 'GF',
        });

        store.getState().addUserMessage({
          text: "Nice! 😎 You made it all the way through. Now I would be very thankful if you could take some time to answer the following questions. Don't overthink the answers and write down everything that comes to your mind. The more input you give, the better no matter how well it is formulated!",
          inputWanted: false,
          onNext: () => store.setState({ currentIntroStep: 5 }),
        });
      }, 800);
    }

    this.edges.forEach((edgeShape) => {
      if (store.getState().finishedSubProjects.some((fsp) => fsp === edgeShape.name)) {
        logger.log({
          type: 'SF',
          timestamp: Date.now(),
          message: `Finished subproject: ${edgeShape.name}`,
        });

        edgeShape.finished = true;
      }

      edgeShape.draw();
    });
  }
}
