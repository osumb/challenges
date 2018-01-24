import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TextField from '../../../../components/textfield';

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex: 1;
  width: 90%;
`;

const Input = ({ inputs, onChange, style }) => (
  <InputWrapper>
    {inputs.map(({ hint, name, value }) => (
      <TextField
        key={name}
        name={name}
        onChange={onChange}
        hint={hint}
        value={value}
        labelStyle={style}
      />
    ))}
  </InputWrapper>
);

Input.propTypes = {
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      hint: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired
};

export default Input;
