import React from 'react';
import styled from 'styled-components';
import useAppState from 'renderer/hooks/useAppState';
import TextBox from 'renderer/Components/Common/TextBox';
import { getVersion } from 'renderer/lib/appUtil';

const Container = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  align-items: center;
`;
const AppMessage = styled.div`
  /* margin-right: auto; */
  display: flex;
  align-items: center;
  min-width: 0;
  flex-shrink: 1;
  margin-left: 5px;
`
const CustomTextBox = styled(TextBox)`
  font-size: 12px;
  opacity: 0.8;
  margin-right: 5px;
`
const CustomTextBoxLimitWidth = styled(CustomTextBox)`
  /* max-width: 90%; */
  min-width: 0;
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
        <CustomTextBox text={`[${appLog.level}]`} />
        <CustomTextBox text={`[${appLog.date}]`} />
        <CustomTextBoxLimitWidth
          containerProps={{ minWidth: 0 }}
          text={appLog.message}
        />
      </AppMessage>
      <Version>
        <CustomTextBox text={`v${version}`} />
      </Version>
    </Container>
  )
};

export default React.memo(Footer);
