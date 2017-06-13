import React from 'react';

import { helpers as userHelpers } from '../../../../data/user';
import { helpers as spotHelpers } from '../../../../data/spot';
import EditText from './edit_text';

export default class EditSpot extends React.PureComponent {
  static get propTypes() {
    return {
      onChange: React.PropTypes.func.isRequired,
      row: React.PropTypes.object.isRequired, // row is an object representing our user and provided by react-table
      value: React.PropTypes.string.isRequired // this is our spot value
    };
  }

  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.errorMessage = this.errorMessage.bind(this);
    this.update = this.update.bind(this);
    this.validNewValue = this.validNewValue.bind(this);
  }

  handleUpdate(spot) {
    this.props.onChange({ ...this.props.row, spot });
  }

  errorMessage(newSpot) {
    const { instrument, part } = this.props.row;
    const spot = spotHelpers.spotFromString(newSpot);
    const { row } = spot;
    let message = 'Invalid Spot.';

    if (!spotHelpers.validPartForRow(row, part)) {
      message = `${message} row ${row} can't have part ${part}.`;
    }
    if (!spotHelpers.validInstrumentForRow(row, instrument)) {
      message = `${message} row ${row} can't have instrument ${instrument}.`;
    }
    return message;
  }

  update(newSpot) {
    return userHelpers.switchSpots(
      this.props.row.buckId,
      spotHelpers.spotFromString(newSpot)
    );
  }

  validNewValue(newSpot) {
    const { instrument, part } = this.props.row;
    const spot = spotHelpers.spotFromString(newSpot);
    const { row } = spot;

    return (
      spotHelpers.validSpot(spot) &&
      spotHelpers.validPartForRow(row, part) &&
      spotHelpers.validInstrumentForRow(row, instrument)
    );
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
