import React from 'react';
import styled from 'styled-components';
import useAppState from 'renderer/hooks/useAppState';
import { getVersion } from 'renderer/lib/appUtil';

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
  const { appLog } = useAppState();
  React.useEffect(() => {
    getVersion()
      .then((appVersion) => setVersion(appVersion))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container>
      {/* <AppMessage>[{message.level}][{message.text}]</AppMessage> */}
      <AppMessage>
        [{appLog.level}] [{appLog.date}] {appLog.message}
      </AppMessage>
      <Version>v{version}</Version>
    </Container>
  )
};

export default React.memo(Footer);
