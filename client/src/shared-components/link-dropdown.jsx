import React, { Component, PropTypes } from 'react';
import Divider from 'material-ui/Divider';
import keycode from 'keycode';
import { ListItem } from 'material-ui/List';
import Popover from 'material-ui/Popover/Popover';

export default class LinkDropdown extends Component {

  static get propTypes() {
    return {
      displayName: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired
      })),
      router: PropTypes.object.isRequired
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

  handleClose({ target }) {
    if (target.dataset.route) {
      this.props.router.transitionTo(target.dataset.route);
    }
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

    return (
      <div ref="dropdown">
        <ListItem onTouchTap={this.handleToggle} primaryText={displayName} />
        <span>
          <Popover
            onCloseRequest={this.handleClose}
            open={this.state.open}
            useLayerForClickAway={false}
          >
            {links.map(({ name, path }) =>
              <span key={path}>
                <Divider />
                <ListItem>
                  <span data-route={path} onTouchTap={this.handleClose}>{name}</span>
                </ListItem>
              </span>
            )}
          </Popover>
        </span>
      </div>
  );
  }

}
