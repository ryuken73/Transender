import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`

`

const BasicCard = (props) => {
  return (
    <Container>Basic Card</Container>
  )
}

export default React.memo(BasicCard);
