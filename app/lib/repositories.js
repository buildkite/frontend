export function repositoryGitToWebUri(gitUri) {
  // bail on empty URIs
  if (!gitUri) {
    return;
  }

  // file: uris look like other uris but we can't
  // magick them into things that work in-browser
  if (gitUri.indexOf('file://') === 0) {
    return;
  }

  // make an HTTPS url out of it - this'll work for most hosts
  const newUri = gitUri.replace(
    /^([^:]+:\/\/)?(?:git@)?([^:]+:[0-9]+|[^:\/]+)[:/](.+)$/i,
    (match, protocol, host, path) => {
      if (!protocol || protocol.indexOf('https') !== 0) {
        protocol = 'https://';
      }

      return `${protocol}${host}/${path.replace(/\.git$/i, '')}`;
    }
  );

  // if this is a new URI now
  if (newUri.indexOf('://') !== -1) {
    return newUri;
  }

  return;
}

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
