import React from 'react';

import { helpers, propTypes } from '../../../data/discipline_action';
import Button from '../../button';
import Typography from '../../typography';

export default class PastDisciplineAction extends React.PureComponent {
  static get propTypes() {
    return {
      ...propTypes,
      currentPerformance: React.PropTypes.any,
      onDelete: React.PropTypes.func
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
      requesting: false
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    helpers.del(this.props.id)
    .then(() => {
      this.setState({
        deleted: true,
        requesting: false
      });
      if (this.props.onDelete) {
        this.props.onDelete(this.props.id);
      }
    });
  }

  render() {
    const { currentPerformance, performance, reason, user } = this.props;
    const showDelete = Boolean(currentPerformance) && currentPerformance.id === performance.id;

    return (
      <div>
        <Typography category="title">
          For the {performance.name}, {user.firstName} was disciplined for {reason}
        </Typography>
        {showDelete && <Button onClick={this.handleDeleteClick} primary>Delete</Button>}
      </div>
    );
  }
}
