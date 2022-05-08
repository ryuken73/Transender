import React from 'react';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import colors from '../../config/colors';

const Container = styled(Box)`
  && {
    height: ${(props) => props.height || 'auto'};
    width: ${(props) => props.width || 'auto'};
    max-width: ${(props) => props.maxwidth || '100%'};
    margin: ${(props) => props.margin || '0px'};
    margin-right: ${(props) => props.margin || props.marginRight || '0px'};
    text-align: ${(props) => props.textalign || 'left'};
    user-select: ${(props) => props.userselect || 'none'};
  }
`;
const Text = styled(Box)`
  font-size: ${(props) => props.fontSize || '12px'};
  color: ${(props) => props.color || 'darkgrey'};
  font-weight: ${(props) => props.fontWeight || 400};
  opacity: ${(props) => props.opacity || '0.8'};
  cursor: ${(props) => props.cursor ? 'pointer' : props.clickable ? 'pointer' : 'auto'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    opacity: ${(props) => props.opacityOnHover || '1'};
  }
`;

const TextBox = (props) => {
  const {
    onClick = () => {},
    text = 'Text',
    preserveHtmlTag = false,
    containerProps = {},
    clickable = false,
    ...restProps
  } = props;
  return (
    <Container {...containerProps}>
      {preserveHtmlTag && (
        <Text
          onClick={onClick}
          clickable={clickable}
          dangerouslySetInnerHTML={{
            __html: text,
          }}
          {...restProps}
        />
      )}
      {!preserveHtmlTag && (
        <Text onClick={onClick} clickable={clickable} {...restProps}>
          {text}
        </Text>
      )}
    </Container>
  );
};

export default React.memo(TextBox);
