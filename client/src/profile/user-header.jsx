import React, { PropTypes } from 'react';

import './user-header.scss';

const UserHeader = ({ name, spotId, admin }) => (
  <div className="UserHeader">
    <div className={admin ? 'UserHeader-admin' : 'UserHeader-spot'}>
      {admin ?
        <h1 className="UserHeader-text">Admin</h1> :
        <h3 className="UserHeader-text">{spotId}</h3>
      }
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
