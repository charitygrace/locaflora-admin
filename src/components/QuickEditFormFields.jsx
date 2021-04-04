import React from 'react';

export class FormCheck extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props);
    const k = this.props.field;
    let options
    if (this.props.fields[k]) options = this.props.fields[k].options;
    let selected = this.props.plant[k];
    this.keys = k.split(".");
    if (this.keys.length === 2) {
      let k1 = this.keys[0];
      let k2 = this.keys[1];
      options = this.props.fields[k1][k2].options
      selected = this.props.plant[k1][k2]
    }
    this.options = options;
    //if(!(Array.isArray(selected))) selected = [selected];
    this.state = {
      selected: selected
    };

    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event) {
    //console.log(event);
    //console.log(event.target.type);
    //console.log(event.target.checked);
    //console.log(event.target.value);
    let selected = this.state.selected;
    let plant = this.props.plant;
    //let key = event.target.name;
    if (event.target.checked) {
      selected.push(event.target.value);
    } else {
      const index = selected.indexOf(event.target.value);
      if (index > -1) {
        selected.splice(index, 1);
      }
    }
    if (this.keys.length === 1) {
      let k1 = this.keys[0];
      plant[k1] = selected
    }
    if (this.keys.length === 2) {
      let k1 = this.keys[0];
      let k2 = this.keys[1];
      plant[k1][k2] = selected
    }

    this.setState({
      selected: selected
    });

    if (this.props.onChange !== undefined) this.props.onChange(plant);
  }

  render() {
    let optionsDisplay = this.options.map( (option, key) => {
        let checked = "";
        for (let i of this.state.selected) {
          if (option === i) {
            checked = "checked";
          }
        }
        return (
          <div className="form-check form-check-inline" key={key}>
            <input
              className="form-check-input"
              type="checkbox"
              name={this.props.field}
              id={"input-" + option}
              value={option}
              checked={checked}
              onChange={this.handleChange}
            />
            <label className="form-check-label" htmlFor={"input-" + option}>
              {option}
            </label>
          </div>
        )
    })
    return(
      <tr>
        <th>{this.props.field}</th>
        <td>
          {optionsDisplay}
        </td>
      </tr>
    );
  }
}


export class FormRadio extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props);
    const k = this.props.field;
    let options
    if (this.props.fields[k]) options = this.props.fields[k].options;
    let selected = this.props.plant[k];
    this.keys = k.split(".");
    if (this.keys.length === 2) {
      let k1 = this.keys[0];
      let k2 = this.keys[1];
      options = this.props.fields[k1][k2].options
      selected = this.props.plant[k1][k2]
    }
    this.options = options;
    this.state = {
      selected: selected
    };

    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event) {
    //console.log(event);
    //console.log(event.target.type);
    //console.log(event.target.checked);
    //console.log(event.target.value);
    let selected = this.state.selected;
    let plant = this.props.plant;
    //let key = event.target.name;
    if (event.target.checked) {
      selected = event.target.value;
    }
    if (this.keys.length === 1) {
      let k1 = this.keys[0];
      plant[k1] = selected
    }
    if (this.keys.length === 2) {
      let k1 = this.keys[0];
      let k2 = this.keys[1];
      plant[k1][k2] = selected
    }

    //console.log(selected);
    this.setState({
      selected: selected
    });

    if (this.props.onChange !== undefined) this.props.onChange(plant);
  }

  render() {
    let optionsDisplay = this.options.map( (option, key) => {
        let checked = "";
        if (option === this.state.selected) {
          checked = "checked";
        }
        return (
          <div className="form-check" key={key}>
            <input
              className="form-check-input"
              type="radio"
              name={this.props.field}
              id={"input-" + option}
              value={option}
              checked={checked}
              onChange={this.handleChange}
            />
            <label className="form-check-label" htmlFor={"input-" + option}>
              {option}
            </label>
          </div>
        )
    })
    return(
      <tr>
        <th>{this.props.field}</th>
        <td>
          {optionsDisplay}
        </td>
      </tr>
    );
  }
}


export class FormBoolean extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props);
    const k = this.props.field;
    let selected = this.props.plant[k];
    this.keys = k.split(".");
    if (this.keys.length === 2) {
      let k1 = this.keys[0];
      let k2 = this.keys[1];
      selected = this.props.plant[k1][k2]
      if (!selected) selected = false
    }
    //if(!(Array.isArray(selected))) selected = [selected];
    this.state = {
      selected: selected
    };

    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event) {
    //console.log(event);
    //console.log(event.target.type);
    //console.log(event.target.checked);
    //console.log(event.target.value);
    let selected = this.state.selected;
    let plant = this.props.plant;
    //let key = event.target.name;
    selected = event.target.checked;
    console.log(selected);
    if (this.keys.length === 1) {
      let k1 = this.keys[0];
      plant[k1] = selected
    }
    if (this.keys.length === 2) {
      let k1 = this.keys[0];
      let k2 = this.keys[1];
      plant[k1][k2] = selected
    }

    this.setState({
      selected: selected
    });

    if (this.props.onChange !== undefined) this.props.onChange(plant);
  }

  render() {
    let checked = false;
    if (true === this.state.selected) {
      checked = "checked";
    }
    return(
      <tr>
        <th>{this.props.field}</th>
        <td>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name={this.props.field}
            id={"input-" + this.props.field}
            checked={checked}
            onChange={this.handleChange}
          />
          <label className="form-check-label" htmlFor={"input-" + this.props.field}>

          </label>
        </div>
        </td>
      </tr>
    );
  }
}
