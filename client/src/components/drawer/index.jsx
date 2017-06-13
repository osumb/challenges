import React from 'react';
import { MDCTemporaryDrawer } from '@material/drawer/dist/mdc.drawer.min.js';

export default class Drawer extends React.PureComponent {
  static get propTypes() {
    return {
      children: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.arrayOf(
          React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element)
          ])
        )
      ]),
      header: React.PropTypes.string,
      onClick: React.PropTypes.func,
      onCloseRequest: React.PropTypes.func,
      open: React.PropTypes.bool.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleDrawerClick = this.handleDrawerClick.bind(this);
    this.handleEscape = this.handleEscape.bind(this);
  }

  componentDidMount() {
    this.mdcDrawer = new MDCTemporaryDrawer(this.root);
    this.mdcDrawer.open = this.props.open;
    this.root.addEventListener('click', this.handleClick);
    this.drawer.addEventListener('click', this.handleDrawerClick);
    window.addEventListener('keyup', this.handleEscape);
  }

  componentDidUpdate() {
    if (this.mdcDrawer) {
      this.mdcDrawer.open = this.props.open;
    }
  }

  componentWillUnmount() {
    this.root.removeEventListener('click', this.handleClick);
    this.drawer.removeEventListener('click', this.handleDrawerClick);
    window.removeEventListener('keyup', this.handleEscape);
  }

  handleClick(e) {
    if (this.props.onCloseRequest) {
      this.props.onCloseRequest(e);
    }
  }

  handleDrawerClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  handleEscape(e) {
    if (e.code === 'Escape' && this.props.onCloseRequest) {
      this.props.onCloseRequest(e);
    }
  }

  render() {
    return (
      <aside
        className="mdc-temporary-drawer"
        ref={root => {
          this.root = root;
        }}
      >
        <nav
          className="mdc-temporary-drawer__drawer"
          ref={drawer => {
            this.drawer = drawer;
          }}
        >
          <header className="mdc-temporary-drawer__header">
            <div
              className="mdc-temporary-drawer__header-content mdc-theme--text-primary-on-primary"
              style={{
                backgroundColor: '#b3b3b3'
              }}
            >
              {this.props.header || ''}
            </div>
          </header>
          <nav className="mdc-temporary-drawer__content mdc-list-group">
            <div className="mdc-list">
              {React.Children.map(this.props.children, child =>
                React.Children.map(child, c =>
                  React.cloneElement(c, { className: 'mdc-list-item' })
                )
              )}
            </div>
          </nav>
        </nav>
      </aside>
    );
  }
}
