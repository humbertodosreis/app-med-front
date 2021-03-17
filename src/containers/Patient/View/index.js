import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
// import { API, Storage } from "aws-amplify";
import { onError } from "../../../libs/errorLib";
import { getPatient } from "../../../services/patients";
import "./style.css";

export default function Notes() {
  //   const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [patient, setPatient] = useState(null);
  //   const [content, setContent] = useState("");

  useEffect(() => {
    async function onLoad() {
      try {
        const loadedPatient = await getPatient(id);
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
