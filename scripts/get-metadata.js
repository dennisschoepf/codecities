import { resolve } from 'path';
import { readdir, writeFile } from 'fs/promises';
import getItemSize from 'get-folder-size';
import {
  getLegaciesForSubproject,
  getLinksForSubproject,
  getPackagesForSubproject,
  getProjectContributors,
} from './helpers.js';

const __dirname = resolve();
export const PROJECT_PATH = resolve(__dirname, 'sourceproject/ethereumjs-monorepo');
export const SUBPACKAGE_PATH = resolve(PROJECT_PATH, 'packages');

const main = async () => {
  const subprojectPaths = await readdir(SUBPACKAGE_PATH);
  const subprojectOverviewData = await Promise.all(
    subprojectPaths.map(async (subprojectPath) => {
      const size = await getItemSize.loose(resolve(PROJECT_PATH, SUBPACKAGE_PATH, subprojectPath));

      return {
        name: subprojectPath,
        path: `packages/${subprojectPath}`,
        filePath: resolve(PROJECT_PATH, SUBPACKAGE_PATH, subprojectPath),
        size: Math.floor(size * 0.001),
      };
    })
  );

  const subprojects = subprojectOverviewData.filter(
    (subprojectData) => subprojectData.name !== 'vm' && subprojectData.name !== 'ethereum-tests'
  );

  const projectContributors = await getProjectContributors();

  console.log(projectContributors.length);

  const subprojectsWithRevealables = await Promise.all(
    subprojects.map(async (subproject, i) => {
      const packages = await getPackagesForSubproject(subproject);
      const links = await getLinksForSubproject(subproject);
      const legacies = await getLegaciesForSubproject(subproject);
      const contributors = [
        projectContributors[0 + i],
        projectContributors[10 + i],
        projectContributors[20 + i],
      ];

      return {
        ...subproject,
        links,
        revealables: [...packages, ...contributors, ...legacies],
      };
    })
  );

  const jsonToWrite = JSON.stringify(
    {
      subprojects: subprojectsWithRevealables,
    },
    null,
    2
  );

  writeFile(resolve(__dirname, 'metadata/project.json'), jsonToWrite);
};

main();
