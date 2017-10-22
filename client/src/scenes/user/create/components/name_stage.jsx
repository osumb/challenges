import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
`;

export default class NameStage extends React.Component {
  static get propTypes() {
    return {
      initialState: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string
      })
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      ...props.initialState
    };
  }

  render() {
    return (
      <Container>Name</Container>
    );
  }
}
