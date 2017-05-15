import React from 'react';
import ReactTable from 'react-table';
import styled from 'styled-components';

import 'react-table/react-table.css';
import { fetch } from '../../../utils';
import { helpers as spotHelpers } from '../../../data/spot';
import { helpers, propTypes } from '../../../data/user';
import EditFirstName from './components/edit_first_name';
import EditLastName from './components/edit_last_name';
import EditPart from './components/edit_part';
import EditSpot from './components/edit_spot';
import RosterHeader from './components/roster_header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const fetchRoster = () => helpers.getAll();
const propsFromData = ({ users }) => ({ users: flattenSpotToString(users) });

const filterMethod = ({ id, value }, row) => row[id].toLowerCase().includes(value.toLowerCase());
const flattenSpotToString = oldUsers =>
  oldUsers.map(({ spot, ...a }) => ({ spot: `${spot.row}${spot.file}`, ...a }))
;
const updateStateWithNewRow = newRow => ({ users }) => {
  const newSpot = newRow.spot;
  let oldSpot, oldSpotUserIndex; // index at which the user who currently holds `newSpot` resides
  const newUsers = users.map(({ id, ...rest }, index) => {
    if (rest.spot === newSpot) oldSpotUserIndex = index;
    if (id === newRow.id) {
      oldSpot = rest.spot;
      return newRow;
    } else {
      return { id, ...rest };
    }
  });
  newUsers[oldSpotUserIndex].spot = oldSpot;

  return { users: newUsers.sort((a, b) => spotHelpers.compareSpots(a.spot, b.spot)) };
};

class Roster extends React.PureComponent {
  static get propTypes() {
    return {
      users: React.PropTypes.arrayOf(React.PropTypes.shape({ ...propTypes, spot: React.PropTypes.string }))
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      users: props.users
    };
    this.handleRowChange = this.handleRowChange.bind(this);
    this.renderEditFirstName = this.renderEditFirstName.bind(this);
    this.renderEditLastName = this.renderEditLastName.bind(this);
    this.renderEditPart = this.renderEditPart.bind(this);
    this.renderEditSpot = this.renderEditSpot.bind(this);
  }

  handleRowChange(row) {
    this.setState(updateStateWithNewRow(row));
  }

  renderEditFirstName(props) {
    return <EditFirstName {...props} onChange={this.handleRowChange} />;
  }

  renderEditLastName(props) {
    return <EditLastName {...props} onChange={this.handleRowChange} />;
  }

  renderEditPart(props) {
    return <EditPart {...props} onChange={this.handleRowChange} />;
  }

  renderEditSpot(props) {
    return <EditSpot {...props} onChange={this.handleRowChange} />;
  }

  render() {
    const { users } = this.state;
    const columns = [
      {
        header: 'Name',
        columns: [
          {
            header: 'First',
            accessor: 'firstName',
            render: this.renderEditFirstName,
            filterMethod
          },
          {
            header: 'Last',
            accessor: 'lastName',
            render: this.renderEditLastName,
            filterMethod
          }
        ]
      },
      {
        header: 'Spot',
        columns: [{
          header: 'Spot',
          accessor: 'spot',
          render: this.renderEditSpot,
          filterMethod
        }]
      },
      {
        header: 'Part',
        columns: [{
          header: 'Part',
          accessor: 'part',
          render: this.renderEditPart,
          filterMethod
        }]
      },
      {
        header: 'Instrument',
        columns: [{
          header: 'Instrument',
          accessor: 'instrument',
          filterMethod
        }]
      }
    ];

    return (
      <Container>
        <RosterHeader users={users} />
        <ReactTable
          className="-striped -highlight"
          data={users}
          columns={columns}
          defaultPageSize={14}
          showFilters
          loading={users.length <= 0}
        />
      </Container>
    );
  }
}

export default fetch(fetchRoster, propsFromData, Roster);
