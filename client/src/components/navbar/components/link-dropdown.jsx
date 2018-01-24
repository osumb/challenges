import React, { PureComponent } from 'react';
import keycode from 'keycode';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const DropdownContainer = styled.div`
  position: absolute;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
  z-index: 1;
  max-height: ${({ show }) => (show ? '200px' : 0)};
  transition: all 0.25s ease-in-out;
  overflow-y: hidden;
  top: 100%;
`;
const LinkWrapper = styled.div`
  padding: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

export default class LinkDropdown extends PureComponent {
  static get propTypes() {
    return {
      displayName: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired
        })
      )
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleKeyClick = this.handleKeyClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick);
    window.addEventListener('keyup', this.handleKeyClick);
    window.addEventListener('touchend', this.handleOutsideClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
    window.removeEventListener('keyup', this.handleKeyClick);
    window.removeEventListener('touchend', this.handleOutsideClick);
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  handleKeyClick({ keyCode }) {
    if (keycode(keyCode) === 'esc') {
      this.setState({
        open: false
      });
    }
  }

  handleOpen() {
    this.setState({
      open: true
    });
  }

  handleOutsideClick({ target }) {
    const area = this.dropdown;

    if (!area.contains(target)) {
      this.setState({
        open: false
      });
    }
  }

  handleToggle() {
    const { open } = this.state;

    this.setState({
      open: !open
    });
  }

  render() {
    const { displayName, links } = this.props;

    return (
      <Container
        onClick={this.handleToggle}
        innerRef={ref => {
          this.dropdown = ref;
        }}
      >
        {displayName}
        <Dropdown open={this.state.open}>
          {links.map(({ name, path }) => (
            <span key={path}>
              <LinkWrapper>
                <Link to={path} style={{ color: 'black' }}>
                  {name}
                </Link>
              </LinkWrapper>
            </span>
          ))}
        </Dropdown>
      </Container>
    );
  }
}

class Dropdown extends React.Component {
  static get propTypes() {
    return {
      children: PropTypes.any,
      open: PropTypes.bool
    };
  }

  render() {
    return (
      <DropdownContainer show={this.props.open}>
        {this.props.children}
      </DropdownContainer>
    );
  }
}
