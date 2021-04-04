//import data from '../data/wildflowerorg-planturls.json';
import { deDuplicateArray } from './modifyFields';
import { getNameNext } from './getNameNext';


export function getNPINUrl(plant, nameAlt) {
  let queryName = plant.name;
  //if (plant.taxa.x === 1) queryName = plant.taxa.species.split(" ")[0] + " ×"+ plant.taxa.species.split(" ")[2];
  //console.log(plant);
  //console.log(plant.taxa.x);
  if (plant.taxa.x === 1) queryName = plant.name.replace(" × "," ×");;
  if (nameAlt) queryName = nameAlt;
  console.log('NPIN: ' + queryName);
  plant.taxa.scientificAlts = deDuplicateArray(plant.taxa.scientificAlts);

  return fetch(process.env.PUBLIC_URL + "data/wildflowerorg-planturls.json")
  .then(res => res.json())
  .then(data => {
    //console.log(data);
    var match = data.find( item => item.name === queryName );
    //console.log(match);
    if (!match) {
      //console.log('no match');

      let nameNext = getNameNext(plant, nameAlt);
      if (nameNext) getNPINUrl(plant, nameNext);
    } else {
      //console.log('match');
      //console.log(match);
      plant.externalLinks.push({
        label: "Wildflower.org",
        url: match.url,
      })
      plant.externalLinks.push({
        label: "USDA Plants Database",
        url: "https://plants.usda.gov/core/profile?symbol=" + match.id,
      })
      /*
      plant.sources.push({
        label: "Native Plant Information Network",
        url: match.url,
        //from: dateNow() //dateNow is not actually correct because it depends on when I scrapped the data
      })
      */
      plant.ids.usdaId = match.id;
    }
    //console.log(plant);
    return plant
  });
}
