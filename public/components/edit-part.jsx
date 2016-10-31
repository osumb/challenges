import React, { Component, PropTypes } from 'react';

import './edit-part.scss';

const instrumentPartMap = {
  Baritone: ['First'],
  Mellophone: ['First', 'Second'],
  Percussion: ['Bass', 'Cymbals', 'Snare', 'Tenor'],
  Sousaphone: ['First'],
  Trombone: ['First', 'Second', 'Bass'],
  Trumpet: ['Efer', 'Solo', 'First', 'Second', 'Flugel']
};

class EditPart extends Component {

  constructor({ part }) {
    super();
    this.state = {
      editing: false,
      part
    };
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleCancelClick() {
    this.setState({
      editing: false
    });
  }

  handleConfirmClick() {
    this.props.onEdit(this.refs.parts.value);
    this.setState({
      editing: false
    });
  }

  handleEditClick() {
    this.setState({
      editing: true
    });
  }

  render() {
    const { editing } = this.state;
    const { instrument, part } = this.props;

    if (!editing) {
      return (
        <div>
          {part}
          <button className="EditPart-edit" onClick={this.handleEditClick}>Edit Part</button>
        </div>
      );
    }

    return (
      <div>
        <select defaultValue={part} ref="parts">
          {instrumentPartMap[instrument].map((optionPart) => <option key={optionPart} value={optionPart}>{optionPart}</option>)}
        </select>
        <button onClick={this.handleCancelClick}>Cancel</button>
        <button onClick={this.handleConfirmClick}>Confirm</button>
      </div>
    );
  }
}

EditPart.propTypes = {
  instrument: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  part: PropTypes.string.isRequired
};

export default EditPart;
