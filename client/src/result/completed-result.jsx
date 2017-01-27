import React, { Component, PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import './completed-result.scss';

export default class CompletedResult extends Component {

  static get propTypes() {
    return {
      firstComments: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      firstNameNumber: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      onEditRequest: PropTypes.func.isRequired,
      performanceId: PropTypes.number.isRequired,
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
      editing: false,
      firstComments: props.firstComments,
      originalFirstComments: props.firstComments,
      originalSecondComments: props.secondComments,
      secondComments: props.secondComments
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  componentWillReceiveProps({ firstComments, secondComments }) {
    this.setState({
      firstComments,
      originalFirstComments: firstComments,
      originalSecondComments: secondComments,
      secondComments
    });
  }

  handleCancel() {
    const { originalFirstComments, originalSecondComments } = this.state;

    this.setState({
      editing: false,
      firstComments: originalFirstComments,
      secondComments: originalSecondComments
    });
  }

  handleCommentsChange({ target }) {
    this.setState({ [target.name]: target.value, success: false });
  }

  handleConfirm() {
    const result = {
      ...this.props,
      firstComments: this.state.firstComments,
      secondComments: this.state.secondComments
    };

    delete result.onEditRequest;

    this.setState({ editing: false });
    this.props.onEditRequest(result);
  }

  handleEditClick() {
    this.setState({ editing: true, success: false });
  }

  render() {
    const { firstName, firstNameNumber, secondName, secondNameNumber, spotId, winnerId } = this.props;
    const { editing, firstComments, secondComments } = this.state;
    const winner = firstNameNumber === winnerId
      ? firstName
      : secondName;

    return (
      <div className="CompletedResult">
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
                rows={4}
                rowsMax={4}
                value={firstComments}
              />
            }
            {secondNameNumber && (!editing ?
              <CardText className="CompletedResult-text"><span><strong>{secondName}: </strong>{secondComments}</span></CardText> :
              <TextField
                multiLine
                name="secondComments"
                onChange={this.handleCommentsChange}
                rows={4}
                rowsMax={4}
                value={secondComments}
              />
            )}
          </div>
          <CardActions>
            {editing && <FlatButton className="CompletedResult-button" onTouchTap={this.handleCancel}>Cancel</FlatButton>}
            {editing ?
              <FlatButton
                className="CompletedResult-button"
                disabled={firstComments === this.state.originalFirstComments && secondComments === this.state.originalSecondComments}
                onTouchTap={this.handleConfirm}
              >Submit</FlatButton> :
              <FlatButton className="CompletedResult-button" onTouchTap={this.handleEditClick}>Edit</FlatButton>
            }
          </CardActions>
        </Card>
      </div>
    );
  }
}
