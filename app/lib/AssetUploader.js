import ExtendableError from 'es6-error';

class AssetUploaderError extends ExtendableError {
  constructor(message = 'An internal error occured. Please try again.') {
    super(message);
  }
}

class AssetUploader {
  constructor(options) {
    this.options = options;
    this._pasteCounter = 0;
  }

  doesEventContainFiles(event) {
    return event.dataTransfer && event.dataTransfer.types.indexOf("Files") >= 0;
  }

  uploadFromEvent(event) {
    var files;

    if(event.type == "drop") {
      files = this._extractFilesFromDropEvent(event);
    } else if (event.type == "paste") {
      files = this._extractFilesFromPasteEvent(event);
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
    fetch("/uploads", {
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
          // Now that the server has responded with upload instructions, kick
          // the uploads off
          json.assets.forEach((asset, index) => {
            this._uploadFile(asset.upload, files[index]);
          });
        }
      })
    })
  }

  // Takes an upload instruction, and a file object, and uploads it as per the
  // instructions.
  _uploadFile(upload, file) {
    var formData = new FormData();

    // Add in the file to the form upload
    formData.append('file', file);

    // Copy the keys from our upload instructions into the form data
    for(let key in upload.fields) {
      formData.append(key, upload.fields[key]);
    }

    // Now we can upload the file
    fetch(upload.url, {
      method: 'post',
      body: formData
    }).then((response) => {
      if(response.ok) {
        this._finalizeFileUpload(upload, file);
      } else {
        this.options.onError(new AssetUploaderError("There was an error uploading the file. Please try again."));
      }
    });
  }

  // Once a file has finally uploaded, we need to notify Buildkite that it's
  // finished, at which point we'll get a URL back.
  _finalizeFileUpload(upload, file) {
    fetch("/uploads/" + upload.id, {
      credentials: 'same-origin',
      method: 'put',
      headers: {
	'Accept': 'application/json',
        'X-CSRF-Token': window._csrf.token
      },
      body: JSON.stringify({ finished: true })
    }).then((response) => {
      response.json().then((json) => {
        if (!response.ok) {
          this.options.onError(new AssetUploaderError(json.error));
        } else {
          // Yay! File all uploaded and ready to show :)
          this.options.onAssetUploaded(file, json.url);
        }
      })
    })
  }

  _extractFilesFromDropEvent(event) {
    var files = [];

    for (var i = 0; i < event.dataTransfer.files.length; i++) {
      var f = event.dataTransfer.files[i];
      files.push(f);
    };

    return files;
  }

  _extractFilesFromPasteEvent(event) {
    var files = [];

    for (var i = 0; i < event.clipboardData.items.length; i++) {
      var item = event.clipboardData.items[i];
      var file = item.getAsFile();

      if(file) {
        // Images that get pasted don't have file names, so we'll generate one
        let extension = file.type.split("/")[1];
        let name = "image-" + (this._pasteCounter += 1);
        file.name = name + "." + extension;

        files.push(file);
      }
    }

    return files;
  }
}

export default AssetUploader;
