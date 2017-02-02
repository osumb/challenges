import React, { Component, PropTypes } from 'react';
import Snackbar from 'material-ui/Snackbar';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import './roster.scss';
import { compareSpots } from '../utils';
import Fetch from '../shared-components/fetch';
import RosterDownload from './roster-download';
import RosterItem from './roster-item';

const endPoint = '/roster';

class Roster extends Component {

  static get propTypes() {
    return {
      users: PropTypes.arrayOf(PropTypes.shape({
        instrument: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        nameNumber: PropTypes.string.isRequired,
        part: PropTypes.string.isRequired,
        spotId: PropTypes.string.isRequired
      }))
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      success: false,
      usersMap: props.users.reduce((acc, curr) => {
        acc[curr.nameNumber] = curr;

        return acc;
      }, {})
    };
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
  }

  handleSnackbarClose() {
    this.setState(() => ({ success: false }));
  }

  handleUserChange({ nameNumber, ...rest }) {
    this.setState(({ usersMap }) => ({
      success: true,
      usersMap: {
        ...usersMap,
        [nameNumber]: {
          nameNumber,
          ...rest
        }
      }
    }));
  }

  render() {
    const { usersMap } = this.state;
    const users = Object.keys(usersMap).map((key) => usersMap[key]).sort(({ spotId: a }, { spotId: b }) => compareSpots(a, b));

    return (
      <div className="Roster">
        <RosterDownload
          id="Roster-download"
          users={users}
        />
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Spot</TableHeaderColumn>
              <TableHeaderColumn>Instrument</TableHeaderColumn>
              <TableHeaderColumn>Part</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(({ nameNumber, ...rest }) =>
              <RosterItem
                key={nameNumber}
                onUserChange={this.handleUserChange}
                nameNumber={nameNumber}
                {...rest}
              />)
            }
          </TableBody>
        </Table>
        <Snackbar
          autoHideDuration={2000}
          message="Successfully updated user"
          onRequestClose={this.handleSnackbarClose}
          open={this.state.success}
        />
      </div>
    );
  }
}

export default function RosterContainer(props) {
  return (
    <Fetch
      {...props}
      errorMessage="Error fetching roster"
      endPoint={endPoint}
    >
      <Roster />
    </Fetch>
  );
}
