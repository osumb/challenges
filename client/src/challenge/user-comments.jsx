import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import './user-comments.scss';

class UserComments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstComments: props.firstComments,
      secondComments: props.secondComments
    };
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.value = this.value.bind(this);
  }

  handleCommentsChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  value() {
    return this.state;
  }

  render() {
    const { firstComments, secondComments } = this.state;
    const { firstName, secondName, spotId } = this.props;

    return (
      <div className="UserComments">
        <Paper>
          <h4 className="UserComments-header">{firstName} {secondName && `vs ${secondName}`} ({spotId})</h4>
          <div className="UserComments-comments">
            <div className="UserComments-comment">
              <TextField
                fullWidth
                multiLine
                onChange={this.handleCommentsChange}
                name="firstComments"
                placeholder={`  Comments for ${firstName}`}
                rowsMax={4}
                value={firstComments}
              />
            </div>
            {secondName &&
              <div className="UserComments-comment">
                <TextField
                  fullWidth
                  multiLine
                  onChange={this.handleCommentsChange}
                  name="secondComments"
                  placeholder={`  Comments for ${secondName}`}
                  rowsMax={4}
                  value={secondComments}
                />
              </div>
            }
          </div>
        </Paper>
      </div>
    );
  }
}

UserComments.propTypes = {
  firstComments: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  secondComments: PropTypes.string,
  secondName: PropTypes.string,
  spotId: PropTypes.string.isRequired
};

UserComments.defaultProps = {
  firstComments: ''
};

export default UserComments;
