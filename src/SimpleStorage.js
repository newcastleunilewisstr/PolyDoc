// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStorage_abi from './contracts/SimpleStorage_abi.json'
import logo from './logo.svg';
import background from './background.svg';
import {then} from 'react';



const SimpleStorage = () => {

	// deploy simple storage contract and paste deployed contract address here. This was the local ganache chain, now it is polygon testnet address currently. Will change this to mainnet when launch
	let contractAddress = '0xaA6cF3dd03A3854f3E98a9C5e2C84325a9491fc9';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [adminSwitchText, setAdminSwitchText] = useState('Admin Portal');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);




	


	  const initialAdmins = [
		{id: 1, name: 'Lewis', address: '0x54B7210ec53ADF5B30e6e7eA5C290DaDD062A172'},
		
	  ];
	  const [Admins, setAdmins] = useState(initialAdmins);
	
const connectAdmin = () => {
		if (defaultAccount==initialAdmins){

			then(result => {
				
				setAdminSwitchText('Admin Verified');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to get Admin Approval');
			setErrorMessage('If you are a user please use the user portal. If you require admin access please contact your manager to get approval for admin access');
		}
	}




	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, SimpleStorage_abi, tempSigner);
		setContract(tempContract);	
	}

	const setHandler = (event) => {
		event.preventDefault();
		console.log('sending ' + event.target.setText.value + ' to the contract');
		contract.set(event.target.setText.value);
	}

	const getCurrentVal = async () => {
		let val = await contract.get();
		setCurrentContractVal(val);
	}
	
	return (
		
		
		<div>
		<h1> {"MedicBlock"} </h1>

		<img src={logo} alt=""></img>
		
		<h4> {"Change Healthcare Data"} </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<div> 
			<button onClick={setAdmins}>{adminSwitchText}</button>
			</div>
			<form onSubmit={setHandler}>
				<input id="setText" type="text"/>
				<button type={"submit"}> Update Contract </button>
			</form>
			<div>
			<button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
			{currentContractVal}
			{errorMessage}
		</div>
	);
}

export default SimpleStorage;