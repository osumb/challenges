import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { errorEmitter } from '../../../../utils';
import EditButton from './edit_button';

const Container = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const EditInput = styled.input`
  width: 100px;
`;

export default class EditText extends React.PureComponent {
  static get propTypes() {
    return {
      errorMessage: PropTypes.func.isRequired,
      onUpdate: PropTypes.func.isRequired,
      row: PropTypes.object.isRequired, // row is an object representing our user and provided by react-table
      update: PropTypes.func.isRequired,
      validNewValue: PropTypes.func.isRequired,
      value: PropTypes.string.isRequired // this is our spot value
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      newValue: props.value,
      requesting: false
    };
    this.handleEditConfirmClick = this.handleEditConfirmClick.bind(this);
    this.handleEditToggleClick = this.handleEditToggleClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentWillReceiveProps({ value }) {
    this.setState({ editing: false, newValue: value, request: false });
  }

  handleEditConfirmClick() {
    const { newValue } = this.state;
    const { errorMessage, onUpdate, update, validNewValue } = this.props;

    if (validNewValue(newValue)) {
      this.setState({ requesting: true });
      update(newValue).then(() => {
        this.setState({ editing: false, requesting: false });
        onUpdate(newValue);
      });
    } else {
      errorEmitter.dispatch(errorMessage(newValue));
    }
  }

  handleEditToggleClick() {
    this.setState(({ editing }) => ({ editing: !editing }));
  }

  handleTextChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { value } = this.props;
    const { editing, requesting } = this.state;

    if (editing) {
      return (
        <Container>
          <EditInput
            onChange={this.handleTextChange}
            value={this.state.newValue}
            name="newValue"
            disabled={requesting}
          />
          <Container>
            <EditButton
              onClick={this.handleEditToggleClick}
              disabled={requesting}
            >
              Cancel
            </EditButton>
            <EditButton
              onClick={this.handleEditConfirmClick}
              disabled={requesting}
            >
              Confirm
            </EditButton>
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
