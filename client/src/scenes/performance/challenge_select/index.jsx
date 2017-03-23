import React from 'react';

import { compareSpots } from '../../../utils';
import { helpers as performanceHelpers } from '../../../data/performance';
import Select from './components/select';

export default class ChallengeSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    performanceHelpers.getChallengeableUsers().then(({ challengeableUsers, performance }) => {
      this.setState({
        data: {
          challengeableUsers: [...challengeableUsers].sort(compareSpots),
          performance
        }
      });
    });
  }

  render() {
    const { data } = this.state;

    if (data === null) {
      return (
        <div>Loading...</div>
      );
    }

    return <Select {...data} />;
  }
}
