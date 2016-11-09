import React, { Component } from 'react';
import { Link } from 'react-router';

import './user-search.scss';
import { api } from '../utils';

export default class UserSearch extends Component {

  constructor() {
    super();
    this.state = {
      searchResults: [],
      query: ''
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch({ target }) {
    this.setState({
      query: target.value
    });

    if (target.value.length > 2) {
      api.get(`/users/search?q=${target.value}`)
      .then(({ users }) => {
        this.setState({
          ...this.state,
          searchResults: users
        });
      });
    }
  }

  render() {
    return (
      <div className="UserSearch">
        <input
          autoFocus
          className="UserSearch-search"
          onChange={this.handleSearch}
          placeholder="Search For User"
          value={this.state.query}
        />
        <div className="UserSearch-results">
          <ul className="UserSearch-results-list">
            {this.state.searchResults.map(({ name, nameNumber }) =>
              <li className="UserSearch-result" key={nameNumber}>
                <Link to={`/users/profile/${nameNumber}`}>Manage {name}</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
