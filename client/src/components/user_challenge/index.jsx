import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CryingCat from '../../assets/images/crying-cat-face.png';
import Trophy from '../../assets/images/trophy.png';

import { propTypes } from '../../data/challenge_evaluations';
import { FlexContainer } from '../../components/flex';
import Typography from '../../components/typography';

const Wrapper = styled.div`
  margin: 8px 0;
`;

const Place = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  padding-bottom: 4px;
  align-items: center;
  margin: 8px 0;
`;

export default function UserChallenge({
  comments,
  user,
  place,
  hideName,
  hasEditableComments,
  onCommentEdit,
  style = {}
}) {
  const imageSrc = place === 1 ? Trophy : CryingCat;

  return (
    <FlexContainer
      flexDirection="column"
      alignItems="flex-start"
      style={{ ...style }}
    >
      {!hideName && (
        <Wrapper>
          <Typography category="headline">
            {user.firstName} {user.lastName}
          </Typography>
        </Wrapper>
      )}
      <Place>
        <img
          alt={place === 1 ? 'Winner' : 'Loser'}
          src={imageSrc}
          style={{ height: 30, width: 30, paddingRight: 8 }}
        />
        <Typography category="title">Place: {place}</Typography>
      </Place>
      <Wrapper>
        <Typography category="headline">Comments:</Typography>
      </Wrapper>
      <Wrapper>
        {!hasEditableComments && (
          <Typography category="subheading" number={2}>
            {comments}
          </Typography>
        )}
        {hasEditableComments && (
          <textarea
            defaultValue={comments}
            onChange={onCommentEdit}
            rows="10"
            style={{ width: '100%' }}
          />
        )}
      </Wrapper>
    </FlexContainer>
  );
}

UserChallenge.propTypes = {
  ...propTypes.userChallengeForEvaluationPropTypes,
  hasEditableComments: PropTypes.bool.isRequired,
  hideName: PropTypes.bool,
  style: PropTypes.object,
  onCommentEdit: PropTypes.func.isRequired
};

UserChallenge.defaultProps = {
  hasEditableComments: false,
  onCommentEdit: () => null
};
