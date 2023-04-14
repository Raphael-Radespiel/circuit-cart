async function postRequest(data, serverRoute, callback){
    let request = {
      method: "POST",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    // MAKE REQUEST AND HANDLE RESPONSE 
    let response = await fetch(serverRoute, request);

    if(response.ok){
      callback();
    }
    else{
      const jsonResponse = await response.json();
      alert(`Error: ${jsonResponse.message}`);
    }
}


export {postRequest};
