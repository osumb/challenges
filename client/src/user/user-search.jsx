import React, { Component, PropTypes } from 'react';
import keycode from 'keycode';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';

import './user-search.scss';
import SearchList from './search-list';

export default class UserSearch extends Component {

  static get propTypes() {
    return {
      location: PropTypes.shape({
        query: PropTypes.shape({
          q: PropTypes.string.isRequired
        })
      }).isRequired,
      router: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      query: this.props.location.query && this.props.location.query.q
    };
    this.handleEnterCheck = this.handleEnterCheck.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillReceiveProps({ location }) {
    this.setState({ query: location.query && location.query.q });
  }

  handleEnterCheck({ keyCode }) {
    if (keycode(keyCode) === 'enter') {
      this.handleSearch();
    }
  }

  handleSearch() {
    if (this.state.query) {
      this.props.router.transitionTo(`/search?q=${this.state.query}`);
    }
  }

  handleQueryChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { query } = this.state;

    return (
      <div className="UserSearch">
        <div className="UserSearch-wrapper">
          <TextField
            fullWidth
            name="query"
            onChange={this.handleQueryChange}
            onKeyDown={this.handleEnterCheck}
            placeholder="Search for a user"
            value={query || ''}
          />
          <span>
            <RaisedButton style={{ backgroundColor: 'blue' }} onTouchTap={this.handleSearch}><SearchIcon id="UserSearch-buttonIcon" /></RaisedButton>
          </span>
        </div>
        <SearchList query={(this.props.location.query && this.props.location.query.q) || ''} />
      </div>
    );
  }
}
