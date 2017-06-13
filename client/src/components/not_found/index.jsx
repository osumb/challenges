import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const NotFound = () =>
  <Container>
    <img src="/images/404.png" />
    <h2>Not Found</h2>
    <Link to="/">Get me outta here!</Link>
  </Container>;

export default NotFound;
