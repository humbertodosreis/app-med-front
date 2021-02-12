import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../../libs/errorLib";

export default function Notes() {
  //   const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [patient, setPatient] = useState(null);
  //   const [content, setContent] = useState("");

  useEffect(() => {
    function loadPatient() {
      return API.get("pacientes", `/pacientes/${id}`);
    }

    async function onLoad() {
      try {
        const loadedPatient = await loadPatient();
        // const { content, attachment } = note;

        // if (attachment) {
        //   note.attachmentURL = await Storage.vault.get(attachment);
        // }

        // setContent(content);
        setPatient(loadedPatient);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  return <div className="Patients"></div>;
}
