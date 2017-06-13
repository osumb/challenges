import React from 'react';
import { MDCTextfield } from '@material/textfield/dist/mdc.textfield.min.js';

export default class TextField extends React.PureComponent {
  static get propTypes() {
    return {
      autoFocus: React.PropTypes.bool,
      labelStyle: React.PropTypes.object,
      hint: React.PropTypes.string,
      name: React.PropTypes.string,
      onChange: React.PropTypes.func,
      onKeyUp: React.PropTypes.func,
      placeholder: React.PropTypes.string,
      type: React.PropTypes.string,
      value: React.PropTypes.string
    };
  }

  static get defaultProps() {
    return {
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
          type={this.props.type}
          name={this.props.name}
          onChange={this.handleTextChange}
          onKeyUp={this.handleKeyUp}
          placeholder={this.props.placeholder || ''}
          value={this.props.value}
        />
        {this.props.hint &&
          <span className="mdc-textfield__label">{this.props.hint}</span>}
      </label>
    );
  }
}
