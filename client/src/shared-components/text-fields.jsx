import React, { Component, PropTypes } from 'react';
import keycode from 'keycode';
import TextField from 'material-ui/TextField';

import './text-fields.scss';

export default class TextFields extends Component {

  static get propTypes() {
    return {
      textFields: PropTypes.arrayOf(PropTypes.shape({
        errorText: PropTypes.string,
        label: PropTypes.string,
        name: PropTypes.string.isRequired,
        validate: PropTypes.func
      })).isRequired,
      onEnter: PropTypes.func
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      errors: props.textFields.reduce((acc, curr) => {
        acc[curr.name] = false;

        return acc;
      }, {}),
      fields: props.textFields.reduce((acc, curr) => {
        acc[curr.name] = {
          ...curr,
          value: ''
        };

        return acc;
      }, {})
    };
    this.handleCheckForEnter = this.handleCheckForEnter.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.areValid = this.areValid.bind(this);
    this.validate = this.validate.bind(this);
    this.values = this.values.bind(this);
  }

  handleCheckForEnter({ keyCode }) {
    if (keycode(keyCode) === 'enter' && this.props.onEnter) {
      this.props.onEnter();
    }
  }

  handleTextChange({ target }) {
    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        [target.name]: {
          ...fields[target.name],
          value: target.value
        }
      }
    }));
  }

  areValid() {
    const { fields } = this.state;

    return Object.keys(fields).every((key) => fields[key].validate ? fields[key].validate(fields[key].value) : true);
  }

  validate() {
    this.setState(({ fields }) => ({
      errors: Object.keys(fields).reduce((acc, curr) => {
        const field = fields[curr];

        acc[curr] = field.validate ? !field.validate(field.value) : false;

        return acc;
      }, {})
    }));
  }

  values() {
    const { fields } = this.state;

    return Object.keys(fields).map(key => ({
      name: fields[key].name,
      value: fields[key].value
    }));
  }

  render() {
    return (
      <div className="TextFields">
        {Object.keys(this.state.fields).map(key => {
          const { errors, fields } = this.state;
          const { label, ...rest } = fields[key];

          delete rest.validate;
          const textField = (
            <TextField
              key={key}
              {...rest}
              errorText={errors[key] && fields[key].errorText}
              onChange={this.handleTextChange}
              onKeyUp={this.handleCheckForEnter}
            />
          );

          if (label) {
            return (
              <div className="TextField" key={key}>
                <label>{label}</label>
                {textField}
              </div>
            );
          }

          return textField;
        })}
      </div>
    );
  }
}
