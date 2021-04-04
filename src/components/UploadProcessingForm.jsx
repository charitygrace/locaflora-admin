import React from 'react';
import { FormSelect, FormText, FormNote } from '../components/UploadFormFields';
import { mapToArray, mapPlantTypes, mapLifeCycle, mapLightNeeds, mapMoistureNeeds, mapLeafRetention, mapColors, mapMonths, mapSeasons, mapGardens, mapHeightMin, mapHeightMax } from '../actions/mapFields';
import { toTitleCase, dateNow } from '../actions/modifyFields';

const countryAbbreviations = [
  'US','CA'
]

//const separatorRegex = /[,|][\s]?/g;


class UploadProcessingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //value: "",
      stateArray: []
    };
    //console.log(this.state.stateArray);
    //console.log(this.state.stateArray.length);
    //console.log(this.props.data);
    //this.plantsExisting = this.props.data;
    this.handleChange = this.handleChange.bind(this);
    this.processData = this.processData.bind(this);
  }

  processData(event) {
    event.preventDefault();
    let data = this.props.data;
    //let fields = this.props.fields;
    //console.log(data);
    //console.log(event.target);
    let key = event.target.scientificName.value;
    let ssp = event.target.ssp.value;
    let v = event.target.variety.value;

    let country = event.target.nativeCountry.value;
    let state = event.target.nativeState.value;
    let regions = event.target.regions.value;

    let commonAlts = event.target.commonAlts.value;
    let scientificAlts = event.target.scientificAlts.value;

    let plantTypes = event.target.plantTypes.value;
    let lifeCycle = event.target.lifeCycle.value;
    let gardens = event.target.gardens.value;
    let lightNeeds = event.target.lightNeeds.value;
    let moistureNeeds = event.target.moistureNeeds.value;
    let leafRetention = event.target.leafRetention.value;
    let flowerColors = event.target.flowerColors.value;
    let flowerMonths = event.target.flowerMonths.value;
    let flowerSeasons = event.target.flowerSeasons.value;
    let heightRanges = event.target.heightRanges.value;
    let heightUnit = event.target.heightUnit.value;

    let sourceName = event.target.sourceName.value;
    let sourceUrl = event.target.sourceUrl.value;
    let sourceUrlBase = event.target.sourceUrlBase.value;

    let plants = [];
    data.forEach( item  => {
      let name = item[key].trim();
      let sName = name;
      let genus = name.split(" ")[0];
      let species = name.split(" ")[1];

      let subsp = "";
      let variety = "";

      if (item[ssp]) subsp = item[ssp];
      if (item[v]) variety = item[v];

      let x = false;
      if (subsp) {
        name = name + " ssp. " + subsp;
        sName = genus + " " + species + " ssp. " + subsp;
      }
      if (variety) {
        name = name + " var. " + variety;
        sName = genus + " " + species + " var. " + variety;
      }

      //assuming ssp or var are in the name not in separate columns
      if (!subsp && !variety) {
        if (name.split(" ")[2]) {
          if (name.split(" ")[2] === "ssp" || name.split(" ")[2] === "ssp." || name.split(" ")[2] === "subsp" || name.split(" ")[2] === "subsp.") {
            subsp = name.split(" ")[3];
            sName = genus + " " + species + " ssp. " + subsp;
          }
          if (name.split(" ")[2] === "var" || name.split(" ")[2] === "var.") {
            variety = name.split(" ")[3];
            sName = genus + " " + species + " var. " + variety;
          }
        }
        //if the plant is a cross we expect an x as the second word or the first character of the second word
        if (name.split(" ")[1].toLowerCase() === 'x' || name.split(" ")[1].toLowerCase() === '×') {
          sName = genus + " × " + name.split(" ")[2];
          species = sName;
          subsp = "";
          variety = "";
          x = true
        }
      }
      let commonNames = mapToArray(item[commonAlts]);
      if (commonNames.length > 0) commonNames[0] = toTitleCase( commonNames[0] );

      let linkArr = [];
      let sourceArr = [];

      if ( sourceName && ( item[sourceUrl] || sourceUrlBase ) )  {
        let linkUrl;
        item[sourceUrl] ? linkUrl = item[sourceUrl] : linkUrl = sourceUrlBase;
        if (item[sourceUrl]) {
          linkArr.push({
                      "label": sourceName,
                      "url": item[sourceUrl],
                    })
        }
        sourceArr.push({
                      "label": sourceName,
                      "url": linkUrl,
                      "from": dateNow()
                    })
      }

      plants.push({
        id: "",
        name: sName,
        uploadedName: name,
        slug: "",
        reviewed: false,
        taxa: {
          genus: genus,
          species: species,
          ssp: subsp,
          v: variety,
          x: x,
          scientificAlts: mapToArray(item[scientificAlts]),
          commonAlts: commonNames,
          xparents: [],
        },
        needsReview: [],
        thumb: {
          1: [],
          2: [],
        },
        images: [],
        plantTypes: mapPlantTypes(item[plantTypes], item[lifeCycle], item[moistureNeeds]),
        lifeCycle: mapLifeCycle(item[lifeCycle]),
        lightNeeds: mapLightNeeds(item[lightNeeds]),
        growthHabit: [],
        gardens: mapGardens(item[gardens]),
        attracts: [],
        tolerant: [],
        uses: [],
        problems: [],
        soils: {
          moistureNeeds: mapMoistureNeeds(item[moistureNeeds]),
          types: [],
          phNeeds: [],
          //drainageNeeds: [],
        },
        flowers: {
          colors: mapColors(item[flowerColors]),
          months: mapMonths(item[flowerMonths]),
          seasons: mapSeasons(item[flowerSeasons]),
        },
        leaves: {
          retention: mapLeafRetention(item[leafRetention]),
        },
        fruits: {
          colors: [],
          months: [],
          seasons: [],
        },
        height: {
          ranges: mapToArray(item[heightRanges]),
          max: mapHeightMax(item[heightRanges]),
          min: mapHeightMin(item[heightRanges]),
          unit: heightUnit,
        },
        spread: {
          ranges: [],
          unit: "",
        },
        ids: {},
        native: {},
        exotic: {},
        regions: {},
        status: [],
        externalLinks: linkArr,
        sources: sourceArr,
      })
      if (country && state && item[regions]) {
        //console.log(country + " " + state + " " + item[regions]);
        plants.forEach( i => {
          let regionsKey = country + ":" + state;
          i.regions[regionsKey] = mapToArray(item[regions]);
        })
      }
    })
    //console.log(newPlants);
    this.props.onChange(plants);

  }

  handleChange(field, value) {
    const fields = this.props.fields;
    //console.log(fields);
    //let dataKeys = Object.keys(fields.native);
    //console.log(dataKeys);

    //console.log(field);
    //console.log(value);
    if (field === 'nativeCountry') {
      let country = value;
      let stateArray = [];
      //console.log(fields.native);
      //console.log(country);
      switch (country) {
        case 'US':
          stateArray = fields.native.US.options;
          break;
        case 'CA':
          stateArray = fields.native.CA.options;
          break;
        default: break;
      }
      this.setState({
        stateArray: stateArray,
      })
    }
  }

  render() {
    //{ this.state.stateArray.length > 0 ? <FormSelect name="nativeState" options={this.state.stateArray} directions="Select the state to which these plants are native."/> : }

    //console.log(this.props.csvUploaded);
    //console.log(this.state.stateArray.length);
    //if(this.props.csvUploaded === true) {
      return (
        <form onSubmit={this.processData}>
          <small className="form-text text-muted">Note data already in the system takes precedence over data in this CSV.</small>
          <small className="form-text text-muted">Note data in this CSV takes precedence over API data.</small>
          <hr />
          <FormSelect name="scientificName" options={this.props.dataKeys} required="required" directions="The first two words will be separated into Genus and species."/>
          <FormSelect name="ssp" options={this.props.dataKeys} />
          <FormSelect name="variety" options={this.props.dataKeys} />
          <hr />
          <FormSelect name="scientificAlts" options={this.props.dataKeys} />
          <FormSelect name="commonAlts" options={this.props.dataKeys} />
          <hr />
          <FormSelect name="nativeCountry" options={countryAbbreviations} directions="Select the country to which these plants are native." onChange={this.handleChange}/>
          <FormSelect name="nativeState" options={this.state.stateArray} directions="Select the state to which these plants are native."/>
          <FormSelect name="regions" options={this.props.dataKeys} />
          <hr />
          <FormSelect name="plantTypes" options={this.props.dataKeys} />
          <FormSelect name="lifeCycle" options={this.props.dataKeys} />
          <FormSelect name="gardens" options={this.props.dataKeys} />
          <FormSelect name="leafRetention" options={this.props.dataKeys} />
          <FormSelect name="flowerColors" options={this.props.dataKeys} />
          <FormSelect name="flowerMonths" options={this.props.dataKeys} />
          <FormSelect name="flowerSeasons" options={this.props.dataKeys} />
          <hr />
          <FormSelect name="moistureNeeds" options={this.props.dataKeys} />
          <FormSelect name="lightNeeds" options={this.props.dataKeys} />
          <FormSelect name="heightRanges" options={this.props.dataKeys} />
          <FormSelect name="heightUnit" options={['ft']} />
          <hr />
          <FormText name="sourceName" options={this.props.dataKeys} />
          <FormSelect name="sourceUrl" options={this.props.dataKeys} directions="The detail page url." />
          <FormNote note="Or" />
          <FormText name="sourceUrlBase" options={this.props.dataKeys} directions="Just the homepage url." />

          <p className="text-right"><button type="submit" className="btn btn-primary">Submit</button></p>
        </form>
      )
    //} else return (<div></div>)
  }
}

export default UploadProcessingForm
