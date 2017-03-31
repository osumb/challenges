import React from 'react';
import { MDCTextfield } from '@material/textfield/dist/mdc.textfield.min.js';

export default class TextField extends React.PureComponent {
  static get propTypes() {
    return {
      onChange: React.PropTypes.func,
      hint: React.PropTypes.string,
      name: React.PropTypes.string,
      type: React.PropTypes.string
    };
  }

  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    this.mdcTextfield = new MDCTextfield(this.textfield);
  }

  handleTextChange(e) {
    if (this.props.onChange) {
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
        />
        {this.props.hint && <span className="mdc-textfield__label">{this.props.hint}</span>}
      </label>
    );
  }
}
