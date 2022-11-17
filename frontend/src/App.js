import styled from 'styled-components';
import { Connect } from './components/Connect';
import { WalletStatus } from './components/WalletStatus';
import { SignMessage } from './components/SignMessage';
import { ContractCall } from './components/ContractCall';

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

function App() {
  return (
    <StyledAppDiv>
      <Connect />
      <WalletStatus />
      <SignMessage />
      <ContractCall />
    </StyledAppDiv>
  );
}

export default App;
