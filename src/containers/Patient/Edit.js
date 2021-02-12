import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { API } from "aws-amplify";
import LoaderButton from "../../components/LoaderButton";
import { onError } from "../../libs/errorLib";

export default function Notes() {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadPatient() {
      return API.get("pacientes", `/pacientes/${id}`);
    }

    async function onLoad() {
      try {
        const loadedPatient = await loadPatient();

        setName(loadedPatient.nome);
        setBirthday(loadedPatient.data_nascimento);
        setPhone(loadedPatient.telefone);
        setEmail(loadedPatient.email);

        setDataLoaded(true);
      } catch (e) {
        console.log(e);
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function savePatient(patient) {
    return API.put("pacientes", `/pacientes/${id}`, {
      body: patient,
    });
  }

  function deletePatient() {
    return API.del("pacientes", `/pacientes/${id}`);
  }

  function validateForm() {
    return (
      name.length > 0 &&
      birthday.length > 0 &&
      phone.length > 0 &&
      email.length > 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await savePatient({
        nome: name,
        telefone: phone,
        data_nascimento: birthday,
        email,
      });
      history.push("/patients");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm("Você deseja remover este registro?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deletePatient();
      history.push("/patients");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Patients">
      {isDataLoaded ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="phone">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="birthday">
            <Form.Label>Data de Nascimento</Form.Label>
            <Form.Control
              type="text"
              value={birthday}
              onChange={(e) => {
                setBirthday(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="email">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
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
            Salvar
          </LoaderButton>

          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Excluir
          </LoaderButton>
        </Form>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}
