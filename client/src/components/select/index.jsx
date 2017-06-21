import React from 'react';
import PropTypes from 'prop-types';

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
      defaultText: PropTypes.string
    };
  }

  constructor(props) {
    super(props);
    this.getSelectedIndex = this.getSelectedIndex.bind(this);
  }

  getSelectedIndex() {
    return this.root.selectedIndex;
  }

  render() {
    return (
      <select
        className="mdc-select"
        defaultValue={this.props.defaultText || 'Pick from list'}
        ref={root => {
          this.root = root;
        }}
      >
        {React.Children.map(this.props.children, c => c)}
      </select>
    );
  }
}
