import React from 'react';

import Button from '../../../components/button';
import CircularProgress from '../../../components/circular_progress';
import { FlexChild, FlexContainer } from '../../../components/flex';
import Typography from '../../../components/typography';
import { helpers } from '../../../data/user';

class UserUpload extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFileUploadRef = this.setFileUploadRef.bind(this);

    this.state = {
      requesting: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.requesting) return;
    this.setState({
      requesting: true
    });
    helpers
      .postUpload(this.fileUploadRef.files[0])
      .then(() => {
        this.setState({ requesting: false });
      })
      .catch(() => {
        this.setState({ requesting: false });
      });
  }

  setFileUploadRef(ref) {
    this.fileUploadRef = ref;
  }

  render() {
    const { requesting } = this.state;

    return (
      <FlexContainer>
        <form onSubmit={this.handleSubmit}>
          <input required type="file" accept="xlsx" multiple={false} ref={this.setFileUploadRef} />
          <Button onClick={this.handleSubmit}>Submit</Button>
        </form>
        {requesting && <CircularProgress />}
      </FlexContainer>
    );
  }
}

export default UserUpload;
