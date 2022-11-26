import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import GreetingArtifact from '../artifacts/contracts/Greeting.sol/Greeting.json';

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function ContractCall() {
  const context = useWeb3React();
  const { library, active } = context;

  const [signer, setSigner] = useState();
  const [greetingContract, setGreetingContract] = useState();
  const [greetingContractAddr, setGreetingContractAddr] = useState('');
  const [greeting, setGreeting] = useState('');
  const [greetingInput, setGreetingInput] = useState('');

  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect(() => {
    if (!greetingContract) {
      return;
    }

    async function getGreeting(greetingContract) {
      const _greeting = await greetingContract.greet();

      if (_greeting !== greeting) {
        setGreeting(_greeting);
      }
    }

    getGreeting(greetingContract);
  }, [greetingContract, greeting]);

  function handleDeployContract(event) {
    event.preventDefault();

    // only deploy the Greeting contract one time, when a signer is defined
    if (greetingContract || !signer) {
      return;
    }

    async function deployGreetingContract(signer) {
      const Greeting = new ethers.ContractFactory(
        GreetingArtifact.abi,
        GreetingArtifact.bytecode,
        signer
      );

      try {
        const greetingContract = await Greeting.deploy('Hello, Hardhat!');

        await greetingContract.deployed();

        const greeting = await greetingContract.greet();

        setGreetingContract(greetingContract);
        setGreeting(greeting);

        window.alert(`Greeting deployed to: ${greetingContract.address}`);

        setGreetingContractAddr(greetingContract.address);
      } catch (error) {
        window.alert(
          'Error : ' + (error && error.message ? `${error.message}` : '')
        );
      }
    }

    deployGreetingContract(signer);
  }

  function handleGreetingChange(event) {
    event.preventDefault();
    setGreetingInput(event.target.value);
  }

  function handleGreetingSubmit(event) {
    event.preventDefault();

    if (!greetingContract) {
      window.alert('Undefined greetingContract');
      return;
    }

    if (!greetingInput) {
      window.alert('Greeting cannot be empty');
      return;
    }

    async function submitGreeting(greetingContract) {
      try {
        const setGreetingTxn = await greetingContract.setGreeting(greetingInput);

        await setGreetingTxn.wait();

        const newGreeting = await greetingContract.greet();
        window.alert(`Success! Greeting is now: ${newGreeting}`);

        if (newGreeting !== greeting) {
          setGreeting(newGreeting);
        }
      } catch (error) {
        window.alert(
          'Error :' + (error && error.message ? `${error.message}` : '')
        );
      }
    }

    submitGreeting(greetingContract);
  }

  return (
    <>
      <StyledDeployContractButton
        disabled={!active || greetingContract ? true : false}
        style={{
          borderColor: !active || greetingContract ? 'unset' : 'blue'
        }}
        onClick={handleDeployContract}
      >
        Deploy Greeting Contract
      </StyledDeployContractButton>
      <StyledGreetingDiv>
        <StyledLabel>Contract address</StyledLabel>
        <div>
          {greetingContractAddr ? (
            greetingContractAddr
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        <StyledLabel>Current greeting</StyledLabel>
        <div>
          {greeting ? greeting : <em>{`<Contract not yet deployed>`}</em>}
        </div>
        <StyledLabel htmlFor="greetingInput">Set new greeting</StyledLabel>
        <StyledInput
          id="greetingInput"
          type="text"
          placeholder={greeting ? '' : '<Contract not yet deployed>'}
          onChange={handleGreetingChange}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !greetingContract ? true : false}
          style={{
            borderColor: !active || !greetingContract ? 'unset' : 'blue'
          }}
          onClick={handleGreetingSubmit}
        >
          Submit
        </StyledButton>
      </StyledGreetingDiv>
    </>
  );
}
