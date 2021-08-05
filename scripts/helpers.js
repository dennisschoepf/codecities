import { resolve, basename } from 'path';
import { readFile } from 'fs/promises';
import { promisify } from 'util';
import { Octokit } from '@octokit/core';
import child_process from 'child_process';
import nodeGlob from 'glob';
import { PROJECT_PATH, SUBPACKAGE_PATH } from './get-metadata.js';

const exec = promisify(child_process.exec);
const glob = promisify(nodeGlob);

const octokit = new Octokit({
  auth: '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',
});

export async function getLegaciesForSubproject(subproject) {
  // Get all paths to project files
  const files = await glob(resolve(SUBPACKAGE_PATH, subproject.name, '**/*.ts'));
  const filteredFilePaths = files.filter(
    (filePath) =>
      !filePath.includes('spec.') && !filePath.includes('/test/') && !filePath.includes('@types')
  );

  // Get line counts for files
  const filesWithWordCounts = await Promise.all(
    filteredFilePaths.map(async (filteredFilePath) => {
      const { stdout } = await exec(`wc -l < ${filteredFilePath}`);

      return {
        path: filteredFilePath,
        count: Number(stdout.replace('\n', '')),
      };
    })
  );

  const largestFiles = filesWithWordCounts
    .sort((fwcA, fwcB) => fwcB.count - fwcA.count)
    .slice(0, 2);

  // Transform to legacy object
  const legacies = largestFiles.map((largeFile) => createLegacy(largeFile));

  // Return 2 highest line counts
  return legacies;
}

export async function getProjectContributors() {
  const contribs = await octokit.request('/repos/ethereumjs/ethereumjs-monorepo/contributors');
  const contributors = await Promise.all(
    contribs.data.map(async (contrib) => createContributor(contrib))
  );

  return contributors;
}

export async function getLinksForSubproject(subproject) {
  const subprojectPackageJson = await readFile(
    resolve(subproject.filePath, 'package.json'),
    'utf8'
  );
  const { dependencies } = JSON.parse(subprojectPackageJson);
  const links = Object.keys(dependencies).filter((dependency) =>
    dependency.includes('@ethereumjs')
  );

  return links;
}

export async function getPackagesForSubproject(subproject) {
  const subprojectPackageJson = await readFile(
    resolve(subproject.filePath, 'package.json'),
    'utf8'
  );
  const { dependencies } = JSON.parse(subprojectPackageJson);
  const relevantDependencies = Object.keys(dependencies)
    .filter((dependency) => !dependency.includes('ethereumjs') && !dependency.includes('@types'))
    .slice(0, 3)
    .map((dependencyKey) => ({
      name: dependencyKey,
      version: dependencies[dependencyKey],
    }));

  const formattedDependencies = relevantDependencies.map((dep) => createPackage(dep));

  return formattedDependencies;
}

const createContributor = async (contrib) => {
  if (!contrib) return;

  let commits;

  try {
    const rawCommits = await octokit.request(`/repos/ethereumjs/ethereumjs-monorepo/commits`, {
      per_page: 3,
      author: contrib.name,
    });

    commits = rawCommits.data.map((commit) => ({
      url: commit.html_url,
      message: commit.commit.message,
      time: commit.commit.author.date,
    }));
  } catch (e) {}

  return {
    type: 'CONTRIBUTOR',
    name: contrib.login,
    url: contrib.html_url,
    size: contrib.contributions,
    imageUrl: contrib.avatar_url,
    commits,
  };
};

const createPackage = ({ name, version }) => {
  const path = 'path.to.package.json';
  const size = 0;

  return {
    type: 'PACKAGE',
    name,
    path,
    version,
    size,
    contents: '',
    url: `https://www.npmjs.com/package/${name}`,
  };
};

const createLegacy = ({ path, count }) => {
  const projectPath = path.replace(PROJECT_PATH, '');

  return {
    type: 'LEGACY',
    name: basename(projectPath),
    path: projectPath,
    size: count,
    contents: '',
    url: `https://github.com/ethereumjs/ethereumjs-monorepo/blob/master${projectPath}`,
  };
};
