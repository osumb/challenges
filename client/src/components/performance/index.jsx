/* eslint-disable react/jsx-no-bind */
import React from 'react';
import Datetime from 'react-datetime';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import './index.css';
import 'react-datetime/css/react-datetime.css';
import {
  helpers as performanceHelpers,
  propTypes as performanceProps
} from '../../data/performance';
import { errorEmitter } from '../../utils';
import { FlexContainer } from '../flex';
import Button from '../button';
import Typography from '../typography';

const Input = styled.input`
  border: 1px solid #efefef;
  border-radius: 3px;
  font-size: 16px;
  height: 2em;
  width: 16em;
`;

export default class Performance extends React.PureComponent {
  static get propTypes() {
    return {
      buttonText: PropTypes.string.isRequired,
      canDelete: PropTypes.bool,
      onAction: PropTypes.func.isRequired,
      onChallengeListRequest: PropTypes.func,
      onDelete: PropTypes.func,
      performance: PropTypes.shape(performanceProps.performance)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      ...props.performance
    };
    this.handleActionClick = this.handleActionClick.bind(this);
    this.handleChallengeListRequest = this.handleChallengeListRequest.bind(
      this
    );
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleWindowCloseChange = this.handleWindowCloseChange.bind(this);
    this.handleWindowOpenChange = this.handleWindowOpenChange.bind(this);
  }

  handleActionClick() {
    const name = this.input.value;
    const performance = { ...this.state, name };

    if (performanceHelpers.isValidPerformance(performance)) {
      this.props.onAction(performance);
    } else {
      const errorMessage = performanceHelpers
        .performanceErrors(performance)
        .join('; ');
      errorEmitter.dispatch(errorMessage);
    }
  }

  handleChallengeListRequest() {
    if (this.props.onChallengeListRequest) {
      this.props.onChallengeListRequest(this.state.id);
    }
  }

  handleDateChange(date) {
    this.setState({ date });
  }

  handleDeleteClick() {
    if (this.props.onDelete) {
      this.props.onDelete(this.props.performance);
    }
  }

  handleWindowCloseChange(windowClose) {
    this.setState({ windowClose });
  }

  handleWindowOpenChange(windowOpen) {
    this.setState({ windowOpen });
  }

  render() {
    const { date, windowClose, windowOpen } = this.state;
    const { buttonText, performance } = this.props;
    const name = performance ? performance.name : '';

    return (
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        margin="20px"
        padding="20px"
        border="1px solid #808080"
        borderRadius="4px"
      >
        <FlexContainer flexDirection="column" alignItems="flex-start">
          <FlexContainer
            flexDirection="column"
            alignItems="flex-start"
            margin="5px 0"
          >
            <Typography category="title">Performance Name</Typography>
            <Input
              placeholder="Name"
              name="name"
              defaultValue={name}
              innerRef={ref => {
                this.input = ref;
              }}
            />
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            alignItems="flex-start"
            margin="5px 0"
          >
            <Typography category="title">Date of performance</Typography>
            <Datetime
              className="Challenges-Datetime"
              onChange={this.handleDateChange}
              value={date && new Date(date)}
            />
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            alignItems="flex-start"
            margin="5px 0"
          >
            <Typography category="title">Challenge Window Open</Typography>
            <Datetime
              className="Challenges-Datetime"
              onChange={this.handleWindowOpenChange}
              value={windowOpen && new Date(windowOpen)}
            />
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            alignItems="flex-start"
            margin="5px 0"
          >
            <Typography category="title">Challenge Window Close</Typography>
            <Datetime
              className="Challenges-Datetime"
              onChange={this.handleWindowCloseChange}
              value={windowClose && new Date(windowClose)}
            />
          </FlexContainer>
          <FlexContainer justifyContent="space-between" width="100%">
            <Button onClick={this.handleActionClick}>{buttonText}</Button>
            {this.props.canDelete && (
              <Button onClick={this.handleDeleteClick}>Delete</Button>
            )}
            {this.props.onChallengeListRequest && (
              <Button onClick={this.handleChallengeListRequest}>
                Email Challenge List
              </Button>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    );
  }
}
