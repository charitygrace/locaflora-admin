import React from 'react';
import Bottleneck from "bottleneck";
import { getiNatData } from './getiNatData';
import { getTrefleToken, getTrefleID, getTrefleData } from './getTrefleData';
import { getNatureServeData } from './getNatureServeData';
import { getNPINUrl } from './getNPINUrl';
import { getMBGUrl } from './getMBGUrl';
import { modifyNCSUSitemap, getNCSUUrl } from './getNCSUUrl'
import { cleanData, sortAlpha } from './cleanData';
import Spinner from '../components/Spinner';

const limiter = new Bottleneck({
  minTime: 1000, //inat is 60 calls per minute so 1 call per sec.
  maxConcurrent: 3
});

function getExternalData(data, item, importPriority, token) {
  //console.log("getExternalData");
  return getiNatData(item)
  .then(response => getNatureServeData(response))
  //.then(response => getTrefleID(response, token))
  //.then(response => getTrefleData(response, importPriority, token))
  .then(response => getNPINUrl(response))
  .then(response => getMBGUrl(response))
  .then(response => modifyNCSUSitemap(data).then(data => getNCSUUrl(data, response)))
  .then(response => cleanData(response))
  .then(response => {
    //console.log("final response");
    return response;
  })
  .catch(error => console.error(error));
}

class GetExternalData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSpinner: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      showSpinner: true
    });
    let data = this.props.data;
    let issue = {};
    issue.noIds = [];
    getTrefleToken().then( token => {
      const promises = data.map(item => {
        return limiter.schedule(() => getExternalData(data, item, this.props.importPriority, token))
      })
      return Promise.all(promises).then( responses => {
        //console.log("promisises done");
        //console.log(responses);
        this.setState({
          showSpinner: false
        });
        data.sort(function(a, b) {
          return sortAlpha(a.name, b.name);
        })
        let noIds = data.filter( item => !(item.id))
        let noTrefle = data.filter( item => !(item.ids.trefleId))
        issue.noIds = noIds.map( item => {
          return item.name;
        })
        if (noTrefle.length !== 0 ) issue.trefleError = "getTrefleData.js file needs new API token"
        //console.log(issue);
        this.props.onChange(data, issue)
      });
    })
    .catch(error => console.error(error));
  }

  render() {
    //console.log(this.state.showSpinner);
    return (
      <div>
        <button className="btn btn-primary" onClick={this.handleClick}>Get Data for Plants</button> (6 second per plant minimum)
        { this.state.showSpinner && <Spinner size="sm" /> }
      </div>
    )
  }
}

export default GetExternalData
