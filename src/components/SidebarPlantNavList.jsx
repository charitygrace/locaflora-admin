import React from 'react';
import { NavLink } from "react-router-dom";

export class SidebarPlantNavList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    //console.log(event.target.value);
  }

  render() {
    let plants = this.props.plants
    let hideByField = this.props.hideByField
    let count = 0
    let plantList = plants.map( (plant, key) => {
      let fieldData
      let keys = hideByField.split(".");
      if (keys.length === 2) {
        let k1 = keys[0];
        let k2 = keys[1];
        fieldData = plant[k1][k2]
      } else fieldData = plant[hideByField]

      //console.log(hideByField)
      //console.log(fieldData)
      let fieldType = typeof fieldData
      if (Array.isArray(fieldData)) fieldType = "array"
      //console.log(fieldType);
      if (
        hideByField === "" ||
        (fieldType === "undefined" ) ||
        (fieldType === "array" && fieldData.length === 0 ) ||
        (fieldType === "string" && ( fieldData === "" || fieldData === "undefined" ))
      ){
        count++
        return (
          <SidebarPlantNavListItem plant={plant} key={key} />
        )
      } else return null
    });
    //console.log(count);
    //this.props.handleCountUpdate(count);

    return (
      <ul className="nav flex-column">
        <li className="text-center"><i>{count} Plants</i></li>
        {plantList}
      </ul>
    )
  }
}
export default SidebarPlantNavList


function SidebarPlantNavListItem(props) {
  const plant = props.plant
  return(
    <li className="nav-item">
      <div className="d-flex">
        <div className="mr-auto">
            <NavLink
              className="nav-link"
              activeClassName="active"
              to={{
                  pathname: `/edit-plant/${plant.slug}`
                }}
            >
              {plant.name}
            </NavLink>
          </div>
          <div>
            <NavLink
              className="nav-link"
              activeClassName="active"
              to={{
                  pathname: `/edit-plant/${plant.slug}`
                }}
            >
              <i className="far fa-edit"></i>
            </NavLink>
          </div>
          <div>
            <NavLink
              className="nav-link"
              activeClassName="active"
              to={{
                  pathname: `/edit-plant/select-images/${plant.slug}`
                }}
            >
              <i className="far fa-images"></i>
            </NavLink>
          </div>
      </div>
    </li>
  )
}
