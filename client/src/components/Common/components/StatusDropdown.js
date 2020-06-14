import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

function StatusDropdown(props) {
  return (
    <div className="btn-group">
      <DropdownButton onSelect={props.onSelect} title={props.title}>
        {["Todo", "InProgress", "Done"].map(x => {
          const item = (
            <Dropdown.Item eventKey={x} active={x === props.status} key={x}>
              {x}
            </Dropdown.Item>
          );

          return item;
        })}
      </DropdownButton>
    </div>
  );
}

export default StatusDropdown;
