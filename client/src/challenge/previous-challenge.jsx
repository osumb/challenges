import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import Star from 'material-ui/svg-icons/action/stars';

const PreviousChallenge = ({ userName, spotId, performanceName }) =>
  <ListItem leftIcon={<Star />} primaryText={`${userName} challenged ${spotId} for the ${performanceName}`} />;

PreviousChallenge.propTypes = {
  performanceName: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired
};

export default PreviousChallenge;
