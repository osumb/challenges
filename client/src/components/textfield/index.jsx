import React from 'react';
import { MDCTextfield } from '@material/textfield/dist/mdc.textfield.min.js';
import PropTypes from 'prop-types';

export default class TextField extends React.PureComponent {
  static get propTypes() {
    return {
      autoFocus: PropTypes.bool,
      disabled: PropTypes.bool,
      labelStyle: PropTypes.object,
      hint: PropTypes.string,
      name: PropTypes.string,
      onChange: PropTypes.func,
      onKeyUp: PropTypes.func,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };
  }

  static get defaultProps() {
    return {
      disabled: false,
      name: 'text',
      type: 'text'
    };
  }

  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    this.mdcTextfield = new MDCTextfield(this.textfield);
  }

  handleKeyUp(e) {
    if (typeof this.props.onKeyUp !== 'undefined') {
      this.props.onKeyUp(e);
    }
  }

  handleTextChange(e) {
    if (typeof this.props.onChange !== 'undefined') {
      this.props.onChange(e);
    }
  }

  render() {
    return (
      <label
        className="mdc-textfield"
        ref={textfield => {
          this.textfield = textfield;
        }}
        style={this.props.labelStyle}
      >
        <input
          className="mdc-textfield__input"
          autoFocus={this.props.autoFocus}
          disabled={this.props.disabled}
          type={this.props.type}
          name={this.props.name}
          onChange={this.handleTextChange}
          onKeyUp={this.handleKeyUp}
          placeholder={this.props.placeholder || ''}
          value={this.props.value}
        />
        {this.props.hint && (
          <span className="mdc-textfield__label">{this.props.hint}</span>
        )}
      </label>
    );
  }
}
