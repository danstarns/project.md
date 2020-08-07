import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { DebounceInput } from "react-debounce-input";

function NavSearch(props) {
  const [search, setSearch] = useState(false);

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <DebounceInput
        type="text"
        debounceTimeout={300}
        onChange={e => setSearch(e.target.value)}
        value={search}
        aria-label="Small"
        aria-describedby="inputGroup-sizing-lg"
        placeholder="Search"
        className="form-control"
      />
    </>
  );
}

export default NavSearch;
