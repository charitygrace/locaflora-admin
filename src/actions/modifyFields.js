export function toTitleCase(str) {
  return str.replace(
      /[A-zÀ-ÿ]\S*/g, //include accented characters because NatureServe has French alt common names
      function(txt) {
        if (txt.length > 2) return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        else return txt;
      }
  );
}

export function toCapFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toArray(str) {
  let separatorRegex = /[,|][\s]?/g;
  return str.split(separatorRegex)
}


export function dateNow() {
  return new Date().toJSON().slice(0,10);
}


export function roundToPrecision(x, precision) {
    let y = +x + (precision === undefined ? 0.5 : precision/2);
    let z = y - (y % (precision === undefined ? 1 : +precision));
    return z
}

export function deDuplicateArray(arr) {
  let unique = [...new Set(arr)];
  return unique
}

/*
export function deDuplicateArrayByKey(arr, key) {
  let unique = arr.filter( (item, index, self) => {
      console.log(item);
      console.log(index);
      console.log(self);
      self.findIndex(i => i.name === item.name && i.date > item.date) === index
    }
  )}
  console.log(unique);
  //return unique
}
*/

export function removeBlanks(arr) {
  var newArr = arr.filter(function(item) { return item; });
  return newArr
}

export function removeFromArr(arr, str) {
  var newArr = arr.filter( item => item !== str);
  return newArr
}

export function feetToInches(ft) {
  return ft * 12;
}
