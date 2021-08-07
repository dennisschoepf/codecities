import { mp5 } from '../../main';
import { Player } from '../sketchObjects/Player';
import { colors } from '../constants/colors';
import { Edge } from '../sketchObjects/Edge';
import store from '../store';
import { generateEdges } from '../helpers';
import { Scenes } from './scenes';
import projectMetadata from '../../metadata/project.json';
import { Area, Coordinates } from '../types';
import { logger } from '../logger';

export class OverviewScene {
  player: Player;
  playerHead: Area;
  links: Array<{ edgePosition: Coordinates; linkPositions: Coordinates[] }>;
  edges: Edge[];
  sfLogged: boolean;

  constructor() {
    this.edges = generateEdges(projectMetadata.subprojects);
    this.player = new Player();

    this.links = this.edges
      .map((edge) => {
        // 1. Get links from project metadata
        const links = projectMetadata.subprojects
          .filter((subproject) => subproject.name === edge.name)[0]
          .links.map((link) => link.split('/')[1]);

        if (links.length === 0) return;

        // 2. Get position of linked packages for each edge
        const linkPositions = links
          .map((link) => {
            const linkedEdge = this.edges.filter((edge) => link === edge.name)[0];
            if (!linkedEdge) return;
            return {
              x: linkedEdge.x,
              y: linkedEdge.y,
            };
          })
          .filter((linkedPosition) => !!linkedPosition);

        return {
          edgePosition: {
            x: edge.x,
            y: edge.y,
          },
          linkPositions,
        };
      })
      .filter((link) => !!link);
  }

  public draw() {
    mp5.background(mp5.color(colors.greyLighter));

    this.drawConnections();

    this.player.follow();
    this.drawLocations();
    this.player.move();
  }

  public onSceneClick() {
    this.edges.forEach((edge, i) => {
      const dist = mp5.dist(mp5.mouseX, mp5.mouseY, edge.x, edge.y);
      if (dist < edge.currentSize) {
        logger.log({
          type: 'OC',
          timestamp: Date.now(),
          message: 'Click inside edge',
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
          message: 'Click outside edge',
        });
      }
    });
  }

  private drawConnections() {
    this.links.forEach((link) => {
      link.linkPositions.forEach((linkPosition) => {
        mp5.stroke(mp5.color(colors.greyLight));
        mp5.strokeWeight(4);
        mp5.line(link.edgePosition.x, link.edgePosition.y, linkPosition.x, linkPosition.y);
      });
    });
  }

  private drawLocations() {
    if (store.getState().finishedSubProjects.length === 3 && !store.getState().finishedGame) {
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
        edgeShape.finished = true;
      }

      edgeShape.draw();
    });
  }
}
