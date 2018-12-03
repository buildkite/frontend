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
  className: 'circle border border-gray relative p0'
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

  _iconInput: ?HTMLInputElement;
  assetUploader: AssetUploader;
  dragTimeout: TimeoutID;

  componentDidMount() {
    this.assetUploader = new AssetUploader({
      onAssetUploaded: this.handleAssetUploaded,
      onError: this.handleAssetUploadError
    });

    document.addEventListener('dragenter', this.handleDocumentDragEnter);
  }

  componentWillUnmount() {
    delete this.assetUploader;

    document.removeEventListener('dragenter', this.handleDocumentDragEnter);
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

  handleDocumentDragEnter = () => {
    this.setState(
      { documentHover: true },
      () => {
        if (this.dragTimeout) {
          clearTimeout(this.dragTimeout);
        }

        this.dragTimeout = setTimeout(this.handleDocumentDragTimeout, 2000);
      }
    );
  }

  handleDocumentDragTimeout = () => {
    this.setState({ documentHover: false });
  }

  handleDropAreaDragOver = (event: DragEvent) => {
    event.preventDefault();

    this.setState(
      { dropAreaHover: true },
      () => {
        if (this.dragTimeout) {
          clearTimeout(this.dragTimeout);
        }
      }
    );
  }

  handleDropAreaDrop = (event: DragEvent) => {
    event.preventDefault();
    (event: Object).persist();

    this.setState(
      {
        allowFileInput: false,
        documentHover: false,
        dropAreaHover: false,
        uploading: false,
        uploaded: false,
        error: null
      },
      () => {
        const imageFiles = Array.prototype.filter.call(
          (event.dataTransfer ? event.dataTransfer.files : new FileList()),
          (file) => file.type.indexOf("image/") === 0
        );

        if (imageFiles.length === 1) {
          if (this.state.lastImageUrl) {
            URL.revokeObjectURL(this.state.lastImageUrl);
          }

          this.setState({
            uploading: true,
            currentImageUrl: URL.createObjectURL(imageFiles[0]),
            lastImageUrl: this.state.currentImageUrl
          });
          this.assetUploader.uploadFromEvent(event);
        } else if (imageFiles.length > 1) {
          this.setState({
            error: new Error('Only one image can be uploaded.')
          });
        } else {
          this.setState({
            error: new Error('You can only upload images.')
          });
        }
      }
    );
  }

  iconInputRef = (ref: ?HTMLInputElement) => this._iconInput = ref;

  handleIconInputChange = (event: MouseEvent) => {
    if (!this._iconInput) {
      this.setState({ allowFileInput: false });
      return;
    }

    (event: Object).persist();

    this.setState(
      {
        allowFileInput: false,
        documentHover: false,
        dropAreaHover: false,
        uploading: false,
        uploaded: false,
        error: null
      },
      () => {
        const imageFiles = Array.prototype.filter.call(
          (this._iconInput ? this._iconInput.files : new FileList()),
          (file) => file.type.indexOf("image/") === 0
        );

        if (imageFiles.length === 1) {
          if (this.state.lastImageUrl) {
            URL.revokeObjectURL(this.state.lastImageUrl);
          }

          this.setState({
            uploading: true,
            currentImageUrl: URL.createObjectURL(imageFiles[0]),
            lastImageUrl: this.state.currentImageUrl
          });
          this.assetUploader.uploadFromElement(event.target);
        } else if (imageFiles.length > 1) {
          this.setState({
            error: new Error('Only one image can be uploaded.')
          });
        } else {
          this.setState({
            error: new Error('You can only upload images.')
          });
        }
      }
    );
  }

  handlePreviewButtonClick = (event: MouseEvent) => {
    event.preventDefault();

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
      <div className="form-group">
        <DropArea
          className={classNames("flex items-center p1 mxn1 border border-transparent", {
            'border-transparent': !(documentHover && dropAreaHover),
            'border-gray': documentHover && !dropAreaHover,
            'border-lime': dropAreaHover
          })}
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
          <PreviewButton onClick={this.handlePreviewButtonClick}>
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
      </div>
    );
  }

  renderOutput() {
    const { documentHover, dropAreaHover, uploading, uploaded, error } = this.state;

    let message = (
      <>
        Drag and drop, or click to choose an image to upload.<br />
        Images should be square, and at least 500px wide.
      </>
    );

    if (documentHover) {
      message = (
        <>Drop your new icon here.</>
      );
    } else if (dropAreaHover) {
      message = (
        <>Thatʼs it! Right here.</>
      );
    } else if (uploading) {
      message = (
        <><Spinner />Uploading&hellip;</>
      );
    } else if (uploaded) {
      message = null;
    } else if (error) {
      message = error.message;
    }

    return (
      <div className="flex flex-stretch items-center">
        <small className="hint-block m0 ml2">
          {message}
        </small>
      </div>
    );
  }
}
