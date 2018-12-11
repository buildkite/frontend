// @flow

export function shortMessage(message: string): string {
  return message.split('\n')[0];
}

export function shortCommit(commitish: string): string {
  // Does this look like a git sha?
  if (commitish && commitish.length === 40 && !commitish.match(/[^a-f0-9]/i)) {
    return commitish.substring(0, 7);
  }

  return commitish;
}
