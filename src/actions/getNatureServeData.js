import { getNameNext } from './getNameNext';
import { toTitleCase , dateNow } from './modifyFields';

export function getNatureServeData(plant, nameAlt) {
  let queryName = plant.name;
  //let hasMatch = false;
  //console.log('getNatureServeData: ' + queryName);
  if (plant.taxa.x === 1) queryName = plant.name.replace(" × "," x ");
  //let queryName = plant.taxa.genus + " " + plant.taxa.species

  if (nameAlt) queryName = nameAlt;
  //console.log(queryName);

  const url =  'https://explorer.natureserve.org/api/data/speciesSearch';
  const searchOptions = {
    "criteriaType" : "species",
    "textCriteria" : [
      {
        "paramType" : "quickSearch",
        "searchToken" : queryName//.replace(/\s/gi, "%20"),
      }
    ],
  }
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchOptions),
  };

  return fetch(url, requestOptions)
  .then(res => res.json())
  .then(
    (result) => {
      console.log('NatureServeData: ' + queryName);
      //console.log(requestOptions);
      //console.log(queryName);
      //console.log(result.results);
      let match = result.results.find(line => line.scientificName.toLowerCase() === queryName.toLowerCase());
      if (!match && result.results.length === 1) {
        if (result.results[0].speciesGlobal.informalTaxonomy.includes("Vascular Plants")) {
          match = result.results[0];
          plant.needsReview.push({natureServeID: "assumed match: " + queryName + " to " + match.scientificName});
          plant.taxa.scientificAlts.push(match.scientificName);
        }
      }
      if (!match) {
        let nameTry;
        if (plant.taxa.ssp && plant.taxa.ssp !== "") {
          nameTry = plant.taxa.genus + " " + plant.taxa.species + " var. " + plant.taxa.ssp
          console.log(nameTry);
          match = result.results.find(line => line.scientificName.toLowerCase() === nameTry.toLowerCase());
          if (match) plant.taxa.scientificAlts.push(nameTry);
        } else if (plant.taxa.v && plant.taxa.v !== "") {
          nameTry = plant.taxa.genus + " " + plant.taxa.species + " ssp. " + plant.taxa.v
          console.log(nameTry);
          match = result.results.find(line => line.scientificName.toLowerCase() === nameTry.toLowerCase());
          if (match) plant.taxa.scientificAlts.push(nameTry);
        }
      }
      if (!match) {
        //console.log('no match');
        plant.needsReview.push({natureServeID: "no name match for: " + queryName});
        //console.log(plant.taxa.scientificAlts.length);
        let nameNext = getNameNext(plant, nameAlt);
        if (nameNext) getNatureServeData(plant, nameNext);
      }
      if (match) {
        //console.log(match);
        //console.log('match');

        match.nations.forEach( item => {
          //console.log(item);
          //let nation = item.nationCode;
          plant.native[item.nationCode] = [];
          plant.exotic[item.nationCode] = [];
          item.subnations.forEach( unit => {
            if (unit.exotic === false){
              //console.log(item.nationCode);
              let key = item.nationCode + ":" + unit.subnationCode;
              let rankCode = unit.roundedSRank;
              let rank;
              if ( rankCode === "SX") rank = "Locally Extinct";
              if ( rankCode === "SH") rank = "Likely Extinct";
              if ( rankCode === "S1") rank = "Critically Imperiled";
              if ( rankCode === "S2") rank = "Imperiled";
              if ( rankCode === "S3") rank = "Vulnerable";
              if ( rankCode === "S4") rank = "Secure but Declining";
              if ( rankCode === "S5") rank = "Secure";
              if ( rank ) plant.status.push({[key]: rank });
              plant.native[item.nationCode].push(unit.subnationCode);
              //console.log(plant.native[nation]);
            } else plant.exotic[item.nationCode].push(unit.subnationCode);
          })
          if (plant.exotic[item.nationCode].length === 0) delete plant.exotic[item.nationCode];
        })
        if (match.primaryCommonName) {
          if (plant.taxa.commonName !== toTitleCase(match.primaryCommonName)) {
            plant.taxa.commonAlts.push(toTitleCase(match.primaryCommonName));
          }
        }
        plant.taxa.scientificFamily = match.speciesGlobal.family;

        match.speciesGlobal.otherCommonNames.forEach( item => {
          if (plant.taxa.commonName !== toTitleCase(item)) {
            plant.taxa.commonAlts.push(toTitleCase(item));
          }
        })
        plant.taxa.commonAlts = plant.taxa.commonAlts.filter(item => plant.taxa.common_name !== item);
        plant.ids.natureServeId = match.elementGlobalId;
        plant.externalLinks.push({
          label: "NatureServe Explorer",
          url: "https://explorer.natureserve.org/Taxon/ELEMENT_GLOBAL.2." + plant.ids.natureServeId
        })
        plant.sources.push({
          label: "NatureServe",
          url: "https://explorer.natureserve.org/Taxon/ELEMENT_GLOBAL.2." + plant.ids.natureServeId,
          from: dateNow()
        })
        //hasMatch = true;
      }
      //console.log(plant);
      //console.log(hasMatch);
      return plant;
    },
    (error) => {
      console.log(error);
    }
  )
}

/*
https://www.natureserve.org/conservation-tools/conservation-status-assessment
National (N) and Subnational (S) Conservation Status Ranks

RANK	DEFINITION
NX,SX
Presumed Extirpated—Species or ecosystem is believed to be extirpated from the jurisdiction (i.e., nation, or state/province). Not located despite intensive searches of historical sites and other appropriate habitat, and virtually no likelihood that it will be rediscovered.  [equivalent to “Regionally Extinct” in IUCN Red List terminology]
NH,SH
Possibly Extirpated – Known from only historical records but still some hope of rediscovery.  There is evidence that the species or ecosystem may no longer be present in the jurisdiction, but not enough to state this with certainty.  Examples of such evidence include (1) that a species has not been documented in approximately 20-40 years despite some searching and/or some evidence of significant habitat loss or degradation; (2) that a species or ecosystem has been searched for unsuccessfully, but not thoroughly enough to presume that it is no longer present in the jurisdiction.
N1,S1
Critically Imperiled— At very high risk of extirpation in the jurisdiction due to very restricted range, very few populations or occurrences, very steep declines, severe threats, or other factors.
N2,S2
Imperiled— At high risk of extirpation in the jurisdiction due to restricted range, few populations or occurrences, steep declines, severe threats, or other factors.
N3,S3
Vulnerable— At moderate risk of extirpation in the jurisdiction due to a fairly restricted range, relatively few populations or occurrences, recent and widespread declines, threats, or other factors.
N4,S4
Apparently Secure— At a fairly low risk of extirpation in the jurisdiction due to an extensive range and/or many populations or occurrences, but with possible cause for some concern as a result of local recent declines, threats, or other factors.
N5,S5
Secure— At very low or no risk of extirpation in the jurisdiction due to a very extensive range, abundant populations or occurrences, with little to no concern from declines or threats.
*/
