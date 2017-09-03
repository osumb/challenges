import React from 'react';
import PropTypes from 'prop-types';

import { helpers as spotHelpers } from '../../../../data/spot';
import { helpers as userHelpers } from '../../../../data/user';
import { propTypes } from '../../../../data/performance';
import { FlexContainer } from '../../../../components/flex';
import Button from '../../../../components/button';
import NormalChallengeableUser from './normal_challengeable_user';
import OpenSpotChallengeableUser from './open_spot_challengeable_user';
import Select from '../../../../components/select';
import TriChallengeableUser from './tri_challengeable_user';

const { compareSpots } = spotHelpers;

export default function AdminChallengeSelect({ users }) {
  const sortedUsers = users.sort((a, b) =>
    compareSpots({ row: a.row, file: a.file }, { row: b.row, file: b.file })
  );

  return (
    <FlexContainer>
      <Select
        defaultText="Select one person or spot"
        ref={ref => {
          this.select = ref;
        }}
      >
        {sortedUsers.map(({ buckId, ...rest }) => {
          const user = {
            buckId,
            spot: {
              row: rest.row,
              file: rest.file
            },
            ...rest
          };

          if (userHelpers.isTriChallengeUser(user)) {
            return <TriChallengeableUser key={buckId} {...rest} />;
          } else if (user.openSpot) {
            return <OpenSpotChallengeableUser key={buckId} {...rest} />;
          } else {
            return <NormalChallengeableUser key={buckId} {...rest} />;
          }
        })}
      </Select>
      <Button>Submit Challenge</Button>
    </FlexContainer>
  );
}

AdminChallengeSelect.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape(propTypes.challengeableUser))
};
