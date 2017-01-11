import React, { Component, PropTypes } from 'react';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import classnames from 'classnames';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import './user-comparison.scss';

export default class UserComparison extends Component {

  static get propTypes() {
    return {
      id: PropTypes.number.isRequired,
      firstComments: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      firstNameNumber: PropTypes.string.isRequired,
      onSubmit: PropTypes.func.isRequired,
      secondComments: PropTypes.string,
      secondName: PropTypes.string,
      secondNameNumber: PropTypes.string,
      spotId: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      confirming: false,
      winnerId: props.firstNameNumber
    };
    this.handleConfirmClose = this.handleConfirmClose.bind(this);
    this.handleConfirmOpen = this.handleConfirmOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleWinnerIdChange = this.handleWinnerIdChange.bind(this);
  }

  handleConfirmClose() {
    this.setState({
      confirming: false
    });
  }

  handleConfirmOpen() {
    this.setState({
      confirming: true
    });
  }

  handleSubmit() {
    this.props.onSubmit({
      id: this.props.id,
      firstComments: this.props.firstComments,
      secondComments: this.props.secondComments,
      winnerId: this.state.winnerId
    });
  }

  handleWinnerIdChange({ target }) {
    this.handleConfirmClose();
    this.setState({
      winnerId: target.dataset.namenumber
    });
  }

  render() {
    const { firstComments, firstName, firstNameNumber, secondComments, secondName, secondNameNumber, spotId } = this.props;
    const { confirming, winnerId } = this.state;
    const title = secondName
      ? `${firstName} and ${secondName} for ${spotId}`
      : `${firstName} for ${spotId}`;
    const winner = winnerId === firstNameNumber
      ? `Current Winner: ${firstName}`
      : `Current Winner: ${secondName}`;
    const firstCommentsClassName = classnames({
      'UserComparison-text': true,
      'UserComparison-text--winner': winnerId === firstNameNumber,
      'UserComparison-text--loser': winnerId !== firstNameNumber
    });
    const secondCommentsClassName = classnames({
      'UserComparison-text': true,
      'UserComparison-text--winner': winnerId === secondNameNumber,
      'UserComparison-text--loser': winnerId !== secondNameNumber
    });
    const dialogActions = [
      <FlatButton key="cancel" onTouchTap={this.handleConfirmClose}>Cancel</FlatButton>,
      <FlatButton key="submit" onTouchTap={this.handleSubmit}>Submit</FlatButton>
    ];

    return (
      <div className="UserComparison">
        <Dialog
          actions={dialogActions}
          onRequestClose={this.handleConfirmClose}
          open={confirming}
        >
          {winner}. Are you sure you want to submit&#63;
        </Dialog>
        <Card>
          <CardTitle
            title={title}
            subtitle={<strong>{winner}</strong>}
          />
          <div className="UserComparison-textContainer">
            <div data-nameNumber={firstNameNumber} className={firstCommentsClassName} onTouchTap={this.handleWinnerIdChange}>
              <CardText data-nameNumber={firstNameNumber}>
                <strong data-nameNumber={firstNameNumber}>Comments for {firstName}:</strong> {firstComments}
              </CardText>
            </div>
            <div data-nameNumber={firstNameNumber} className={secondCommentsClassName} onTouchTap={this.handleWinnerIdChange}>
              <CardText data-nameNumber={secondNameNumber}>
                <strong data-nameNumber={secondNameNumber}>Comments for {secondName}:</strong> {secondComments}
              </CardText>
            </div>
          </div>
          <CardActions>
            <FlatButton className="UserComparison-button" onTouchTap={this.handleConfirmOpen}>Submit</FlatButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}
