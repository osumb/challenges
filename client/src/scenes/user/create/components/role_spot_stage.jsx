import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { helpers as spotHelpers } from '../../../../data/spot';
import { helpers as userHelpers } from '../../../../data/user';
import Select from '../../../../components/select';
import Textfield from '../../../../components/textfield';
import Typography from '../../../../components/typography';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const FieldsContainer = styled.div`
  width: 80%;
  display: flex;
`;
const FieldContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const isFormComplete = (role, spot) =>
  Boolean(role) && Boolean(spot.row) && spot.file !== null;
const roleKeys = Object.keys(userHelpers.roles);
const roleValues = roleKeys.map(key => userHelpers.roles[key]);
const rowKeys = Object.keys(spotHelpers.rows);
const rowValues = rowKeys.map(key => spotHelpers.rows[key]);

export default class RoleSpotStage extends React.Component {
  static get propTypes() {
    return {
      user: PropTypes.shape({
        role: PropTypes.string,
        spot: PropTypes.shape({
          row: PropTypes.string,
          file: PropTypes.number
        })
      }),
      onFormComplete: PropTypes.func.isRequired,
      onFormIncomplete: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      role: props.user.role,
      spot: props.user.spot
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleSpotChange = this.handleSpotChange.bind(this);
  }

  componentDidMount() {
    if (isFormComplete(this.props.user.role, this.props.user.spot)) {
      this.props.onFormComplete();
    } else {
      this.props.onFormIncomplete();
    }
  }

  componentDidUpdate() {
    if (isFormComplete(this.state.role, this.state.spot)) {
      this.props.onFormComplete();
    } else {
      this.props.onFormIncomplete();
    }
  }

  handleFileChange(event) {
    const spot = { ...this.state.spot };
    const newFile = event.target.value;
    let file = newFile;

    if (newFile < 1) {
      file = 1;
    } else {
      file = Math.min(spotHelpers.rowFileMax[spot.row], newFile);
    }

    spot.file = file;
    this.setState({ spot });
  }

  handleRoleChange(roleIndex) {
    this.setState({ role: userHelpers.roles[roleKeys[roleIndex]] });
  }

  handleSpotChange(rowIndex) {
    const spot = { ...this.state.spot };

    spot.row = spotHelpers.rows[rowKeys[rowIndex]];
    this.setState({ spot });
  }

  render() {
    const disableSpotSelect = !userHelpers.isPerformerRole(this.state.role);

    return (
      <Container>
        <Typography category="title">What is their role and spot?</Typography>
        <FieldsContainer>
          <FieldContainer>
            <Select onChange={this.handleRoleChange}>
              {roleValues.map(key => <option key={key}>{key}</option>)}
            </Select>
          </FieldContainer>
          <FieldContainer>
            <Select
              disabled={disableSpotSelect}
              onChange={this.handleSpotChange}
            >
              {rowValues.map(key => <option key={key}>{key}</option>)}
            </Select>
            <Textfield
              disabled={disableSpotSelect}
              type="number"
              labelStyle={{
                height: '24px',
                marginLeft: '16px',
                marginBottom: '10px'
              }}
              onChange={this.handleFileChange}
              value={this.state.spot.file}
            />
          </FieldContainer>
        </FieldsContainer>
      </Container>
    );
  }
}
