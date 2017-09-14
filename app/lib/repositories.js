// @flow

export function repositoryProviderIcon(providerName: ?string): string {
  switch (providerName) {
    case 'RepositoryProviderBitbucket':
      return 'bitbucket';
    case 'RepositoryProviderGithub':
      return 'github';
    case 'RepositoryProviderGithubEnterprise':
      return 'github';
    case 'RepositoryProviderGitlab':
      return 'gitlab';
    case 'RepositoryProviderGitlabCommunity':
      return 'gitlab';
    default:
      return 'git';
  }
}
