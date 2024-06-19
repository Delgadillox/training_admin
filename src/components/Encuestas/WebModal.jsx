import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormHelperText,
  IconButton,
} from "@mui/material";
import QRCode from "qrcode.react";
import GetAppIcon from "@mui/icons-material/GetApp";
import CryptoJS from "crypto-js";
import axios from "axios";
import html2canvas from "html2canvas"; // Asegúrate de tener esta dependencia instalada
import { transformDate } from "../../utils";

const secretKey = "psicologia-aplicada";

function encryptId(id) {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
  const urlSafeEncrypted = encrypted
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "~");
  return urlSafeEncrypted;
}

const WebModal = ({ open, handleClose, selectedSurvey }) => {
  const [companies, setCompanies] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [template, setTemplate] = useState("");

  const [expirationDate, setExpirationDate] = useState("");
  const [company, setCompany] = useState("");
  const [leader, setLeader] = useState(0);
  const [maxResponses, setMaxResponses] = useState(1);
  const [unlimitedResponses, setUnlimitedResponses] = useState(false);
  const [visibilityInstances, setVisibilityInstances] = useState([]);
  const [companyError, setCompanyError] = useState(false);

  useEffect(() => {
    const fetchInstances = async () => {
      setVisibilityInstances([]);
      const onlineInstances = await axios.get(
        `https://psicologia-aplicada.com/quizz/psicologia-api/quizz/getOnlineInstancesByQuizz.php?id=${selectedSurvey.id}`
      );
      const result = onlineInstances.data;
      console.log(result);
      setVisibilityInstances(result);
    };

    if (selectedSurvey) {
      const optionsObj = JSON.parse(selectedSurvey.preguntas).map(
        (question) => ({
          id: question.id,
          options: new Array(question.options.length).fill(0),
        })
      );
      setTemplate(optionsObj);
      fetchInstances();
    }
  }, [selectedSurvey]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await fetch(
        "https://psicologia-aplicada.com/quizz/psicologia-api/api/getPlants.php"
      );
      const data = await response.json();
      setCompanies(data);
    };
    fetchCompanies();
  }, []);

  const handleSave = async () => {
    // Validar que el campo "Empresa" no esté vacío
    if (!company) {
      setCompanyError(true);
      return;
    }
    setCompanyError(false);

    if (!maxResponses && !unlimitedResponses) {
      window.alert("No puedes dejar vacio el campo de máximas respuestas");
    }

    // Crear nueva instancia de visibilidad
    const newVisibility = {
      quizz: selectedSurvey.id,
      expirationDate,
      company,
      leader,
      maxResponses: unlimitedResponses ? 1000000 : maxResponses,
      template,
    };

    console.log(newVisibility);
    try {
      const response = await axios.post(
        "https://psicologia-aplicada.com/quizz/psicologia-api/quizz/newOnlineInstance.php",
        newVisibility
      );
      const { id } = response.data;
      // Guardar la nueva instancia en el servidor
      newVisibility.id = id;
      setVisibilityInstances([...visibilityInstances, newVisibility]);

      // Limpiar el formulario
      setExpirationDate("");
      setCompany("");
      setLeader(0);
      setMaxResponses(1);
      setUnlimitedResponses(false);
    } catch (error) {
      console.error("Error creating new instance:", error);
    }
  };

  const handleCompanyChange = async (event) => {
    const newCompanyId = event.target.value;
    console.log(event.target);
    console.log(newCompanyId);
    try {
      const response = await axios.get(
        `https://psicologia-aplicada.com/quizz/psicologia-api/api/getLideres.php?plant=${newCompanyId}`
      );
      console.log("data", response);
      setLeaders(response.data);
    } catch (error) {
      console.error("Error fetching leaders:", error);
    }
    setCompany(event.target.value);
    setLeader(0);
    setCompanyError(false);
  };

  // Uso de html2canvas para capturar y descargar el QR code como imagen
  const handleDownloadQR = async (qrCodeRef, link) => {
    if (qrCodeRef) {
      try {
        const canvas = await html2canvas(qrCodeRef);
        const linkElement = document.createElement("a");
        linkElement.href = canvas.toDataURL("image/png");
        linkElement.download = `${link}.png`;
        linkElement.click();
      } catch (error) {
        console.error("Error generating QR code image:", error);
      }
    } else {
      console.error("QR code ref is undefined.");
    }
  };

  // Ref para el componente QRCode
  const qrRefs = useRef({});

  // Función para guardar el ref de QRCode
  const setQRCodeRef = (id) => (element) => {
    if (element) {
      qrRefs.current[id] = element;
    }
  };

  const isSaveDisabled = !company || !expirationDate;
  const selectedSurveyId = selectedSurvey ? selectedSurvey.id : null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {selectedSurvey ? selectedSurvey.title : "Gestión de Encuestas"}
      </DialogTitle>
      <DialogContent>
        {selectedSurveyId ? (
          <>
            <h2>Instancias de Visibilidad Existentes:</h2>
            <List>
              {visibilityInstances.length > 0 &&
                visibilityInstances.map((instance) => {
                  const currentDate = new Date();
                  const expirationDate = new Date(instance.Expiracion);
                  const isExpired = expirationDate < currentDate;
                  if (isExpired) return;
                  return (
                    <ListItem key={instance.id} divider>
                      <ListItemText
                        primary={`Empresa: ${
                          instance.Empresa
                        } - Fecha de Expiración: ${transformDate(
                          instance.Expiracion
                        )}`}
                        secondary={`Respuestas: ${
                          instance.Total
                        } - Máx. Respuestas: ${
                          instance.Limite === 1000000
                            ? "Ilimitadas"
                            : instance.Limite
                        }`}
                      />
                      <div ref={setQRCodeRef(instance.id)}>
                        <QRCode
                          value={`https://psicologia-aplicada.com/encuestas/?q=${encryptId(
                            instance.id
                          )}`}
                          size={50}
                        />
                      </div>
                      <IconButton
                        onClick={() =>
                          handleDownloadQR(
                            qrRefs.current[instance.id],
                            `https://psicologia-aplicada.com/encuestas/?q=${encryptId(
                              instance.id
                            )}`
                          )
                        }
                        style={{ marginLeft: "10px" }}
                      >
                        <GetAppIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        onClick={() =>
                          window.open(
                            `https://psicologia-aplicada.com/encuestas/?q=${encryptId(
                              instance.id
                            )}`,
                            "_blank"
                          )
                        }
                        style={{ marginLeft: "10px" }}
                      >
                        Ver Link
                      </Button>
                    </ListItem>
                  );
                })}
            </List>
            <Divider style={{ margin: "20px 0" }} />
            <h3>Crear Nueva Instancia de Visibilidad:</h3>
            <form noValidate autoComplete="off">
              <TextField
                label="Fecha de Expiración"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl fullWidth margin="normal" error={companyError}>
                <InputLabel>Empresa</InputLabel>
                <Select
                  value={company}
                  label="Empresa"
                  onChange={handleCompanyChange}
                >
                  {companies.map((company) => (
                    <MenuItem key={company.IdPlanta} value={company.IdPlanta}>
                      {company.Planta}
                    </MenuItem>
                  ))}
                </Select>
                {companyError && (
                  <FormHelperText>
                    La empresa no puede estar vacía
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Líder</InputLabel>
                <Select
                  value={leader}
                  label="Líder"
                  onChange={(e) => setLeader(e.target.value)}
                  disabled={!company}
                >
                  <MenuItem value="0">
                    <span>-- CUALQUIERA</span>
                  </MenuItem>
                  {leaders.map((leader) => (
                    <MenuItem key={leader.idLider} value={leader.idLider}>
                      {leader.Nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Número Máximo de Respuestas"
                type="number"
                value={maxResponses}
                onChange={(e) => setMaxResponses(e.target.value)}
                fullWidth
                margin="normal"
                disabled={unlimitedResponses}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={unlimitedResponses}
                    onChange={(e) => setUnlimitedResponses(e.target.checked)}
                  />
                }
                label="Respuestas Ilimitadas"
              />
            </form>
          </>
        ) : (
          <>
            {/* Aquí se puede colocar el código para crear una nueva encuesta */}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        {selectedSurveyId ? (
          <Button
            variant="contained"
            onClick={handleSave}
            color="primary"
            disabled={isSaveDisabled}
          >
            Guardar
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default WebModal;
