import ExtendableError from 'es6-error';

class AssetUploaderError extends ExtendableError {
  constructor(message = 'An internal error occured. Please try again.') {
    super(message);
  }
}

class AssetUploader {
  constructor(options) {
    this.options = options;
  }

  doesEventContainFiles(event) {
    return event.dataTransfer && event.dataTransfer.types.indexOf("Files") >= 0;
  }

  uploadFromEvent(event) {
    var files;

    if(event.type == "drop") {
      files = this._extractFilesFromEvent(event);
    } else if (event.type == "paste") {
      files = this._extractFilesFromEventt(event);
    } else {
      throw("Unknown event for asset upload `" + event.type + "`")
    }

    if(files.length > 0) {
      this._startUploadingFiles(files);
    }

    return files;
  }

  // This will post file information to Buildkite. The resulting response from
  // the server will include instructions on where to upload the files.
  _startUploadingFiles(files) {
    var payload = { files: [] }

    // Add the files to the payload
    files.forEach((f) => {
      payload.files.push({ name: f.name, type: f.type, size: f.size });
    });

    // Post the files back to Buildkite
    fetch(this.options.url, {
      credentials: 'same-origin',
      method: 'post',
      headers: {
	'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': window._csrf.token
      },
      body: JSON.stringify(payload)
    }).then((response) => {
      response.json().then((json) => {
        // If the request failed, then we should have an error in the JSON
        // payload that we can show.
        if (!response.ok) {
          this.options.onError(new AssetUploaderError(json.error));
        } else {
          console.log('parsed json', json)
        }
      }).catch((exception) => {
        this.options.onError(new AssetUploaderError("An error occured while parsing the upload response from Buildkite. Please try again."));
      })
    })
  }

  _extractFilesFromEvent(event) {
    var files = [];

    for (var i = 0; i < event.dataTransfer.files.length; i++) {
      var f = event.dataTransfer.files[i];

      files.push(f);
    };

    return files;
  }

  _extractFilesFromEventt(event) {
    var files = [];

    for (var i = 0; i < event.clipboardData.items.length; i++) {
      var item = event.clipboardData.items[i];
      var file = item.getAsFile();

      if(file) {
        files.push(file);
      }
    }

    return files;
  }
}

export default AssetUploader;
