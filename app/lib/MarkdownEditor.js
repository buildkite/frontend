class MarkdownEditor {
  constructor(textarea) {
    this.textarea = textarea;
  }

  bold() {
    this.modify("**{s}{t}{s}**");
  }

  italic() {
    this.modify("_{s}{t}{s}_");
  }

  quote() {
    this.modify(function(selectedText) {
      let lines = selectedText.split(/\r\n|\r|\n/);
      var replacement = [];

      for(var line of lines) {
        replacement.push("> " + line);
      }

      return "{s}" + replacement.join("\r\n") + "{s}"
    });
  }

  numberedList() {
    this.modify(function(selectedText) {
      let lines = selectedText.split(/\r\n|\r|\n/);
      var replacement = [];

      for (var index = 0; index < lines.length; index++) {
        replacement.push(`${index + 1}. ${lines[index]}`);
      }

      return "{s}" + replacement.join("\r\n") + "{s}"
    });
  }

  bulletedList() {
    this.modify(function(selectedText) {
      let lines = selectedText.split(/\r\n|\r|\n/);
      var replacement = [];

      for(var line of lines) {
        replacement.push(`- ${line}`)
      }

      return "{s}" + replacement.join("\r\n") + "{s}"
    });
  }

  code() {
    this.modify(function(selectedText) {
      // If there's more than 1 line of text, we should use a code fence
      // instead of just wrapping with a `
      if(selectedText.split(/\r\n|\r|\n/).length > 1) {
        return "```\n{s}{t}{s}\n```"
      } else {
        return "`{s}{t}{s}`"
      }
    });
  }

  link() {
    this.modify(function(selectedText) {
      // If we're making a link out text that starts with HTTP, then this
      // should become the link portion of the replacement.
      if(selectedText.indexOf("http:") == 0) {
        return "[{s}text{s}]({t})";
      } else if(selectedText.length > 0) {
        return "[{t}]({s}url{s})";
      } else {
        return "[{s}text{s}](url)";
      }
    });
  }

  isCursorOnNewLine() {
    return !!(this.textarea.value.substr(0,this.textarea.selectionStart).match(/(?:^|\r?\n\s*)$/)
              && this.textarea.value.substr(this.textarea.selectionStart).match(/^(?:\s*\r?\n|$)/));
  }

  // Replaces text in the text area and retains the users cursor
  replace(before, after) {
    // Grab the start/end of the currently selected text
    let selectionStart = this.textarea.selectionStart;
    let selectionEnd = this.textarea.selectionEnd;

    let indexOfBeforeText = this.textarea.value.indexOf(before);

    if(indexOfBeforeText < selectionStart) {
      let changeInLength = after.length - before.length;

      selectionStart += changeInLength;
      selectionEnd += changeInLength;
    }

    // When we perform the replacement, the cursor jumps to the end of the textarea
    this.textarea.value = this.textarea.value.replace(before, after);

    // Reset the selection to what it was before
    this.textarea.setSelectionRange(selectionStart, selectionEnd);
  }

  // Convenice method to append text to the textarea
  append(text) {
    this.textarea.value += text;
  }

  // Insert text at the current cursor position
  insert(text) {
    // Grab the start/end of the currently selected text
    let selectionStart = this.textarea.selectionStart;
    let selectionEnd = this.textarea.selectionEnd;

    // Insert the text in between the selection start & end
    let value = this.textarea.value;
    this.textarea.value = value.substring(0, selectionStart) + text + value.substring(selectionEnd, value.length);

    // Now set the selection to the end of what we just inserted
    this.textarea.setSelectionRange(selectionStart + text.length, selectionStart + text.length);
  }

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
  modify(instruction) {
    // Get the value current length of the string in the text area
    let value = this.textarea.value;
    let length = value.length;

    // Grab the start/end of the currently selected text
    let selectionStart = this.textarea.selectionStart;
    let selectionEnd = this.textarea.selectionEnd;

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

    var replacement;

    // If there wasn't a $t character, then the length of the explosion will
    // just be 1 (since there was nothing to split on). In that case we'll just
    // insert the instruction as is.
    if(explodedInstruction.length == 1) {
      replacement = instruction;
    } else {
      // Get the text before and after the $t so we know what to surround the
      // selection with.
      let beforeText = explodedInstruction[0];
      let afterText = explodedInstruction[1];

      // Wrap the text in it's new replacement
      replacement = beforeText + selectedText + afterText;
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

    // Set the new value back to the text area into the correct place
    this.textarea.value = value.substring(0, selectionStart) + replacement + value.substring(selectionEnd, length);

    // Re-select the text as per the {s} rules
    this.textarea.setSelectionRange(selectionStart + newSelectionStart, selectionStart + newSelectionEnd);
  }
}

export default MarkdownEditor;
