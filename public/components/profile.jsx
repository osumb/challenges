import React, { PropTypes } from 'react';

const Profile = ({ user }) => (
  <div className="Profile">Hey, {user.name}</div>
);

Profile.propTypes = {
  user: PropTypes.shape({
    admin: PropTypes.bool.isRequired,
    director: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    instrument: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameNumber: PropTypes.string.isRequired,
    new: PropTypes.bool.isRequired,
    part: PropTypes.string.isRequired,
    spotId: PropTypes.string.isRequired,
    spotOpen: PropTypes.bool,
    squadLeader: PropTypes.bool
  })
};

export default Profile;
