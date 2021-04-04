import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../components/Spinner';
//import { ImgPagination }  from '../components/ImgPagination.jsx';
import { dateNow } from '../actions/modifyFields';


export class SelectImages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.plant = this.props.plant;

    this.imageOptions = this.props.imageOptions;
    this.handleImgSelect = this.handleImgSelect.bind(this);
    this.handleImgRemove = this.handleImgRemove.bind(this);
  }

  handleImgRemove(e) {
    let plant = this.plant;

    let id = e.target.parentNode.dataset.id;
    if (!id) id = e.target.parentNode.parentNode.dataset.id;
    if (!id) id = e.target.parentNode.parentNode.parentNode.dataset.id;
    id = Number(id);

    const matchGeneral = plant.images.find( item => item.id === id );
    const matchThumb1 = plant.thumb['1'].find( item => item.id === id );
    const matchThumb2 = plant.thumb['2'].find( item => item.id === id );


    if ( matchThumb1 ) plant.thumb['1'] = [];
    if ( matchThumb2 ) plant.thumb['2'] = [];
    if ( matchGeneral ) {
      const index = plant.images.indexOf(matchGeneral);
      if (index > -1) {
        plant.images.splice(index, 1);
      }
    }
    this.props.onChange(plant)
  }

  handleImgSelect(e) {
    //console.log("handleImgSelect");
    let plant = this.plant;

    let id = e.target.parentNode.dataset.id;
    if (!id) id = e.target.parentNode.parentNode.dataset.id;
    if (!id) id = e.target.parentNode.parentNode.parentNode.dataset.id;
    id = Number(id);

    let idObsrv = e.target.parentNode.dataset.idobsrv;
    if (!idObsrv) idObsrv = e.target.parentNode.parentNode.dataset.idobsrv;
    if (!idObsrv) idObsrv = e.target.parentNode.parentNode.parentNode.dataset.idobsrv;
    idObsrv = Number(idObsrv);

    let width = e.target.parentNode.dataset.width;
    if (!width) width = e.target.parentNode.parentNode.dataset.width;
    if (!width) width = e.target.parentNode.parentNode.parentNode.dataset.width;
    width = Number(width);

    let height = e.target.parentNode.dataset.height;
    if (!height) height = e.target.parentNode.parentNode.dataset.height;
    if (!height) height = e.target.parentNode.parentNode.parentNode.dataset.height;
    height = Number(height);

    let by = e.target.parentNode.dataset.by;
    if (!by) by = e.target.parentNode.parentNode.dataset.by;
    if (!by) by = e.target.parentNode.parentNode.parentNode.dataset.by;

    let group = e.target.dataset.group;
    if (!group) group = e.target.parentNode.dataset.group;
    if (!group) group = "general";
    //console.log(group);

    //const image = document.getElementById("img-"+id).getElementsByTagName('img')
    //const src = image[0].getAttribute('src');
    const src = document.getElementById("img-"+id).getElementsByTagName('img')[0].getAttribute('src');
    const credit = document.getElementById("img-"+id).getElementsByClassName('select-img-credit')[0].textContent
    const license = document.getElementById("img-"+id).getElementsByClassName('select-img-license')[0].textContent
    const quality = document.getElementById("img-"+id).getElementsByClassName('select-img-quality')[0].textContent
    const fileType = src.match(/.([^.]+)$/g)

    //console.log(credit);
    let alt = plant.name;
    if (plant.commonName) alt = plant.name + " / " + plant.commonName;
    const imageInfo = {
      'id': id,
      'idObsrv': idObsrv,
      'default': src,
      'fileType': fileType[0].replace(".",""),
      'width': width,
      'height': height,
      'credit': credit,
      'license': license,
      'alt': alt,
      'by': by,
      'date': dateNow(),
      'quality': quality
    }
    //console.log(imageInfo);

    // determine if the images is already assigned
    const matchGeneral = plant.images.find( item => item.id === id );
    const matchThumb1 = plant.thumb['1'].find( item => item.id === id );
    const matchThumb2 = plant.thumb['2'].find( item => item.id === id );

    if (!plant.images) plant.images = []

    if (group === "thumb1") {
      // if image already in thumb1, thumb2, or images move it or remove it
      if ( plant.thumb['1'].length > 0 ) plant.images.push(plant.thumb['1'][0]);
      if ( matchThumb2 ) plant.thumb['2'] = [];
      //console.log(plant.images);
      plant.thumb['1'] = [];
      plant.thumb['1'].push(imageInfo);
      // if image already in images remove it
      if ( matchGeneral ) {
        //console.log( matchGeneral );
        plant.images = plant.images.filter(function( obj ) {
            return obj.id !== imageInfo.id;
        });
      }
      //console.log(plant.images);
    }

    if (group === "thumb2") {
      if ( plant.thumb['2'].length > 0 ) plant.images.push(plant.thumb['2'][0]);
      if ( matchThumb1 ) plant.thumb['1'] = [];
      //console.log(plant.images);
      plant.thumb['2'] = [];
      plant.thumb['2'].push(imageInfo);
      // if image already in images remove it
      if ( matchGeneral ) {
        //console.log( matchGeneral );
        plant.images = plant.images.filter(function( obj ) {
            return obj.id !== imageInfo.id;
        });
      }
      //console.log(plant.images);

    }

    if (group === "general") {
      if (matchThumb1) plant.thumb['1'] = [];
      if (matchThumb2) plant.thumb['2'] = [];
      //delete plant.thumb['1'][idKey];
      //delete plant.thumb['2'][idKey];
      if ( !matchGeneral ) plant.images.push(imageInfo);
      //console.log(data.images);
    }
    //console.log(plant.thumb['1'][0]);
    //console.log(plant.thumb['2'][0]);
    //console.log("images array");
    //console.log(plant.images);
    this.props.onChange(plant)
  }


  render() {
    const plant =  this.plant
    const imageOptions = this.imageOptions
    const imageIds = plant.images.map( i => i.id);

    //let imageIds = [];
    let imageIdThumb1
    let imageIdThumb2

    if (plant.thumb['1'][0]) {
      imageIdThumb1 = plant.thumb['1'][0].id
      imageIds.push(imageIdThumb1);
    }
    if (plant.thumb['2'][0]) {
      imageIdThumb2 = plant.thumb['2'][0].id
      imageIds.push(imageIdThumb2);
    }

    const imageDisplay = imageOptions.map( photo => {
      let isSelected = "";
      let selectedGeneral = "";
      let selectedThumb1 = "";
      let selectedThumb2 = "";
      if (imageIds.includes(photo.iNatId)) {
        isSelected = "selected";
        if (imageIdThumb1 === photo.iNatId) selectedThumb1 = "selected"
        else if (imageIdThumb2 === photo.iNatId) selectedThumb2 = "selected"
        else selectedGeneral = "selected"
      }
      return (
        <div
          className={"col-md-4 col-lg-3 select-img " + isSelected}
          id={"img-" + photo.iNatId}
          data-id={photo.iNatId}
          data-idobsrv={photo.idObsrv}
          data-by={photo.by}
          data-width={photo.width}
          data-height={photo.height}
          key={photo.iNatId}
        >
          <div className="select-img-img" data-group="general">
            <img
              onClick={this.handleImgSelect}
              src={'https://static.inaturalist.org/photos/' + photo.iNatId + '/medium' + photo.fileType} className="img-fluid" alt=""
            />
          </div>
          <div className="select-remove" onClick={this.handleImgRemove}></div>
          <div className="select-img-quality text-right"><i>{photo.quality}</i></div>
          <div className="select-options text-right">
            <button
              className={"btn-circle btn select-img-1 " + selectedThumb1}
              onClick={this.handleImgSelect}
              data-group="thumb1"
            >
              1
            </button>
            <button
              className={"btn-circle btn select-img-2 " + selectedThumb2}
              onClick={this.handleImgSelect}
              data-group="thumb2"
            >
              2
            </button>
            <button
              className={"btn-circle btn select-img-general " + selectedGeneral}
              onClick={this.handleImgSelect}
              data-group="general"
            >
              <i className="far fa-images"></i>
            </button>
          </div>
          <div className="select-img-license">{photo.license}</div>
          <p className="select-img-credit form-text">{photo.credit}</p>
        </div>
      )
    });


    return (
      <div className="row select-view">
        {imageDisplay}
        {this.props.showSpinner === true ? <div className="col-md-4 col-lg-3 text-center align-self-center"><Spinner /></div> : null }
      </div>
    )
  }
};

export default SelectImages;

SelectImages.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
  group: PropTypes.string,
  src: PropTypes.string,
  credit: PropTypes.string,
  license: PropTypes.string,
  alt: PropTypes.string,
  imageInfo: PropTypes.array,
  imageIds: PropTypes.array,
  imageIdThumb1: PropTypes.number,
  imageIdThumb2: PropTypes.number,
  isSelected: PropTypes.string,
  selectedGeneral: PropTypes.string,
  selectedThumb1: PropTypes.string,
  selectedThumb2: PropTypes.string,
  matchGeneral: PropTypes.array,
  matchThumb1: PropTypes.array,
  matchThumb2: PropTypes.array,
  imageDisplay: PropTypes.element,
  plant: PropTypes.object.isRequired
};
