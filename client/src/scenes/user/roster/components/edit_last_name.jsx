import React from 'react';
import PropTypes from 'prop-types';

import { helpers as userHelpers } from '../../../../data/user';
import EditText from './edit_text';

export default class EditLastName extends React.PureComponent {
  static get propTypes() {
    return {
      onChange: PropTypes.func.isRequired,
      row: PropTypes.object.isRequired, // row is an object representing our user and provided by react-table
      value: PropTypes.string.isRequired // this is our spot value
    };
  }

  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.errorMessage = this.errorMessage.bind(this);
    this.update = this.update.bind(this);
    this.validNewValue = this.validNewValue.bind(this);
  }

  handleUpdate(lastName) {
    this.props.onChange({ ...this.props.row, lastName });
  }

  errorMessage() {
    return "Last Name Can't Be Blank";
  }

  update(newLastName) {
    return userHelpers.update({ ...this.props.row, lastName: newLastName });
  }

  validNewValue(newFirstName) {
    return Boolean(newFirstName);
  }

  render() {
    return (
      <EditText
        errorMessage={this.errorMessage}
        onUpdate={this.handleUpdate}
        row={this.props.row}
        update={this.update}
        validNewValue={this.validNewValue}
        value={this.props.value}
      />
    );
  }
}
