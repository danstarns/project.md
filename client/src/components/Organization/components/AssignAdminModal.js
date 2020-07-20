/* eslint-disable no-use-before-define */
import React, { useState, useContext, useCallback } from "react";
import { Modal } from "react-bootstrap";
import gql from "graphql-tag";
import { GraphQL } from "../../../contexts/index.js";

const ASSIGN_ADMIN_ORGANIZATION = gql`
  mutation assignAdminOrganization($id: ID!, $user: String!) {
    assignAdminOrganization(input: { id: $id, user: $user })
  }
`;

const REVOKE_ADMIN_ORGANIZATION = gql`
  mutation revokeAdminOrganization($id: ID!, $user: String!) {
    revokeAdminOrganization(input: { id: $id, user: $user })
  }
`;

function AssignAdminModal(props) {
  const { client } = useContext(GraphQL.Context);

  return (
    <Modal show={props.show} onHide={props.onHide}>
      Hi From Assign Admin
    </Modal>
  );
}

export default AssignAdminModal;
