import React from 'react';
const { Parser, transforms: { flatten } } = require('json2csv');

function SaveJSONToCSV(props) {
    const data = props.data;
    //console.log(data);
    const parser = new Parser({ transforms: flatten('__') });
    let csv = parser.parse(data);
    csv = csv.replace(/\[/g,"").replace(/\]/g,"");
    const fileData = csv;
    const blob = new Blob([fileData], {type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const datetime = Date.now();
    link.download = 'plants-' + datetime +'.csv';
    link.href = url;

    return (
      <a href={link.href} className="btn btn-primary" download={link.download}><i className="fas fa-download"></i> CSV</a>
    )
}

export default SaveJSONToCSV
