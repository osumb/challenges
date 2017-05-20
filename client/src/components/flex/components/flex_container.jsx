import styled from 'styled-components';

export default styled.div`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  align-items: ${({ alignItems }) => alignItems};
  justify-content: ${({ justifyContent }) => justifyContent};
  flex-wrap: ${({ flexWrap }) => flexWrap};
`;
