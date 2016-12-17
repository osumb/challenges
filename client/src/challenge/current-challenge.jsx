import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import './current-challenge.scss';
import { api } from '../utils';

export default class CurrentChallenge extends Component {

  static propTypes() {
    return {
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      spotId: PropTypes.string.isRequired
    };
  }

  constructor() {
    super();
    this.state = {
      deleted: false
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    api.del(`/challenges/${this.props.id}`)
    .then(() => {
      this.setState({
        deleted: true
      });
    });
  }

  render() {
    const paperStyle = {
      width: '75%'
    };

    return (
      <Paper style={paperStyle}>
        {!this.state.deleted ?
          <div className="CurrentChallenge">
            <h2>You are currently signed up to challenge spot {this.props.spotId} for the {this.props.name}</h2>
            <RaisedButton id="CurrentChallenge-button" onClick={this.handleDelete}>Delete</RaisedButton>
          </div> :
          <div className="CurrentChallenge">
            <h2>Successfully deleted challenge. Remember to go make another</h2>
          </div>
        }
      </Paper>
    );
  }
}
