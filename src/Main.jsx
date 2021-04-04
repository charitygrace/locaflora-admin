import React from 'react';
import Sidebar from './display/Sidebar';
import AppRoutes from './AppRoutes';
import Spinner from './components/Spinner';
import { getStoredPlants } from './actions/getStoredPlants';
//import Footer from './display/Footer';

//import plants from './data/plants.json';
import fields from './data/fields.json';

//console.log(plants);

//const plants = require(process.env.PUBLIC_URL + "data/plants.json");


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plants: false
    }
    //console.log("Main");
    this.handleUpdate = this.handleUpdate.bind(this);

  }

  componentDidMount() {
    //console.log("Main componentWillMount");
    return getStoredPlants().then(data => {
      //console.log(data);
      this.setState({
        plants: data
      })
    });
  }

  handleUpdate(plants) {
    this.setState({
      plants: plants
    })
  }

  render () {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-lg-4 col-xl-2 d-none d-md-block bg-light sidebar">
              <div className="sidebar-sticky">
               { this.state.plants !== false ? <Sidebar plants={this.state.plants} fields={fields} /> : null }
              </div>
            </div>
            <div className="col-md-9 col-lg-8 col-xl-10 ml-md-auto px-2 pt-3">
              <div className="main">
                { this.state.plants !== false ?
                  <AppRoutes plants={this.state.plants} fields={fields} onChange={this.handleUpdate} />
                  : <div className="text-center"><br /><br /><br /><Spinner /></div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
//
