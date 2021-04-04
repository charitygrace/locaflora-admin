//import data from '../data/mbg-planturls.json';
import { deDuplicateArray } from './modifyFields';
import { getNameNext } from './getNameNext';


export function modifyNCSUSitemap(plants) {
  console.log("modifyNCSUSitemap");
  return fetch(process.env.PUBLIC_URL + "data/ncsu-planturls.json")
  .then(response => response.json())
  .then(data => {
    data.forEach( (item, index) => {
      item.rootURL = item.loc
      delete item.loc
      let nameMatch = item.rootURL.match(/(?<=https:\/\/plants\.ces\.ncsu\.edu\/plants\/)(.+)(?=\/common-name)/)
      if (nameMatch) item.name = nameMatch[0]
      if (!item.name) {
        nameMatch= item.rootURL.match(/(?<=https:\/\/plants\.ces\.ncsu\.edu\/plants\/)(.+)(?=\/)/)
        if (nameMatch) item.name = nameMatch[0]
      }
      //console.log(item.name);
      item.name = item.name.replace(/-/g," ")
      item.name = item.name.replace(" var "," var. ")
      item.name = item.name.replace(" ssp "," ssp. ")
      item.name = item.name.replace(" subsp "," ssp. ")
      item.url = item.rootURL.match(/https:\/\/plants\.ces\.ncsu\.edu\/plants\/[a-zA-Z-]*/)[0]
      //console.log(item.name);
      //console.log(item.url);
      data[index] = item
    })
    data.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
    //console.log(data);
    //console.log("modifyNCSUSitemap return");
    return data
  });
}


export function getNCSUUrl(data, plant, nameAlt) {
  //console.log(data);
  //console.log("getNCSUUrl: " + plant.name);
  let queryName = plant.name.toLowerCase();
  //if (plant.taxa.x === 1) queryName = plant.taxa.species.split(" ")[0] + " ×"+ plant.taxa.species.split(" ")[2];
  //if (plant.taxa.x === 1) queryName = plant.name.replace(" × "," ×");;
  if (nameAlt) queryName = nameAlt.toLowerCase();
  if (plant.taxa.x === 1) queryName = queryName.replace(" × "," ×");;
  console.log('NCSU: ' + queryName);
  plant.taxa.scientificAlts = deDuplicateArray(plant.taxa.scientificAlts);

  let match = data.find( item => item.name === queryName );
  //console.log(match);
  if (!match) {
    //console.log('no match');
    let nameNext = getNameNext(plant, nameAlt);
    if (nameNext) getNCSUUrl(data, plant, nameNext);
  } else {
    //console.log('match');
    //console.log(match);
    plant.externalLinks.push({
      label: "North Carolina Extension Gardener Plant Toolbox",
      url: match.url,
    })
  }
  //console.log(plant);
  return plant
}
