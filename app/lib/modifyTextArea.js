// Modifies the currently highlighted text. This function accepts either a
// function a string that is a modification instruction, or a function(that
// is passed the highlighted text, and then returns a modification
// instruction.
//
// A modification instruction is a string instructing us what to do with the
// highlighted text, and what to highlight afterwards.
//
// - {t} will be replaced with the currently highlighted text
// - The text surrounded with {s}...{s} will be highlighted after the modification.
//
// For example a modification instruction such as "__{s}{t}{s}__" will surround
// the highlighted text with `__` and then select the original text. If the rule
// was "{s}__{t}__{s}", the entire text would be highlighted after the modification.

export default function modifyTextArea(textarea, instruction) {
  // Get the value current length of the string in the text area
  let value = textarea.value;
  let length = value.length;

  // Grab the start/end of the currently selected text
  let selectionStart = textarea.selectionStart;
  let selectionEnd = textarea.selectionEnd;

  // Substring the selected text out of the value
  var selectedText = value.substring(selectionStart, selectionEnd);

  // Escape the magical characters "{" and "}" that we use
  selectedText = selectedText.replace(/\{(t|s)\}/gmi, "\\{$1\\}")

  // Figure out what to surround the text with
  if(typeof instruction == "function") {
    instruction = instruction(selectedText);
  }

  // Make sure that if the highlighter characters are there, that there are
  // exactly 2 of them
  let highlighterCount = instruction.match(/\{s\}/gmi);
  if(!highlighterCount || highlighterCount.length != 2) {
    throw(`There needs to be only 2 {s} sequences in this modification instruction "${instruction}"`);
  }

  // Split the instruction on the string replacement
  let explodedInstruction = instruction.split("{t}");

  // If there wasn't a $t character, then the length of the explosion will
  // just be 1 (since there was nothing to split on). In that case we'll just
  // insert the instruction as is.
  if(explodedInstruction.length == 1) {
    var replacement = instruction;
  } else {
    // Get the text before and after the $t so we know what to surround the
    // selection with.
    let beforeText = explodedInstruction[0];
    let afterText = explodedInstruction[1];

    // Wrap the text in it's new replacement
    var replacement = beforeText + selectedText + afterText;
  }

  // Record the current replacement length because we'll need to know it's
  // original size after we remove the {t} and {s} characters from it
  let replacementLengthBefore = replacement.length;

  // Get the indexes of the {s} sequences so we know where to highlight
  let newSelectionStart = replacement.indexOf("{s}");
  let newSelectionEnd = replacement.indexOf("{s}", newSelectionStart + 1) + "{s}".length;

  // Remove the highlight sequences and un-escape any {t} and {s} sequences that may
  // have been there before.
  replacement = replacement.replace(/\{s\}/gmi, "");
  replacement = replacement.replace(/\\\{(t|s)\\\}/gmi, "{$1}");

  // Since the size of the string has now changed, we need to remove the the
  // same amount of characters from the index of the selection end. i.e. if 5
  // characters were removed, then we need to move the selection end back by
  // 5.
  newSelectionEnd = newSelectionEnd - (replacementLengthBefore - replacement.length);

  console.log(replacement);

  // Set the new value back to the text area into the correct place
  textarea.value = value.substring(0, selectionStart) + replacement + value.substring(selectionEnd, length);

  // Re-select the text as per the {s} rules
  textarea.setSelectionRange(selectionStart + newSelectionStart, selectionStart + newSelectionEnd);
}
