// @flow

import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import AssetUploader from 'app/lib/AssetUploader';
import Spinner from 'app/components/shared/Spinner';

const DropArea = styled('div')`
  border-radius: 60px;
  transition: border-color 150ms ease-in-out;
`;

const PreviewButton = styled('button').attrs({
  type: 'button',
  className: 'flex-none circle bg-white border border-gray relative p0 mr2'
})`
  height: 52px;
  width: 52px;
  overflow: hidden;
  cursor: pointer;

  &:disabled {
    cursor: wait;
  }
`;

const PreviewButtonLabel = styled('div').attrs({
  className: 'flex items-center justify-center absolute p1 white circle'
})`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(20, 204, 128, 0.76);
  text-shadow: 0px 0px 4px black;
  opacity: 0;
  transition: opacity 150ms ease-in-out;

  ${PreviewButton}:hover > &,
  ${PreviewButton}:focus > &,
  ${PreviewButton}:active > & {
    opacity: 1;
  }

  ${PreviewButton}:disabled:hover > &,
  ${PreviewButton}:disabled:focus > &,
  ${PreviewButton}:disabled:active > & {
    opacity: 0;
  }
`;

type Props = {
  imageUrl: string,
  onChange?: Function,
  onUpload?: Function,
  onError?: Function
};

type State = {
  allowFileInput: boolean,
  documentHover: boolean,
  dropAreaHover: boolean,
  uploading: boolean,
  uploaded: boolean,
  error: ?Error,
  currentImageUrl: ?string,
  lastImageUrl: ?string
};

export default class ImageUploadField extends React.PureComponent<Props, State> {
  state = {
    allowFileInput: false,
    documentHover: false,
    dropAreaHover: false,
    uploading: false,
    uploaded: false,
    error: null,
    currentImageUrl: null,
    lastImageUrl: null
  };

  assetUploader: AssetUploader;
  dragTimeout: TimeoutID;

  _iconInput: ?HTMLInputElement;
  iconInputRef = (ref: ?HTMLInputElement) => this._iconInput = ref;

  _dragArea: ?HTMLDivElement;
  dragAreaRef = (ref: ?HTMLDivElement) => this._dragArea = ref;

  _loadImage: ?Promise<{ default: Function }>;

  componentDidMount() {
    this.assetUploader = new AssetUploader({
      onAssetUploaded: this.handleAssetUploaded,
      onError: this.handleAssetUploadError
    });

    document.addEventListener('dragover', this.handleDocumentDragOver);
  }

  componentWillUnmount() {
    delete this.assetUploader;

    document.removeEventListener('dragover', this.handleDocumentDragOver);
  }

  handleAssetUploaded = (file: File, asset: Object) => {
    if (this.props.onUpload) {
      this.props.onUpload(asset);
    }

    this.setState({
      uploading: false,
      uploaded: true,
      error: null
    });
  }

  handleAssetUploadError = (error: Error) => {
    if (this.props.onError) {
      this.props.onError(error);
    }

    if (this.state.currentImageUrl) {
      URL.revokeObjectURL(this.state.currentImageUrl);
    }

    this.setState({
      uploading: false,
      uploaded: false,
      currentImageUrl: this.state.lastImageUrl,
      lastImageUrl: null,
      error
    });
  }

  handleDocumentDragOver = (event: DragEvent) => {
    // Skip any events which are inside our drop target, so we're not resetting constantly
    if (this._dragArea && this._dragArea.contains(((event.target: any): HTMLDivElement))) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    // Make sure we're loading the image processing code now the user is dragging something around
    this.getLoadImage();

    this.setState(
      {
        dropAreaHover: false,
        documentHover: true
      },
      this.setDragTimeout
    );
  }

  setDragTimeout = () => {
    this.cancelDragTimeout();
    this.dragTimeout = setTimeout(this.handleDragCancelled, 500);
  }

  cancelDragTimeout = () => {
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
    }
  }

  handleDragCancelled = () => {
    this.setState({ documentHover: false, dropAreaHover: false });
  }

  handleDropAreaDragOver = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();

    // Make sure we're now loading (hopefully _have loaded_!) the image
    // processing code now that the user is dragging over the drop area
    this.getLoadImage();

    this.setState({ dropAreaHover: true }, this.setDragTimeout);
  }

  handleDropAreaDrop = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();

    this.startUpload(event.dataTransfer && event.dataTransfer.files);
  }

  handleIconInputChange = () => {
    // If we don't have a ref to _iconInput, something's gone weird;
    // re-render and abort this event
    if (!this._iconInput) {
      this.setState({ allowFileInput: false });
      return;
    }

    this.startUpload(this._iconInput && this._iconInput.files);
  }

  getLoadImage = () => {
    // If we don't have our import promise stored, create it
    if (!this._loadImage) {
      this._loadImage = import('blueimp-load-image');
    }

    // Finally, return the promise
    return this._loadImage;
  }

  withLoadImage = (callback: Function) => {
    // Call back with the default loadImage
    // function, once the import promise resolves
    this.getLoadImage().then((module) => callback(module.default));
  }

  startUpload = (files: ?FileList) => {
    if (this.props.onChange) {
      this.props.onChange();
    }

    this.setState(
      {
        allowFileInput: false,
        documentHover: false,
        dropAreaHover: false,
        uploading: true,
        uploaded: false,
        error: null
      },
      () => {
        const imageFiles = Array.prototype.filter.call(
          files, (file) => file.type.indexOf("image/") === 0
        );

        if (imageFiles.length === 1) {
          const imageFile = imageFiles[0];

          // If the image is less than 256 kb, is an svg (and thus can't be
          // resized!), or is a gif less than 768kb, don't bother resizing
          if (imageFile.size <= 262144 ||
              imageFile.type === 'image/svg' ||
              (imageFile.type === 'image/gif' && imageFile.size <= 786432)) {
            this.processUpload(imageFile);
            return;
          }

          this.withLoadImage(
            (loadImage: Function) => loadImage(
              imageFile,
              (processed: HTMLImageElement | HTMLCanvasElement | Event) => {
                if (processed instanceof HTMLCanvasElement) {
                  processed.toBlob(
                    (blob: Blob) => {
                      // If we didn't improve things, then let's just upload the original
                      if (blob.size >= imageFile.size) {
                        this.processUpload(imageFile);
                      } else {
                        this.processUpload(blob);
                      }
                    },
                    imageFile.type
                  );
                } else {
                  // If loadImage gives us an <img/> (means the browser couldn't
                  // do canvas), or otherwise couldn't resize it, use the original
                  this.processUpload(imageFile);
                }
              },
              {
                // NOTE: Minimum heights and widths are merely so the library
                // doesn't try to upscale the images. For what it's worth, most
                // tiny images won't ever reach this point anyway due to byte
                // size, so we won't likely be processing any 1px tracking gifs
                // via this code, but might as well be lossless when acceptable.
                minHeight: 1,
                minWidth: 1,
                // This asks the resize library to respect EXIF orientation
                // information in JPEGs, so we don't end up with sideways avatars
                orientation: true,
                // Finally, this is the size we will downscale larger images to.
                //
                // 500px was chosen to balance byte size and utility because we'd
                // like the ability to display larger images in the future, but
                // don't currently have tech to resize for each display size, so
                // this avoids us displaying a 1024px image in 25px img tags!
                maxHeight: 500,
                maxWidth: 500
              }
            )
          );
        } else if (imageFiles.length > 1) {
          this.setError(new Error('Only one image can be uploaded.'));
        } else {
          this.setError(new Error('You can only upload images.'));
        }
      }
    );
  }

  processUpload = (imageFile: File | Blob) => {
    if (imageFile.size > 2097152) {
      this.setError(
        new Error(
          'Sorry, that image is too large. Please try one smaller than 2 megabytes.'
        )
      );
      return;
    }

    const processedUrl = URL.createObjectURL(imageFile);

    if (this.state.lastImageUrl) {
      URL.revokeObjectURL(this.state.lastImageUrl);
    }

    this.setState({
      currentImageUrl: processedUrl,
      lastImageUrl: this.state.currentImageUrl
    });

    this.assetUploader.uploadFromArray([imageFile]);
  };

  setError = (error: Error) => {
    this.setState(
      {
        uploading: false,
        error
      },
      () => {
        if (this.props.onError) {
          this.props.onError(error);
        }
      }
    );
  }

  handleUploadClick = (event: MouseEvent) => {
    event.preventDefault();

    // Start loading the image processing code while the user browses for a file
    this.getLoadImage();

    this.setState(
      { allowFileInput: true },
      () => {
        if (this._iconInput) {
          this._iconInput.click();
        }
      }
    );
  }

  render() {
    const { documentHover, dropAreaHover } = this.state;

    return (
      <DropArea
        className={classNames("flex items-center p1 mxn1 border border-transparent", {
          'border-transparent': !(documentHover && dropAreaHover),
          'border-gray': documentHover && !dropAreaHover,
          'border-lime': dropAreaHover
        })}
        // TODO: Port to forwardRef once we land styled-components v4
        innerRef={this.dragAreaRef}
        onDragOver={this.handleDropAreaDragOver}
        onDrop={this.handleDropAreaDrop}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={!this.state.allowFileInput}
          ref={this.iconInputRef}
          onChange={this.handleIconInputChange}
        />
        <PreviewButton onClick={this.handleUploadClick}>
          <PreviewButtonLabel>Edit</PreviewButtonLabel>
          <img
            src={this.state.currentImageUrl || this.props.imageUrl}
            height="100%"
            width="100%"
            alt="Current Organization Icon"
          />
        </PreviewButton>
        {this.renderOutput()}
      </DropArea>
    );
  }

  renderOutput() {
    const { documentHover, dropAreaHover, uploading, uploaded, error } = this.state;

    let message = (
      <span>
        <a href="#" onClick={this.handleUploadClick} className="lime hover-lime text-decoration-none hover-underline">
          Choose an image
        </a> to upload.<br />
        Images should be square, and at least 500px wide.
      </span>
    );

    if (dropAreaHover) {
      message = 'Thatʼs it! Right here.';
    } else if (documentHover) {
      message = 'Drop your new icon here.';
    } else if (uploading) {
      message = (
        <>
          <Spinner className="mr1" />
          Uploading&hellip;
        </>
      );
    } else if (uploaded) {
      message = null;
    } else if (error) {
      message = error.message;
    }

    return (
      <small className="flex flex-stretch items-center hint-block m0 line-height-3 h5 regular">
        {message}
      </small>
    );
  }
}
