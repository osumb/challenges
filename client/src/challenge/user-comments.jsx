import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import './user-comments.scss';

const UserComments = ({ comments, name, nameNumber, onChange }) => {
  const handleChange = ({ target }) => {
    onChange(nameNumber, target.value);
  };

  return (
    <div className="UserComments">
      <Paper>
        <h4 className="UserComments-header">{name}</h4>
        <TextField
          fullWidth
          multiLine
          onChange={handleChange}
          name={name}
          placeholder={`  Comments for ${name}`}
          rowsMax={4}
          value={comments}
        />
      </Paper>
    </div>
  );
};

UserComments.propTypes = {
  comments: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  nameNumber: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default UserComments;
