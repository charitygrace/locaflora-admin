import React from 'react';
import PropTypes from 'prop-types';
import { SelectImages } from '../components/EditPlantImagesSelect';
import { OrderImages } from '../components/EditPlantImagesOrder';
import { ExternalPlantLinks } from '../components/ExternalPlantLinks'
import { OverviewPlantTR, OverviewPlantTRImage } from '../components/OverviewPlantTR';
import { FormCheck, FormRadio, FormBoolean } from '../components/QuickEditFormFields'
import { NavLink } from "react-router-dom";


class INatImages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageOptions: [],
      pages: 1,
      page: 1,
      orderView: false,
      orderViewActive: "",
      selectViewActive: "active",
      showSpinner: false,
      quality: 'research',
      qualityNext: 'casual',
      license:'cc-by%2Ccc-by-nd%2Ccc-by-sa%2Ccc0'
    };
    this.plants = this.props.plants;
    this.fields = this.props.fields;
    let plantSlug = this.props.match.params.plantSlug
    this.plant = this.plants.find(plant => plant.slug === plantSlug);

    this.handleDisplay = this.handleDisplay.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadImgs = this.loadImgs.bind(this);
    this.loadCCbyNC = this.loadCCbyNC.bind(this);
    this.loadChangeQuality = this.loadChangeQuality.bind(this);
  }

  componentDidMount() {
    this.loadImgs();
  }

  loadImgs() {
    //console.log('loadImgs');
    this.setState({
      showSpinner: true
    });

    const plant = this.plant;
    const page = this.state.page;

    //%2Ccc-by-nc%2Ccc-by-nc-sa
    const license = this.state.license //'cc-by%2Ccc-by-nd%2Ccc-by-sa%2Ccc0' 'cc-by%2Ccc-by-nd%2Ccc-by-sa%2Ccc0%2Ccc-by-nc';
    const quality = this.state.quality //'cc-by%2Ccc-by-nd%2Ccc-by-sa%2Ccc0' 'cc-by%2Ccc-by-nd%2Ccc-by-sa%2Ccc0%2Ccc-by-nc';

    const perPage = 100; //200 is maximum
    //const url = 'https://api.inaturalist.org/v1/observations?quality_grade='+quality+'&photos=true&verifiable=true&page='+page+'&per_page='+perPage+'&photo_license=' + license + '&taxon_id=' + plant.ids.iNatId + '&iconic_taxa=Plantae&order=desc&order_by=created_at';
    const url = 'https://api.inaturalist.org/v1/observations?quality_grade='+quality+'&photos=true&page='+page+'&per_page='+perPage+'&photo_license=' + license + '&taxon_id=' + plant.ids.iNatId + '&iconic_taxa=Plantae&order=desc&order_by=created_at';
    //console.log(url);
    const imageOptions = this.state.imageOptions;
    let imageOption = {};
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          //console.log(result);
          //console.log(result.results);
          result.results.forEach((item, i) => {
            let imageLicense;
            let width;
            let height;
            item.photos.forEach((photo, i) => {
              //console.log(photo.original_dimensions);
              if (photo.original_dimensions) {
                //console.log(photo.license_code);
                photo.license_code ? imageLicense = photo.license_code : imageLicense = item.license_code;
                let fileType = photo.url.match(/(\.[^.]*)(?=\?)/g)
                if (!fileType) fileType = photo.url.match(/.([^.]+)$/g)
                imageOption = {
                  iNatId: photo.id,
                  credit: photo.attribution,
                  by: item.user.name,
                  idObsrv: item.id,
                  width: photo.original_dimensions.width,
                  height: photo.original_dimensions.height,
                  license: imageLicense,
                  dateStored: this.state.date,
                  fileType: fileType,
                  quality: item.quality_grade
                }
                imageOptions.push(imageOption);
              }
            });
          });
          this.setState({
            imageOptions: imageOptions,
            pages: result.total_results / perPage,
            page: page + 1,
            showSpinner: false
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
  }

  loadCCbyNC() {
    this.setState({
      page: 1,
      license:'cc-by-nc',
      quality: 'research',
      qualityNext: 'casual'
    }, () => {
      this.loadImgs();
    });
  }

  loadChangeQuality() {
    let grade
    let next
    if (this.state.quality === 'research') {
      grade = 'casual'
      next = 'needs_id'
    }
    if (this.state.quality === 'casual') grade = 'needs_id'
    this.setState({
      page: 1,
      quality: grade,
      qualityNext: next
    }, () => {
      this.loadImgs();
    });
  }

  handleDisplay() {
    const orderView = this.state.orderView
    this.setState({
      orderView: !orderView,
      orderViewActive: !orderView ? "active" : "",
      selectViewActive: orderView ? "active" : "",
    });
  }

  handleUpdate(data) {
    let plants = this.plants;
    const plant = plants.find(plant => plant.id === data.id);
    plants[plants.indexOf(plant)] = data;
    this.props.onChange(plants)
  }

  render() {
    const plant = this.plant
    const fields = this.fields
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
        <h1>{plant.name} ({plant.taxa.commonName})</h1>
        <div className="row">
          <div className="col-8">
            <div className="text-right">
              <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <label className={"btn btn-secondary " + this.state.selectViewActive}>
                  <input type="radio" name="options" value="display-select" onChange={this.handleDisplay} checked={!this.state.orderView} /> Select Images
                </label>
                <label className={"btn btn-secondary " + this.state.orderViewActive}>
                  <input type="radio" name="options" value="display-order"  onChange={this.handleDisplay} checked={this.state.orderView} /> Re-order Selected
                </label>
              </div>
            </div>
            {
              this.state.orderView === false ?
              <SelectImages plant={plant} imageOptions={this.state.imageOptions} showSpinner={this.state.showSpinner} onChange={this.handleUpdate} /> :
              <OrderImages plant={plant} onChange={this.handleUpdate} />
            }
            <br />
            <div className="text-center">
              {this.state.orderView === false && this.state.page < this.state.pages + 1 ? <button className="btn btn-primary" onClick={this.loadImgs}>Load More Images</button> : null }
              {this.state.orderView === false && this.state.quality !== 'needs_id' && this.state.page >= this.state.pages + 1 ? <button className="btn btn-primary" onClick={this.loadChangeQuality}>Load {this.state.qualityNext} Images</button> : null }
              &nbsp;
              {this.state.orderView === false && this.state.license !== 'cc-by-nc' && this.state.page >= this.state.pages + 1 ? <button className="btn btn-primary" onClick={this.loadCCbyNC}>Load CC-by-NC Images</button> : null }
            </div>
          </div>
          <div className="col-4">
            <ExternalPlantLinks plant={plant} />
            <table className="table table-sm">
              <tbody>
                <OverviewPlantTRImage plant={plant} field="thumb.1" />
                <OverviewPlantTRImage plant={plant} field="thumb.2" />
                <FormCheck plant={plant} fields={fields} field="plantTypes" onChange={this.handleUpdate} />
                <FormCheck plant={plant} fields={fields} field="lightNeeds" onChange={this.handleUpdate} />
                <FormCheck plant={plant} fields={fields} field="soils.moistureNeeds" onChange={this.handleUpdate} />
                <FormCheck plant={plant} fields={fields} field="flowers.colors" onChange={this.handleUpdate} />
                <FormBoolean plant={plant} fields={fields} field="flowers.conspicuous" onChange={this.handleUpdate} />
                <FormCheck plant={plant} fields={fields} field="fruits.colors" onChange={this.handleUpdate} />
                <FormBoolean plant={plant} fields={fields} field="fruits.conspicuous" onChange={this.handleUpdate} />
                <FormRadio plant={plant} fields={fields} field="leaves.retention" onChange={this.handleUpdate} />
                <OverviewPlantTR plant={plant} field="height.min" />
                <OverviewPlantTR plant={plant} field="height.max" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
};

export default INatImages;


SelectImages.INatImages = {
  page: PropTypes.number,
  perPage: PropTypes.number,
  url: PropTypes.string,
  fileType: PropTypes.string,
  license: PropTypes.string,
  imageOptions: PropTypes.array,
  imageOption: PropTypes.object,
  imageLicense: PropTypes.string,
  orderView: PropTypes.bool,
  plants: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  plant: PropTypes.object.isRequired
};
