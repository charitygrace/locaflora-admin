import React from 'react';

export function OverviewPlantTR(props) {
  //console.log('OverviewPlantTR')
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

export function OverviewPlantTRImage(props) {
  //console.log('OverviewPlantTR')
  let k = props.field;
  let keys = k.split(".");
  let display = props.plant[k];
  if (keys.length === 2) {
    let k1 = keys[0];
    let k2 = keys[1];
    display = props.plant[k1][k2]
  }
  console.log(display);
  let quality = ""
  if (display[0] && display[0].quality) quality = display[0].quality

  let license = ""
  if (display[0] && display[0].license) license = display[0].license

  if (display.length > 0) display = display.map( item => item.default);

  return(
    <tr>
      <th scope="row">
        {props.field}<br />
        <i style={{fontWeight: 'normal'}}>
          {quality}<br />
          {license}
        </i>
      </th>
      <td>{ display.map( (src, key) =>
        <img src={src} alt='' key={key} className='img-fluid' />
      )}
      </td>
    </tr>
  )
}
