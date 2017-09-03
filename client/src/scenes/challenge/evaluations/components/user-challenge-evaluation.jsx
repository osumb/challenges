import React from 'react';

import PropTypes from 'prop-types';

import Elevation from '../../../../components/elevation';
import { FlexChild, FlexContainer } from '../../../../components/flex';
import Typography from '../../../../components/typography';
import { propTypes } from '../../../../data/challenge_evaluations';
import PlacePicker from './place-picker';

const DEFAULT_COMMENTS_TEXT = 'Enter your comments here';

const textAreaOnCommentsChange = onChange => event =>
  onChange(event.currentTarget.value);
const UserChallengeEvaluation = ({
  comments,
  onCommentsChange,
  onPlacePick,
  place,
  userChallenge,
  userCount
}) =>
  <Elevation>
    <FlexContainer flexDirection="column">
      <FlexChild flex="0">
        <Typography category="title">
          {userChallenge.user.firstName} {userChallenge.user.lastName}
        </Typography>
      </FlexChild>
      <FlexChild flex="0">
        <Typography category="subheading2">Place:</Typography>
        <PlacePicker
          numberOfPlaces={userCount}
          onPlacePick={onPlacePick}
          place={place}
        />
      </FlexChild>
      <FlexChild flex="4">
        <Typography category="subheading2">Comments:</Typography>
        <textarea
          defaultValue={comments}
          placeholder={DEFAULT_COMMENTS_TEXT}
          onChange={textAreaOnCommentsChange(onCommentsChange)}
          rows="10"
          style={{ width: '100%' }}
        />
      </FlexChild>
    </FlexContainer>
  </Elevation>;

UserChallengeEvaluation.propTypes = {
  comments: PropTypes.string,
  onCommentsChange: PropTypes.func.isRequired,
  onPlacePick: PropTypes.func.isRequired,
  place: PropTypes.number,
  userChallenge: PropTypes.shape(propTypes.userChallengeForEvaluationPropTypes)
    .isRequired,
  userCount: PropTypes.number.isRequired
};

export default UserChallengeEvaluation;
