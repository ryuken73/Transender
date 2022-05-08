import React from 'react';
import styled from 'styled-components';
// import useMessage from 'renderer/hooks/useMessage';
import { getVersion } from 'renderer/lib/appUtil';
import constants from 'renderer/config/constants';

const { MSG_LEVEL } = constants;

const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 5px;
`;
const AppMessage = styled.div`
  margin-right: auto;
`
const Version = styled.div`
  margin-left: auto;
`;

const Footer = () => {
  const [version, setVersion] = React.useState('loading..');
  // const { message } = useMessage({
  //   level: MSG_LEVEL.INFO,
  //   text: 'Ready',
  // });
  React.useEffect(() => {
    getVersion()
      .then((appVersion) => setVersion(appVersion))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container>
      {/* <AppMessage>[{message.level}][{message.text}]</AppMessage> */}
      <Version>v{version}</Version>
    </Container>
  )
};

export default React.memo(Footer);
