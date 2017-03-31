import React from 'react';
import Datetime from 'react-datetime';
import pick from 'lodash.pick';
import styled from 'styled-components';

import './index.scss';
import '../../../../../node_modules/react-datetime/css/react-datetime.css';
import { helpers as performanceHelpers } from '../../../data/performance';
import { errorEmitter } from '../../../utils';
import Button from '../../../components/button';
import Snackbar from '../../../components/snackbar';
import TextField from '../../../components/textfield';
import Typography from '../../../components/typography';

const Container = styled.div`
  flex: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;
const FormFields = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`;
const FormField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 5px 0;
`;

export default class CreatePerformance extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      name: null,
      success: false,
      windowClose: null,
      windowOpen: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleWindowCloseChange = this.handleWindowCloseChange.bind(this);
    this.handleWindowOpenChange = this.handleWindowOpenChange.bind(this);
  }

  handleClick() {
    const performance = pick(this.state, performanceHelpers.performanceKeys);
    if (performanceHelpers.isValidPerformance(performance)) {
      performanceHelpers.create(performance)
      .then(() => {
        this.setState({ success: true });
      });
    } else {
      const errorMessage = performanceHelpers.performanceErrors(performance).join('; ');
      errorEmitter.dispatch(errorMessage);
    }
  }

  handleDateChange(date) {
    this.setState({ date, success: false });
  }

  handleNameChange({ target }) {
    this.setState({ [target.name]: target.value, success: false });
  }

  handleWindowCloseChange(windowClose) {
    this.setState({ windowClose, success: false });
  }

  handleWindowOpenChange(windowOpen) {
    this.setState({ windowOpen, success: false });
  }

  render() {
    return (
      <Container>
        <FormFields>
          <Typography category="display" number={1}>Create Performance</Typography>
          <FormField>
            <TextField onChange={this.handleNameChange} hint="Performance Name" name="name" />
          </FormField>
          <FormField>
            <Typography category="title">Date of performance</Typography>
            <Datetime className="Challenges-Datetime" onChange={this.handleDateChange} />
          </FormField>
          <FormField>
            <Typography category="title">When does the challenge window open?</Typography>
            <Datetime className="Challenges-Datetime" onChange={this.handleWindowOpenChange} />
          </FormField>
          <FormField>
            <Typography category="title">When does the challenge window close?</Typography>
            <Datetime className="Challenges-Datetime" onChange={this.handleWindowCloseChange} />
          </FormField>
          <Button onClick={this.handleClick}>Create</Button>
          <Snackbar message="Successfully created performance" show={this.state.success} />
        </FormFields>
      </Container>
    );
  }
}
