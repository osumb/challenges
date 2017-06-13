import React from 'react';
import styled from 'styled-components';

const Button = styled.div`
  color: ${({ disabled }) => (disabled ? 'gray' : 'black')};
  margin-right: 10px;
  text-decoration: underline;
  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'hand')};
  }
`;
const EditButton = props => <Button {...props} />;

export default EditButton;
