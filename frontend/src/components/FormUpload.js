import React from 'react';
import Dropzone from 'react-dropzone';

class FormUpload extends React.Component {
  state = {
    uploadState: false,
    file: [],
    allowToUpload: false
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles) {
      this.setState({ file: acceptedFiles }, () => {
        this.checkForm();
      });
    }
  }

  checkForm = () => {
    if (this.firstName.value.length > 0 &&
      this.lastName.value.length > 0 &&
      this.state.file.length > 0) {
      this.setState({ allowToUpload: true });
    } else {
      this.setState({ allowToUpload: false });
    }
  }

  handleUpload = (e) => {
    e.preventDefault();

    if (this.state.allowToUpload) {
      const data = new FormData();
      let file = this.state.file[0];

      data.append('file', file);
      data.append('extend', file.name.substr(file.name.length - 3))
      data.append('lastname', this.lastName.value);
      data.append('firstname', this.firstName.value);

      fetch(`${this.props.networkUrl}:8000/upload`, {
        method: 'POST',
        body: data,
      }).then((response, error) => {
        response.json().then((body) => {
          this.setState({ uploadState: true });
          this.formUpload.reset();
        }).catch(err => {
          console.log('caught it!', err);
        });
      });
    }
  }
  focusInput = (event) => {
    let label = event.target.parentNode.querySelector("label");
    let input = event.target.parentNode.querySelector("input");
    input.focus();
    if (input.value) {
      label.classList.add("hide");
    } else {
      label.classList.remove("hide");
      label.classList.add("focus");
    }
  }
  blurInput = (event) => {
    let label = event.target.parentNode.querySelector("label");
    let input = event.target.parentNode.querySelector("input");
    if (input.value) {
      label.classList.remove("focus");
      label.classList.add("hide");
    } else {
      label.classList.remove("hide");
      label.classList.remove("focus");
    }
  }

  render() {
    return (
      <form className={this.state.uploadState ? "formUpload uploadSucess" : "formUpload uploadDefault"} onChange={this.checkForm} onSubmit={this.handleUpload} ref={(ref) => { this.formUpload = ref; }}>
        <Dropzone accept=".rar, .zip, application/x-rar-compressed, application/rar, application/octet-stream, application/zip, application/x-zip-compressed" onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
            let classList = "dropzone"
            let message = "Ajouter un fichier"

            if (rejectedFiles.length > 0) {
              message = "Problème de format";
            } else if (acceptedFiles.length > 0) {
              this.state.file.map(item => message = item.name)
            }

            classList = isDragActive ? "dropzone dropActive" : "dropzone";
            classList = isDragReject ? "dropzone rejectStyle" : "dropzone";
            classList = isDragAccept ? "dropzone acceptDrag" : "dropzone";

            return (
              <div
                {...getRootProps()}
                className={classList}
              >
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    <div className="onDrop">
                      <p>Drop files here...</p>
                    </div>
                    :
                    <div className="addFile">
                      <i className="fas fa-plus"></i>
                      <h2>{message}</h2>
                    </div>
                }
              </div>
            )
          }}
        </Dropzone>
        <div className="formGroup">
          <label onClick={this.focusInput}>Votre nom</label>
          <input onFocus={this.focusInput} onBlur={this.blurInput} ref={(ref) => { this.lastName = ref; }} type="text" />
        </div>
        <div className="formGroup">
          <label onClick={this.focusInput}>Votre prénom</label>
          <input onFocus={this.focusInput} onBlur={this.blurInput} ref={(ref) => { this.firstName = ref; }} type="text" />
        </div>
        <div className="formButton">
          {this.state.allowToUpload ?
            <button className="ready">Upload</button> :
            <button disabled>Upload</button>
          }
        </div>
        <div className="successUpload">
          <div>
            <i className="fas fa-check"></i>
          </div>
        </div>
      </form>
    );
  }
}

export default FormUpload;