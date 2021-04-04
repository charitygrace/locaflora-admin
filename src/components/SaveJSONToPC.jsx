import React from 'react';

function SaveJSONToPC(props) {
  //console.log(props.data);
  const fileData = JSON.stringify(props.data);
  const blob = new Blob([fileData], {type: "text/plain"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const datetime = Date.now();
  link.download = 'filename-' + datetime +'.json';
  link.href = url;
  return(
    <a href={link.href} className="btn btn-primary" download={link.download}><i className="fas fa-download"></i> JSON</a>
  )
}

export default SaveJSONToPC
