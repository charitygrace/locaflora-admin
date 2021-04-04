//import { toTitleCase , toArray, roundToPrecision, dateNow } from './modifyFields';
import { getNameNext } from './getNameNext';
import { mapTrefle } from './mapTrefle';


//Get expiring client side with this url
//this.trefleID = "MFBxR09FYmJ0THNzU1o4N3d1OEY2UT09";
//this.myURL = "http://localhost:3000";
/*
curl -i -X POST "https://trefle.io/api/auth/claim?token=MFBxR09FYmJ0THNzU1o4N3d1OEY2UT09&origin=http://localhost:3000"
*/
//const trefleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcCI6WzQ4LDQ2LDQ4LDQ2LDQ4LDQ2LDQ4XSwiaXNzdWVyX2lkIjo5NjcsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImF1ZCI6Ikpva2VuIiwiZXhwIjoxNTkzMTIyMTY2LCJpYXQiOjE1OTMxMTQ5NjYsImlzcyI6Ikpva2VuIiwianRpIjoiMm9kdTM3b29lcTdsY3ZuMDBvMDAxYjUxIiwibmJmIjoxNTkzMTE0OTY2fQ.uxTFoLxeTYxPNouccRvW6KJKwFiSl-Xi92B5EZ2kP4g";


export function getTrefleToken() {
  console.log("getTrefleToken");
  return fetch(process.env.PUBLIC_URL + "/data/trefleToken.txt")
  .then(res => res.text())
  .then(
    text  => {
      return text;
    },
    (error) => {
      alert("No trefleToken text file.");
      console.log("no trefleToken text file");
      console.log(error);
    }
  )
}


//trefle seems to throw an internal server error often so there is a recursive component to this call
export function getTrefleID(plant, token, nameAlt) {
  if (plant.id) {
    console.log("getTrefleID: " + plant.name);
    let queryName = plant.taxa.genus + " " + plant.taxa.species;
    if (plant.taxa.ssp) queryName = queryName + " ssp. " + plant.taxa.ssp;
    if (plant.taxa.v) queryName = queryName + " var. " + plant.taxa.v;
    if (plant.taxa.x === 1) queryName = plant.name.replace(" × "," ×");;
    //queryName = queryName.trim().replace(/\s\s/gi, " ");
    if (nameAlt) queryName = nameAlt;
    const url = "https://trefle.io/api/species?q=" + queryName.replace(/\s/gi, "%20") + "&token=" + token;
    return fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        //console.log(url);
        //console.log("trefleID " + queryName);
        //console.log('result');
        //console.log(result);
        if (result === "Internal server error") {
          //console.log("trying getTrefleID again");
          //console.log(plant);
          if (nameAlt) setTimeout(() => getTrefleID(plant, token, nameAlt), 5000);
          else  setTimeout(() => getTrefleID(plant, token), 5000);
        } else if (result.length === 0) {
            plant.needsReview.push({trefleId: "no name match for: " + queryName});
            let nameNext = getNameNext(plant, nameAlt);
            if (nameNext) getTrefleID(plant, token, nameNext);
        } else if (result.length > 0) {
          //console.log('has result');
          let match = result.find(line => line.is_main_species === true);
          if (!match) {
            match = result.find(line => line.scientific_name === queryName);
          }
          if (!match) {
            plant.needsReview.push({trefleId: "no name match for: " + queryName});
            let nameNext = getNameNext(plant, nameAlt);
            if (nameNext) getTrefleID(plant, token, nameNext);
          }
          if (match) {
            plant.ids.trefleId = match.id;
            if (match.is_main_species === false) plant.ids.trefleIdMain = match.main_species_id;
            //console.log(plant);
          }
        }
        return plant;
      },
      (error) => {
        console.log("ERROR: Likely to need new trefleToken. Add token to the data/trefleToken.txt in the public folder");
        console.log(error);
        //return plant;
      }
    )
  } else return plant;
}

export function getTrefleData(plant, importPriority, token) {
  console.log('getTrefleData: ' + plant.name);
  //console.log(plant.ids);
  if (plant.ids && plant.ids.trefleId) {
    const url = "https://trefle.io/api/plants/" + plant.ids.trefleId + "?token=" + token;
    return fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        //console.log("trefle DATA for:" + plant.name);
        //console.log(url);
        //console.log(result);
        if (result === "Internal server error") {
          //console.log("trying getTrefleData again");
          setTimeout(() => getTrefleData(plant, importPriority), 4000);
        } else {
          plant = Object.assign(plant, mapTrefle(plant, importPriority, result));

        }
        //console.log(plant);
        return plant;
      },
      (error) => {
        console.log(error);
      }
    )
  } else return plant
}
