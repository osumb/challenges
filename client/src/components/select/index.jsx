import React from 'react';
import PropTypes from 'prop-types';

import { noOp } from '../../utils';

export default class Select extends React.PureComponent {
  static get propTypes() {
    return {
      children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element)
          ])
        )
      ]),
      defaultText: PropTypes.string,
      disabled: PropTypes.bool,
      onChange: PropTypes.func,
      style: PropTypes.object,
      value: PropTypes.any
    };
  }

  static get defaultProps() {
    return {
      disabled: false,
      style: {}
    };
  }

  constructor(props) {
    super(props);
    this.getSelectedIndex = this.getSelectedIndex.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.root.addEventListener('change', this.handleChange);
  }

  componentWillUnmount() {
    this.root.removeEventListener('change', this.handleChange);
  }

  handleChange() {
    if (this.props.onChange) {
      this.props.onChange(this.root.selectedIndex);
    }
  }

  getSelectedIndex() {
    return this.root.selectedIndex;
  }

  render() {
    return (
      <select
        className="mdc-select"
        disabled={this.props.disabled}
        ref={root => {
          this.root = root;
        }}
        onChange={noOp}
        style={this.props.style}
        value={this.props.value}
      >
        {React.Children.map(this.props.children, c => c)}
      </select>
    );
  }
}
