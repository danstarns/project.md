import React, { useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ExportDocumentDropdown(props) {
  const downloadMarkdown = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([props.document.markdown], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${props.document.name}.md`;
    document.body.appendChild(element);
    element.click();
  }, []);

  const downloadPDF = useCallback(() => {
    const element = document.createElement("a");
    element.href = props.document.url;
    element.download = `${props.document.name}.pdf`;
    document.body.appendChild(element);
    element.click();
  }, []);

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
        <FontAwesomeIcon icon="file-export" size="1x" className="mr-2" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="mt-1">
        <Dropdown.Item onClick={downloadPDF} disabled={!props.document.url}>
          <FontAwesomeIcon icon="file-pdf" size="1x" className="mr-2" /> PDF
        </Dropdown.Item>
        <Dropdown.Item onClick={downloadMarkdown}>
          <FontAwesomeIcon
            icon={["fab", "markdown"]}
            size="1x"
            className="mr-2"
          />
          Markdown
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ExportDocumentDropdown;
