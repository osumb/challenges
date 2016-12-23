import React, { Component, PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import './completed-result.scss';
import { api } from '../utils';

export default class CompletedResult extends Component {

  static get propTypes() {
    return {
      firstComments: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      firstNameNumber: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      secondComments: PropTypes.string,
      secondName: PropTypes.string,
      secondNameNumber: PropTypes.string,
      spotId: PropTypes.string.isRequired,
      winnerId: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      confirming: false,
      editing: false,
      firstComments: props.firstComments,
      originalFirstComments: props.firstComments,
      originalSecondComments: props.secondComments,
      secondComments: props.secondComments,
      success: false
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleConfirmClose = this.handleConfirmClose.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCancel() {
    const { originalFirstComments, originalSecondComments } = this.state;

    this.setState({
      editing: false,
      firstComments: originalFirstComments,
      secondComments: originalSecondComments
    });
  }

  handleConfirmClose() {
    this.setState({ confirming: false });
  }

  handleCommentsChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  handleConfirm() {
    this.setState({ confirming: true });
  }

  handleEditClick() {
    this.setState({ editing: true });
  }

  handleSubmit() {
    const { firstComments, secondComments } = this.state;

    api.put('/results/completed', {
      id: this.props.id,
      firstComments,
      secondComments
    })
    .then(() => {
      this.setState({
        confirming: false,
        editing: false,
        originalFirstComments: firstComments,
        originalSecondComments: secondComments,
        success: true
      });
    });
  }

  render() {
    const { firstName, firstNameNumber, secondName, spotId, winnerId } = this.props;
    const { confirming, editing, firstComments, secondComments, success } = this.state;
    const dialogActions = [
      <FlatButton key="cancel" onTouchTap={this.handleConfirmClose}>No</FlatButton>,
      <FlatButton key="submit" onTouchTap={this.handleSubmit}>Submit</FlatButton>
    ];
    const winner = firstNameNumber === winnerId
      ? firstName
      : secondName;

    return (
      <div className="CompletedResult">
        <Dialog
          actions={dialogActions}
          onRequestClose={this.handleConfirmClose}
          open={confirming}
        >
          Are you sure you want to update this result&#63;
        </Dialog>
        <Snackbar
          autoHideDuration={3000}
          message="Updated Result"
          open={success}
        />
        <Card>
          <CardHeader className="CompletedResult-header" title={`Winner: ${winner} ${spotId}`} />
          <Divider />
          <div className="CompletedResult-textWrapper">
            {!editing ?
              <CardText className="CompletedResult-text">
                <span>
                  <strong>{firstName}: </strong>{firstComments}
                </span>
              </CardText> :
              <TextField
                multiLine
                name="firstComments"
                onChange={this.handleCommentsChange}
                rowsMax={4}
                value={firstComments}
              />
            }
            {(secondComments && !editing) ?
              <CardText className="CompletedResult-text"><span><strong>{secondName}: </strong>{secondComments}</span></CardText> :
              <TextField
                multiLine
                name="secondComments"
                onChange={this.handleCommentsChange}
                rowsMax={4}
                value={secondComments}
              />
            }
          </div>
          <CardActions>
            {editing && <FlatButton className="CompletedResult-button" onTouchTap={this.handleCancel}>Cancel</FlatButton>}
            {editing ?
              <FlatButton className="CompletedResult-button" onTouchTap={this.handleConfirm}>Submit</FlatButton> :
              <FlatButton className="CompletedResult-button" onTouchTap={this.handleEditClick}>Edit</FlatButton>
            }
          </CardActions>
        </Card>
      </div>
    );
  }
}
