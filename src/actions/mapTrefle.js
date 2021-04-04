import { toTitleCase , toArray, roundToPrecision, deDuplicateArray, feetToInches, removeFromArr } from './modifyFields';
import {mapMonths, mapSeasons, mapColors } from '../actions/mapFields';

//See https://plants.usda.gov/charinfo.html for USDA field info
export function mapTrefle(plant, importPriority, result) {
  //console.log(plant);
  console.log("mapTrefle: " + plant.name);
  //console.log(result);
  if (result.common_name && toTitleCase(result.common_name) !== plant.taxa.commonName) plant.taxa.commonAlts.push(toTitleCase(result.common_name));
  plant.taxa.commonAlts = deDuplicateArray(plant.taxa.commonAlts);
  plant.taxa.commonAlts = plant.taxa.commonAlts.filter(item => plant.taxa.common_name !== item);

  if (result.complete_data === true) plant.completeTrefleData = true
  if (result.family && plant.taxa.scientificFamily === "") {
    if (result.family.name) plant.taxa.scientificFamily = result.family.name;
  }
  if (result.family_common_name) plant.taxa.commonFamily = result.family_common_name.replace(" family", "");
  //if (result.growth_habit) plant.plantTypes = result.growth_habit;

  if (result.main_species) {
    let species = result.main_species
    //console.log(species);
    if (result.duration && !plant.lifeCycle) plant.lifeCycle = species.duration;

    if (species.sources) {
      species.sources.forEach( item => {
        plant.sources.push({
          label: item.name + " via Trefle.io",
          url: item.source_url,
          from: item.last_update.split('T')[0]
          //from: item.last_update.replace("/\T(.*)/g","");
        })
      });
    }
    if (species.flower) {
      if (species.flower.color) {
        var flower_colors = species.flower.color;
        mapColors(flower_colors).forEach(i => plant.flowers.colors.push(i));;
        //flower_colors.forEach(color => plant.flowers.colors.push(color));
      }
      if (species.flower.conspicuous && (species.flower.conspicuous === "Yes" || species.flower.conspicuous === true) ) {
        //Yes, No
        plant.flowers.conspicuous = true;
        //plant.attracts.push('Butterflies and Moths');
        //plant.attracts.push('Bees');
      }
    }

    if (species.fruit_or_seed) {
      if (species.fruit_or_seed.color) {
        let fruit_colors = species.fruit_or_seed.color;
        mapColors(fruit_colors).forEach(i => plant.fruits.colors.push(i));;
        //fruit_colors.forEach(color => plant.fruits.colors.push(color));
      }
      if (species.fruit_or_seed.conspicuous && (species.fruit_or_seed.conspicuous === "Yes" || species.fruit_or_seed.conspicuous === true) ) {
        //Yes, No
        plant.fruits.conspicuous = true;
        //plant.attracts.push('Songbirds');
      }
      if (species.fruit_or_seed.seed_period_begin ) {
        //let fruit_seasons = species.fruit_or_seed.seed_period_begin;
        // does not map well with Callicarpa americana - overlaps with flowering
        //mapMonths(fruit_seasons).forEach(i => plant.fruits.months.push(i));;
        //mapSeasons(fruit_seasons).forEach(i => plant.fruits.seasons.push(i));
      }
      if ( species.fruit_or_seed.seed_period_end ) {
        let fruit_seasons = species.fruit_or_seed.seed_period_end;
        mapMonths(fruit_seasons).forEach(i => plant.fruits.months.push(i));;
        mapSeasons(fruit_seasons).forEach(i => plant.fruits.seasons.push(i));
      }
    }

/*
Spring
Early Spring
Mid Spring
Late Spring
Summer
Early Summer
Mid Summer
Late Summer
Fall
Winter
Late Winter
Indeterminate
*/
    if (species.seed.bloom_period && species.seed.bloom_period.length > 0) {
      let flower_seasons = species.seed.bloom_period;
      mapMonths(flower_seasons).forEach(i => plant.flowers.months.push(i));;
      mapSeasons(flower_seasons).forEach(i => plant.flowers.seasons.push(i));
      //flower_seasons.forEach(season => plant.flowers.seasons.push(season));
    }
    if (species.seed.commercial_availability && species.seed.commercial_availability === "Routinely Available") {
      /*No known source
      Routinely available
      Contracting only: available only through contracting with a commercial grower
      Field collections only: not produced by commercial growers*/
      plant.gardens = true
    }


    if (species.growth) {
      if (species.growth.drought_tolerance) {
        //None, Low, Medium, High
        plant.soils.droughtTolerance = species.growth.drought_tolerance;
        if (species.growth.drought_tolerance === "None") {
          /*
          if (species.growth.moisture_use === "High") {
            plant.soils.moistureNeeds.push("Aquatic");
            plant.plantTypes.push("Water Plants");
          } */
          plant.soils.moistureNeeds.push("Moist");
          plant.soils.moistureNeeds.push("Wet");
        }
        if (species.growth.drought_tolerance === "Low") plant.soils.moistureNeeds.push("Moist");
        if (species.growth.drought_tolerance === "Medium") plant.soils.moistureNeeds.push("Moist");
        if (species.growth.drought_tolerance === "High") {
          plant.soils.moistureNeeds.push("Dry");
          plant.tolerant.push("Drought");
        }
      }
      if (species.growth.salinity_tolerance) {
        //None, Low, Medium, High
        if (species.growth.salinity_tolerance === "Medium") plant.tolerant.push("Salt");
        if (species.growth.salinity_tolerance === "High") plant.tolerant.push("Salt");
      }

      if (species.growth.moisture_use) {
        //Low, Medium, High
        //plant.soils.moistureNeeds = species.growth.moisture_use;
        if (species.growth.moisture_use === "Low") plant.soils.moistureNeeds.push("Dry");
        if (species.growth.moisture_use === "Medium") plant.soils.moistureNeeds.push("Moist");
        if (species.growth.moisture_use === "High") plant.soils.moistureNeeds.push("Wet");
      }

      if (species.growth.ph_minimum && species.growth.ph_minimum < 6) plant.soils.phNeeds.push("Acid");
      if (species.growth.ph_minimum && species.growth.ph_minimum < 8) plant.soils.phNeeds.push("Neutral");
      if (species.growth.ph_maximum && species.growth.ph_maximum >= 8) plant.soils.phNeeds.push("Alkaline");

      if (importPriority === false || plant.spread.max === "") {
        if (species.growth.planting_density_maximum.acre) {
          var spread_estimate = 1 / (species.growth.planting_density_maximum.acre / 43560 );
          plant.spread.max_density = spread_estimate;
          if (plant.spread.max_density < ( 2 * species.specifications.mature_height.ft ) ) {
            plant.spread.max = Math.round(spread_estimate * .8);
            plant.spread.min = Math.round(spread_estimate * .3);
            if (plant.spread.max_density > 10 && species.growth.shade_tolerance === "Tolerant") {
              plant.spread.max = roundToPrecision( plant.spread.max_density * .45, 5 );
              plant.spread.min = roundToPrecision( plant.spread.max_density * .25, 5);
            } else if (plant.spread.max_density > 10) {
              plant.spread.max = roundToPrecision( plant.spread.max_density, 5 );
              plant.spread.min = roundToPrecision( plant.spread.max_density * .45, 5);
            }
          }
        }
      }
      //react-jsonschema-form is being buggy around subfields without values
      if (!plant.spread.unit || plant.spread.unit === "") plant.spread.unit = "ft";

      if (species.growth.shade_tolerance) {
        //USDA Intolerant, Intermediate, Tolerant
        if (species.growth.shade_tolerance === "Tolerant") {
          plant.lightNeeds.push("Shade");
          plant.lightNeeds.push("Part Shade");
        } else if (species.growth.shade_tolerance === "Intermediate") {
          plant.lightNeeds.push("Part Shade");
          plant.lightNeeds.push("Sun");
        } else if (species.growth.shade_tolerance === "Intolerant") {
          plant.lightNeeds.push("Sun");
          removeFromArr(plant.lightNeeds, "Shade");
        } //else plant.lightNeeds.push("Sun");
      }

      if (species.growth.temperature_minimum.deg_f) {
        plant.tempMinF = species.growth.temperature_minimum.deg_f;
        if (species.growth.temperature_minimum.deg_f < 32) {
          //plant.frostTolerant = true;
          plant.tolerant.push("Frost");
        }
      }
    }
    if (species.soils_adaptation) {
      //Clay, Loam, Sand
      /*
      Coarse	Sand	Coarse sand	Fine sand, Loamy coarse sand	Loamy fine sand	Loamy very fine sand, Very fine sand	Loamy sand
      Medium	Silt	Sandy clay loam	Very fine sandy loam, Silty clay loam	Silt loam	Loam, Fine sandy loam	Sandy loam	Coarse sandy loam, Clay loam
      Fine	Sandy clay	Silty clay	Clay
      */
      if (species.soils_adaptation.coarse === true) plant.soils.types.push("Sandy / Rocky");
      if (species.soils_adaptation.medium === true) plant.soils.types.push("Loam");
      if (species.soils_adaptation.fine === true) plant.soils.types.push("Clay");
    }

    if (species.specifications) {
      //note USDA "Does the tree, shrub, or sub-shrub retain its leaves year round? Plants with other growth habits are scored "No" here by default."
      //leaf_retention Yes, No > really it's false/null but null sometimes is there for everygreens
      if (importPriority === false || !(plant.leaves.retention)) {
        if (!plant.leaves.retention) {
          //note Semi-evergreen is not really something that can be gathered from Trefle
          if (species.specifications.leaf_retention && species.specifications.leaf_retention === true ) plant.leaves.retention = "Evergreen"
          if (species.specifications.leaf_retention && species.specifications.leaf_retention === false ) plant.leaves.retention = "Deciduous"
        }
        if (species.specifications.fall_conspicuous && species.specifications.fall_conspicuous === true ) {
          plant.leaves.conspicuousFall = true;
          if (!plant.leaves.retention) plant.leaves.retention = "Deciduous";
        }
      }
      if (importPriority === false || plant.height.max === "") {
        if (species.specifications.mature_height && species.specifications.mature_height.ft) {
          plant.height.mature_ft = species.specifications.mature_height.ft;
          //works for Packera aurea
          plant.height.max = Math.round(plant.height.mature_ft * 1.1);
          plant.height.min = Math.round(plant.height.mature_ft * .25);
          plant.height.unit = "ft";
          if (plant.height.mature_ft >= 30) {
            //console.log(">=30");
            plant.height.max = roundToPrecision(plant.height.mature_ft * 1.1, 5);
            plant.height.min = roundToPrecision(plant.height.mature_ft * .6, 5);
          } else if (plant.height.mature_ft >= 20) {
            //console.log(">=20");
            plant.height.max = roundToPrecision(plant.height.mature_ft * 1.1, 5);
            plant.height.min = roundToPrecision(plant.height.mature_ft * .55, 5);
          } else if (plant.height.mature_ft >= 6) {
            //console.log(">=4");
            //works for Callicarpa americana
            plant.height.max = Math.round(plant.height.mature_ft * 1.1);
            plant.height.min = Math.round(plant.height.mature_ft * .45);
          } else if (plant.height.mature_ft <= 1) {
            //Utricularia minor
            plant.height.max = Math.round(feetToInches(plant.height.mature_ft * 1.5));
            plant.height.min = Math.round(feetToInches(plant.height.mature_ft * .65));
            plant.height.unit = "in";
          }
        }
      }
      //react-jsonschema-form is being buggy around subfields without values
      if (plant.height.unit === "") plant.height.unit = "ft";

      //Annuals, Perennials, Wildflowers, Bulbs, Grasses - Sedges, Ground Covers, Water Plants, Carnivorous, Ferns, Vines, Shrubs, Trees
      /* USDA categories
        Forb/herb (graminoids are excluded but ferns, horsetails, lycopods, and whisk-ferns are included)
        Graminoid (grasses (Poaceae), sedges (Cyperaceae), rushes (Juncaceae), arrow-grasses (Juncaginaceae), and quillworts (Isoetes))
        Lichenous
        Nonvascular (mosses, hornworts, and liverworts)
        Shrub (usually less than 4 to 5 meters (13 to 16 feet))
        Subshrub (Low-growing shrub usually under 0.5 m (1.5 feet) tall, never exceeding 1 meter (3 feet) tall at maturity.)
        Tree
        Vine 
      */
      if (species.specifications.toxicity && species.specifications.toxicity !== "None") {
        ///None, Slight, Moderate, Severe
        plant.problems.push("Toxic")// + species.specifications.toxicity;
      }
      if (species.specifications.nitrogen_fixation && (species.specifications.nitrogen_fixation === "Medium" || species.specifications.nitrogen_fixation === "High") ) {
        //None, Low, Medium, High
        plant.soils.nitrogen = true;
      }

      if (species.specifications.growth_habit) {
        var plant_habit = toArray(species.specifications.growth_habit);
        plant_habit.forEach( habit => {
          plant.growthHabit.push(habit);
          if (habit === "Forb/herb" ) {
            plant.plantTypes.push("Wildflowers");
            if (result.duration === "Annual") plant.plantTypes.push("Annuals");
            if (result.duration === "Perennial") plant.plantTypes.push("Perennials");
          } else if ( habit === "Graminoid" ) {
            plant.plantTypes.push("Grasses - Sedges");
            if (result.duration === "Annual") plant.plantTypes.push("Annuals");
            if (result.duration === "Perennial") plant.plantTypes.push("Perennials");
          } else if ( habit === "Subshrub" ) {
            plant.plantTypes.push("Shrubs");
          } else if ( habit === "Shrub" ) {
            plant.plantTypes.push("Shrubs");
          } else if ( habit === "Tree" ) {
            plant.plantTypes.push("Trees");
          } else if ( habit === "Vine " ) {
            plant.plantTypes.push("Vines");
          }
        });
      }

      if (species.specifications.lifespan && species.specifications.lifespan.length > 0) {
        if ( !plant.lifeCycle ) plant.lifeCycle = 'Perennial';
        if ( species.specifications.growth_habit.includes('Forb/herb') ) plant.plantTypes.push('Perennials');
      }
    }
  }
  return plant;
}
