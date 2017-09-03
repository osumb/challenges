import React from 'react';
import PropTypes from 'prop-types';

import { helpers as userHelpers } from '../../../../data/user';
import EditText from './edit_text';

export default class EditFirstName extends React.PureComponent {
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

  handleUpdate(firstName) {
    this.props.onChange({ ...this.props.row, firstName });
  }

  errorMessage() {
    return "First Name Can't Be Blank";
  }

  update(newFirstName) {
    return userHelpers.update({ ...this.props.row, firstName: newFirstName });
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
