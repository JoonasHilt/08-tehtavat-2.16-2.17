import React from "react";

const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    filter shown with
    <input
      placeholder="search"
      value={searchTerm}
      onChange={handleSearchChange}
    />
  </div>
);

export default Filter;
