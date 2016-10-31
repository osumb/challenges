import React, { Component, PropTypes } from 'react';

const validSpot = /^[A-Z][1-9][1-9]?$/;

const isSpotValid = (spot, originalSpot) =>
  spot !== originalSpot && validSpot.test(spot) && 1 <= parseInt(spot.substring(1), 10) && parseInt(spot.substring(1), 10) <= 18; // eslint-disable-line yoda

class EditSpot extends Component {

  constructor({ spot }) {
    super();
    this.state = {
      editing: false,
      spotId: spot
    };
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSpotEdit = this.handleSpotEdit.bind(this);
  }

  handleCancelClick() {
    this.setState({
      editing: false
    });
  }

  handleConfirmClick() {
    this.props.onEdit(this.state.spotId);
    this.setState({
      editing: false
    });
  }

  handleEditClick() {
    this.setState({
      editing: true
    });
  }

  handleSpotEdit({ target }) {
    this.setState({
      ...this.state,
      spotId: target.value
    });
  }

  render() {
    const { editing, spotId } = this.state;
    const { spot } = this.props;

    if (!editing) {
      return (
        <div>
          {spot}
          <button onClick={this.handleEditClick}>Edit Spot</button>
        </div>
      );
    }

    return (
      <div>
        <input onChange={this.handleSpotEdit} type="text" value={spotId} />
        <button onClick={this.handleCancelClick}>Cancel</button>
        <button disabled={!isSpotValid(spotId, spot)} onClick={this.handleConfirmClick}>Confirm</button>
      </div>
    );
  }
}

EditSpot.propTypes = {
  onEdit: PropTypes.func.isRequired,
  spot: PropTypes.string.isRequired
};

export default EditSpot;
