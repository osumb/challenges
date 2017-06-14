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
      deleted: false,
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
    this.handlePerformanceDelete = this.handlePerformanceDelete.bind(this);
    this.handlePerformanceUpdate = this.handlePerformanceUpdate.bind(this);
  }

  handlePerformanceDelete({ id }) {
    this.setState({ deleted: false });
    helpers.del(id).then(() => {
      this.setState(({ performancesById }) => {
        const newPerformances = { ...performancesById };

        delete newPerformances[id];

        return {
          deleted: true,
          performancesById: { ...newPerformances }
        };
      });
    });
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
    const { deleted, performancesById, updated } = this.state;
    let snackbarMessage = 'Updated Performance';

    if (deleted) {
      snackbarMessage = 'Deleted Performance';
    }

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
                  canDelete
                  onAction={this.handlePerformanceUpdate}
                  onDelete={this.handlePerformanceDelete}
                  performance={performancesById[id]}
                />
              </Elevation>
            )}
          </FlexContainer>
        </FlexChild>
        <Snackbar show={updated || deleted} message={snackbarMessage} />
      </FlexContainer>
    );
  }
}

export default fetch(helpers.getAll, null, PerformanceIndex);
