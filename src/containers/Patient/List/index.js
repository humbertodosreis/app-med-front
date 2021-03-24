import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../libs/contextLib";
import { onError } from "../../../libs/errorLib";
import { getAllPatients } from "../../../services/patients";
import "./style.css";

export default function List() {
  const [patients, setPatients] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const loadedPatients = await getAllPatients();
        console.log(loadedPatients);
        setPatients(loadedPatients);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function renderPatientsList(patients) {
    return (
      <>
        {patients.map((item) => (
          <tr key={item.paciente_id}>
            <td>{item.paciente_id.substring(1, 8)}</td>
            <td>{item.nome}</td>
            <td>{item.telefone}</td>
            <td>{new Date(item.data_nascimento).toLocaleDateString()}</td>
            <td>{item.email}</td>
            <td>
              [<Link to={`/patients/${item.paciente_id}/edit`}>Editar</Link>] [
              <Link to={`/patients/${item.paciente_id}`}>Ver</Link>]
            </td>
          </tr>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
      </div>
    );
  }

  function renderPatients() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Pacientes</h2>
        <LinkContainer to="/patients/new">
          <span>[ Novo ]</span>
        </LinkContainer>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Data de Nascimento</th>
              <th>E-mail</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{!isLoading && renderPatientsList(patients.items)}</tbody>
        </Table>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderPatients() : renderLander()}
    </div>
  );
}
