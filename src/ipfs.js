import fetch from 'isomorphic-fetch';


export const ipfsbcupload = async (text) => {
    const file = new File([text], 'texthash.txt', { type: 'application/octet-stream' })
    const form = new FormData ()
    form.append ('file', file)
	const result = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
		method: 'POST',
		//headers: { 'Content-Type': 'multipart/formdata'},

		body: form
	});
	const json = await result.json();
    return json.Hash
};
