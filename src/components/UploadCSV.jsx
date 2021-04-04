import React from 'react';
import CSVReader from 'react-csv-reader'


const labelColClass = "col-sm-4";
const inputColClass = "col-sm-8";


class UploadCSV extends React.Component {
  constructor(props) {
    super(props);
    //const plants = this.props.data;
    this.plantCSVtoJSON = this.plantCSVtoJSON.bind(this);
    this.plantCSVtoJSONError = this.plantCSVtoJSONError.bind(this);
    //console.log(plants);
  }

  plantCSVtoJSON(data) {
    //console.log(data);
    var dataKeys = Object.keys(data[0]);
    this.props.onChange(data, dataKeys);
  }

  plantCSVtoJSONError(data, error) {
    console.log('oops');
    console.log(error);
    console.log(data);
  }

  render() {
    const csvReaderOptions = {
      header: true,
      skipEmptyLines: true,
    }
    return (
        <CSVReader
          cssClass="form-group row csv-upload"
          cssInputClass={inputColClass}
          label="Upload Plant CSV"
          labelClass={labelColClass} /*not in module yet*/
          inputId="plantCSVUpload"
          parserOptions={csvReaderOptions}
          onFileLoaded={this.plantCSVtoJSON}
          onError={this.plantCSVtoJSONError}
        />
    )
  }
}

export default UploadCSV;

//export default UploadCSV

//              <GetAPIIds data={this.state.data} onChange={this.handleChange}  />
