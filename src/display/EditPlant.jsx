import React from "react";
import Form from "react-jsonschema-form-bs4";
import PrettyPrintJson from '../components/PrettyPrintJson'
import { ExternalPlantLinks } from '../components/ExternalPlantLinks'
import { mapGenus, mapSpecies, mapSsp, mapV, mapX, mapSlug } from '../actions/mapFields';
import { NavLink } from "react-router-dom";
//import { getTrefleToken, getTrefleID, getTrefleData } from '../actions/getTrefleData';
//import { getNatureServeData } from '../actions/getNatureServeData';
//import { getNPINUrl } from '../actions/getNPINUrl';
//import { getMBGUrl } from '../actions/getMBGUrl';
//import { cleanData, sortAlpha } from '../actions/cleanData';


const merge = require('deepmerge');
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray

const specialFields = ['label','field','display','options','readOnly','help', 'required'];

class EditPlant extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props);
    this.state = {
      plants: this.props.plants,
      plant: this.props.plants.find(plant => plant.slug === this.props.match.params.plantSlug),
      messageText: ""
    }
    //console.log(props);
    this.fields = this.props.fields
    //let plantSlug = this.props.match.params.plantSlug
    //this.plant = this.state.plants.find(plant => plant.slug === plantSlug);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    //this.handleFetchNatureServe = this.handleFetchNatureServe.bind(this);
    this.mapToSchema = this.mapToSchema.bind(this);
    this.mapToSchemaArray = this.mapToSchemaArray.bind(this);
    this.determineFieldType = this.determineFieldType.bind(this);
    this.addFieldToPlantData = this.addFieldToPlantData.bind(this);
  }

/* Didn't get it working yet.  Issue with getNatureServeData returning on the first try rathering that waiting for a match
  handleFetchNatureServe(e) {
    e.preventDefault();
    const plant = this.state.plant;
    //const trefleId = document.getElementById('root_ids_trefleId').value

    getNatureServeData(plant)
    .then( (response, hasMatch) => {
      if (hasMatch === true) {
        cleanData(response)
        .then(response => {
          const plantUpdate = response
          console.log(plantUpdate);
          this.setState({
            messageText: "Data Fetched. Don't forget to save",
            plant: plantUpdate,
          })
        })
        .catch(error => console.error(error));
      }
    })
    .catch(error => console.error(error));

    if (trefleId) {
      getTrefleToken().then( token => {
        getTrefleID(plant, token)
        .then(response => getTrefleData(response, false, token))
        .then(response => cleanData(response))
        .then(response => {
          //console.log("final response");
          return plant;
        })
        .catch(error => console.error(error));
      })
      .then(response => {
        //console.log("final response");
        return plant;
      })
      .catch(error => console.error(error));
    }
    console.log(plant);
  }
*/
  handleChange() {
    //console.log("handleChange");
  }

  handleSubmit(formData, e) {
    //console.log("handleSubmit");
    e.preventDefault();
    //console.log(formData);
    const data = formData.formData
    const plants = this.state.plants;
    //console.log(plants);
    const plant = plants.find(plant => plant.id === data.id);
    let plantUpdate = merge(plant, data, { arrayMerge: overwriteMerge });
    plantUpdate.taxa.x = mapX(plantUpdate.name)
    if (plantUpdate.taxa.x === true) {
      plantUpdate.taxa.genus = "";
      plantUpdate.taxa.species = "";
      plantUpdate.taxa.ssp = "";
      plantUpdate.taxa.v = "";
    } else {
      plantUpdate.taxa.genus = mapGenus(plantUpdate.name);
      plantUpdate.taxa.species = mapSpecies(plantUpdate.name);
      plantUpdate.taxa.ssp = mapSsp(plantUpdate.name);
      plantUpdate.taxa.v = mapV(plantUpdate.name);
    }
    plantUpdate.slug = mapSlug(plantUpdate.name);
    //console.log(plants.indexOf(plant));
    plants[plants.indexOf(plant)] = plantUpdate;
    console.log(plants);
    this.setState({
      messageText: "Data Updated",
      plants: plants,
      plant: plantUpdate,
    })
    this.props.onChange(plants)
  }

  handleError(formData, e) {
    console.log("handleError");
    console.log(formData);
    this.setState({
      messageText: "Problem with " + formData[0].property,
    })
  }

  handleDelete() {
    /*
    console.log(plant.name);
    var index = plants.findIndex(function(item, i){
      return item.name === plant.name
    });
    console.log(index);
    Array.prototype.mySwapDelete = function arrayMySwapDelete (index) {
      plants[index] = plants[plants.length - 1];
      plants.pop();
    }
    console.log(plants);
    */
  }


/*
fieldTypes

string => textfield
number / integer => textfield
object => grouping of subfields
  enum => type = "string" (creates select) (add placeholder with "ui:placeholder": "Choose one")
array
  enum => type = "string" (creates checkboxes when "ui:widget": "checkboxes")
boolean


my custom names

label => title of the fields
field => json schema field type (if other than default)
display => display field type in a different way
options => the options that can be selected for the field
hidden => if set to true, then the field will not show to the user
readOnly => will show the field but it will be disabled for editing
help => text hint that appears with field
*/

  mapToSchema(obj) {
    let newSchema = {
        title: "Edit Plant",
        type: "object",
        properties: {} // = newProperties once set
    };
    let newProperties = {};
    let newuiSchema = {};

    for (let [k, v] of Object.entries(obj)) {
      if (!specialFields.includes(k)) {
        //determine the field type
        //default fieldtype is string
        const fieldType = this.determineFieldType(k, v);

        newProperties[k] = {
          type: fieldType,
          title: v.label,
        }
        newuiSchema[k] = {}

        if (fieldType === 'object') {
          newProperties[k].properties = {}
        }

        if (v.field === 'array') {
          newProperties[k].items = {
            type: 'string',
            default: ""
          }
        }
        if (v.required) newProperties[k].required = v.required

        if (v.display) newuiSchema[k]['ui:widget'] = v.display;

        if (v.options && Array.isArray(v.options)) {
          let subScheme = this.mapToSchemaArray(k, v);
          newProperties = {
              ...newProperties,
              ...subScheme.newProperties
          };
          newuiSchema = {
              ...newuiSchema,
              ...subScheme.newuiSchema
          };
        }
        if (v.readOnly) {
          newProperties[k].readOnly = true
        }
        if (v.help) {
          newuiSchema[k]['ui:help'] = v.help
        }

        for (let [k2, v2] of Object.entries(v)) {
          if (!specialFields.includes(k2)) {
            const fieldType2 = this.determineFieldType(k2, v2);
            //console.log(k + " : " + k2 + " : " + fieldType2);
            newProperties[k].properties[k2] = {
                type: fieldType2,
                title: v2.label,
            }
            if (v2.field === 'array') {
              newProperties[k].properties[k2].items = {
                type: 'string',
                default: ""
              }
            }
            if (v2.required) newProperties[k].properties[k2].required = v2.required

            if (v2.options) newuiSchema[k][k2] = {}


            if (v2.options && Array.isArray(v2.options)) {
              let subScheme2 = this.mapToSchemaArray(k2, v2)
              newProperties[k].properties = {
                  ...newProperties[k].properties,
                  ...subScheme2.newProperties
              };
              newuiSchema[k] = {
                  ...newuiSchema[k],
                  ...subScheme2.newuiSchema
              };
            }
            if (v2.readOnly) {
              newProperties[k]['properties'][k2].readOnly = true
            }
            if (v2.help) {
              if (newuiSchema[k][k2]) newuiSchema[k][k2]['ui:help'] = v2.help
              else newuiSchema[k][k2] = {'ui:help': v2.help}
            }

          }
        } // end for k2,v2
      }//end if
    } // end for k,v

    //console.log(newProperties);
    newSchema.properties = newProperties;
    //console.log('newSchema');
    //console.log(newSchema);
    //console.log(newuiSchema);
    return {newSchema, newuiSchema}
  }

  determineFieldType(k, v) {
    let fieldType = 'string';
    if (v.field) fieldType = v.field;
    //if there are nested field, field type is object
    if (fieldType !== "boolean") {
      let objKeys = Object.keys(v);
      for (let i = 0; i < objKeys.length; i++) {
        // if we are nesting suboptions in fields.json, then the fieldType is an object
        if (!specialFields.includes(objKeys[i])) {
          fieldType = 'object'
          break
        }
      }
    }
    return fieldType
  }

  mapToSchemaArray(k, v) {
    //console.log(k);
    let newProperties = {};
    let newuiSchema = {};
    newuiSchema[k] = {};

    let fieldType = 'array';
    if (v.display === 'radio' || v.display === 'select') {
      fieldType = "string"
    }

    if (fieldType === 'array') {
      newProperties[k] = {
        title: v.label,
        type: fieldType,
        items: {
          type: 'string',
          enum: v.options
        }
      };
      //console.log(newProperties[k]);
      newProperties[k]['uniqueItems'] = true;
    } else {
      newProperties[k] = {
        title: v.label,
        type: fieldType,
        enum: v.options
      };
    }

    let widgetField;
    //console.log(k + "-" + v.display);
    if (v.field || v.display) {
      widgetField = v.field;
    } else widgetField = 'checkboxes';
    //console.log(k);
    //console.log(widgetField);

    if (widgetField) newuiSchema[k]['ui:widget'] = widgetField;
    if (v.hidden && v.hidden === 'true') newuiSchema[k]['ui:widget'] = "hidden";
    if (v.display && v.display === 'radio') newuiSchema[k]['ui:widget'] = 'radio';
    if (v.display && v.display === 'select') {
      newuiSchema[k]['ui:placeholder'] = '– Select –';
      newuiSchema[k]['ui:emptyValue'] = '';
    }


    //console.log("newProperties");
    //console.log(newProperties);
    //console.log(newuiSchema);
    return {newProperties, newuiSchema}
  }
  //this will currently add new arrays, but not objects
  addFieldToPlantData(plant,fields) {
    //console.log(plant);
    //console.log(fields);
    for (let [k, v] of Object.entries(fields)) {
      //console.log(k);
      //console.log(plant[k]);
      if (v.options && !plant[k]) plant[k] = []
      else {
        for (let [k2, v2] of Object.entries(v)) {
          if (v2.options && !plant[k][k2]) plant[k][k2] = []
        }
      }
      //console.log(plant[k]);
      //console.log(v.options);
    }

  }


  render() {
    const plant = this.state.plant;
    const fields = this.fields;
    //console.log(plant);
    //console.log(fields);
    const result = this.mapToSchema(fields);
    const schema = result.newSchema;
    const uiSchema = result.newuiSchema;
    //console.log(schema);
    //console.log(uiSchema);

    this.addFieldToPlantData(plant,fields)

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
        <button className="btn btn-primary" onClick={this.handleDelete} plant={plant}>Delete Plant - TODO</button>
        <div className="row">
          <div className="col-6">
            <Form
                schema={schema}
                uiSchema={uiSchema}
                noValidate={true}
                formData={plant}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                onError={this.handleError}
                >
                <button className="btn btn-primary" type="submit">Update Data</button>&nbsp;
                {/*this.state.messageText !== "" ? <button className="btn btn-secondary" onClick={this.handleFetchNatureServe}>Refetch NatureServe Data</button> : null */}
              </Form>
            <br />
            {this.state.messageText !== "" ? <div className="alert alert-warning">{this.state.messageText}</div> : null }
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

export default EditPlant;
