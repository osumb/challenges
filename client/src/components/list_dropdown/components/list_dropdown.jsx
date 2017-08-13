import React from 'react';
import ArrowDown from '../../../assets/images/ic_keyboard_arrow_down_black_24px.svg';
import ArrowUp from '../../../assets/images/ic_keyboard_arrow_up_black_24px.svg';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ListDropdownItem, { ITEM_HEIGHT } from './list_dropdown_item';
import ListDropdownSeparator from './list_dropdown_separator';

const AnimationContainer = styled.div`
  transition: height 0.25s ease-in-out;
  height: ${({ itemCount, show }) =>
    show ? `${ITEM_HEIGHT * itemCount}px` : 0};
  overflow: hidden;
`;

export default class ListDropdown extends React.PureComponent {
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
      header: PropTypes.string,
      separatorMargin: PropTypes.string,
      separatorPadding: PropTypes.string
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
    const { separatorMargin: margin, separatorPadding: padding } = this.props;
    const { open } = this.state;
    const children = React.Children.map(this.props.children, c =>
      <ListDropdownItem>
        {c}
      </ListDropdownItem>
    );

    return (
      <ul className="mdc-list">
        <li
          className="mdc-list-item"
          ref={header => {
            this.header = header;
          }}
        >
          {(this.props.header || '').charAt(0).toUpperCase() +
            (this.props.header || '').slice(1)}
          {open
            ? <img src={ArrowUp} alt="Arrow Up" />
            : <img src={ArrowDown} alt="Arrow Down" />}
        </li>
        <ListDropdownSeparator margin={margin} padding={padding} />
        <AnimationContainer show={open} itemCount={children.length}>
          {children}
        </AnimationContainer>
        {open && <ListDropdownSeparator margin={margin} padding={padding} />}
      </ul>
    );
  }
}
