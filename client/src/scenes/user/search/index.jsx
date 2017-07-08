import React from 'react';
import keycode from 'keycode';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { helpers } from '../../../data/user';
import Button from '../../../components/button';
import SearchIcon from '../../../assets/images/ic_search_white_24px.svg';
import SearchResultList from './components/search_result_list';
import SearchResultListItem from './components/search_result_list_item';
import TextField from '../../../components/textfield';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Results = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const SearchField = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const SearchIconImg = styled.img`
  display: block;
  margin: auto;
`;

const getSearchQueryFromQueryString = queryString => queryString.split('=')[1];

class Search extends React.PureComponent {
  static get propTypes() {
    return {
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired,
      location: PropTypes.shape({
        search: PropTypes.string
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      query: getSearchQueryFromQueryString(props.location.search),
      requesting: false,
      searchResults: []
    };
    this.handleApiSearch = this.handleApiSearch.bind(this);
    this.handleEnterKeyup = this.handleEnterKeyup.bind(this);
    this.handleInputQueryChange = this.handleInputQueryChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    const initialQuery = getSearchQueryFromQueryString(
      this.props.location.search
    );

    if (initialQuery) {
      this.handleApiSearch(initialQuery);
    }
  }

  handleApiSearch(query) {
    this.setState({ requesting: true });
    helpers.search(query).then(({ users }) => {
      this.setState({ requesting: false, searchResults: users });
    });
  }

  handleEnterKeyup({ keyCode }) {
    if (keycode(keyCode) === 'enter') {
      this.handleSearch();
    }
  }

  handleInputQueryChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  handleSearch() {
    const { query } = this.state;

    this.props.history.push(`/search?q=${query}`);
    this.handleApiSearch(query);
  }

  render() {
    const { query, requesting, searchResults } = this.state;

    return (
      <Container>
        <SearchField>
          <TextField
            autoFocus
            name="query"
            onChange={this.handleInputQueryChange}
            onKeyUp={this.handleEnterKeyup}
            labelStyle={{
              width: '80%'
            }}
            value={query || ''}
          />
          <Button disabled={requesting} primary onClick={this.handleSearch}>
            <SearchIconImg src={SearchIcon} />
          </Button>
        </SearchField>
        <Results>
          <SearchResultList
            query={getSearchQueryFromQueryString(this.props.location.search)}
          >
            {searchResults.map(({ buckId, ...rest }) =>
              <SearchResultListItem key={buckId} buckId={buckId} {...rest} />
            )}
          </SearchResultList>
        </Results>
      </Container>
    );
  }
}

export default withRouter(Search);
