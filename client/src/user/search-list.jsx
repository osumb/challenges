import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

import { api } from '../utils';
import SearchListItem from './search-list-item';

const endPoint = '/users/search';

class SearchList extends React.Component {

  static get propTypes() {
    return {
      query: PropTypes.string
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      users: null
    };
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    if (this.props.query) {
      this.search();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.query && this.props.query !== prevProps.query) {
      this.search();
    }
  }

  search() {
    this.setState({ loading: true });
    api.get(`${endPoint}?q=${this.props.query}`)
    .then(({ users }) => {
      this.setState({ loading: false, users });
    })
    .catch(() => {
      this.setState({ loading: false, users: [] });
    });
  }

  render() {
    const { loading, users } = this.state;
    const { query } = this.props;

    if (loading && query) {
      return <CircularProgress />;
    } else if (!query) {
      return null;
    }

    return (
      <div className="SearchList">
        <List>
          <ListItem
            primaryText={`${(users || []).length} result(s) found for ${query}`}
          />
          {(users || []).map((result) => (
            <span key={result.nameNumber}><Divider /><SearchListItem {...result} /></span>
          ))}
        </List>
      </div>
    );
  }

}

export default SearchList;
