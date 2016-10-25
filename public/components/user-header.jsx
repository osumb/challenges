import React, { PropTypes } from 'react';

import './user-header.scss';

const UserHeader = ({ name, spotId, admin }) => (
  <div className="UserHeader">
    <div className={admin ? 'UserHeader-admin' : 'UserHeader-spot'}>
      <h1 className="UserHeader-text">
        {admin ? 'Admin' : spotId}
      </h1>
    </div>
    <h1 className="UserHeader-name">
      {name}
    </h1>
  </div>
);

UserHeader.propTypes = {
  admin: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  spotId: PropTypes.string
};

export default UserHeader;
