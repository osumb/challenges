import styled from 'styled-components';

export default styled.div`
  flex: ${({ flex }) => flex}
  ${({ alignSelf }) => alignSelf && `align-self: ${alignSelf};`};
  ${({ minWidth }) => minWidth && `min-width: ${minWidth};`};
  ${({ maxWidth }) => maxWidth && `max-width: ${maxWidth};`};
  ${({ minHeight }) => minHeight && `min-height: ${minHeight};`};
  ${({ maxHeight }) => maxHeight && `max-height: ${maxHeight};`};
  ${({ margin }) => margin && `margin: ${margin};`};
  ${({ padding }) => padding && `padding: ${padding};`};
  ${({ height }) => height && `height: ${height};`};
  ${({ width }) => width && `width: ${width};`};
  ${({ textAlign }) => textAlign && `text-align: ${textAlign};`};
`;
