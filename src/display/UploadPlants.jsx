import React from 'react';
import GetExternalData from '../actions/GetExternalData'
import MergePlants from '../actions/MergePlants'
import UploadCSV from '../components/UploadCSV'
import UploadProcessingForm from '../components/UploadProcessingForm'
import SaveJSONToPC from '../components/SaveJSONToPC'
import SaveJSONToCSV from '../components/SaveJSONToCSV'
import PrettyPrintJson from '../components/PrettyPrintJson'

/*
*/

class UploadPlants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      issue: [],
      csvKeys: [],
      csvUploaded: false,
      csvProcessed: false,
      importPriority: false
    };
    this.plants = this.props.plants
    this.fields = this.props.fields

    //console.log(this.state);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMerge = this.handleMerge.bind(this);
  }

  handleCheck(e){
    const check = e.target.checked;
    this.setState({
      importPriority: check
    })
    console.log(this.state.importPriority);
  }

  handleUpload(data, dataKeys) {
    //console.log("handleUpload");
    //console.log(data);
    this.setState({
      data: data,
      csvKeys: dataKeys,
      csvUploaded: true
    })
  }

  handleChange(data, issue) {
    //console.log("handleChange");
    //console.log(data);
    var issueArray = this.state.issue;
    //console.log(issueArray);
    if (issue) issueArray.push(issue);
    //console.log(issue);
    //console.log(this.state.issue);
    this.setState({
      data: data,
      issue: issueArray,
      csvProcessed: true
    })
  }

  handleMerge(data) {
    this.props.onChange(data);
  }


  render() {
    const plants = this.plants//this.props.plants;
    const fields = this.fields//this.props.fields;
    //console.log(plants);
    //console.log(fields);
    //console.log(this.state.issue);
    return (
      <div>
        <div className="container-fluid">
          <div className="row no-gutters">
            <div className="col-12">
              <h1>Upload Plant CSV file for import</h1>
            </div>
          </div>
        <hr />
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-6">
              <UploadCSV data={plants} onChange={this.handleUpload} />
              <div className="form-check form-text">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="overwrite"
                  id="overwrite"
                  onClick = {this.handleCheck}
                />
                <label className="form-check-label" htmlFor="overwrite">
                  This data takes precedent over API or exisiting data. (Arrays will merge together, single selections and string fields will be overwritten.)
                </label>
              </div>
              { (this.state.csvUploaded === true)
                ? ( <UploadProcessingForm dataKeys={this.state.csvKeys} fields={fields} data={this.state.data} onChange={this.handleChange} /> )
                : null
              }
              <br />
              { (this.state.csvProcessed === true)
                ? ( <GetExternalData data={this.state.data} onChange={this.handleChange} importPriority={this.state.importPriority} /> )
                : null
              }
              <br />
              { (this.state.csvProcessed === true)
                ? ( <MergePlants data={this.state.data} plants={this.props.plants} onChange={this.handleMerge} importPriority={this.state.importPriority} /> )
                : null
              }
              <br />
              { (this.state.issue.length > 0)
                ? <div className="alert alert-warning"><PrettyPrintJson data={this.state.issue} /></div>
                : null
              }
            </div>
            <div className="col-6">
              { (this.state.csvProcessed === true)
                ? (<div className="text-right"><SaveJSONToPC data={this.state.data} /> <SaveJSONToCSV data={this.state.data} /></div>)
                : null
              }
              {this.state.issue}
              <PrettyPrintJson data={this.state.data} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

//export default connect(mapStateToProps)(UploadPlants);
export default UploadPlants

//              <GetAPIIds data={this.state.data} onChange={this.handleChange}  />
