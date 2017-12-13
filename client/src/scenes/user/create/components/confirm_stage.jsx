import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { helpers as spotHelpers, propTypes as spotProps } from '../../../../data/spot';
import { helpers as userHelpers, propTypes as userProps } from '../../../../data/user';
import { errorEmitter } from '../../../../utils';
import CircularProgress from '../../../../components/circular_progress';
import Confirm from '../../../../components/confirm';
import Typography from '../../../../components/typography';

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

export default class ConfirmStage extends React.Component {
  static get propTypes() {
    return {
      history: PropTypes.shape({
        goBack: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired
      }),
      user: PropTypes.shape({
        ...userProps,
        spot: PropTypes.shape(spotProps)
      })
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userToReplace: null
    };
    this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
    this.handleConfirmConfirm = this.handleConfirmConfirm.bind(this);
    this.renderUser = this.renderUser.bind(this);
  }

  componentDidMount() {
    const { user: { role, spot } } = this.props;
    if (userHelpers.isPerformerRole(role) && !spot) {
      errorEmitter.dispatch('Whoops! Please make sure this user has a spot');
      setTimeout(() => this.setState({ loading: false }), 0);
    } else if (userHelpers.isPerformerRole(role)) {
      spotHelpers.find(spot).then((s) => {
        this.setState({ 
          loading: false,
          userToReplace: s.currentUser
        });
      });
    } else {
      setTimeout(() => this.setState({ loading: false }), 0);
    }
  }

  handleConfirmCancel() {
    this.props.history.goBack();
  }

  handleConfirmConfirm() {
    const newUser = { ...this.props.user };

    if (!userHelpers.isPerformerRole(newUser.role)) {
      delete newUser.spot;
    }

    userHelpers.create(newUser).then(({ user }) => {
      const newRoute = userHelpers.isPerformerRole(user.role)
        ? `/users/${user.buckId}`
        : '/';
      this.props.history.push(newRoute);
    });
  }

  renderUser() {
    const { userToReplace } = this.state;
    const { user } = this.props;

    return (
      <Confirm
        onCancel={this.handleConfirmCancel}
        onConfirm={this.handleConfirmConfirm}
      >
        <div>
          <Typography category="headline">
            Are you sure you want to add {user.firstName} {user.lastName}?
          </Typography>
          <Typography category="subheading" number={2}>
            {user.firstName}'s contact information will be: {user.buckId}/{user.email}
          </Typography>
          <Typography category="subheading" number={2}>
            {user.firstName}'s role will be: {user.role}
          </Typography>
          <Typography category="subheading" number={2}>
            {user.firstName}'s instrument/part will be: {user.instrument}/{user.part}
          </Typography>
          {userHelpers.isPerformerRole(user.role) &&
            <Typography category="subheading" number={2}>
              {user.firstName}'s spot will be: {spotHelpers.toString(user.spot)}
            </Typography>
          }
          {userToReplace !== null &&
            <Typography category="subheading" number={2}>
              Doing so will deactivate {userToReplace.firstName} {userToReplace.lastName}<br />
              who is currently {spotHelpers.toString(userToReplace.currentSpot)}
            </Typography>
          }
        </div>
      </Confirm>
    );
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <Container>
          <CircularProgress />
        </Container>
      );
    }

    return (
      <Container>
        {this.renderUser()}
      </Container>
    );
  }
}
