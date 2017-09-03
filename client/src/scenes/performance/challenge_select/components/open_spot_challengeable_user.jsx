import React from 'react';

import { propTypes } from '../../../../data/performance';

export default function OpenSpotChallengeableUser({
  file,
  row,
  membersInChallenge
}) {
  return (
    <option className="mdc-list-item" disabled={membersInChallenge >= 2}>
      {row}
      {file} (open - challenged {membersInChallenge} time(s))
    </option>
  );
}

OpenSpotChallengeableUser.propTypes = propTypes.challengeableUser;
