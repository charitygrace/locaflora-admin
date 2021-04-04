import React from 'react'
import { Switch, Route } from 'react-router-dom';

import UploadPlants from './display/UploadPlants';
import EditPlant from './display/EditPlant';
import EditPlantImages from './display/EditPlantImages';
import EditPlantCreateSVG from './display/EditPlantCreateSVG';
//import GetiNaturalistItem from './actions/GetiNaturalistItem';
import NoMatch from './display/NoMatch';


class AppRoute extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props);
    //console.log(this.props.plants);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(plants) {
    this.props.onChange(plants)
   }

  render() {
    //console.log(this.props.fields);
    return(
      <Switch>
        <Route exact path="/" render={props => <UploadPlants {...props} plants={this.props.plants} fields={this.props.fields} onChange={this.handleUpdate} />} />
        <Route exact path="/edit-plant/:plantSlug" render={
          props => <EditPlant {...props} key={props.match.params.plantSlug} plants={this.props.plants} fields={this.props.fields} onChange={this.handleUpdate} />
        } />
        <Route exact path="/edit-plant/select-images/:plantSlug" render={
          props => <EditPlantImages {...props} key={props.match.params.plantSlug} plants={this.props.plants} fields={this.props.fields} onChange={this.handleUpdate} />
        } />
        <Route exact path="/edit-plant/create-svg/:plantSlug" render={
          props => <EditPlantCreateSVG {...props} key={props.match.params.plantSlug} plants={this.props.plants} fields={this.props.fields} onChange={this.handleUpdate} />
        } />
        <Route component={NoMatch} />
      </Switch>
    );
  }
}
export default AppRoute;

/*
<Route exact path='/' component={UploadPlants} />
<Route path='/edit-plant/:plantSlug' component={EditPlant} />
<Route path='/edit-plant-images/:plantSlug' component={EditPlantImages} />
<Route component={NoMatch} />
*/
