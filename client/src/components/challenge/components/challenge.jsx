/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as styles from '../../../styles';
import { propTypes } from '../../../data/challenge_evaluations';
import { FlexContainer } from '../../flex';
import Button from '../../button';
import Elevation from '../../elevation';
import Typography from '../../typography';
import UserChallenge from '../../user_challenge';

const UCContainer = styled.div`
  &:not(:first-child) {
    border-left: 1px solid #e0e0e0;
  }
  flex: 1;
  padding: 0 10px;
`;

export default function Challenge({
  hideName,
  leftButtonText,
  rightButtonText,
  hasEditableComments,
  spot,
  onLeftButtonClick,
  onRightButtonClick,
  onCommentEdit,
  style,
  userChallenges
}) {
  return (
    <Elevation style={{ flex: 1, maxWidth: 600, padding: '0', ...style }}>
      <FlexContainer
        alignItems="center"
        flexDirection="column"
        style={{ height: '100%' }}
      >
        <FlexContainer
          alignItems="center"
          flex={1}
          justifyContent="space-between"
          style={{
            backgroundColor: styles.lightGray,
            boxSizing: 'border-box',
            padding: 10,
            width: '100%'
          }}
        >
          <Typography category="display" number={1}>
            {spot.row}
            {spot.file}
          </Typography>
          <div>
            {leftButtonText && (
              <Button onClick={onLeftButtonClick}>{leftButtonText}</Button>
            )}
            {rightButtonText && (
              <Button onClick={onRightButtonClick} style={{ marginLeft: 4 }}>
                {rightButtonText}
              </Button>
            )}
          </div>
        </FlexContainer>
        <FlexContainer
          style={{
            boxSizing: 'border-box',
            height: '100%',
            padding: '10px 0',
            width: '100%'
          }}
        >
          {userChallenges.map(uc => (
            <UCContainer key={uc.id}>
              <UserChallenge
                {...uc}
                hasEditableComments={hasEditableComments}
                onCommentEdit={onCommentEdit(uc.id)}
                hideName={hideName}
              />
            </UCContainer>
          ))}
        </FlexContainer>
      </FlexContainer>
    </Elevation>
  );
}

Challenge.propTypes = {
  ...propTypes.challengeForEvaluationPropTypes,
  hideName: PropTypes.bool,
  leftButtonText: PropTypes.string,
  rightButtonText: PropTypes.string,
  hasEditableComments: PropTypes.bool.isRequired,
  onLeftButtonClick: PropTypes.func,
  onRightButtonClick: PropTypes.func,
  onCommentEdit: PropTypes.func.isRequired
};

Challenge.defaultProps = {
  hasEditableComments: false,
  onCommentEdit: () => () => null,
  hideName: false
};
