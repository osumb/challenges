import React from 'react';

import { helpers } from '../../../data/password_reset_request';
import Reset from './components/reset';

export default class PasswordResetReset extends React.PureComponent {
  static get propTypes() {
    return {
      match: React.PropTypes.shape({
        params: React.PropTypes.shape({
          id: React.PropTypes.string.isRequired
        })
      })
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    helpers.get(this.props.match.params.id).then(data => {
      this.setState({ data });
    });
  }

  render() {
    const { data } = this.state;

    if (data === null) {
      return <div>Loading...</div>;
    }

    return <Reset {...data} />;
  }
}
