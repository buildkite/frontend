// @flow

// Reformats a multi-line job command into a single line bash command. Returns
// falsey if command is falsey.
//
// For example:
//   jobCommandOneliner("\n\n\nls -l\n\necho 'oh hai'\n")
//   => "ls -l && echo 'oh hai'"
export default function jobCommandOneliner(command: ?string): ?string {
  if (command) {
    return command.trim().replace(/\s*\n+\s*/g, " && ");
  }
}
