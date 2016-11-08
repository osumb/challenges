import React, { PropTypes } from 'react';

import './user-row.scss';
import EditSpot from './edit-spot';
import EditPart from './edit-part';

const UserRow = ({ className, onPartEdit, onSpotEdit, user }) => {
  const onSpotEditBind = onSpotEdit.bind(null, user.nameNumber);
  const onPartEditBind = onPartEdit.bind(null, user.nameNumber);

  return (
    <div className={`UserRow ${className}`}>
      <div className="UserRow-item">{user.name}</div>
      <div className="UserRow-item"><EditSpot onEdit={onSpotEditBind} spot={user.spotId} /></div>
      <div className="UserRow-item">{user.instrument}</div>
      <div className="UserRow-item"><EditPart instrument={user.instrument} onEdit={onPartEditBind} part={user.part} /></div>
    </div>
  );
};

UserRow.propTypes = {
  className: PropTypes.string.isRequired,
  onPartEdit: PropTypes.func.isRequired,
  onSpotEdit: PropTypes.func.isRequired,
  user: PropTypes.shape({
    admin: PropTypes.bool.isRequired,
    director: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    instrument: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameNumber: PropTypes.string.isRequired,
    new: PropTypes.bool.isRequired,
    part: PropTypes.string.isRequired,
    spotId: PropTypes.string,
    squadLeader: PropTypes.bool
  })
};

export default UserRow;
