import React, { Component, PropTypes } from 'react';
import Divider from 'material-ui/Divider';
import keycode from 'keycode';
import { Link } from 'react-router-dom';
import { ListItem } from 'material-ui/List';
import Popover from 'material-ui/Popover/Popover';

export default class LinkDropdown extends Component {

  static get propTypes() {
    return {
      displayName: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired
      }))
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleKeyClick = this.handleKeyClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    /* eslint-disable react/no-did-mount-set-state, lines-around-comment */
    this.setState({
      anchorEl: this.refs.dropdown
    });
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
    const area = this.refs.dropdown;

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
    const { anchorEl } = this.state;

    return (
      <div ref="dropdown">
        <ListItem onTouchTap={this.handleToggle} primaryText={displayName} />
        <span>
          <Popover
            anchorEl={anchorEl}
            onCloseRequest={this.handleClose}
            open={this.state.open}
            useLayerForClickAway={false}
          >
            {links.map(({ name, path }) =>
              <span key={path}>
                <Divider />
                <ListItem>
                  <Link to={path}>{name}</Link>
                </ListItem>
              </span>
            )}
          </Popover>
        </span>
      </div>
    );
  }

}
