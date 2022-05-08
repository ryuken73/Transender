import React from 'react'
import Box from '@mui/material/Box';
import styled from 'styled-components';
import colors from 'renderer/config/colors';
import Slide from '@mui/material/Slide';
import useMediaQueryEasy from 'renderer/hooks/useMediaQueryEasy'

const Container = styled(Box)`
    && {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: absolute;
        border-radius: 8px;
        bottom: ${props => props.bottom || '20px'};
        width: ${props => props.width || 'auto'};
        height: ${props => props.height || 'auto'};
        padding: 5px;
        background: ${props => props.bgcolor || colors.playerLight4};
        opacity: ${props => props.opacity || 1};
        left: 0;
        right: 0;
        margin: auto;
    }
`


const SnackBar = props => {
    const {hidden=true, direction="up", children} = props;
    const {containerProps} = props;
    const {bottomByMediaQuery} = useMediaQueryEasy();
    return (
        <Slide direction={direction} timeout={500} in={!hidden} mountOnEnter unmountOnExit>
            <Container bottom={bottomByMediaQuery} {...containerProps}>
                {children}
            </Container>
        </Slide>
    )
}

export default React.memo(SnackBar);
