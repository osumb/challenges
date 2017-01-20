import React, { Component, PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import { grey500 } from 'material-ui/styles/colors';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import './pending-result.scss';
import { api } from '../utils';

export default class PendingResult extends Component {

  static get propTypes() {
    return {
      firstComments: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      firstNameNumber: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      onApprove: PropTypes.func.isRequired,
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
      originalWinnerId: props.winnerId,
      secondComments: props.secondComments,
      success: false,
      winnerId: props.winnerId
    };
    this.handleApproveClick = this.handleApproveClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleConfirmClose = this.handleConfirmClose.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleWinnerIdChange = this.handleWinnerIdChange.bind(this);
    this.renderRadioButtons = this.renderRadioButtons.bind(this);
  }

  handleApproveClick() {
    this.props.onApprove(this.props.id);
  }

  handleCancel() {
    const { originalFirstComments, originalSecondComments, originalWinnerId } = this.state;

    this.setState({
      editing: false,
      firstComments: originalFirstComments,
      secondComments: originalSecondComments,
      winnerId: originalWinnerId
    });
  }

  handleCommentsChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  handleConfirm() {
    this.setState({ confirming: true, success: false });
  }

  handleConfirmClose() {
    this.setState({ confirming: false, success: false });
  }

  handleEditClick() {
    this.setState({ editing: true, success: false });
  }

  handleSubmit() {
    const { firstComments, secondComments, winnerId } = this.state;

    api.put('/results/pending', {
      id: this.props.id,
      firstComments,
      secondComments,
      winnerId
    })
    .then(() => {
      this.setState({
        confirming: false,
        editing: false,
        originalFirstComments: firstComments,
        originalSecondComments: secondComments,
        originalWinnerId: winnerId,
        success: true
      });
    });
  }

  handleWinnerIdChange(event, value) {
    this.setState({
      winnerId: value
    });
  }

  renderRadioButtons(firstName, firstNameNumber, id, secondName, secondNameNumber, winnerId) {
    if (secondName && secondNameNumber) {
      return (
        <RadioButtonGroup
          name={`PendingResultWinner-${id}`}
          onChange={this.handleWinnerIdChange}
          valueSelected={winnerId}
        >
          <RadioButton
            label={firstName}
            value={firstNameNumber}
          />
          <RadioButton
            label={secondName}
            value={secondNameNumber}
          />
        </RadioButtonGroup>
      );
    } else {
      return (
        <RadioButtonGroup
          name={`PendingResultWinner-${id}`}
          onChange={this.handleWinnerIdChange}
          valueSelected={winnerId}
        >
          <RadioButton
            label={firstName}
            value={firstNameNumber}
          />
        </RadioButtonGroup>
      );
    }

  }

  render() {
    const { confirming, editing, firstComments, secondComments, success, winnerId } = this.state;
    const { firstName, firstNameNumber, id, secondName, secondNameNumber, spotId } = this.props;
    const currentWinner = winnerId === firstNameNumber ? firstName : secondName;
    const dialogActions = [
      <FlatButton key="cancel" onTouchTap={this.handleConfirmClose}>No</FlatButton>,
      <FlatButton key="submit" onTouchTap={this.handleSubmit}>Submit</FlatButton>
    ];
    const title = editing
      ? <strong><LockOpen /> {currentWinner} ({spotId})</strong>
      : <strong><LockOutline /> {currentWinner} ({spotId})</strong>;

    return (
      <div className="PendingResult">
        <Dialog
          actions={dialogActions}
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
          <CardHeader
            className="PendingResult-header"
            style={{
              backgroundColor: grey500
            }}
            title={title}
          />
          {editing ?
            <div className="PendingResult-textHeaders">
              {this.renderRadioButtons(firstName, firstNameNumber, id, secondName, secondNameNumber, winnerId)}
            </div> :
            <div className="PendingResult-textHeaders">
              <p>{firstName}</p>
              {secondNameNumber && <p>{secondName}</p>}
            </div>
          }
          <Divider />
          <div className="PendingResult-text">
            {editing ?
              <TextField
                multiLine
                name="firstComments"
                onChange={this.handleCommentsChange}
                rows={4}
                rowsMax={4}
                value={firstComments}
              /> :
              <CardText>{firstComments}</CardText>
            }
            {secondNameNumber && (editing ?
              <TextField
                multiLine
                name="secondComments"
                onChange={this.handleCommentsChange}
                rows={4}
                rowsMax={4}
                value={secondComments}
              /> :
              <CardText>{secondComments}</CardText>
            )}
          </div>
          <CardActions>
            {editing && <FlatButton className="PendingResult-button" onTouchTap={this.handleCancel}>Cancel</FlatButton>}
            {editing && <FlatButton className="PendingResult-button" onTouchTap={this.handleConfirm}>Update</FlatButton>}
            {!editing && <FlatButton className="PendingResult-button" onTouchTap={this.handleApproveClick}>Approve</FlatButton>}
            {!editing && <FlatButton className="PendingResult-button" onTouchTap={this.handleEditClick}>Edit</FlatButton>}
          </CardActions>
        </Card>
      </div>
    );
  }
}
