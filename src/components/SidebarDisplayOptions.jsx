import React from 'react';

export class SidebarDisplayOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    //console.log(event.target.value);
    this.props.onChange(event.target.value);
  }

  render() {
    const fields = this.props.fields
    //console.log(fields);
    let removeAnOption = [
      "id",
      "uploadedName",
      "slug",
      "name",
      "commonAlts",
      "scientificAlts",
      "genus",
      "species",
      "ssp",
      "v",
      "x",
      "xparents",
      "ids",
      "droughtTolerance",
      "unit",
      "frostTolerant",
      "tempMinF",
      "sources",
      "externalLinks",
      "nitrogen"
    ]
    let addAnOption = [
      "images",
    ]
    const specialFields = ['label','field','display','options','readOnly','help'];

    let displayOptions = [];
    addAnOption.forEach( add => {
      displayOptions.push({
        label:  add,
        fieldKey: add
      })
    })
    let plantKeys = Object.keys(fields);
    plantKeys.forEach( (i, k) => {
      //console.log(i);
      let plantKeys2 = Object.keys(fields[i]);
      //console.log(plantKeys2);
      specialFields.forEach( field => {
        let index = plantKeys2.indexOf(field);
        if (index > -1) {
          plantKeys2.splice(index, 1);
        }
      })
      //console.log(plantKeys2);
      if (!removeAnOption.includes(i) && plantKeys2.length === 0) {
        let appendi = "";
        if (fields[i].field === "boolean") appendi = " (false)";
        displayOptions.push({
          label: i + appendi,
          fieldKey: i,
          //fieldType: fieldType
        })
      }
      plantKeys2.forEach( (item, key) => {
        //console.log(typeof plants[0][i][item]);
        if (!specialFields.includes(item) && !removeAnOption.includes(item)) {
          let appendi2 = "";
          if (fields[i][item].field === "boolean") appendi2 = " (false)";
          displayOptions.push({
            label:  i + "." + item + appendi2,
            fieldKey: i + "." + item,
            //fieldType: fieldType
          })
        }
      })
    })
    let selectOptions = displayOptions.map( (i, k) => {
      //console.log(i.label);
      return (
        <option key={k} value={i.fieldKey}>{i.label}</option>
      )
    })

    return(
      <select className="form-control" id="noData" defaultValue="" onChange={this.handleChange}>
        <option key="select" value="">- Select -</option>
        {selectOptions}
      </select>
    )
  }
}

export default SidebarDisplayOptions
