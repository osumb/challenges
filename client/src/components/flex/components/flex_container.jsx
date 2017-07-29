import styled from 'styled-components';

export default styled.div`
  display: flex;
  ${({ margin }) => margin && `margin: ${margin};`};
  ${({ padding }) => padding && `padding: ${padding};`};
  ${({ height }) => height && `height: ${height};`};
  ${({ width }) => width && `width: ${width};`};
  ${({ flexDirection }) =>
    flexDirection && `flex-direction: ${flexDirection};`};
  ${({ alignItems }) => alignItems && `align-items: ${alignItems};`};
  ${({ justifyContent }) =>
    justifyContent && `justify-content: ${justifyContent};`};
  ${({ flexWrap }) => flexWrap && `flex-wrap: ${flexWrap};`};
  ${({ opacity }) => opacity >= 0 && `opacity: ${opacity };`};
  ${({ border }) => border && `border: ${border};`};
  ${({ borderRadius }) => borderRadius && `border-radius: ${borderRadius};`};
`;
