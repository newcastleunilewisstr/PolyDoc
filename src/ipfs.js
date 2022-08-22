//import fetch from 'isomorphic-fetch';




const projectId = '2DPV3IloboQ6Gvwzmec0UOnrD3u';
const projectSecret = 'a0a1627e8a9760b597e489fee9ba1474';

export const ipfsbcupload = async (text) => {
    console.log("IPFSupload function called")
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    const file = new File([text], 'texthash.txt', { type: 'application/octet-stream' })
    const form = new FormData ()
    form.append ('file', file)
	const result = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
		method: 'POST',
        headers: {
            authorization: auth,
        },
		//headers: { 'Content-Type': 'multipart/formdata'},

		body: form
	});
    console.log("IPFSCID generated")
	const json = await result.json();
    return json.Hash
    
};

