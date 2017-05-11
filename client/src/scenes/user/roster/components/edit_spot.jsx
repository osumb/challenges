import React from 'react';
import styled from 'styled-components';

import { helpers as spotHelpers } from '../../../../data/spot';
import { helpers as userHelpers } from '../../../../data/user';
import { errorEmitter } from '../../../../utils';

const Container = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const EditButton = styled.div`
  color: ${({ disabled }) => disabled ? 'gray' : 'black'};
  margin-right: 10px;
  text-decoration: underline;
  &:hover {
    cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
    cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'hand'};
  }
`;
const EditInput = styled.input`
  width: 50px;
`;

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
    this.state = {
      editing: false,
      newSpot: props.value,
      requesting: false
    };
    this.handleEditConfirmClick = this.handleEditConfirmClick.bind(this);
    this.handleEditToggleClick = this.handleEditToggleClick.bind(this);
    this.handleSpotChange = this.handleSpotChange.bind(this);
  }

  componentWillReceiveProps({ value }) {
    this.setState({ editing: false, newSpot: value, request: false });
  }

  handleEditConfirmClick() {
    const { instrument, part } = this.props.row;
    const { newSpot } = this.state;
    const [row, file] = spotHelpers.splitOnSpotString(newSpot);
    const spot = { row, file };

    if (
      spotHelpers.validSpot(spot) &&
      spotHelpers.validInstrumentForPart(row, part) &&
      spotHelpers.validInstrumentForRow(row, instrument)
    ) {
      this.setState({ requesting: true });
      userHelpers.editSpot()
      .then(() => {
        this.setState({ editing: false, requesting: false });
        this.props.onChange(this.props.row, newSpot);
      });
    } else {
      let errorMessage = 'Invalid Spot.';

      if (!spotHelpers.validInstrumentForPart(row, part)) {
        errorMessage = `${errorMessage} row ${row} can't have part ${part}.`;
      }
      if (!spotHelpers.validInstrumentForRow(row, instrument)) {
        errorMessage = `${errorMessage} row ${row} can't have instrument ${instrument}.`;
      }

      errorEmitter.dispatch(errorMessage);
    }
  }

  handleEditToggleClick() {
    this.setState(({ editing }) => ({ editing: !editing }));
  }

  handleSpotChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { value } = this.props;
    const { editing, requesting } = this.state;

    if (editing) {
      return (
        <Container>
          <EditInput onChange={this.handleSpotChange} value={this.state.newSpot} name="newSpot" disabled={requesting} />
          <Container>
            <EditButton onClick={this.handleEditToggleClick} disabled={requesting}>Cancel</EditButton>
            <EditButton onClick={this.handleEditConfirmClick} disabled={requesting}>Confirm</EditButton>
          </Container>
        </Container>
      );
    }

    return (
      <Container>
        {value}
        <EditButton onClick={this.handleEditToggleClick}>Edit</EditButton>
      </Container>
    );
  }
}
