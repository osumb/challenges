import React, { PropTypes } from 'react';

import './result.scss';

const Result = ({
  button,
  firstComments,
  firstName,
  firstNameNumber,
  secondComments,
  secondName,
  spotId,
  winnerId
}) => (
  <div className="Result">
    <div className="Result-header">
      <p>{spotId}</p>
      <p className="Result-winner">Winner: {winnerId === firstNameNumber ? firstName : secondName}</p>
      {button &&
        <div className="Result-buttonWrapper">
          <button className="Result-button" onClick={button.handleAction}>{button.label}</button>
        </div>
      }
    </div>
    <div className="Result-comments">
      <div className="Result-comment">
        <p>{firstName}</p>
        <p>Notes: {firstComments}</p>
      </div>
      {secondName &&
        <div className="Result-comment">
          <p>{secondName}</p>
          <p>Notes: {secondComments}</p>
        </div>
      }
    </div>
  </div>
);

Result.propTypes = {
  button: PropTypes.shape({
    label: PropTypes.string.isRequired,
    handleAction: PropTypes.func.isRequired
  }),
  firstComments: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  firstNameNumber: PropTypes.string.isRequired,
  secondComments: PropTypes.string,
  secondName: PropTypes.string,
  secondNameNumber: PropTypes.string,
  spotId: PropTypes.string.isRequired,
  winnerId: PropTypes.string.isRequired
};

export default Result;
