//import fetch from 'isomorphic-fetch';

//API Secret should be stored in enviroment variable
const projectId = "2DPV3IloboQ6Gvwzmec0UOnrD3u";
const projectSecret = process.env.REACT_APP_PROJECTSECRET

export const ipfsbcupload = async (text) => {
  console.log("IPFSupload function called");
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const file = new File([text], "texthash.txt", {
    type: "application/octet-stream",
  });
  const form = new FormData();
  form.append("file", file);
  const result = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
    method: "POST",
    headers: {
      authorization: auth,
    },
    //headers: { 'Content-Type': 'multipart/formdata'},

    body: form,
  });
  console.log("IPFSCID generated");
  const json = await result.json();
  return json.Hash;
};
