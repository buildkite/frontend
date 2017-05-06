/* global describe, it, expect */
import { repositoryGitToWebUri, repositoryProviderIcon } from './repositories';

const VALID_REPOSITORY_URIS = [
  // these should work!
  'https://github.com/ticky/jessicastokes.net.git',
  'git@github.com:buildkite/bash-example.git',
  'git+ssh://git@github.com/ticky/mojibaka.git',
  'git://git@github.com:80/ticky/mojibaka.git',
  'git@repo.buildkite.example.com:this-might-be/gitlab-or-something-right.git',
  'git@codebasehq.com:2fast/2furious/movie.git',
  'http://home.someguy.io:8000/myrepo/private-server.git',
  'gitisweird.net.au:this/is/valid/somehow.git'
];

const INVALID_REPOSITORY_URIS = [
  '',
  '/',
  'file://'
];

describe('repositoryGitToWebUri', () => {
  describe('returns expected web URI', () => {
    VALID_REPOSITORY_URIS.forEach((uri) => {
      it(`for ${JSON.stringify(uri)}`, () => {
        const webUri = repositoryGitToWebUri(uri);
        expect(webUri).toMatchSnapshot();
        expect(webUri.indexOf('http')).toBe(0);
      });
    });
  });

  describe('returns undefined for dangerous or unexpected things, like', () => {
    INVALID_REPOSITORY_URIS.forEach((uri) => {
      it(JSON.stringify(uri), () => {
        expect(repositoryGitToWebUri(uri)).toBeUndefined();
      });
    });
  });
});

const PROVIDERS = [
  'RepositoryProviderBitbucket',
  'RepositoryProviderCodebase',
  'RepositoryProviderGithub',
  'RepositoryProviderGithubEnterprise',
  'RepositoryProviderGitlab',
  'RepositoryProviderGitlabCommunity',
  'RepositoryProviderUnknown'
];

describe('repositoryProviderIcon', () => {
  describe('returns expected icon names', () => {
    PROVIDERS.forEach((provider) => {
      it(`for ${provider}`, () => {
        expect(repositoryProviderIcon(provider)).toMatchSnapshot();
      });
    });
  });
});
