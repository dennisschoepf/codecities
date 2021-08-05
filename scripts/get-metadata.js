import { resolve } from 'path';
import { readdir } from 'fs/promises';
import getItemSize from 'get-folder-size';
import { getProjectContributors } from './helpers.js';

const main = async () => {
  /* CONSTANTS */
  const __dirname = resolve();
  const PROJECT_PATH = resolve(__dirname, 'sourceproject/ethereumjs-monorepo');
  const SUBPACKAGE_PATH = resolve(PROJECT_PATH, 'packages');

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

  /*const subprojectsWithRevealables = await Promise.all(
    subprojects.map(async (subproject) => {
      const contributors = await getContributorsForSubproject(subproject);
      const revealables = [...contributors];
      const subprojectWithRevealables = {
        ...subproject,
        revealables,
      };
      console.log(revealables);

      return subprojectWithRevealables;
    })
  );*/

  const projectContributors = await getProjectContributors();

  console.log('overall contribs', projectContributors);

  // console.log('Resulting metadata:');
  /* console.log({
    subprojects: subprojectsWithRevealables,
  });*/
};

main();
