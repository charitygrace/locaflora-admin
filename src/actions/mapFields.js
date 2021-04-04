import fields from '../data/fields.json';
import { toTitleCase } from './modifyFields';

let separatorRegex = /[,|][\s]?/g;

export function mapToArray(str) {
  let arr = [];
  if (str) arr = str.trim().split(separatorRegex);
  return arr
}

export function mapName( name, genus = "", species = "", ssp = "", v = "", x = false ) {
  if (x !== true) {
    name = genus + " " + species
    if (ssp) name = genus + " " + species + " " + ssp;
    else if (v)  name = genus + " " + species + " " + v;
  }
  return name
}

export function mapGenus( name ) {
  let genus
  if (name) {
    let nameArr = name.split(" ");
    genus = nameArr[0];
  }
  return genus
}

export function mapSpecies( name ) {
  let species
  if (name) {
    let nameArr = name.split(" ");
    species = nameArr[1];
  }
  return species
}

export function mapSsp( name ) {
  let ssp
  if (name) {
    let nameArr = name.split(" ");
    if (nameArr[2] === "ssp" || nameArr[2] === "ssp." || nameArr[2] === "subsp" || nameArr[2] === "subsp.") {
      ssp = nameArr[3];
    }
  }
  return ssp
}

export function mapV( name ) {
  let v
  if (name) {
    let nameArr = name.split(" ");
    if (nameArr[2] === "var" || nameArr[2] === "var." ) {
      v = nameArr[3];
    }
  }
  return v
}

export function mapX( name ) {
  let x = false;
  if (name) {
    let nameArr = name.split(" ");
    if (nameArr[1].toLowerCase() === 'x' || nameArr[1].toLowerCase() === '×') {
      x = true;
    }
  }
  return x
}

export function mapSlug( name ) {
  if (name) {
    name = name.toLowerCase().replace(/\s/gi, "-").replace(".", "").replace("×", "x");
  }
  return name
}

export function mapPlantTypes(str, lifeCycle, moistureUse) {
  let arr = [];
  if (str) {
    str = str.split(separatorRegex);
    str.forEach( i => {
      i = i.toLowerCase();
      if (i === 'tree') {
        arr.push('Trees' || i.includes('tree'));
      } if (i === 'shrub' || i.includes('shrub')) {
        arr.push('Shrubs');
      } if (i === 'vine' || i.includes('vine') ) {
         arr.push('Vines');
      } if (i === 'fern/clubmoss/allies') {
         arr.push('Ferns');
      } if (i === 'herb/wildflower') {
         arr.push('Wildflowers');
         if (lifeCycle) {
           lifeCycle = lifeCycle.toLowerCase();
           if ( lifeCycle === 'annual' || lifeCycle.includes('annual') ) arr.push('Annuals');
           if ( lifeCycle === 'perennial') arr.push('Perennials');
         }
       } if (i.includes('grass') || i.includes('sedge')) {
        arr.push('Grasses - Sedges');
        if (lifeCycle) {
          lifeCycle = lifeCycle.toLowerCase();
          if ( lifeCycle === 'annual' || lifeCycle.includes('annual') ) arr.push('Annuals');
          if ( lifeCycle === 'perennial') arr.push('Perennials');
        }
      }
    });
  }
  if (moistureUse) {
    moistureUse = moistureUse.toLowerCase();
    if (moistureUse.includes('aquatic') ) arr.push('Water Plants');
  } //else console.log(i + " is not a PlantType option");
  if (arr.length > 0) {
    let unique = [...new Set(arr)];
    return unique
  } else return []
}

export function mapLifeCycle(str) {
  if (str) {
    str = str.toLowerCase();
    if (str.includes("perennial")) {
      return "Perennial"
    } if (str.includes("annual")) {
      return "Annual"
    } if (str.includes("biennial")) {
      return "Biennial"
    }
  }
}

export function mapLightNeeds(str) {
  let arr = [];
  if (str) {
    str = str.split(separatorRegex);
    str.forEach( i => {
      i = i.toLowerCase();
      if (i === 'sun') {
        arr.push('Sun');
      } if (i === 'part sun' || i === 'part shade' || i === 'part-sun' || i === 'part-shade') {
        arr.push('Part Shade');
      } if (i === 'shade') {
        arr.push('Shade');
      } //else console.log(i + " is not an lightNeed option");
    });
  }
  return arr
}

export function mapMoistureNeeds(str) {
  let arr = [];
  if (str) {
    str = str.split(separatorRegex);
    str.forEach( i => {
      i = i.toLowerCase();
      if (i === 'dry' || i === 'dry to medium') {
        arr.push('Dry');
      } if (i === 'moist' || i === 'average' || i === 'medium' || i === 'medium to wet' || i === 'dry to medium') {
        arr.push('Moist');
      } if (i === 'wet') {
        arr.push('Wet');
      } if (i === 'aquatic') {
        arr.push('Aquatic');
      }
    });
  }
  return arr
}

/*
MBG
Dry
Dry to medium
Medium
Medium to wet
Wet


NCSU
Frequent Standing Water
Good Drainage
Moist
Occasional Flooding
Occasionally Dry
Occasionally Wet
Very Dry
*/

export function mapLeafRetention(str) {
  if (str) {
    str = str.toLowerCase();
    if (str === 'deciduous') {
      return "Deciduous"
    }
    if (str === 'semi-evergreen') {
      return "Semi-Evergreen"
    }
    if (str === 'evergreen') {
      return "Evergreen"
    }
  }
  /*
  let arr = [];
  if (str) {
    str = str.split(separatorRegex);
    str.forEach( i => {
      i = i.toLowerCase();
      if (i === 'deciduous') {
        arr.push('Deciduous');
      } if (i === 'semi evergreen') {
        arr.push('Semi-Evergreen');
      } if (i === 'semi-evergreen') {
        arr.push('Semi-Evergreen');
      } if (i === 'evergreen') {
        arr.push('Evergreen');
      }
    });
  }
  */
  else return "";
}

export function mapColors(str) {
  let arr = [];
  if (str) {
    str = str.split(separatorRegex);
    let options = fields.flowers.colors.options;
    str.forEach( i => {
      i = i.toLowerCase();
      options.forEach( item => {
        item = item.toLowerCase();
        if (i === item) {
          arr.push(toTitleCase(item));
        }
      })
    });
  }
  return arr
}

export function mapMonths(str) {
  let arr = [];
  if (str) {
    str = str.split(separatorRegex);
    str.forEach( i => {
      i = i.toLowerCase();
      if (i === 'jan' || i === 'january') {
        arr.push('1');
      }
      if (i === 'feb' || i === 'february') {
        arr.push('2');
      }
      if (i === 'mar' || i === 'march') {
        arr.push('3');
      }
      if (i === 'apr' || i === 'april') {
        arr.push('4');
      }
      if (i === 'may') {
        arr.push('5');
      }
      if (i === 'jun' || i === 'june') {
        arr.push('6');
      }
      if (i === 'jul' || i === 'july') {
        arr.push('7');
      }
      if (i === 'aug' || i === 'august') {
        arr.push('8');
      }
      if (i === 'sep' || i === 'sept' || i === 'september') {
        arr.push('9');
      }
      if (i === 'oct' || i === 'october') {
        arr.push('10');
      }
      if (i === 'nov' || i === 'november') {
        arr.push('11');
      }
      if (i === 'dec' || i === 'december') {
        arr.push('12');
      }
      if (i === 'spring') {
        arr.push('3');
        arr.push('4');
        arr.push('5');
      }
      if (i === 'early spring') {
        arr.push('3');
      }
      if (i === 'mid spring') {
        arr.push('4');
      }
      if (i === 'late spring') {
        arr.push('5');
      }
      if (i === 'summer') {
        arr.push('6');
        arr.push('7');
        arr.push('8');
      }
      if (i === 'early summer') {
        arr.push('6');
      }
      if (i === 'mid summer') {
        arr.push('7');
      }
      if (i === 'late summer') {
        arr.push('8');
      }
      if (i === 'fall') {
        arr.push('9');
        arr.push('10');
        arr.push('11');
      }
      if (i === 'winter') {
        arr.push('12');
        arr.push('1');
        arr.push('2');
      }
      if (i === 'late winter') {
        arr.push('2');
      }
      if (i === 'indeterminate') {
        //arr.push('12');
      }
    });
  }
  return arr
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
export function mapSeasons(str) {
  let arr = [];
  if (str) {
    str = str.split(separatorRegex);
    str.forEach( i => {
      i = i.toLowerCase();
      if (i === 'mar' || i === 'march' || i === 'apr' || i === 'april' || i === 'may') {
        arr.push('Spring');
      }
      if (i === 'jun' || i === 'june' || i === 'jul' || i === 'july' || i === 'aug' || i === 'august') {
        arr.push('Summer');
      }
      if (i === 'sep' || i === 'sept' || i === 'september' || i === 'oct' || i === 'october' || i === 'nov' || i === 'november') {
        arr.push('Fall');
      }
      if (i === 'dec' || i === 'december' || i === 'jan' || i === 'january' || i === 'feb' || i === 'february') {
        arr.push('Winter');
      }
      if (i.includes("spring") || i.includes("early spring") || i.includes("mid spring") || i.includes("late spring") ) {
        arr.push('Spring');
      }
      if (i.includes("summer") || i.includes("early summer") || i.includes("mid summer") || i.includes("late summer") ) {
        arr.push('Summer');
      }
      if (i.includes("fall")) {
        arr.push('Fall');
      }
      if (i.includes("winter") || i.includes("late winter")) {
        arr.push('Winter');
      }
    });
  }
  let unique = [...new Set(arr)];
  return unique
}

export function mapGardens(str) {
  if (str) {
    str = str.toLowerCase();
    if (str === 'true' || str === '1') {
      return true
    } if (str === 'false' || str === '0') {
      return false
    }
  }
}

export function mapHeightMin(str) {
  if (str) {
    let arr = [];
    arr = str.split(separatorRegex);
    if (arr.length > 0) {
      var heightArray = str.match(/\d+/g).map(Number);
      return Math.min(...heightArray);
    }
  }
}
export function mapHeightMax(str) {
  if (str) {
    let arr = [];
    arr = str.split(separatorRegex);
    if (arr.length > 0) {
      var heightArray = str.match(/\d+/g).map(Number);
      return Math.max(...heightArray);
    }
  }
}
