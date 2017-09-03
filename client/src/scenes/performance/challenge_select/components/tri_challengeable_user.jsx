import React from 'react';

import { propTypes } from '../../../../data/performance';

export default function TriChallengeableUser({
  file,
  firstName,
  lastName,
  row,
  membersInChallenge
}) {
  return (
    <option className="mcd-list-item" disabled={membersInChallenge >= 2}>
      {row}
      {file}: {firstName} {lastName}
    </option>
  );
}

TriChallengeableUser.propTypes = propTypes.challengeableUser;
