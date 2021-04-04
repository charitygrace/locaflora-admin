//import data from '../data/mbg-planturls.json';
import { deDuplicateArray } from './modifyFields';
import { getNameNext } from './getNameNext';


export function getMBGUrl(plant, nameAlt) {
  let queryName = plant.name;
  //if (plant.taxa.x === 1) queryName = plant.taxa.species.split(" ")[0] + " ×"+ plant.taxa.species.split(" ")[2];
  //if (plant.taxa.x === 1) queryName = plant.name.replace(" × "," ×");;
  if (nameAlt) queryName = nameAlt;
  console.log('MBG: ' + queryName);
  plant.taxa.scientificAlts = deDuplicateArray(plant.taxa.scientificAlts);

  return fetch(process.env.PUBLIC_URL + "data/mbg-planturls.json")
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    let match = data.find( item => item.name === queryName );
    //console.log(match);
    if (!match) {
      //console.log('no match');

      let nameNext = getNameNext(plant, nameAlt);
      if (nameNext) getMBGUrl(plant, nameNext);
    } else {
      //console.log('match');
      //console.log(match);
      plant.externalLinks.push({
        label: "Missouri Botanical Garden",
        url: match.url,
      })
      /*
      plant.sources.push({
        label: "Missouri Botanical Garden",
        url: match.url,
        //from: dateNow() //dateNow is not actually correct because it depends on when I scrapped the data
      })
      */
      plant.ids.mbgId = match.id;
    }
    //console.log(plant);
    return plant
  });
}
