import React from 'react';
import PropTypes from 'prop-types';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';

const DragHandle = sortableHandle(() => <div className="text-right drag-handle"><div className="btn-circle"><i className="fas fa-sort"></i></div></div>);

const SortableItem = sortableElement(({image, onClick, onChange}) => (
  <div className="row selected order-view pt-3" id={"img-" + image.id} data-id={image.id} key={image.id}>
    <div className="col-md-1">
      <DragHandle />
    </div>
    <div className="col-md-3">
      <div className="select-img-img" data-group="general">
        <img
          src={image.default} className="img-fluid" alt=""
        />
      </div>
      <div className="select-remove" onClick={onClick}></div>
      <div className="select-options">
        <button
          className="btn-circle btn select-img-1"
          data-group="thumb1"
          onClick={onClick}
        >
          1
        </button>
        <button
          className="btn-circle btn select-img-2"
          data-group="thumb2"
          onClick={onClick}
        >
          2
        </button>
        <button
          className="btn-circle btn select-img-general selected"
          data-group="general"
        >
          <i className="far fa-images"></i>
        </button>
      </div>
    </div>
    <div className="col-md-8">
      <form onSubmit={onChange}>
        <div className="input-group mb-3">
          <input className="form-control form-control-sm" name="imageAlt" type="text" placeholder="alt text" defaultValue={image.alt} />
          <div className="input-group-append">
            <button className="btn btn-sm btn-primary" type="submit">Update Alt Text</button>
          </div>
        </div>
      </form>
      <p className="select-img-credit form-text">{image.credit}</p>
      <p className="select-img-quality form-text"><i>{image.quality}</i></p>
    </div>
  </div>
));

const SortableContainer = sortableContainer(({children}) => {
  return <div>{children}</div>;
});


export class OrderImages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageArr: this.props.plant.images
    };
    this.plant = this.props.plant;
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleAltChange = this.handleAltChange.bind(this);
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    let plant = this.plant
    this.setState(({imageArr}) => ({
      imageArr: arrayMove(imageArr, oldIndex, newIndex),
    }));
    plant.images = this.state.imageArr
    this.props.onChange(plant)
  };

  handleImgChange(e) {
    //console.log("handleImgChange");
    let plant = this.plant
    let imageArr = this.state.imageArr
    let id = e.target.parentNode.dataset.id;
    if (!id) id = e.target.parentNode.parentNode.dataset.id;
    if (!id) id = e.target.parentNode.parentNode.parentNode.dataset.id;
    id = Number(id);

    let image = imageArr.find(i => i.id === id);

    let group = e.target.dataset.group;
    if (!group) group = e.target.parentNode.dataset.group;

    if (group === "thumb1") {
      //console.log("thumb1");
      if (plant.thumb['1'][0]) imageArr.unshift(plant.thumb['1'][0]);
      plant.thumb['1'] = [image];
    }
    if (group === "thumb2") {
      //console.log("thumb2");
      if (plant.thumb['2'][0]) imageArr.unshift(plant.thumb['2'][0]);
      plant.thumb['2'] = [image];
    }

    const index = imageArr.indexOf(image);
    if (index > -1) {
      imageArr.splice(index, 1);
    }
    this.setState({
      imageArr: imageArr,
    });
    plant.images = imageArr
    this.props.onChange(plant)
  }

  handleAltChange(e) {
    e.preventDefault();
    //console.log('handleAltChange');
    let plant = this.plant
    let imageArr = this.state.imageArr
    let id = e.target.parentNode.dataset.id;
    if (!id) id = e.target.parentNode.parentNode.dataset.id;
    if (!id) id = e.target.parentNode.parentNode.parentNode.dataset.id;
    id = Number(id);
    //console.log(id);

    let image = imageArr.find(i => i.id === id);
    //console.log(e.target);
    //console.log(e.target.elements);
    //console.log(e.target.imageAlt);
    //console.log(e.target.imageAlt.value);
    image.alt = e.target.imageAlt.value;

    const index = imageArr.indexOf(image);
    if (index > -1) {
      imageArr[index] = image;
    }
    this.setState({
      imageArr: imageArr,
    });
    plant.images = imageArr
    //console.log(imageArr);
    //console.log(plant);
    this.props.onChange(plant)
  }

  render() {
    const {imageArr} = this.state;

    return (
      <SortableContainer onSortEnd={this.onSortEnd} useDragHandle lockAxis="y">
        {imageArr.map( (image, i) => (
          <SortableItem key={image.id} index={i} image={image} onClick={this.handleImgChange} onChange={this.handleAltChange} />
        ))}
      </SortableContainer>
    );
  }
};

export default OrderImages;

OrderImages.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
  image: PropTypes.array,
  imageArr: PropTypes.array,
  plant: PropTypes.object.isRequired
};
