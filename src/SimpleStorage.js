// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, { useState } from 'react'
import { ethers } from 'ethers'
import SimpleStorage_abi from './contracts/SimpleStorage_abi.json'
import { Header } from './components/Header'
//import { create } from 'ipfs-core'
import {ipfsbcupload} from './ipfs'



const initialAdmins = [
	{ id: 1, name: 'Lewis', address: '0x54B7210ec53ADF5B30e6e7eA5C290DaDD062A172' },
	{ id: 2, name: 'Luke', address: '0x54B7210ec53ADF5B30e6e7eA5C2wefewfgqwgfqf90DaDD062A172' },
];


const App = () => {

	// deploy simple storage contract and paste deployed contract address here. This was the local ganache chain, now it is polygon testnet address currently. Will change this to mainnet when launch
	let contractAddress = '0xaA6cF3dd03A3854f3E98a9C5e2C84325a9491fc9';

	const [errorMessage, setErrorMessage] = useState(null);
	// const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [currentContractVal, setCurrentContractVal] = useState(null);
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	const [user, setUser] = useState(null)
	



	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts' })
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
		setUser({ address: newAccount });
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

	const setHandler =  async (event) => {
		event.preventDefault();
		const Hash = await ipfsbcupload (event.target.setText.value)
		console.log('sending ' + event.target.setText.value + ' to the contract');
		contract.set(Hash);
	}

	const getCurrentVal = async () => {
		let val = await contract.get();
		setCurrentContractVal(val);
	}

	

	const AdminComponent = () => {
		
		const [ViewAdmin, SetViewAdmin] = useState (false)


		const GetAdminList = () => {
			SetViewAdmin(true);
		  };
		
		  return (
			<div>
			  <div>Admin View</div>
			  <button onClick={GetAdminList}> View Admins </button>
			  {ViewAdmin &&
				initialAdmins.map((admin) => {
				  return (
					<div>
					  Admin: {admin.name} {admin.address} {admin.id}
					</div>
				  );
				})}
			</div>
		  );
		};
			

		
	
	



	return (


		<div>
			<Wallet
				
			
				user={user}
				setUser={setUser}
				connectWalletHandler={connectWalletHandler}
				connButtonText={connButtonText} />
			<Header />

			{
				
				user?.admin === true ?
					<AdminComponent />
					: null
			}
			
			{/* {
				
			// 	user?.ViewAdmin === true ?
			// 		<GetAdminList />
			// 		: null 
			// } */}
			

			<form onSubmit={setHandler}>
				<input id="setText" type="text" />
				<button type={"submit"}> Update Contract </button>
			</form>
			<div>
				<button onClick={getCurrentVal} style={{ marginTop: '5em' }}> Get Current Contract Value </button>
			</div>
			{currentContractVal}
			{errorMessage}
		</div>
	);
}



const Wallet = ({ user, setUser, connectWalletHandler, connButtonText }) => {
	const [adminSwitchText, setAdminSwitchText] = useState('Admin Portal');
	const [admins] = useState(initialAdmins);
	const [errorMessage, setErrorMessage] = useState(null);
	

	const connectAdmins = () => {
		console.log('current address', user?.address)
		console.log('admins', admins)
		const admin = admins.find(admin => admin.address.toUpperCase() === user?.address.toUpperCase())
		console.log('admin', admin)
		if (admin) {
			setUser({ ...user, admin: true })
			setAdminSwitchText('Admin Verified');
			setErrorMessage(null);
			// window.location.assign('https://www.google.co.uk')
		} else {
			console.log('Need to get Admin Approval');
			setErrorMessage('If you are a user please use the user portal. If you require admin access please contact your manager to get approval for admin access');
		}

	
	}

	return <div style={{ width: '100%' }}>
		<div style={{ display: 'flex', justifyContent: 'end' }}>
			<button style={{ pading: '5px', background: 'none', border: '2px solid black', borderRadius: '5px', margin: '10px' }} onClick={connectWalletHandler}>{connButtonText}</button>
			<button style={{ pading: '5px', background: 'none', border: '2px solid black', borderRadius: '5px', margin: '10px' }} onClick={connectAdmins}>{adminSwitchText}</button>
		</div>
		<div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
			<h3 style={{ margin: 0 }}>Address</h3><div>{user?.address}</div>
			{errorMessage}
		</div>
	</div>
}

// const GetAdminList = () => initialAdmins.map(admin => {
// 	return <div>Admin: {admin.name} {admin.address} {admin.id}</div>
// })
// }


export default App
