import React from 'react';
import styled from 'styled-components';

import { helpers as userHelpers } from '../../../../data/user';
import Select from '../../../../components/select';

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

export default class EditPart extends React.PureComponent {
  static get propTypes() {
    return {
      onChange: React.PropTypes.func,
      row: React.PropTypes.object.isRequired, // row is an object representing our user and provided by react-table
      value: React.PropTypes.string.isRequired // this is our spot value
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      requesting: false
    };
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleEditToggleClick = this.handleEditToggleClick.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ editing: false, requesting: false });
  }

  handleConfirmClick() {
    const partIndex = this.partsSelect.getSelectedIndex();
    const newPart = userHelpers.partsForInstrument(this.props.row.instrument)[partIndex];

    this.setState({ requesting: true });
    userHelpers.editPart(this.props.row.id, newPart)
    .then(() => {
      this.setState({ editing: false, requesting: false });
      this.props.onChange({ ...this.props.row, part: newPart });
    });
  }

  handleEditToggleClick() {
    this.setState(({ editing }) => ({ editing: !editing }));
  }

  render() {
    const part = this.props.value;
    const { editing, requesting } = this.state;

    if (editing) {
      return (
        <Container>
          <Select
            ref={ref => {
              this.partsSelect = ref;
            }}
          >
            {userHelpers.partsForInstrument(this.props.row.instrument).map(p => (
              <option className="mcd-list-item" key={p}>{p}</option>
            ))}
          </Select>
          <Container>
            <EditButton disabled={requesting} onClick={this.handleEditToggleClick}>Cancel</EditButton>
            <EditButton disabled={requesting} onClick={this.handleConfirmClick}>Confirm</EditButton>
          </Container>
        </Container>
      );
    }

    return (
      <Container>
        {part}
        <EditButton disabled={requesting} onClick={this.handleEditToggleClick}>Edit</EditButton>
      </Container>
    );
  }
}
