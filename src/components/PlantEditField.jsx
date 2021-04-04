import React from 'react';

export function PlantEditField(props) {
  let k = props.field;
  let keys = k.split(".");
  let display = props.plant[k];
  if (keys.length === 2) {
    let k1 = keys[0];
    let k2 = keys[1];
    display = props.plant[k1][k2]
  }
  if (Array.isArray(display)) {
    display = display.map( (i, idx, arr) => {
      if (idx !== arr.length - 1){
          return i + ", ";
      } else return i
    })
  }
  if (typeof display === "string") {
    if (display.includes('jpg') || display.includes('jpeg') || display.includes('png')) {
      display = "<img src='" + display + "' alt='' className='img-fluid' />"
    }
  }
  return(
    <tr>
      <th scope="row">{props.field}</th>
      <td>{display}</td>
    </tr>
  )
}
