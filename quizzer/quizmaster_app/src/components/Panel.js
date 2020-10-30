import React from 'react';

class Panel extends React.Component {
  state = {
    name: '',
  };

  handleInput = (e) => {
    this.props.handleInput({
      name: e.target.value,
    });
  }

  render() {
    const items = this.props.items.map(data => {     
      return <option
        onClick={this.handleInput}
        key={data}>
        {data}
      </option>
    });
    return <React.Fragment>
      <div className="form-group">
        <label htmlFor="teams">{this.props.title}</label>
        <select multiple className="form-control">
          {items}
        </select>
      </div>
    </React.Fragment>
  }
}
export default Panel;
