import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import LoaderButton from "../../components/LoaderButton";
import { onError } from "../../libs/errorLib";
import config from "../../config";
import { useFormFields } from "../../libs/hooksLib";
import "./New.css";

export default function New() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    phone: "",
    birthday: "",
    email: "",
  });

  function validateForm() {
    return (
      fields.name.length > 0 &&
      fields.phone.length > 0 &&
      fields.birthday.length > 0 &&
      fields.email.length > 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await createPatient({
        nome: fields.name,
        telefone: fields.phone,
        data_nascimento: fields.birthday,
        email: fields.email,
      });
      history.push("/patients");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createPatient(patient) {
    return API.post("pacientes", "/pacientes", {
      body: patient,
    });
  }

  return (
    <div className="New Patient">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="name">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={fields.name}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="phone">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            value={fields.phone}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="birthday">
          <Form.Label>Data de Nascimento</Form.Label>
          <Form.Control
            type="text"
            value={fields.birthday}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="email">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="text"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Cadastrar
        </LoaderButton>
      </Form>
    </div>
  );
}
