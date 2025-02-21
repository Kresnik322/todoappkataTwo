import React from "react";

import "./SearchPanel.scss";

class SearchPanel extends React.Component {
  state = {
    value: "",
  };

  onInputChange = (e) => {
    this.setState({ value: e.target.value });
    this.props.onInputChange(e.target.value, e.target.name);
  };

  render() {
    const { onInputChange } = this;
    const { value } = this.state;
    const {name} = this.props;
    return (
      <div className="search-panel input-group mb-3">
        <input
          name = {name}
          className="search-panel__text form-control "
          type="text"
          value={value}
          placeholder="Type to search..."
          onChange={onInputChange}
        ></input>
      </div>
    );
  }
}

export default SearchPanel;
