/* global describe, it, expect */
import { repositoryProviderIcon } from './repositories';

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
