import React from 'react';
import Datetime from 'react-datetime';

import './index.scss';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import {
  helpers as performanceHelpers,
  propTypes as performanceProps
} from '../../data/performance';
import { errorEmitter } from '../../utils';
import { FlexContainer } from '../flex';
import Button from '../button';
import TextField from '../textfield';
import Typography from '../typography';

export default class Performance extends React.PureComponent {
  static get propTypes() {
    return {
      buttonText: React.PropTypes.string.isRequired,
      canDelete: React.PropTypes.bool,
      onAction: React.PropTypes.func.isRequired,
      onDelete: React.PropTypes.func,
      performance: React.PropTypes.shape(performanceProps.performance)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      ...props.performance
    };
    this.handleActionClick = this.handleActionClick.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleWindowCloseChange = this.handleWindowCloseChange.bind(this);
    this.handleWindowOpenChange = this.handleWindowOpenChange.bind(this);
  }

  handleActionClick() {
    const performance = this.state;
    if (performanceHelpers.isValidPerformance(performance)) {
      this.props.onAction(performance);
    } else {
      const errorMessage = performanceHelpers
        .performanceErrors(performance)
        .join('; ');
      errorEmitter.dispatch(errorMessage);
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

  handleNameChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  handleWindowCloseChange(windowClose) {
    this.setState({ windowClose });
  }

  handleWindowOpenChange(windowOpen) {
    this.setState({ windowOpen });
  }

  render() {
    const { date, name, windowClose, windowOpen } = this.state;
    const { buttonText } = this.props;

    return (
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding="20px"
      >
        <FlexContainer flexDirection="column" alignItems="flex-start">
          <FlexContainer
            flexDirection="column"
            alignItems="flex-start"
            margin="5px 0"
          >
            <TextField
              onChange={this.handleNameChange}
              placeholder="Performance Name"
              name="name"
              value={name || ''}
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
            {this.props.canDelete &&
              <Button onClick={this.handleDeleteClick}>Delete</Button>}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    );
  }
}
