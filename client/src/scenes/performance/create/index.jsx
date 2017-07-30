import React from 'react';

import { helpers as performanceHelpers } from '../../../data/performance';
import CircularProgress from '../../../components/circular_progress';
import { FlexContainer } from '../../../components/flex';
import Performance from '../../../components/performance';
import Snackbar from '../../../components/snackbar';
import Typography from '../../../components/typography';

export default class CreatePerformance extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      created: false,
      requesting: false
    };
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate(performance) {
    this.setState({
      created: false,
      requesting: true
    });
    performanceHelpers.create(performance).then(() => {
      this.setState({ created: true, requesting: false });
    });
  }

  render() {
    const { created, requesting } = this.state;

    return (
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        opacity={requesting ? 0.5 : 1}
      >
        <Typography category="display" number={2}>
          Create Performance
        </Typography>
        <Performance onAction={this.handleCreate} buttonText="Create" />
        <Snackbar show={created} message="Created Performance" />
        {requesting && <CircularProgress />}
      </FlexContainer>
    );
  }
}
