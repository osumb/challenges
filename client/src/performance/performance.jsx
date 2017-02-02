import React, { Component, PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Datetime from 'react-datetime';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';

import '../../../node_modules/react-datetime/css/react-datetime.css';
import './performance.scss';

const openCloseDateFormat = 'MMM, Do h:mm A';
const performDateFormat = 'MMMM DD, YYYY';

const getStateFromProps = ({ closeAt, id, listExported, name, openAt, performDate }) => ({
  closeAt: moment(closeAt),
  editing: false,
  id,
  listExported,
  name,
  openAt: moment(openAt),
  performDate: moment(performDate),
  requesting: false
});

export default class Performance extends Component {

  static get propTypes() {
    return {
      closeAt: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      listExported: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      onEdit: PropTypes.func.isRequired,
      openAt: PropTypes.string.isRequired,
      performDate: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = getStateFromProps(props);
    this.handleCloseAtChange = this.handleCloseAtChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleEditToggle = this.handleEditToggle.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleOpenAtChange = this.handleOpenAtChange.bind(this);
    this.handlePerformDateChange = this.handlePerformDateChange.bind(this);
  }

  componentDidReceiveProps(props) {
    this.setState(getStateFromProps(props));
  }

  handleCloseAtChange(closeAt) {
    this.setState({ closeAt });
  }

  handleConfirm() {
    const { state } = this;

    delete state.editing;
    delete state.requesting;

    this.props.onEdit({
      ...state,
      closeAt: state.closeAt.format(),
      openAt: state.openAt.format(),
      performDate: state.performDate.format()
    });
  }

  handleEditToggle() {
    this.setState(({ editing }) => ({ editing: !editing }));
  }

  handleNameChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  handleOpenAtChange(openAt) {
    this.setState({ openAt });
  }

  handlePerformDateChange(performDate) {
    this.setState({ performDate });
  }

  render() {
    const { editing, requesting } = this.state;
    const { closeAt, listExported, name, openAt, performDate } = this.state;

    return (
      <Card>
        <CardHeader
          title={editing ?
            <div className="Performance-dateWrapper">
              <label>Performance Name:&nbsp;</label>
              <input onChange={this.handleNameChange} name="name" value={name} />
            </div> :
            name
          }
          subtitle={editing ?
            <div className="Performance-dateWrapper">
              <label>Performance Date:&nbsp;</label>
              <Datetime
                onChange={this.handlePerformDateChange}
                textFormat={performDateFormat}
                value={performDate}
              />
            </div> :
            `Performance on ${moment(performDate).format(performDateFormat)}`
          }
        />
        {editing && !listExported ?
          <CardText>
            <div className="Performance-dateWrapper">
              <label>Opens at:&nbsp;</label>
              <Datetime
                onChange={this.handleOpenAtChange}
                textFormat={openCloseDateFormat}
                value={openAt}
              />
            </div>
            <div className="Performance-dateWrapper">
              <label>Closes at:&nbsp;</label>
              <Datetime
                onChange={this.handleCloseAtChange}
                textFormat={openCloseDateFormat}
                value={closeAt}
              />
            </div>
          </CardText> :
          <CardText>
            <div>Opens at: {moment(openAt).format(openCloseDateFormat)}</div>
            <div>Closes at: {moment(closeAt).format(openCloseDateFormat)}</div>
          </CardText>
        }
        <CardActions>
          {editing ?
            [
              <RaisedButton key="cancel" onTouchTap={this.handleEditToggle}>Cancel</RaisedButton>,
              <RaisedButton key="confirm" disabled={requesting} onTouchTap={this.handleConfirm}>Confirm</RaisedButton>
            ] :
            <RaisedButton onTouchTap={this.handleEditToggle}>Edit</RaisedButton>
          }
        </CardActions>
      </Card>
    );
  }
}
