class AssetUploader {
  constructor() {
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
      // TODO: Upload
    }

    return files;
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
