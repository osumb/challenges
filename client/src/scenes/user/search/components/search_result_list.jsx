import React from 'react';
import styled from 'styled-components';

import { ListDropdownItem, ListDropdownSeparator } from '../../../../components/list_dropdown';
import Typography from '../../../../components/typography';

const Container = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;
const Item = styled.div`
  margin-top: 5px;
`;

const SearchResultList = ({ children, query }) => (
  <Container>
    {Boolean(query) && children.length <= 0 ?
      <Typography category="headline">No Results</Typography> :
      <Typography category="title">{children.length} result(s) found for '{query}'</Typography>
    }
    {React.Children.map(children, child => (
      <Item>
        <ListDropdownItem>{child}</ListDropdownItem>
        <ListDropdownSeparator />
      </Item>
    ))}
  </Container>
);

SearchResultList.propTypes = {
  children: React.PropTypes.node,
  query: React.PropTypes.string
};

export default SearchResultList;
