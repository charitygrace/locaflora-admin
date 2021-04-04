import React from 'react';
import SaveJSONToPC from '../components/SaveJSONToPC'
import {downloadFileAutomatically} from './downloadFileAutomatically'


class UpdateJSONData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //page: 1,
      plants: this.props.data,
    }
    this.loadImgs = this.loadImgs.bind(this);
  }
  //console.log(props.data);

  componentDidMount() {
    let callCount = 0
    let plants = this.state.plants
    let that = this

    plants.forEach( (plant, index) => {
      //console.log(callCount + ": " + plant.name);
      if (plant.thumb['2'].length > 0) {
        if (!(plant.thumb['2'][0].quality)) {
          callCount = callCount + 1
          console.log(callCount + ": " + plant.name);
          setTimeout( function() {
            //console.log('setTimeout: ' + index);
            //that.loadImgs(plants, index)
          }, 10000 * callCount);
        }
      }
    });
  }

  loadImgs(plants, index) {
    //console.log('loadImgs');
    const plant = plants[index]
    console.log(plant);
    //let photoIndex = 0
    plant.thumb['2'].forEach( (photoObj, photoIndex) => {
      console.log(plant.name);
      //if (!(plant.thumb['2'][photoIndex].quality)) {
        const url = 'https://api.inaturalist.org/v1/observations/' + plant.thumb['2'][photoIndex].idObsrv //photoObj.id;
        //console.log(url);

        fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            //console.log(result);
            //console.log(result.results);
            result.results.forEach((item, idx) => {
                  let photoObjId = plant.thumb['2'][photoIndex].id
                  let match = item.photos.find( i => i.id === photoObjId );
                  if (match) {
                    //console.log(plant.name);
                    //console.log(match);
                    //console.log(item.quality_grade);
                    //console.log(item.identifications_most_agree);
                    //console.log(item.identifications_most_disagree);
                    //console.log(item.identifications_some_agree);
                    //console.log(item.owners_identification_from_vision);
                    plant.thumb['2'][photoIndex].quality = item.quality_grade
                    //plant.images[photoIndex].height = match.original_dimensions.height
                    //plant.images[0].by = item.user.name
                    //plant.images[photoIndex].idObsrv = item.id
                  }
                //}
              //});
            }) // end result.results.forEach
            console.log(plant);
            plants[index] = plant
            console.log(plants[index].thumb['1']);
            //console.log(plants[index].thumb['1']);
            //console.log(plants[index].thumb['2']);
            this.setState({
              plants: plants
            });
            return plants
          },
          (error) => {
            console.log("error");
            downloadFileAutomatically(plants,"plantbackup")
            console.log(error);
          }
        )
        .then( plants => {
          if (Number.isInteger(index / 10)) downloadFileAutomatically(plants,"plantbackup2")
          if (index === (plants.length - 1))  downloadFileAutomatically(plants,"plantbackup-all")
        })

      //}
    })
  }

  render() {
    //console.log(this.state.plants);
    return (
      <div className="text-center">
        <p>Update JSON File via code</p>
        <SaveJSONToPC data={this.state.plants} />
        <hr />
      </div>
    )
  }
}


export default UpdateJSONData



/* get new data from external json
import { modifyNCSUSitemap, getNCSUUrl } from './getNCSUUrl'

componentDidMount(){
  let plants = this.state.plants
  modifyNCSUSitemap(plants)
  .then( data => {
    plants.forEach( (item, index) => {
      plants[index] = getNCSUUrl(data, item)
    })
    this.setState({
      plants: plants,
    })
  })
}
*/

/* add field if not present
plants.forEach( (item, index) => {
  item.sources.forEach( (itm, idx) => {
    if (!itm.from) item.sources[idx].from = "2020-07-05"
  })
  plants[index] = item
})
*

/* add data from external source (this is just adding an external url to NC Extension)
modifyNCSUSitemap(plants)
.then( data => {
  //console.log(data);
  plants.forEach( (item, index) => {
    plants[index] = getNCSUUrl(data, item)
  })
  console.log(plants)
})
*/

/*
Add Text to Field
plants.forEach( (item, index) => {
  console.log(item.spread.unit);
  if (!item.spread.unit || item.spread.unit === "" || Array.isArray(item.spread.unit) ) item.spread.unit = "ft"
  plants[index] = item
})
console.log(plants);

return (
  <div className="text-center">
    <p>Update JSON File via code</p>
    <SaveJSONToPC data={plants} />
    <hr />
  </div>
)
*/


/* move and then delete field
item.soils.nitrogen = item.nitrogen
delete item.nitrogen;
*/

/* modify images array
let fileType
item.images.forEach( (image, index) => {
  image.default = image.src

  fileType = image.default.match(/.([^.]+)$/g)
  image.fileType = fileType[0].replace(".","")

  if (!image.by) image.by = ""

  delete image.src;

  item.images[index] = image
})
*/

/* find and remove object from array
let match = item.sources.find( l => l.label === "Wikipedia" );
if ( match ) {
  if (item.sources.indexOf(match) > -1 ) {
    item.sources.splice(item.sources.indexOf(match), 1);
  }
}

match = item.sources.find( l => l.label === "Missouri Botanical Garden" );
if ( match ) {
  if (item.sources.indexOf(match) > -1 ) {
    item.sources.splice(item.sources.indexOf(match), 1);
  }
}

match = item.sources.find( l => l.label === "Wildflower.org" );
if ( match ) {
  if (item.sources.indexOf(match) > -1 ) {
    item.sources.splice(item.sources.indexOf(match), 1);
  }
}
*/

/* get more image data just with the image id (there is now an observation id so that is a more direct route to image data)


  componentDidMount() {
    let photoWithoutWidth = false
    let callCount = 0
    let plants = this.state.plants
    let that = this

    plants.forEach( (plant, index) => {
      photoWithoutWidth = false
      //console.log(plant.name);
      if (plant.images.length > 0 ){
        plant.images.forEach( photoObj => {
          if (!photoObj.width) {
            photoWithoutWidth = true
            console.log("images:" + photoObj.id);
          }
        })
      }
      if (plant.thumb['1'].length > 0 ){
        plant.thumb['1'].forEach( photoObj => {
          if (!photoObj.width) {
            photoWithoutWidth = true
            console.log("thumb1:" + photoObj.id);
          }
        })
      }
      if (plant.thumb['2'].length > 0 ){
        plant.thumb['2'].forEach( photoObj => {
          if (!photoObj.width) {
            photoWithoutWidth = true
            console.log("thumb2:" + photoObj.id);
          }
        })
      }
      if (photoWithoutWidth === true) {
        console.log(callCount + ": " + plant.name);
        //console.log(photoWithoutWidth);
        callCount = callCount + 1
        setTimeout( function() {
          console.log(callCount + ": " + plant.name);
          //console.log('setTimeout: ' + index);
          //that.loadImgs(plants, index)
        }, 30000 * callCount);
      }
    });
  }

  loadImgs(plants, index, page = 50) {
    //console.log('loadImgs');
    //console.log(page);
    const plant = plants[index]

    //%2Ccc-by-nc%2Ccc-by-nc-sa
    const license = 'cc-by%2Ccc-by-nd%2Ccc-by-sa%2Ccc0%2Ccc-by-nc';
    const perPage = 200; //200 is maximum
    const url = 'https://api.inaturalist.org/v1/observations?photos=true&verifiable=true&page='+page+'&per_page='+perPage+'&photo_license=' + license + '&taxon_id=' + plant.ids.iNatId + '&iconic_taxa=Plantae&order=desc&order_by=created_at';
    //console.log(url);

    //if (Number.isInteger(index / 10)) downloadFileAutomatically(plants,"plantbackup")

    console.log(plant.name + ": " + page);
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        //console.log(result);
        //console.log(result.results);
        result.results.forEach((item, idx) => {
          plant.images.forEach( (photoObj, photoIndex) => {
            if (!photoObj.width) {
              let photoObjId = photoObj.id
              //console.log(photoObj.id)
              //console.log(item.photos)
              let match = item.photos.find( i => i.id === photoObjId );
              if (match) {
                //console.log(match);
                //console.log(plants[index].images);
                //console.log(item);
                plant.images[photoIndex].width = match.original_dimensions.width
                plant.images[photoIndex].height = match.original_dimensions.height
                plant.images[photoIndex].by = item.user.name
                plant.images[photoIndex].idObsrv = item.id
                //console.log(plants[index].images[photoIndex]);
              }
            }
          });
          plant.thumb['1'].forEach( (photoObj, photoIndex) => {
            if (!photoObj.width) {
              let photoObjId = photoObj.id
              //console.log(photoObj.id)
              //console.log(item.photos)
              let match = item.photos.find( i => i.id === photoObjId );
              if (match) {
                //console.log(match);
                //console.log(plants[index].thumb['1']);
                //console.log(item);
                plant.thumb['1'][photoIndex].width = match.original_dimensions.width
                plant.thumb['1'][photoIndex].height = match.original_dimensions.height
                plant.thumb['1'][photoIndex].by = item.user.name
                plant.thumb['1'][photoIndex].idObsrv = item.id

                //console.log(plants[index].images[photoIndex]);
              }
            }
          });
          plant.thumb['2'].forEach( (photoObj, photoIndex) => {
            if (!photoObj.width) {
              let photoObjId = photoObj.id
              //console.log(photoObj.id)
              //console.log(item.photos)
              let match = item.photos.find( i => i.id === photoObjId );
              if (match) {
                //console.log(match);
                //console.log(plants[index].thumb['2']);
                //console.log(item);
                plant.thumb['2'][photoIndex].width = match.original_dimensions.width
                plant.thumb['2'][photoIndex].height = match.original_dimensions.height
                plant.thumb['2'][photoIndex].by = item.user.name
                plant.thumb['2'][photoIndex].idObsrv = item.id

                //console.log(plants[index].images[photoIndex]);
              }
            }
          });
        }) // end result.results.forEach
        plants[index] = plant
        //console.log(plants[index].images);
        //console.log(plants[index].thumb['1']);
        //console.log(plants[index].thumb['2']);
        this.setState({
          plants: plants
        });
        return plants
      },
      (error) => {
        console.log("error");
        downloadFileAutomatically(plants,"plantbackup")
        console.log(error);
      }
    )
    .then( plants => {
      let photoWithoutWidth = false
      plants[index].images.forEach( photoObj => {
        if (!photoObj.width) {
          console.log("image missing:" + photoObj.id)
          photoWithoutWidth = true
        }
      })
      plants[index].thumb['1'].forEach( photoObj => {
        if (!photoObj.width) {
          console.log("thumb1 missing:" + photoObj.id)
          photoWithoutWidth = true
        }
      })
      plants[index].thumb['2'].forEach( photoObj => {
        if (!photoObj.width) {
          console.log("thumb2 missing:" + photoObj.id)
          photoWithoutWidth = true
        }
      })
      //console.log(photoWithoutWidth);
      page = page + 1
      console.log(plant.name + ": " + page);
      if (!photoWithoutWidth) {
        console.log(plant.name + ": DONE");
        downloadFileAutomatically(plants,"plantbackup")
        //console.log(plants);
      }
      if (photoWithoutWidth && page <= 100) this.loadImgs(plants, index, page)
      if (page > 100) {
        console.log("NEED TO RUN: " + plant.name + " again from 50");
        downloadFileAutomatically(plants,"plantbackup")
      }
    })

  }

*/
