import React from 'react';
import { cleanData } from './cleanData';
const merge = require('deepmerge');

const combineMerge = (target, source, options) => {
  const destination = target.slice()
  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = merge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  //console.log(destination);
  return destination
}

class MergePlants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      merge: "Merge Plants Objects"
    }
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    //console.log('handleClick');
    const data = this.props.data;
    const plants = this.props.plants;
    let issue = [];

    //let plantsUpdate = [];
    let plantsToAdd = data.filter( function(item) {
     if (item.id) return item;
     else return null
     //else issue.push(item.name + " not added");
   });

    //console.log(plants);
    //console.log(data);
    //console.log(plantsToAdd);

    //merge new plants with plants already in system
    plants.forEach((plant, i) => {
      //console.log(plant);
      let match = plantsToAdd.find( item => item.id === plant.id );
      //console.log(match);
      if (match) {
        if ( this.props.importPriority === true ) plants[i] = merge(plant, match, { arrayMerge: combineMerge });
        else plants[i] = merge(match, plant, { arrayMerge: combineMerge });
        plants[i] = cleanData(plants[i]);
        //console.log(plants[i]['name'].toLowerCase().replace(" ", "-"));
        //console.log(plant);
        //remove plant from plantsToAdd so there is no duplicate
        plantsToAdd = plantsToAdd.filter(item => item.id !== plant.id );
      }
      //console.log(plantsToAdd);
    });
    //console.log(plants);
    //console.log(plantsToAdd);
    //console.log(plants.concat(plantsToAdd));
    //add plants and all new plants
    this.props.onChange(plants.concat(plantsToAdd), issue);
    this.setState({
      merge: "Merge Done"
    })

  }

  render() {
    return (
      <div>
        <button className="btn btn-primary" onClick={this.handleClick}>{this.state.merge}</button> (Only plants with iNat IDs will merge.)
      </div>
    )
  }
}

export default MergePlants

/*
<button className="btn btn-primary" onClick={this.getTrefleID}>Get TrefleID</button>
<button className="btn btn-primary" onClick={this.getiNatID}>Get iNatID</button>
<button className="btn btn-primary" onClick={this.getNatureServeID}>Get NatureServeID</button>
*/
