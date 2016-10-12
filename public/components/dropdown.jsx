import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import './dropdown.scss';
import { keyCodes } from '../utils';

class Dropdown extends Component {

  constructor() {
    super();
    this.state = {
      closed: true
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyClick = this.handleKeyClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick);
    window.addEventListener('keyup', this.handleKeyClick);
    window.addEventListener('touchend', this.handleOutsideClick);
  }

  componentWillUnMount() {
    window.removeEventListener('click', this.handleOutsideClick);
    window.removeEventListener('keyup', this.handleKeyClick);
    window.removeEventListener('touchend', this.handleOutsideClick);
  }

  handleClick() {
    this.setState({
      closed: !this.state.closed
    });
  }

  handleKeyClick({ keyCode }) {
    if (keyCode === keyCodes.ESC) {
      this.setState({
        closed: true
      });
    }
  }

  handleOutsideClick(e) {
    const area = this.refs.dropdown;
    const { target } = e;

    if (area && !area.contains(target)) {
      this.setState({ closed: true });
    }
  }

  renderHeader() {
    return (
      <div className="Dropdown-header" onClick={this.handleClick}>
        {this.props.name}{'  '}<i className="fa fa-angle-down" aria-hidden="true" />
      </div>
    );
  }

  renderLinks() {
    return this.props.links.map(({ location, name }) => (
      <li className="Dropdown-link" key={location}><Link onClick={this.handleClick} to={location}>{name}</Link></li>
    ));
  }

  render() {
    const { closed } = this.state;

    return (
      <div className="Dropdown" ref="dropdown">
        {this.renderHeader()}
        {!closed && <ul className="Dropdown-links">{this.renderLinks()}</ul>}
      </div>
    );
  }
}

Dropdown.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    location: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  name: PropTypes.string.isRequired
};

export default Dropdown;
