import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledWalletStatusDiv = styled.div`
  display: flex;
  gap: 20px;
`;

function ChainId() {
  const { chainId } = useWeb3React();

  return (
    <>
      <span>
        <strong>Chain Id</strong>
      </span>
      <span>{chainId}</span>
    </>
  );
}

function BlockNumber() {
  const { chainId, library } = useWeb3React();

  const [blockNumber, setBlockNumber] = useState();

  useEffect(() => {
    if (!library) {
      return;
    }

    let stale = false;

    async function getBlockNumber(library) {
      try {
        const blockNumber = await library.getBlockNumber();

        if (!stale) {
          setBlockNumber(blockNumber);
        }
      } catch (error) {
        if (!stale) {
          setBlockNumber(undefined);
        }

        window.alert(
          'Error :' + (error && error.message ? `${error.message}` : '')
        );
      }
    }

    getBlockNumber(library);

    library.on('block', setBlockNumber);

    // cleanup function
    return () => {
      stale = true;
      library.removeListener('block', setBlockNumber);
      setBlockNumber(undefined);
    };
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>
        <strong>Block Number</strong>
      </span>
      <span>{blockNumber === null ? 'Error' : blockNumber}</span>
    </>
  );
}

function Account() {
  const { account } = useWeb3React();

  return (
    <>
      <span>
        <strong>Account</strong>
      </span>
      <span>
        {typeof account === 'undefined'
          ? ''
          : account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : ''}
      </span>
    </>
  );
}

function Balance() {
  const { account, library, chainId } = useWeb3React();

  const [balance, setBalance] = useState();

  useEffect(() => {
    if (typeof account === 'undefined' || account === null || !library) {
      return;
    }

    let stale = false;

    async function getBalance(
      library,
      account
    ) {
      const balance = await library.getBalance(account);

      try {
        if (!stale) {
          setBalance(balance);
        }
      } catch (error) {
        if (!stale) {
          setBalance(undefined);

          window.alert(
            'Error :' + (error && error.message ? `${error.message}` : '')
          );
        }
      }
    }

    getBalance(library, account);

    // create a named balancer handler function to fetch the balance each block. in the
    // cleanup function use the fucntion name to remove the listener
    const getBalanceHandler = () => {
      getBalance(library, account);
    };

    library.on('block', getBalanceHandler);

    // cleanup function
    return () => {
      stale = true;
      library.removeListener('block', getBalanceHandler);
      setBalance(undefined);
    };
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>
        <strong>Balance</strong>
      </span>
      <span>
        {balance === null
          ? 'Error'
          : balance
          ? `${ethers.utils.formatEther(balance)} ETH`
          : ''}
      </span>
    </>
  );
}

// nonce: aka 'transaction count'
function NextNonce() {
  const { account, library, chainId } = useWeb3React();

  const [nextNonce, setNextNonce] = useState();

  useEffect(() => {
    if (typeof account === 'undefined' || account === null || !library) {
      return;
    }

    let stale = false;

    async function getNextNonce(
      library,
      account
    ) {
      const nextNonce = await library.getTransactionCount(account);

      try {
        if (!stale) {
          setNextNonce(nextNonce);
        }
      } catch (error) {
        if (!stale) {
          setNextNonce(undefined);

          window.alert(
            'Error!' + (error && error.message ? `\n\n${error.message}` : '')
          );
        }
      }
    }

    getNextNonce(library, account);

    // create a named next nonce handler function to fetch the next nonce each block.
    // in the cleanup function use the fucntion name to remove the listener
    const getNextNonceHandler = () => {
      getNextNonce(library, account);
    };

    library.on('block', getNextNonceHandler);

    // cleanup function
    return () => {
      stale = true;
      setNextNonce(undefined);
    };
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>
        <strong>Next Nonce</strong>
      </span>
      <span>{nextNonce === null ? 'Error' : nextNonce}</span>
    </>
  );
}

export function WalletStatus() {
  return (
    <StyledWalletStatusDiv>
      <ChainId />
      <BlockNumber />
      <Account />
      <Balance />
      <NextNonce />
    </StyledWalletStatusDiv>
  );
}
