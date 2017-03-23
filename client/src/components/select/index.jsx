import React from 'react';

import './index.scss';

export default class Select extends React.PureComponent {
  static get propTypes() {
    return {
      children: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.arrayOf(React.PropTypes.element)]))
      ]),
      defaultText: React.PropTypes.string
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
