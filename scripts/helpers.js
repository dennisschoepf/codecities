import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: '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',
});

export async function getProjectContributors() {
  const contribs = await octokit.request('/repos/ethereumjs/ethereumjs-monorepo/contributors');
  const contributors = await Promise.all(
    contribs.data.map(async (contrib) => createContributor(contrib))
  );

  return contributors;
}

/*export async function getContributorsForSubproject(subproject) {
  const subprojectPackageJson = await readFile(
    resolve(subproject.filePath, 'package.json'),
    'utf8'
  );
  const parsedPackageJson = JSON.parse(subprojectPackageJson);

  try {
    if (parsedPackageJson.contributors && parsedPackageJson.contributors.length > 0) {
      const contributors = await Promise.all(
        parsedPackageJson.contributors.map(async (cntrb) => await createContributor(cntrb))
      );

      return contributors.filter((contributor) => !!contributor);
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
}*/

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

const createPackage = (pkg) => {
  const path = 'path.to.package.json';
  const size = 0;
  const contents = '';
  const url = '';

  return {
    type: 'PACKAGE',
    name: pkg,
    path,
    size,
    contents,
    url,
  };
};

const createLegacy = (lgcy) => {
  const size = 0;
  const contents = '';
  const url = '';

  return {
    type: 'LEGACY',
    name: 'filename',
    path: 'filePath',
    size,
    contents,
    url,
  };
};
