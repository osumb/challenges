import React from 'react';
import { MDCTextfield } from '@material/textfield/dist/mdc.textfield.min.js';

export default class TextField extends React.PureComponent {
  static get propTypes() {
    return {
      onChange: React.PropTypes.func,
      onKeyUp: React.PropTypes.func,
      hint: React.PropTypes.string,
      name: React.PropTypes.string,
      type: React.PropTypes.string
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
      >
        <input
          className="mdc-textfield__input"
          type={this.props.type || 'text'}
          name={this.props.name || 'text'}
          onChange={this.handleTextChange}
          onKeyUp={this.handleKeyUp}
        />
        {this.props.hint && <span className="mdc-textfield__label">{this.props.hint}</span>}
      </label>
    );
  }
}
