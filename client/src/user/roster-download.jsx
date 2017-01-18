import React, { Component, PropTypes } from 'react';
import Download from 'material-ui/svg-icons/action/get-app';

const usersToCSV = (users) =>
  users.reduce(
    (acc, { instrument, name, part, spotId }) => `${acc},${name},${spotId},${instrument},${part}`,
    'Name,Spot,Instrument,Part'
  );

export default class RosterDownload extends Component {

  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      users: PropTypes.arrayOf(PropTypes.shape({
        instrument: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        part: PropTypes.string.isRequired,
        spotId: PropTypes.string.isRequired
      })).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      requesting: false,
      usersCSV: null
    };
    this.handleDownLoad = this.handleDownLoad.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      usersCSV: null
    });
  }

  handleDownLoad() {
    const { usersCSV } = this.state;
    let csv;

    if (!usersCSV) {
      csv = usersToCSV(this.props.users);
      this.setState({
        usersCSV: csv
      });
    } else {
      csv = usersCSV;
    }

    console.log(csv);
  }

  render() {
    return (
      <Download
        id={this.props.id}
        disabled={!this.state.requesting}
        onTouchTap={this.handleDownLoad}
      />
    );
  }
}
