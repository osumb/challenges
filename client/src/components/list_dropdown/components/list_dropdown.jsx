import React from 'react';
import ArrowUp from 'material-design-icons/hardware/svg/production/ic_keyboard_arrow_up_24px.svg';
import ArrowDown from 'material-design-icons/hardware/svg/production/ic_keyboard_arrow_down_24px.svg';

import ListDropdownItem from './list_dropdown_item';
import ListDropdownSeparator from './list_dropdown_separator';

export default class ListDropdown extends React.PureComponent {
  static get propTypes() {
    return {
      children: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.arrayOf(React.PropTypes.element)]))
      ]),
      header: React.PropTypes.string
    };
  }

  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    // Don't remove. The material design components js doesn't let the event bubble up
    // This means we can't just place an `onClick` prop to our header
    this.header.addEventListener('click', this.handleToggle);
  }

  componentWillUnmount() {
    this.header.removeEventListener('click', this.handleToggle);
  }

  handleToggle() {
    this.setState(({ open }) => ({ open: !open }));
  }

  render() {
    return (
      <ul className="mdc-list">
        <li
          className="mdc-list-item"
          ref={header => {
            this.header = header;
          }}
        >
          {(this.props.header || '').charAt(0).toUpperCase() + (this.props.header || '').slice(1)}
          {this.state.open ? <img src={ArrowUp} /> : <img src={ArrowDown} />}
        </li>
        <ListDropdownSeparator />
        {this.state.open &&
          React.Children.map(this.props.children, c => <ListDropdownItem>{c}</ListDropdownItem>)
        }
        {this.state.open &&
          <ListDropdownSeparator />
        }
      </ul>
    );
  }
}
