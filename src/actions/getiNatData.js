import { toTitleCase , dateNow } from './modifyFields';
import { mapSlug } from '../actions/mapFields';

export function getiNatData(plant) {
  //console.log(plant);
  let queryName = plant.taxa.genus + " " + plant.taxa.species + " " + plant.taxa.ssp + " " + plant.taxa.v
  //if (plant.taxa.x === 1) queryName = plant.taxa.species;
  if (plant.taxa.x === 1) queryName = plant.taxa.species.split(" ")[0] + " × "+ plant.taxa.species.split(" ")[2];

  queryName = queryName.trim().replace(/\s\s/gi, " ");
  const url =  'https://api.inaturalist.org/v1/taxa?iconic_taxon_name=Plantae&q=' + queryName.replace(/\s/gi, "%20");
  return fetch(url)
  .then(res => res.json())
  .then(
    (result) => {
      console.log('iNatData ' + queryName);
      //console.log(result);
      //console.log(url);
      //console.log(plant.name);
      //console.log(queryName);
      //console.log(result.results);
      if (result.results.length === 0) {
          console.log('no iNatId found for ' + plant.name + ' using ' + queryName);
          //plant.name = "NO INATID " + plant.name;
          //issue = plant.name + ': no iNatId found';
      } else {
        console.log(result.results);
        let match = result.results.find(line => line.name === queryName);
        //console.log(plant);
        //console.log(queryName);
        //console.log(match);
        if (!match) match = result.results.find(line => line.matched_term === queryName);
        if (!match) match = result.results.find(line => line.matched_term === queryName + " " + plant.taxa.species);
        if (!match && (plant.taxa.species === plant.taxa.ssp || plant.taxa.species === plant.taxa.v) ) {
          match = result.results.find(line => line.matched_term === plant.taxa.genus + " " + plant.taxa.species);
          plant.needsReview.push({iNatName: "no match found with var. or ssp. reverted to without " + queryName});
        }
        if (!match) {
          //issue = queryName + ': no iNat match found. possible ssp or variety';
          plant.needsReview.push({iNatId: "no match found using " + queryName});
        } else {
            //console.log(match);
            //console.log(match.name);
            //console.log(match.matched_term);
            let matchName = match.name;
            //console.log(matchName);
            //console.log(queryName !== matchName);
            if (queryName !== matchName) {
              plant.taxa.scientificAlts.push(plant.name);
              plant.uploadedName = plant.name;
            }
            matchName = matchName.split(" ");
            plant.name = matchName[0] + " " + matchName[1];
            plant.taxa.genus = matchName[0];
            plant.taxa.species = matchName[1];
            if (match.rank === "species") {
              plant.taxa.ssp = "";
              plant.taxa.v = "";
            }
            if (match.rank === "subspecies") {
              if ( plant.taxa.v ) plant.taxa.scientificAlts.push(plant.uploadedName);
              plant.name = plant.name + " ssp. " + matchName[2]
              plant.taxa.ssp = matchName[2];
              plant.taxa.v = "";
            }
            if (match.rank === "variety") {
              if ( plant.taxa.ssp ) plant.taxa.scientificAlts.push(plant.uploadedName);
              plant.name = plant.name + " var. " + matchName[2]
              plant.taxa.ssp = "";
              plant.taxa.v = matchName[2];
            }
            if (match.rank === "hybrid") {
              plant.name = plant.taxa.genus + " × " + matchName[2];
              plant.taxa.species = plant.name;
              plant.taxa.x = 1
            }
            //console.log(plant.name);
            plant.slug = mapSlug(plant.name);
            plant.id = match.id;
            plant.ids.iNatId = match.id;
            if (match.preferred_common_name) plant.taxa.commonName = toTitleCase(match.preferred_common_name);
            if (match.wikipedia_url) {
              plant.externalLinks.push({
                label: "Wikipedia",
                url: match.wikipedia_url
              })
            }
            plant.externalLinks.push({
              label: "iNaturalist",
              url: "https://www.inaturalist.org/taxa/" + match.id
            })
            plant.sources.push({
              label: "iNaturalist",
              url: "https://www.inaturalist.org/taxa/" + match.id,
              from: dateNow()
            })
        }
      }
      //console.log(plant);
      return plant;
      //console.log(issue);
      //console.log("inat:" + plant.name);
      //this.props.onChange(data, issue);
    },
    (error) => {
      console.log(error);
    }
  )
}
