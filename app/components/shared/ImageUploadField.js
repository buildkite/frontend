// @flow

import React from 'react';
// import classNames from 'classnames';

type Props = {
  imageUuidInputName: string,
  fileInputId: string,
  currentImageUrl: string
};

export default class ImageUploadField extends React.PureComponent<Props> {
  state = {
  };

  render() {
    return (
      <div className="form-group">
        <div className="flex items-center p1 mxn1 border border-transparent" style={{ borderRadius: 60 }}>
          <input type="hidden" name={this.props.imageUuidInputName} />
          <input type="file" id={this.props.fileInputId} accept="image/*" className="hidden" disabled={true} />
          <button className="circle border border-gray relative p0" style={{ height: 52, width: 52, overflow: 'hidden' }}>
            <div className="flex items-center justify-center absolute p1 white circle" style={{ top: 0, bottom: 0, left: 0, right: 0, background: "rgba(20,204,128,0.76)", textShadow: '0px 0px 4px black' }}>
              Edit
            </div>
            <img src={this.props.currentImageUrl} height="100%" width="100%" alt="Current Organization Icon"/>
          </button>
          <p className="flex flex-stretch items-center">
            <small className="hint-block m0 ml2">
              Drag and drop, or click to choose an image to upload.<br />
              Images should be square, and at least 500px wide.
            </small>
          </p>
        </div>
      </div>
    );
  }
}

// TODO: Migrate styles
// #drop_area {
//   transition: border-color 150ms ease-in-out;
// }

// #icon_button {
//   cursor: pointer;
// }

// #icon_button:disabled {
//   cursor: wait;
// }

// #icon_button > #icon_button_label {
//   opacity: 0;
//   transition: opacity 150ms ease-in-out;
// }

// #icon_button:hover > #icon_button_label,
// #icon_button:focus > #icon_button_label,
// #icon_button:active > #icon_button_label {
//   opacity: 1;
// }

// #icon_button:disabled:hover > #icon_button_label,
// #icon_button:disabled:focus > #icon_button_label,
// #icon_button:disabled:active > #icon_button_label {
//   opacity: 0;
// }

// TODO: Migrate JS
// (function(
//   AssetUploader,
//   iconFormGroup, iconDropArea, iconInput, iconButton, iconButtonImage, iconErrorParagraph, iconUUIDInput,
//   accountSubmit,
//   uploaderOutput
// ) {

//   var resetOutput = function(options) {
//     var options = options || {};
//     uploaderOutput.innerHTML = (options.message !== undefined) ? options.message : 'Drag and drop, or click to choose an image to upload.<br/>Images should be square, and at least 500px wide.'
//     iconButton.disabled = false;
//     accountSubmit.disabled = false;
//     iconFormGroup.classList.remove('has-error');
//     iconDropArea.classList.remove('border-gray');
//     iconDropArea.classList.remove('border-lime');
//     iconDropArea.classList.add('border-transparent');
//     setIconFieldError(null);
//   };

//   var setIconFieldError = function(errorMessage) {
//     if (errorMessage) {
//       resetOutput();
//       iconFormGroup.classList.add('has-error');
//       iconErrorParagraph.textContent = errorMessage;
//       iconErrorParagraph.classList.remove('hidden');
//     } else {
//       iconFormGroup.classList.remove('has-error');
//       iconErrorParagraph.classList.add('hidden');
//     }
//   }

//   var uploader = new AssetUploader({
//     onAssetUploaded: function handleAssetUploaded(file, asset) {
//       iconUUIDInput.value = asset.id;
//       resetOutput({ message: '' });
//     },

//     onError: function handleAssetUploadError(exception) {
//       setIconFieldError('Upload failed. ' + exception.message);
//       throw exception;
//     }
//   });

//   var updateImageSrc = function(element, src) {
//     var previousSrc = element.src;

//     element.src = src;

//     // Just in case, we invalidate any blob urls we're replacing
//     if (previousSrc.indexOf('blob:') === 0) {
//       URL.revokeObjectURL(previousSrc);
//     }
//   };

//   var dragTimeout;


//   var uploadFiles = function(files) {
//     var imageFiles = Array.prototype.filter.call(
//       files,
//       function(file) {
//         return file.type.indexOf("image/") === 0
//       }
//     );

//     if (imageFiles.length === 1) {
//       iconInput.disabled = true;
//       iconButton.disabled = true;
//       accountSubmit.disabled = true;
//       updateImageSrc(iconButtonImage, URL.createObjectURL(imageFiles[0]));
//       uploaderOutput.innerHTML = '<i class="fa fa-spin fa-spinner"></i> Uploading&hellip;';
//       uploader.uploadFromEvent(event);
//     } else if (imageFiles.length > 1) {
//       setIconFieldError('Only one image can be uploaded.')
//     } else {
//       setIconFieldError('You can only upload images.')
//     }
//   };

//   document.addEventListener('dragenter', function(event) {
//     event.stopPropagation();
//     event.preventDefault();
//     resetOutput();
//     uploaderOutput.innerHTML = 'Drop your new icon here.';
//     iconDropArea.classList.remove('border-transparent');
//     iconDropArea.classList.remove('border-lime');
//     iconDropArea.classList.add('border-gray');
//     clearTimeout(dragTimeout);
//     dragTimeout = setTimeout(resetOutput, 2000);
//   });

//   iconDropArea.addEventListener('dragover', function(event) {
//     event.stopPropagation();
//     event.preventDefault();
//     uploaderOutput.innerHTML = 'Thatʼs it! Right here.';
//     iconDropArea.classList.remove('border-transparent');
//     iconDropArea.classList.remove('border-gray');
//     iconDropArea.classList.add('border-lime');
//     clearTimeout(dragTimeout);
//   });

//   iconDropArea.addEventListener('drop', function(event) {
//     event.stopPropagation();
//     event.preventDefault();

//     iconDropArea.classList.remove('border-gray');
//     iconDropArea.classList.remove('border-lime');
//     iconDropArea.classList.add('border-transparent');

//     clearTimeout(dragTimeout);
    
//     uploadFiles(event.dataTransfer.files);
//   });

//   iconButton.addEventListener('click', function(event) {
//     event.preventDefault();
//     iconInput.disabled = false;
//     iconInput.click();
//   });

//   iconInput.addEventListener('change', function() {
//     uploadFiles(iconInput.files);
//   });
// })(
//   Webpack.require('lib/AssetUploader'),
//   document.getElementById('icon_form_group'),
//   document.getElementById('drop_area'),
//   document.getElementById('icon_file'),
//   document.getElementById('icon_button'),
//   document.getElementById('icon_button_image'),
//   document.getElementById('icon_error_paragraph'),
//   document.getElementById('account_icon_uuid'),
//   document.querySelector('form.edit_account input[type="submit"]'),
//   document.getElementById('uploader_output')
// );