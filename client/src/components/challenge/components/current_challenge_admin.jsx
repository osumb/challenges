import React from 'react';

import { helpers, propTypes } from '../../../data/challenge';
import Button from '../../../components/button';
import { FlexContainer } from '../../../components/flex';
import Typography from '../../../components/typography';

export default class CurrentChallengeAdmin extends React.Component {
  static get propTypes() {
    return {
      ...propTypes,
      onDelete: React.PropTypes.func,
      targetUserBuckId: React.PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      deleted: false
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    helpers.del(this.props.id)
    .then(() => {
      this.setState({
        deleted: true
      });
      if (this.props.onDelete) {
        this.props.onDelete(this.props.id);
      }
    });
  }

  render() {
    const { deleted } = this.state;
    const { performance, spot, targetUserBuckId, users } = this.props;
    const targetUser = users.filter(({ buckId }) => buckId === targetUserBuckId)[0];

    if (deleted) {
      return (
        <Typography category="title">Successfully deleted challenge</Typography>
      );
    }

    return (
      <FlexContainer flexWrap="wrap">
        <Typography category="title">
          {targetUser.firstName} is challenge spot {spot.row}{spot.file} for the {performance.name}
        </Typography>
        <Button primary onClick={this.handleDeleteClick}>Delete</Button>
      </FlexContainer>
    );
  }
}
