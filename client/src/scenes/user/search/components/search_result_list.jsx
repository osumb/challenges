import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  ListDropdownItem,
  ListDropdownSeparator
} from '../../../../components/list_dropdown';
import Typography from '../../../../components/typography';

const Container = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;
const Item = styled.div`
  margin-top: 5px;
`;

const SearchResultList = ({ children, query, requesting }) => {
  if (!query || requesting) return null;
  return (
    <Container>
      {children.length <= 0 &&
        <Typography category="title">
          No results found for '{query}'
        </Typography>}
      {React.Children.map(children, child =>
        <Item>
          <ListDropdownItem>{child}</ListDropdownItem>
          <ListDropdownSeparator />
        </Item>
      )}
    </Container>
  );
};

SearchResultList.propTypes = {
  children: PropTypes.node,
  query: PropTypes.string,
  requesting: PropTypes.bool.isRequired
};

export default SearchResultList;
