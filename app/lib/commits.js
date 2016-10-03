export function shortMessage(message) {
  return message.split("\n")[0];
}

export function shortCommit(commitish) {
  // Does this look like a git sha?
  if (commitish && commitish.length === 40) {
    return commitish.substring(0, 7);
  } else {
    return commitish;
  }
}
