import { deDuplicateArray, removeBlanks } from './modifyFields';

export function cleanData(plant) {
  //console.log('cleanData');
  plant.taxa.scientificAlts = plant.taxa.scientificAlts.filter(i => i !== plant.name);
  plant.taxa.scientificAlts = removeBlanks(plant.taxa.scientificAlts);
  plant.taxa.scientificAlts = removeBlanks(plant.taxa.scientificAlts);
  if (!plant.taxa.commonName && plant.taxa.commonAlts.length > 0) plant.taxa.commonName = plant.taxa.commonAlts[0];
  plant.taxa.commonAlts = plant.taxa.commonAlts.filter(i => i !== plant.taxa.commonName);
  plant.taxa.commonAlts = deDuplicateArray(plant.taxa.commonAlts)
  plant.taxa.commonAlts = removeBlanks(plant.taxa.commonAlts);

  plant.plantTypes = deDuplicateArray(plant.plantTypes);

  plant.flowers.months = deDuplicateArray(plant.flowers.months);
  plant.flowers.seasons = deDuplicateArray(plant.flowers.seasons);
  plant.flowers.colors = deDuplicateArray(plant.flowers.colors);

  plant.lightNeeds = deDuplicateArray(plant.lightNeeds);
  plant.soils.moistureNeeds = deDuplicateArray(plant.soils.moistureNeeds);

  plant.externalLinks = deDuplicateArray(plant.externalLinks)
  plant.sources = deDuplicateArray(plant.sources)

  //console.log(plant);
  return plant
}


export function sortAlpha(a, b) {
  return (a < b) ? -1 : (a > b) ? 1 : 0;
}
