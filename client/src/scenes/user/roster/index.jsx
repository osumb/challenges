import React from 'react';
import ReactTable from 'react-table';
import styled from 'styled-components';

import 'react-table/react-table.css';
import { helpers, propTypes } from '../../../data/user';
import EditInstrument from './components/edit_part';
import EditSpot from './components/edit_spot';
import RosterHeader from './components/roster_header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const filterMethod = ({ id, value }, row) => row[id].toLowerCase().includes(value.toLowerCase());
const flattenSpotToString = oldUsers => (
  {
    users: oldUsers.map(({ spot, ...a }) => ({ spot: `${spot.row}${spot.file}`, ...a }))
  }
);
const updateStateWithNewRow = newRow => ({ users }) => ({
  users: users.map(({ id, ...rest }) => {
    if (id === newRow.id) {
      return newRow;
    } else {
      return { id, ...rest };
    }
  })
});

export default class Roster extends React.PureComponent {
  static get propTypes() {
    return {
      users: React.PropTypes.arrayOf(React.PropTypes.shape(propTypes))
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.handleRowChange = this.handleRowChange.bind(this);
    this.renderEditPart = this.renderEditPart.bind(this);
    this.renderEditSpot = this.renderEditSpot.bind(this);
  }

  componentDidMount() {
    helpers.getAll()
    .then(({ users }) => {
      this.setState(flattenSpotToString(users));
    });
  }

  handleRowChange(row) {
    this.setState(updateStateWithNewRow(row));
  }

  renderEditPart(props) {
    return <EditInstrument {...props} onChange={this.handleRowChange} />;
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
            filterMethod
          },
          {
            header: 'Last',
            accessor: 'lastName',
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
