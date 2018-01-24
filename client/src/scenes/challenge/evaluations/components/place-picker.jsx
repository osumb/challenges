import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { FlexChild, FlexContainer } from '../../../../components/flex';
import { lightGray } from '../../../../styles';

const Chip = styled.p`
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  padding: 8px;
  margin: 0 4px 0 0;

  ${({ active }) =>
    active &&
    `
    background-color: ${lightGray};
    font-weight: bold;
    opacity: 1;
  `} ${({ active }) =>
      !active &&
      `
    background-color: white;
    font-weight: lighter;
    opacity: 0.75;
  `};
`;

const placePickerOnClick = (onClick, place) => () => onClick(place);

const PlacePicker = ({ numberOfPlaces, onPlacePick, place }) => (
  <FlexContainer flexDirection="row">
    {[...Array(numberOfPlaces).keys()].map(p => p + 1).map(p => (
      <FlexChild key={p} flex="0">
        <Chip active={place === p} onClick={placePickerOnClick(onPlacePick, p)}>
          {p}
        </Chip>
      </FlexChild>
    ))}
  </FlexContainer>
);

PlacePicker.propTypes = {
  numberOfPlaces: PropTypes.number.isRequired,
  onPlacePick: PropTypes.func.isRequired,
  place: PropTypes.number
};

export default PlacePicker;
