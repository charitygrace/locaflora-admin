/**
 * Returns an alternative Scientific Name to use if there are alternatives listed in the plant array
 *
 * @param {object} plant A single plant object
 * @param {string} nameAlt If this function has already been querried once, this was the value past before, otherwise it's null
 * @return {string} nameNext the next scientific name to try (if there is one).
 */

export function getNameNext(plant, nameAlt) {
  var nameNext;
  //console.log(nameNext);
  //console.log(nameAlt);
  if (plant.taxa.scientificAlts.length > 0) {
    if (!nameAlt) nameNext = plant.taxa.scientificAlts[0];
    else {
      if (plant.taxa.scientificAlts.length > (plant.taxa.scientificAlts.indexOf(nameAlt) + 1) ) {
        nameNext = plant.taxa.scientificAlts[plant.taxa.scientificAlts.indexOf(nameAlt) + 1];
      }
    }
  }
  //if the species matches the ssp or the v, remove the ssp or the v
  if (!nameNext && (plant.taxa.species === plant.taxa.v || plant.taxa.species === plant.taxa.ssp ) ) {
    nameNext = plant.taxa.genus + " " + plant.taxa.species;
    if (!(plant.taxa.scientificAlts.includes(nameNext))) plant.taxa.scientificAlts.push(nameNext);
    else nameNext = "";
  }
  //if still no match just remove the ssp or the v
  else if (!nameNext && (plant.taxa.v || plant.taxa.ssp ) ) {
    nameNext = plant.taxa.genus + " " + plant.taxa.species;
    if (!(plant.taxa.scientificAlts.includes(nameNext))) plant.taxa.scientificAlts.push(nameNext);
    else nameNext = "";
  }
  //console.log(nameNext);
  return nameNext;
}
