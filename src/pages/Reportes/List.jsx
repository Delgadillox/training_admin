import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SurveyTable from "../../components/Reportes/SurveyTable";

export default function List() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [filters, setFilters] = useState({
    selectedDate: null,
    selectedCompany: "",
    selectedLeader: "",
    selectedTitle: "",
  });

  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const generateReport = (survey, params = null) => {
    const queryParams = new URLSearchParams();
    queryParams.set("selectedTitle", filters.selectedTitle);
    if (params) {
      // Agrega filtros a los parámetros de consulta
      if (filters.selectedDate) {
        queryParams.set(
          "selectedDate",
          filters.selectedDate.toISOString().substr(0, 10)
        );
      }
      if (filters.selectedCompany) {
        queryParams.set("selectedCompany", filters.selectedCompany);
      }
      if (filters.selectedLeader) {
        queryParams.set("selectedLeader", filters.selectedLeader);
      }
    }

    if (survey) {
      queryParams.set("id", survey.toString());
    }

    //navigate(`/admin/reporte?${queryParams.toString()}`);
    window.open(`/admin/reporte?${queryParams.toString()}`, "_blank");
  };

  const generateDynamicReport = (surveyIds) => {
    const queryParams = new URLSearchParams();
    queryParams.set("selectedTitle", filters.selectedTitle);
    queryParams.set("id", surveyIds.toString());

    window.open(`/admin/reporteDinamico?${queryParams.toString()}`, "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      const endpoints = [
        "https://psicologia-aplicada.com/quizz/psicologia-api/quizz/getAll.php",
        "https://psicologia-aplicada.com/quizz/psicologia-api/api/getPlants.php",
      ];
      const responses = await Promise.all(
        endpoints.map((url) => axios.get(url))
      );
      const results = await Promise.all(
        responses.map((res) => {
          return res.data;
        })
      );

      const [quizzes, companies] = results;
      setQuizzes(quizzes);
      setCompanies(companies);
    };
    fetchData();
  }, []);

  const handleSearchBtn = async () => {
    if (filters.selectedTitle) {
      let url = `https://psicologia-aplicada.com/quizz/psicologia-api/reports/getReports.php?quizz=${filters.selectedTitle}`;

      if (filters.selectedDate) {
        url += `&date=${filters.selectedDate.toISOString().substr(0, 10)}`;
      }
      if (filters.selectedCompany && filters.selectedCompany !== "cualquiera") {
        url += `&company=${filters.selectedCompany}`;
      }
      if (filters.selectedLeader && filters.selectedLeader !== "cualquiera") {
        url += `&leader=${filters.selectedLeader}`;
      }

      const response = await axios.get(url);
      console.log(response);
      setSurveys(response.data);
    } else {
      window.alert("Debes seleccionar al menos un cuestionario");
    }
  };

  const handleDeleteClick = (id) => {
    setSurveyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (quizz, report) => {
    navigate(`/reportes/generar?quizz=${quizz}&id=${report}`);
  };

  const handleDeleteConfirm = async () => {
    console.log("Encuesta eliminada:", surveyToDelete);
    const response = await axios.post(
      "https://psicologia-aplicada.com/quizz/psicologia-api/reports/deleteReport.php",
      {
        id: surveyToDelete,
      }
    );
    const filteredSurveys = surveys.filter(
      (survey) => survey.idResultados !== surveyToDelete
    );
    setSurveys(filteredSurveys);
    setSurveyToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setSurveyToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = async (event) => {
    const newCompanyId = event.target.value;

    try {
      const response = await axios.get(
        `https://psicologia-aplicada.com/quizz/psicologia-api/api/getLideres.php?plant=${newCompanyId}`
      );
      setLeaders(response.data);
    } catch (error) {
      console.error("Error fetching leaders:", error);
    }

    setFilters({
      ...filters,
      selectedCompany: newCompanyId,
      selectedLeader: "cualquiera",
    });
  };

  const handleSelectSurvey = (id) => {
    setSelectedSurveys((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAllSurveys = (event) => {
    if (event.target.checked) {
      const newSelectedSurveys = surveys.map((survey) => survey.idResultados);
      setSelectedSurveys(newSelectedSurveys);
    } else {
      setSelectedSurveys([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="title-label">Cuestionario</InputLabel>
            <Select
              labelId="title-label"
              label="cuestionario"
              id="title-select"
              name="selectedTitle"
              value={filters.selectedTitle}
              onChange={handleChange}
            >
              {quizzes.length > 0 &&
                quizzes.map((quizz) => (
                  <MenuItem key={quizz.id} value={quizz.id}>
                    {quizz.titulo}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            id="date"
            label="Fecha"
            type="date"
            name="selectedDate"
            value={
              filters.selectedDate
                ? filters.selectedDate.toISOString().substr(0, 10)
                : ""
            }
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                selectedDate: e.target.value ? new Date(e.target.value) : null,
              }))
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="company-label">Empresa</InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={filters.selectedCompany}
              label="empresa"
              onChange={handleCompanyChange}
              name="selectedCompany"
            >
              <MenuItem value="cualquiera">Cualquiera</MenuItem>
              {companies.length > 0 &&
                companies.map((company) => (
                  <MenuItem key={company.IdPlanta} value={company.IdPlanta}>
                    {company.Planta}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="leader-label">Líder</InputLabel>
            <Select
              labelId="leader-label"
              id="leader"
              label="lider"
              name="selectedLeader"
              value={filters.selectedLeader}
              onChange={handleChange}
            >
              <MenuItem value="cualquiera">Cualquiera</MenuItem>
              {leaders.length > 0 &&
                leaders.map((leader) => (
                  <MenuItem key={leader.idLider} value={leader.idLider}>
                    {leader.Nombre}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSearchBtn}>
            Buscar
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => generateReport(null, filters)}
          >
            Generar Reporte General
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <SurveyTable
            surveys={surveys}
            selectedSurveys={selectedSurveys}
            handleSelectSurvey={handleSelectSurvey}
            handleSelectAllSurveys={handleSelectAllSurveys}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            generateReport={generateReport}
            generateDynamicReport={generateDynamicReport}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres eliminar esta encuesta?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
