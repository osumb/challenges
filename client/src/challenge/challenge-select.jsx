import React, { Component, PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';

import './challenge-select.scss';
import { api } from '../utils';
import { apiWrapper } from '../utils';

const getEndPoint = '/challenges';
const postEndPoint = '/challenges';

class ChallengeSelect extends Component {

  static get propTypes() {
    return {
      challengeableUsers: PropTypes.arrayOf(PropTypes.shape({
        challengeCount: PropTypes.number.isRequired,
        challengeFull: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        spotId: PropTypes.string.isRequired,
        spotOpen: PropTypes.bool.isRequired
      })).isRequired,
      performanceName: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      challengeableUsers: [],
      performanceName: ''
    };
  }

  constructor(props) {
    super(props);
    const firstAvailablePerson = (props.challengeableUsers || []).find(({ challengeFull }) => !challengeFull);

    this.state = {
      errorText: null,
      selectValue: firstAvailablePerson ? firstAvailablePerson.spotId : '',
      success: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, index, selectValue) {
    this.setState({
      selectValue
    });
  }

  handleSubmit() {
    api.post(postEndPoint, { spotId: this.state.selectValue })
    .then(({ code }) => {
      if (code === 0) {
        this.setState({
          success: true
        });
      } else {
        let errorText = 'Sorry, there was a problem with your challenge selection';

        /* eslint-disable indent, lines-around-comment */
        switch (code) {
          case 1:
            errorText = 'Someone has already challenged that spot';
            break;
          case 2:
            errorText = 'Looks like you\'ve already made a challenge';
            break;
          default:
            /* Do nothing */
        }

        this.setState({
          errorText
        });
      }
    });
  }

  render() {
    const { challengeableUsers, performanceName } = this.props;
    const { errorText, selectValue, success } = this.state;

    if ((challengeableUsers || []).length < 1) {
      return (
        <div className="ChallengeSelect">
          <h2>You are currently unable to make a challenge</h2>
        </div>
      );
    }

    if (success) {
      return (
        <div className="ChallengeSelect">
          <h2>You're challenging {this.state.selectValue} for {performanceName}. Good luck!</h2>
        </div>
      );
    }

    const challengeableUsersList = challengeableUsers.map(({ challengedCount, challengeFull, name, spotId, spotOpen }) => {
      if (!spotOpen) {
        return (
          <MenuItem
            key={spotId}
            value={spotId}
            primaryText={`${spotId}: ${name}`} disabled={challengeFull}
          />
        );
      } else {
        return (
          <MenuItem
            key={spotId}
            value={spotId}
            primaryText={`${spotId} (open - challenged ${challengedCount} time(s))`}
            disabled={challengeFull}
          />
        );
      }
    });

    return (
      <div className="ChallengeSelect">
        <h2>Who do you want to challenge for the {performanceName}&#63;</h2>
        <div className="ChallengeSelect-wrapper">
          <SelectField
            errorText={errorText}
            hintText="Select one spot"
            maxHeight={200}
            onChange={this.handleChange}
            value={selectValue}
          >
            {challengeableUsersList}
          </SelectField>
          <RaisedButton onTouchTap={this.handleSubmit}>Submit</RaisedButton>
        </div>
      </div>
    );
  }
}

const Wrapper = apiWrapper(ChallengeSelect, getEndPoint);

export default Wrapper;
