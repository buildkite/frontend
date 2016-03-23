// Reformats a multi-line job command into a single line bash command. Returns
// falsey if command is falsey.
//
// For example:
//   jobCommandOneliner("\n\n\nls -l\n\necho 'oh hai'\n")
//   => "ls -l && echo 'oh hai' &&"
export default function jobCommandOneliner(command) {
  if (command) {
    return command.
      // Remove any leading whitespace (such as multiple new lines before any
      // commands)
      replace(/^(\n|\s)+/, "").
      // We want && to appear when you hit enter in the command text area,
      // so we collapse all trailing whitespace to a single &&
      replace(/\s*\n+\s*/g, " && ");
  }
}
