import React from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import Header from 'renderer/Components/Header';
import Footer from 'renderer/Components/Footer';
import MainTab from 'renderer/Components/Pages/MainTab';
import Home from 'renderer/Components/Pages/Home';
import Send from 'renderer/Components/Pages/Send';
import SendItem from 'renderer/Components/Pages/Send/SendItem';
import Receive from 'renderer/Components/Pages/Receive';
import History from 'renderer/Components/Pages/History';
import Config from 'renderer/Components/Pages/Config';
import Loading from 'renderer/Components/Common/Loading';
import MessageBox from 'renderer/Components/Common/MessageBox';
import styled from 'styled-components';
import { createQueue } from 'renderer/lib/queueClass';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import colors from 'renderer/config/colors';
import useAppState from 'renderer/hooks/useAppState';
import useMessageBox from 'renderer/hooks/useMessageBox';
import useSocketIO from 'renderer/hooks/useSocketIO';
import useCheckConcept from './hooks/useCheckConcept';

const { SOCKET_SERVER_URL } = constants;
const { TASK_TYPES } = bullConstants;

const BasicBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: grey 1px solid;
  box-sizing: border-box;
  border-collapse: collapse;
  font-size: calc(10px + 2vmin);
`;

const AppContainer = styled(BasicBox)`
  text-align: center;
  background-color: ${colors.base};
  flex-direction: column;
  justify-content: flex-start;
  color: white;
  height: 100%;
`;
const HeaderContainer = styled(BasicBox)`
  margin-bottom: -1px;
  height: 10%;
`;
const BodyContainer = styled.div`
  margin-left: -1px;
  margin-right: -1px;
  border: grey 1px solid;
  box-sizing: border-box;
  border-collapse: collapse;
  width: 100%;
  height: 90%;
`;
const CenterPane = styled(BasicBox)`
  flex-direction: column;
  font-size: calc(1px + 2vmin);
  padding: 8px;
  border-right: none;
  margin-right: -1px;
  margin-left: -1px;
  height: 100%;
`;
const FooterContainer = styled(BasicBox)`
  height: 40px;
  margin-top: -1px;
  font-size: calc(1px + 1.5vmin);
  flex-shrink: 0;
`;
const Index = () => {
  return <div>index</div>;
};
const NotFound = () => {
  return <div>not found</div>;
};
export default function App() {
  console.log('re-render App')
  // const [connected, setSocketConnected] = React.useState(false);
  // const { modalOpen, setModalOpenState } = useAppState();
  // const { showMessageBox } = useMessageBox();
  const params = useParams();
  const location = useLocation();
  const { pathname } = location;
  console.log(params, location, pathname);
  React.useEffect(() => {
    // initialize media info Queues
    createQueue('mediainfo', bullConstants);
  }, []);
  // const { socket } = useSocketIO({
  //   hostAddress: SOCKET_SERVER_URL,
  //   setSocketConnected,
  // });

  // const handleProgress = React.useCallback((props) => {
  //   const { clientId, progress } = props;
  //   console.log(`progress event: ${clientId}, ${progress}`);
  // }, []);
  // const toggleModal = React.useCallback(() => {
  //   setModalOpenState(!modalOpen);
  // }, [])
  // const showMessage = React.useCallback(() => {
  //   showMessageBox('info')
  // }, [])
  return (
    <AppContainer>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <BodyContainer>
        <CenterPane>
          <Routes>
            <Route index element={<MainTab />} />
            <Route path="/index.html" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/send" element={<Send />}>
              <Route path=":sendId" element={<SendItem />} />
            </Route>
            <Route path="/receive" element={<Receive />} />
            <Route path="/history" element={<History />} />
            <Route path="/config" element={<Config />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CenterPane>
      </BodyContainer>
      <FooterContainer>
        <Footer />
      </FooterContainer>
      <MessageBox />
      <Loading />
    </AppContainer>
  );
}
