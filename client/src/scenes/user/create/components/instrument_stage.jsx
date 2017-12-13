import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isEqual from 'lodash.isequal';

import { helpers as userHelpers } from '../../../../data/user';
import Select from '../../../../components/select';
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

const isFormComplete = (instrument, part) => Boolean(instrument) && Boolean(part);
const instrumentKeys = Object.keys(userHelpers.instruments);
const partKeys = Object.keys(userHelpers.parts);
const instrumentValues = instrumentKeys.map(key => userHelpers.instruments[key]);
const partValues = partKeys.map(key => userHelpers.parts[key]);

export default class InstrumentStage extends React.Component {
  static get propTypes() {
    return {
      user: PropTypes.shape({
        instrument: PropTypes.string,
        part: PropTypes.string
      }),
      onFormComplete: PropTypes.func.isRequired,
      onFormIncomplete: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      instrument: props.user.instrument,
      part: props.user.part
    };
    this.handleInstrumentChange = this.handleInstrumentChange.bind(this);
    this.handlePartChange = this.handlePartChange.bind(this);
  }

  componentDidMount() {
    if (isFormComplete(this.props.user.instrument, this.props.user.part)) {
      this.props.onFormComplete();
    } else {
      this.props.onFormIncomplete();
    }
  }

  componentWillReceiveProps(newProps) {
    if (!isEqual(newProps.user, this.props.user)) {
      this.setState({ ...newProps.user });
    }
  }

  componentDidUpdate() {
    if (isFormComplete(this.state.instrument, this.state.part)) {
      this.props.onFormComplete();
    } else {
      this.props.onFormIncomplete();
    }
  }

  handleInstrumentChange(instrumentIndex) {
    this.setState({ instrument: instrumentValues[instrumentIndex] });
  }

  handlePartChange(partIndex) {
    this.setState({ part: partValues[partIndex] });
  }

  render() {
    return (
      <Container>
        <Typography category="title">What is their instrument and part?</Typography>
        <FieldsContainer>
          <FieldContainer>
            <Select
              onChange={this.handleInstrumentChange}
            > 
              {instrumentValues.map(key => <option key={key}>{key}</option>)}
            </Select>
          </FieldContainer>
          <FieldContainer>
            <Select
              onChange={this.handlePartChange} 
            >
              {partValues.map(key => <option key={key}>{key}</option>)}
            </Select>
          </FieldContainer>
        </FieldsContainer>
      </Container>
    );
  }
}


