import React from "react";
import Form from "react-jsonschema-form-bs4";
import PrettyPrintJson from '../components/PrettyPrintJson'
import { ExternalPlantLinks } from '../components/ExternalPlantLinks'
import { NavLink } from "react-router-dom";
//import { getTrefleToken, getTrefleID, getTrefleData } from '../actions/getTrefleData';
//import { getNatureServeData } from '../actions/getNatureServeData';
//import { getNPINUrl } from '../actions/getNPINUrl';
//import { getMBGUrl } from '../actions/getMBGUrl';
//import { cleanData, sortAlpha } from '../actions/cleanData';



class EditPlantCreateSVG extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props);
    this.state = {
      plants: this.props.plants,
      plant: this.props.plants.find(plant => plant.slug === this.props.match.params.plantSlug),
      messageText: ""
    }
    this.fields = this.props.fields

  }


  render() {
    const plant = this.state.plant;
    const fields = this.fields;
    //console.log(plant);
    //console.log(fields);

    return (
      <div className="container-fluid">
        <div className="float-right">
          <NavLink
            className="nav-link"
            activeClassName="active"
            to={{
                pathname: `/edit-plant/${plant.slug}`,
              }}
          >
            <i className="far fa-edit"></i>
          </NavLink>
          &nbsp;
          <NavLink
            className="nav-link"
            activeClassName="active"
            to={{
                pathname: `/edit-plant/select-images/${plant.slug}`,
              }}
          >
            <i className="far fa-images"></i>
          </NavLink>
          &nbsp;
          <NavLink
            className="nav-link"
            activeClassName="active"
            to={{
                pathname: `/edit-plant/create-svg/${plant.slug}`,
              }}
          >
            <i class="fas fa-circle-notch"></i>
          </NavLink>
        </div>

        <h1>
          {plant.name} ({plant.taxa.commonName})
          { plant.id === "" ? " (WARNING: This plant has no id)" : null }
        </h1>
        <div className="row">
          <div className="col-6">
            <svg style={{
              border: "2px solid gold"
            }} />
          </div>
          <div className="col-6">
            <ExternalPlantLinks plant={plant} />
            <PrettyPrintJson data={plant} />
          </div>
        </div>
      </div>
    )
  }
};

export default EditPlantCreateSVG;
