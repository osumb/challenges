import React from 'react';
import moment from 'moment';

import { helpers, propTypes } from '../../../data/performance';
import { fetch } from '../../../utils';
import { FlexContainer, FlexChild } from '../../../components/flex';
import Elevation from '../../../components/elevation';
import Performance from '../../../components/performance';
import Snackbar from '../../../components/snackbar';
import Typography from '../../../components/typography';

const formatString = 'MM/DD/YYYY hh:mm A';

class PerformanceIndex extends React.PureComponent {
  static get propTypes() {
    return {
      performances: React.PropTypes.arrayOf(
        React.PropTypes.shape(propTypes.performance)
      ).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      performancesById: props.performances.reduce(
        (acc, { id, date, windowClose, windowOpen, ...rest }) => {
          acc[id] = {
            ...rest,
            id,
            date: moment(new Date(date)).format(formatString),
            windowClose: moment(new Date(windowClose)).format(formatString),
            windowOpen: moment(new Date(windowOpen)).format(formatString)
          };

          return acc;
        },
        {}
      ),
      updated: false
    };
    this.handlePerformanceUpdate = this.handlePerformanceUpdate.bind(this);
  }

  handlePerformanceUpdate({ id, ...rest }) {
    this.setState({ updated: false });
    helpers.update({ id, ...rest }).then(() => {
      this.setState(({ performancesById }) => ({
        performancesById: {
          ...performancesById,
          [id]: {
            id,
            ...rest
          }
        },
        updated: true
      }));
    });
  }

  render() {
    const { performancesById, updated } = this.state;

    return (
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        margin="20px 100px"
      >
        <Typography category="display" number={2}>
          Update Performances
        </Typography>
        <FlexChild flex={1} padding="20px 0 0 0" width="100%">
          <FlexContainer
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            flex={1}
          >
            {Object.keys(performancesById).sort().map(id =>
              <Elevation key={id}>
                <Performance
                  buttonText="Update"
                  onAction={this.handlePerformanceUpdate}
                  performance={performancesById[id]}
                />
              </Elevation>
            )}
          </FlexContainer>
        </FlexChild>
        <Snackbar show={updated} message="Updated Performance" />
      </FlexContainer>
    );
  }
}

export default fetch(helpers.getAll, null, PerformanceIndex);
