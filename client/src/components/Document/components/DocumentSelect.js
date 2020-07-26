import React from "react";
import Select from "react-select";

function DocumentSelect(props) {
  return (
    <div>
      <Select
        value={props.selected}
        onChange={props.onSelect}
        options={props.documents.map(x => ({ value: x._id, label: x.name }))}
      />
    </div>
  );
}

export default DocumentSelect;
