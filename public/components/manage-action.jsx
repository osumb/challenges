import React, { PropTypes } from 'react';

const ManageAction = ({ performanceName, reason, spotId, voluntary }) => (
  <h4 className="ManageAction">
    - For the {performanceName}, {voluntary ? `${spotId} was opened` : `an admin opened ${spotId}`} because {reason}
  </h4>
);

ManageAction.propTypes = {
  performanceName: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired,
  voluntary: PropTypes.bool.isRequired
};

export default ManageAction;
