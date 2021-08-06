import { resolve, basename } from 'path';
import { readFile } from 'fs/promises';
import { promisify } from 'util';
import { Octokit } from '@octokit/core';
import child_process from 'child_process';
import nodeGlob from 'glob';
import { PROJECT_PATH, SUBPACKAGE_PATH } from './get-metadata.js';
import getItemSize from 'get-folder-size';

const exec = promisify(child_process.exec);
const glob = promisify(nodeGlob);

const octokit = new Octokit({
  auth: '',
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
  const legacies = await Promise.all(
    largestFiles.map(async (largeFile) => await createLegacy(largeFile))
  );

  // Return 2 highest line counts
  return legacies;
}

export async function getProjectContributors() {
  const contribs = await octokit.request('/repos/ethereumjs/ethereumjs-monorepo/contributors');
  const contributors = await Promise.all(
    contribs.data.map(async (contrib) => await createContributor(contrib))
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
      author: contrib.login,
    });

    const lastRawCommits = rawCommits.data.slice(0, 3);

    commits = lastRawCommits.map((commit) => ({
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
    contents:
      'This is one of the main contributors to the overall repository and this part of the repository specifically. Below you can see the contributors latest commits and the button on the right will take you straight to the respective Github profile.',
    commits,
  };
};

const createPackage = ({ name, version }) => {
  const path = 'path.to.package.json';
  const size = Math.floor(Math.random() * 250) + 50;

  return {
    type: 'PACKAGE',
    name,
    path,
    version,
    size,
    contents: `This package is used throughout this part of the repository. Below you can see the version that is installed currently. If you want to take a look at the package documentation, past versions and much more, click the button in the lower right corner. It'll lead you to the npmjs website of the package.`,
    url: `https://www.npmjs.com/package/${name}`,
  };
};

const createLegacy = async ({ path, count }) => {
  const fileSize = await getItemSize(path);
  const rawFileContents = await readFile(path, 'utf-8');
  const projectPath = path.replace(PROJECT_PATH, '');

  const fileContents = rawFileContents.replace(/\r\n/g, '\n').split('\n').slice(30, 40).join('\n');

  return {
    type: 'LEGACY',
    name: basename(projectPath),
    path: projectPath,
    size: count,
    contents: `This file seems pretty big compared to the other files in this part of the project. It's ${fileSize.size} bytes and has ${count} lines of code. That could make it hard to read for new contributors and people looking at the repository. You might want to look into a refactoring in order to keep it at a more readable size. What you could also do is contact one of the contributors to help in understanding what's going on. They must be hiding somewhere in this package as well, try to reveal them to access their Github profiles.`,
    fileContents,
    fileSize: fileSize.size,
    url: `https://github.com/ethereumjs/ethereumjs-monorepo/blob/master${projectPath}`,
  };
};
