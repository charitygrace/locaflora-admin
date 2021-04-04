export function getStoredPlants() {
  //console.log('getStoredPlants');
  return fetch(process.env.PUBLIC_URL + "/data/plants.json", {
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    return data
  });
}
