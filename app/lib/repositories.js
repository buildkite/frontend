const REPOSITORY_PROVIDER_ICON_MAP = {
  RepositoryProviderBitbucket: 'bitbucket',
  RepositoryProviderGithub: 'github',
  RepositoryProviderGithubEnterprise: 'github',
  RepositoryProviderGitlab: 'gitlab',
  RepositoryProviderGitlabCommunity: 'gitlab'
};

export function repositoryProviderIcon(providerName) {
  return REPOSITORY_PROVIDER_ICON_MAP[providerName] || 'git';
}
