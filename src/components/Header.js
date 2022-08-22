import logo from '../logo.svg';

export const Header = () => {
	return <>
		<h1>Welcome to PolyDoc</h1>
		<img src={logo} alt="logo"></img>
		<h4>Enter your phone number to register</h4>
	</>
}