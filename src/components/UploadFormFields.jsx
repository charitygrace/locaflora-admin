import React from 'react';

const labelColClass = "col-sm-3";
const inputColClass = "col-sm-9";

export class FormSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    if (this.props.onChange !== undefined) this.props.onChange(event.target.name, event.target.value);
  }

  render() {
    //var required = "";
    //console.log(this.props.required);
    //this.props.required === "true" ? required = "required" : required = "";

    //console.log(this.props.options);
    //console.log(this.props.options.length);
    return(
      <div className="form-group row">
        <label htmlFor={"select-" + this.props.name} className={labelColClass + " col-form-label"}>{this.props.name}</label>
        <div className={inputColClass}>
          <select
            className="custom-select"
            name={this.props.name}
            value={this.state.value}
            onChange={this.handleChange}
            required={this.props.required}
            id={"select-" + this.props.name}
            >
            <option value="">- Select -</option>
            { (this.props.options.length > 0) ?
              this.props.options.map( (option, key) =>
                (<option value={option} key={key}>{option}</option>
              )) : ""
            }
          </select>
          <small className="form-text text-muted">{this.props.directions}</small>
        </div>
      </div>
    );
  }
}

export function FormText(props) {
    return(
      <div className="form-group row">
        <label htmlFor={"input-" + props.name} className={labelColClass + " col-form-label"}>{props.name}</label>
        <div className={inputColClass}>
          <input
            type="text"
            className="form-control"
            name={props.name}
            id={"input-" + props.name}
            required={props.required}
          />
          <small className="form-text text-muted">{props.directions}</small>
        </div>
     </div>
    );
}

export function FormNote(props) {
    return(
      <div className="form-group row">
        <div className={labelColClass}></div>
        <div className={inputColClass}>
          {props.note}
        </div>
     </div>
    );
}
