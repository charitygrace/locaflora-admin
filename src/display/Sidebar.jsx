import React from 'react';
import SaveJSONToPC from '../components/SaveJSONToPC'
import SaveJSONToCSV from '../components/SaveJSONToCSV'
import SidebarDisplayOptions from '../components/SidebarDisplayOptions'
import SidebarPlantNavList from '../components/SidebarPlantNavList'

import { NavLink } from "react-router-dom";
//import UpdateJSONData from '../actions/UpdateJSONData'


export class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideByField: "",
      count:0
    }

    this.handleCountUpdate = this.handleCountUpdate.bind(this);
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
  }

  handleDisplayChange(option) {
    //console.log("handleDisplayChange");
    //console.log(option);
    this.setState({
      hideByField: option
    });
  }

  handleCountUpdate(count) {
    //console.log("handleLoad");
    //console.log(count);
    this.setState({
      count: count
    });
  }

  render() {
    const plants = this.props.plants;
    const fields = this.props.fields;
    //console.log(plants);
    const hideByField = this.state.hideByField;
    //console.log(hideByField);



    return(
      <div>
        {/*<UpdateJSONData data={plants} />*/}
        <div className="text-center">
          <NavLink
            exact={true}
            className="btn btn-primary"
            activeClassName="active"
            to={{
                pathname: "/",
              }}
          >
            <i className="fas fa-upload"></i>
          </NavLink>
          &nbsp;
          { plants.length > 0 ? <span><SaveJSONToPC data={plants} /> <SaveJSONToCSV data={plants} /></span> : null }
        </div>
        <br />
        { plants.length > 0 ? (
          <div className="col">
            <label htmlFor="noData">Show Plants w/o:</label>
            <SidebarDisplayOptions fields={fields} onChange={this.handleDisplayChange} />
            <br />
          </div>
        ) : null }
          <SidebarPlantNavList plants={plants} hideByField={hideByField} />
      </div>
    )
  }
}

export default Sidebar

/*


<div className="form-check">
  <input
    className="form-check-input"
    type="checkbox"
    value="images"
    name="noImages"
    id="input-noImages"
    onClick={this.handleClick}
  />
  <label className="form-check-label" htmlFor="input-noImages">
    Show plants w/o images
  </label>
</div>
<br />
*/
