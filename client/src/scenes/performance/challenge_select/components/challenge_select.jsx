import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { auth, errorEmitter } from '../../../../utils';
import { propTypes as performanceProps } from '../../../../data/performance';
import { helpers as challengeHelpers } from '../../../../data/challenge';
import {
  helpers as userHelpers,
  propTypes as userProps
} from '../../../../data/user';
import { FlexContainer } from '../../../../components/flex';
import Button from '../../../../components/button';
import CircularProgress from '../../../../components/circular_progress';
import NormalChallengeableUser from './normal_challengeable_user';
import OpenSpotChallengeableUser from './open_spot_challengeable_user';
import TriChallengeableUser from './tri_challengeable_user';
import Typography from '../../../../components/typography';
import Select from '../../../../components/select';

const ButtonWrapper = styled.div`
  margin: 10px;
`;
const ErrorText = styled.div`
  color: red;
`;

export default class ChallengeSelect extends React.PureComponent {
  static get propTypes() {
    return {
      challengeableUsers: PropTypes.arrayOf(
        PropTypes.shape(performanceProps.challengeableUser)
      ),
      headerCategory: PropTypes.string,
      headerNumber: PropTypes.number,
      onChallenge: PropTypes.func,
      performance: PropTypes.shape(performanceProps.performance),
      style: PropTypes.object,
      user: PropTypes.shape(userProps)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      requesting: false,
      successMessage: null
    };
    this.createChallenge = this.createChallenge.bind(this);
    this.getUser = this.getUser.bind(this);
    this.handleChallengeCreate = this.handleChallengeCreate.bind(this);
    this.handleErrorBannerClose = this.handleErrorBannerClose.bind(this);
    this.handleSelectClick = this.handleSelectClick.bind(this);
  }

  componentDidMount() {
    errorEmitter.on('close', this.handleErrorBannerClose);
  }

  handleChallengeCreate(spot) {
    const spotStr = `${spot.row}${spot.file}`;
    const s = `Successfully challenged ${spotStr} for the ${
      this.props.performance.name
    }!`;

    this.setState({
      errorMessage: null,
      requesting: false,
      successMessage: s
    });
    if (this.props.onChallenge) {
      setTimeout(this.props.onChallenge, 1000);
    }
  }

  handleErrorBannerClose() {
    this.setState({ requesting: false });
  }

  handleSelectClick() {
    const challengeableUser = this.props.challengeableUsers[
      this.select.getSelectedIndex()
    ];

    if (
      challengeableUser === null ||
      typeof challengeableUser === 'undefined'
    ) {
      this.setState({ errorMessage: 'Please select someone to challenge' });
    } else {
      this.createChallenge(challengeableUser);
    }
  }

  createChallenge({ file, row }) {
    const user = this.getUser();

    this.setState({
      requesting: true,
      successMessage: null
    });
    challengeHelpers
      .create(
        {
          file,
          row
        },
        user.buckId
      )
      .then(({ challenge }) => {
        this.handleChallengeCreate(challenge.spot);
      });
  }

  getUser() {
    return this.props.user || auth.getUser();
  }

  render() {
    const user = this.getUser();
    const {
      challengeableUsers,
      headerCategory,
      headerNumber,
      performance,
      style
    } = this.props;
    const { errorMessage, requesting, successMessage } = this.state;
    const typographyCategory = headerCategory || 'display';
    const typographyNumber = headerNumber !== null ? 1 : headerNumber;
    const justifyContent = (style && style.justifyContent) || 'center';

    if (successMessage !== null && typeof successMessage !== 'undefined') {
      return (
        <FlexContainer
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography category={typographyCategory} number={typographyNumber}>
            {successMessage}
          </Typography>
        </FlexContainer>
      );
    }

    if (challengeableUsers.length <= 0) {
      return (
        <FlexContainer
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography category={typographyCategory} number={typographyNumber}>
            Sorry! There is no one for you to challenge at this time
          </Typography>
        </FlexContainer>
      );
    }

    return (
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        justifyContent={justifyContent}
      >
        {errorMessage && (
          <ErrorText>
            <Typography category={typographyCategory} number={typographyNumber}>
              **{errorMessage}**
            </Typography>
          </ErrorText>
        )}
        <Typography category={typographyCategory} number={typographyNumber}>
          Please make a challenge for the {performance.name}
        </Typography>
        <FlexContainer
          alignItems="center"
          justifyContent={justifyContent}
          flexWrap="wrap"
          width="100%"
        >
          <Select
            defaultText="Select one person or spot"
            ref={select => {
              this.select = select;
            }}
          >
            {challengeableUsers.map(challengeableUser => {
              if (userHelpers.isTriChallengeUser(user)) {
                return (
                  <TriChallengeableUser
                    key={challengeableUser.buckId}
                    {...challengeableUser}
                  />
                );
              } else if (challengeableUser.openSpot) {
                return (
                  <OpenSpotChallengeableUser
                    key={challengeableUser.buckId}
                    {...challengeableUser}
                  />
                );
              } else {
                return (
                  <NormalChallengeableUser
                    key={challengeableUser.buckId}
                    {...challengeableUser}
                  />
                );
              }
            })}
          </Select>
          <ButtonWrapper>
            <Button primary onClick={this.handleSelectClick}>
              Make Challenge
            </Button>
          </ButtonWrapper>
        </FlexContainer>
        {requesting && <CircularProgress />}
      </FlexContainer>
    );
  }
}
