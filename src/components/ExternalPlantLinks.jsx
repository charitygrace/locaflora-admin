import React from 'react';

export function ExternalPlantLinks(props) {
  const plant = props.plant
  return(
    <ul className="list-unstyled list-inline">
      { plant.externalLinks.map( (i,k) => <li key={k} className="list-inline-item list-pipe"><a target="_blank" rel="noopener noreferrer" href={i.url}>{i.label}</a></li>)}
      { plant.ids.trefleId ? <li key="trefle" className="list-inline-item list-pipe"><a target="_blank" rel="noopener noreferrer" href={"https://trefle.io/api/v1/species/"+ plant.ids.trefleId +"?token=MFBxR09FYmJ0THNzU1o4N3d1OEY2UT09"}>Trefle Details</a></li> : null }
      <li key="bonap" className="list-inline-item list-pipe"><a target="_blank" rel="noopener noreferrer" href={"http://bonap.net/Napa/TaxonMaps/Genus/County/" + plant.taxa.genus}>Bonap Page – {plant.taxa.genus}</a></li>
      <li key="bonap-img" className="list-inline-item list-pipe"><a target="_blank" rel="noopener noreferrer" href={"http://bonap.net/MapGallery/County/" + plant.name + ".png"}>Bonap Map – {plant.name}</a></li>
    </ul>
  )
}
