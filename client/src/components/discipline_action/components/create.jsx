import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { helpers as disciplineActionHelpers } from '../../../data/discipline_action';
import {
  helpers as performanceHelpers,
  propTypes as performanceProps
} from '../../../data/performance';
import { propTypes as userProps } from '../../../data/user';
import { FlexContainer } from '../../../components/flex';
import Button from '../../../components/button';
import Checkbox from '../../../components/checkbox';
import TextField from '../../../components/textfield';
import Typography from '../../../components/typography';

const Info = styled.div`
  margin-left: 10px;
`;

export default class CreateDisciplineAction extends React.PureComponent {
  static get propTypes() {
    return {
      onCreate: PropTypes.func,
      performance: PropTypes.shape(performanceProps.performance),
      user: PropTypes.shape(userProps).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      performance: null,
      reason: '',
      requesting: false,
      success: false
    };
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.handleReasonChange = this.handleReasonChange.bind(this);
  }

  componentDidMount() {
    performanceHelpers.getNext().then(({ performance }) => {
      this.setState({
        loading: false,
        performance
      });
    });
  }

  handleCreateClick() {
    const { performance, reason } = this.state;
    const { allowedToChallenge, openSpot } = this;
    const { user } = this.props;

    disciplineActionHelpers
      .create(
        allowedToChallenge.checked,
        openSpot.checked,
        performance.id,
        reason,
        user.buckId
      )
      .then(disciplineAction => {
        this.setState({ success: true });
        if (this.props.onCreate) {
          this.props.onCreate(disciplineAction);
        }
      });
  }

  handleReasonChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { loading, performance, reason, success } = this.state;
    const { user } = this.props;

    if (loading) {
      return <Typography category="title">Loading...</Typography>;
    }

    if (performance === null) {
      return (
        <Typography category="title">
          Currently unable to make a discipline action because there is no
          upcoming performance
        </Typography>
      );
    }

    if (success) {
      return (
        <Typography category="title">
          Discipline action has been created for {user.firstName}
          <br />
          Reason: {reason}
        </Typography>
      );
    }

    return (
      <FlexContainer flexDirection="column" alignItems="flex-start">
        <Typography category="title">Create Discipline Action</Typography>
        <Info flexDirection="column">
          <Typography category="body" number={2}>
            Member: {user.firstName} {user.lastName}
          </Typography>
          <Typography category="body" number={2}>
            Performance: {performance.name}
          </Typography>
        </Info>
        <TextField
          hint="Reason for this action"
          name="reason"
          value={reason}
          onChange={this.handleReasonChange}
          labelStyle={{
            minWidth: '175px'
          }}
        />
        {/* eslint-disable react/jsx-no-bind */}
        <Checkbox
          getRef={ref => {
            this.openSpot = ref;
          }}
          label={`Check box if the spot ${user.spot.row}${user.spot
            .file} opens as a result of the action`}
        />
        <Checkbox
          getRef={ref => {
            this.allowedToChallenge = ref;
          }}
          label={`Check box if ${user.firstName} is allowed to challenge another spot`}
        />
        <Button primary onClick={this.handleCreateClick}>Create</Button>
      </FlexContainer>
    );
  }
}
