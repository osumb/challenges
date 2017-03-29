import React from 'react';
import styled from 'styled-components';

import { auth } from '../../../../utils';
import { helpers as challengeHelpers } from '../../../../data/challenge';
import { propTypes as performanceProps } from '../../../../data/performance';
import { helpers as userHelpers } from '../../../../data/user';
import Button from '../../../../components/button';
import NormalChallengeableUser from './normal_challengeable_user';
import OpenSpotChallengeableUser from './open_spot_challengeable_user';
import TriChallengeableUser from './tri_challengeable_user';
import Typography from '../../../../components/typography';
import MDCSelect from '../../../../components/select';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const SelectButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const ButtonWrapper = styled.div`
  margin-left: 25px;
  margin-top: 10px;
`;
const ErrorText = styled.div`
  color: red;
`;

export default class Select extends React.PureComponent {
  static get propTypes() {
    return {
      challengeableUsers: React.PropTypes.arrayOf(React.PropTypes.shape(performanceProps.challengeableUser)),
      performance: React.PropTypes.shape(performanceProps.performance)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      successMessage: null
    };
    this.createChallenge = this.createChallenge.bind(this);
    this.editCurrentChallenge = this.editCurrentChallenge.bind(this);
    this.handleSelectClick = this.handleSelectClick.bind(this);
  }

  handleSelectClick() {
    const challengeableUser = this.props.challengeableUsers[this.select.getSelectedIndex()];

    if (challengeableUser === null || typeof challengeableUser === 'undefined') {
      this.setState({ errorMessage: 'Please select someone to challenge' });
    } else if (challengeableUser.challengeId === null || typeof challengeableUser.challengeId === 'undefined') {
      this.createChallenge(challengeableUser);
    } else {
      this.editCurrentChallenge(challengeableUser);
    }
  }

  createChallenge({ file, openSpot, row }) {
    let challengeType = 'normal';

    if (openSpot) {
      challengeType = 'open_spot';
    } else if (userHelpers.isTriChallengeUser(auth.getUser())) {
      challengeType = 'tri';
    }

    challengeHelpers.create({
      challengeType,
      file,
      performanceId: this.props.performance.id,
      row
    })
    .then(({ challenge }) => {
      const challengeSpot = `${challenge.spot.row}${challenge.spot.file}`;
      const s = `Successfully challenged ${challengeSpot} for the ${this.props.performance.name}!`;

      this.setState({
        errorMessage: null,
        successMessage: s
      });
    });
  }

  editCurrentChallenge(challengeableUser) {
    challengeHelpers.addUser(auth.getUser().buckId, challengeableUser.challengeId)
    .then(({ challengeSpot }) => {
      const spot = `${challengeSpot.row}${challengeSpot.file}`;
      const s = `Successfully challenged ${spot} for the ${this.props.performance.name}!`;

      this.setState({
        errorMessage: null,
        successMessage: s
      });
    });
  }

  render() {
    const { challengeableUsers, performance } = this.props;
    const { errorMessage, successMessage } = this.state;
    const user = auth.getUser();

    if (challengeableUsers === null || typeof challengeableUsers === 'undefined') {
      return (
        <Container>
          <div>Loading...</div>
        </Container>
      );
    }

    if (successMessage !== null && typeof successMessage !== 'undefined') {
      return (
        <Container>
          <Typography category="display" number={1}>{successMessage}</Typography>
        </Container>
      );
    }

    if (challengeableUsers.length <= 0) {
      return (
        <Container>
          <Typography category="display" number={1}>
            Sorry! There is no one for you to challenge at this time
          </Typography>
        </Container>
      );
    }

    return (
      <Container>
        {errorMessage &&
          <ErrorText>
            <Typography category="display" number={2}>
              **{errorMessage}**
            </Typography>
          </ErrorText>
        }
        <Typography category="display" number={1}>
          Who do you want to challenge for the {performance.name}?
        </Typography>
        <SelectButtonWrapper>
          <MDCSelect
            defaultText="Select one person or spot"
            ref={select => {
              this.select = select;
            }}
          >
            {challengeableUsers.map((challengeableUser) => {
              if (userHelpers.isTriChallengeUser(user)) {
                return <TriChallengeableUser key={challengeableUser.buckId} {...challengeableUser} />;
              } else if (challengeableUser.openSpot) {
                return <OpenSpotChallengeableUser key={challengeableUser.buckId} {...challengeableUser} />;
              } else {
                return <NormalChallengeableUser key={challengeableUser.buckId} {...challengeableUser} />;
              }
            })}
          </MDCSelect>
          <ButtonWrapper>
            <Button primary onClick={this.handleSelectClick}>Make Challenge</Button>
          </ButtonWrapper>
        </SelectButtonWrapper>
      </Container>
    );
  }
}
