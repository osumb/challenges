import React, { PropTypes } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';

import UpdatePart from './update-part';
import UpdateSpot from './update-spot';

const RosterItem = ({ onUserChange, ...rest }) => {
  const { instrument, name, nameNumber, part, spotId } = rest;

  function handleSpotChange(newSpot) {
    onUserChange({
      ...rest,
      spotId: newSpot
    });
  }

  function handlePartChange(newPart) {
    onUserChange({
      ...rest,
      part: newPart
    });
  }

  return (
    <TableRow>
      <TableRowColumn>{name}</TableRowColumn>
      <TableRowColumn><UpdateSpot nameNumber={nameNumber} spotId={spotId} onSpotChange={handleSpotChange} /></TableRowColumn>
      <TableRowColumn>{instrument}</TableRowColumn>
      <TableRowColumn>
        <UpdatePart
          instrument={instrument}
          nameNumber={nameNumber}
          part={part}
          onPartChange={handlePartChange}
        />
      </TableRowColumn>
    </TableRow>
  );
}

RosterItem.propTypes = {
  instrument: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  nameNumber: PropTypes.string.isRequired,
  onUserChange: PropTypes.func.isRequired,
  part: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired
};

export default RosterItem;
