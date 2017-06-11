import React from 'react';

import { helpers as performanceHelpers } from '../../../data/performance';
import { FlexContainer } from '../../../components/flex';
import Performance from '../../../components/performance';
import Snackbar from '../../../components/snackbar';
import Typography from '../../../components/typography';

export default class CreatePerformance extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      created: false
    };
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate(performance) {
    performanceHelpers.create(performance)
    .then(() => {
      this.setState({ created: true });
    });
  }

  render() {
    return (
      <FlexContainer flexDirection="column" alignItems="center">
        <Typography category="display" number={2}>Create Performance</Typography>
        <Performance onAction={this.handleCreate} buttonText="Create" />
        <Snackbar show={this.state.created} message="Created Performance" />
      </FlexContainer>
    );
  }
}
