import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { grey500, grey700 } from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import './update-part.scss';
import { api } from '../utils';

const instrumentPartMap = {
  Trumpet: ['Efer', 'Solo', 'First', 'Second', 'Flugel'],
  Mellophone: ['First', 'Second'],
  Trombone: ['First', 'Second', 'Bass'],
  Baritone: ['First'],
  Percussion: ['Snare', 'Cymbals', 'Tenor', 'Bass'],
  Sousaphone: ['First']
};

export default class UpdatePart extends Component {

  static get propTypes() {
    return {
      instrument: PropTypes.string.isRequired,
      nameNumber: PropTypes.string.isRequired,
      onPartChange: PropTypes.func.isRequired,
      part: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      part: props.part,
      requesting: false,
      selectedSamePart: false
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditToggle = this.handleEditToggle.bind(this);
    this.handlePartChange = this.handlePartChange.bind(this);
  }

  handleEditToggle() {
    this.setState(({ editing }, { part }) => ({
      editing: !editing,
      part,
      requesting: false,
      selectedSamePart: false
    }));
  }

  handleEdit() {
    const { requesting, part } = this.state;

    if (part !== this.props.part && !requesting) {
      this.setState({ selectedSamePart: false, requesting: true });
      api.put('/users', {
        nameNumber: this.props.nameNumber,
        part
      })
      .then(() => {
        this.setState({
          editing: false,
          part,
          requesting: false,
          selectedSamePart: false
        });
        this.props.onPartChange(part);
      });
    } else {
      this.setState({ selectedSamePart: true });
    }
  }

  handlePartChange(event, index, value) {
    this.setState({ part: value });
  }

  render() {
    const { instrument } = this.props;
    const { editing, part, requesting, selectedSamePart } = this.state;
    const fontSize = '13px';
    const buttonStyle = {
      color: 'white',
      margin: '0 4px'
    };

    if (!editing) {
      return (
        <div className="UpdatePart">
          <div className="UpdatePart-wrapper">
            <span className="UpdatePart-part">{part}</span>
            <FlatButton
              backgroundColor={grey500}
              hoverColor={grey700}
              onTouchTap={this.handleEditToggle}
              style={buttonStyle}
            >
              Edit
            </FlatButton>
          </div>
        </div>
      );
    }

    return (
      <div className="UpdatePart">
        <SelectField
          errorText={selectedSamePart && 'Please select a new part'}
          onChange={this.handlePartChange}
          style={{
            fontSize,
            marginBottom: '10px',
            width: '100px'
          }}
          value={part}
        >
          {(instrumentPartMap[instrument] || []).map((p) =>
            <MenuItem
              key={p}
              style={{
                fontSize
              }}
              primaryText={p}
              value={p}
            />)
          }
        </SelectField>
        <div>
          <FlatButton
            backgroundColor={grey500}
            hoverColor={grey700}
            onTouchTap={this.handleEditToggle}
            style={buttonStyle}
          >
            Cancel
          </FlatButton>
          <FlatButton
            backgroundColor={grey500}
            disabled={requesting}
            hoverColor={grey700}
            onTouchTap={this.handleEdit}
            style={buttonStyle}
          >
            Confirm
          </FlatButton>
        </div>
      </div>
    );
  }
}
