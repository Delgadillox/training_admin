import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete, Description } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Survey {
  id: number;
  name: string;
  date: Date;
  time: string;
  company: string;
  leader: string;
}

export default function List() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<Survey | null>(null);
  const [filters, setFilters] = useState({
    selectedDate: null as Date | null,
    selectedCompany: "",
    selectedLeader: "",
    selectedTitle: "",
  });

  const generateReport = (survey, filters = null) => {
    const queryParams = new URLSearchParams();

    if (filters) {
      // Agrega filtros a los parámetros de consulta
      queryParams.set(
        "selectedDate",
        filters.selectedDate
          ? filters.selectedDate.toISOString().substr(0, 10)
          : ""
      );
      queryParams.set("selectedCompany", filters.selectedCompany);
      queryParams.set("selectedLeader", filters.selectedLeader);
      queryParams.set("selectedTitle", filters.selectedTitle);
    }

    if (survey) {
      queryParams.set("id", survey.toString());
    }

    navigate(`/admin/reporte?${queryParams.toString()}`);
  };

  useEffect(() => {
    // Simulación de obtención de datos de encuestas
    const fetchSurveys = async () => {
      // Aquí harías la llamada a la API para obtener los datos de las encuestas
      // Por ahora, simularemos datos estáticos
      const initialSurveys: Survey[] = [
        {
          id: 1,
          name: "Encuesta 1",
          date: new Date(),
          time: "08:00",
          company: "Empresa 1",
          leader: "Líder 1",
        },
        {
          id: 2,
          name: "Encuesta 2",
          date: new Date(),
          time: "10:00",
          company: "Empresa 2",
          leader: "Líder 2",
        },
        {
          id: 3,
          name: "Encuesta 3",
          date: new Date(),
          time: "12:00",
          company: "Empresa 3",
          leader: "Líder 3",
        },
      ];
      setSurveys(initialSurveys);
    };

    fetchSurveys();
  }, []);

  const handleDeleteClick = (survey: Survey) => {
    setSurveyToDelete(survey);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Aquí puedes agregar la lógica para eliminar la encuesta
    console.log("Encuesta eliminada:", surveyToDelete);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setSurveyToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof filters;
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filterSurveys = (survey: Survey) => {
    return (
      (!filters.selectedDate ||
        survey.date.toISOString().substr(0, 10) ===
          filters.selectedDate.toISOString().substr(0, 10)) &&
      (!filters.selectedCompany ||
        survey.company === filters.selectedCompany ||
        filters.selectedCompany === "cualquiera") &&
      (!filters.selectedLeader ||
        survey.leader === filters.selectedLeader ||
        filters.selectedLeader === "cualquiera")
    );
  };

  const filteredSurveys = surveys.filter(filterSurveys);
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
              <MenuItem value="Encuesta de Satisfacción">
                Encuesta de Satisfacción
              </MenuItem>
              <MenuItem value="Encuesta de Productividad">
                Encuesta de Productividad
              </MenuItem>
              <MenuItem value="Encuesta de Clima Laboral">
                Encuesta de Clima Laboral
              </MenuItem>
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
              onChange={handleChange}
              name="selectedCompany"
            >
              <MenuItem value="cualquiera">Cualquiera</MenuItem>
              <MenuItem value="empresa1">Empresa 1</MenuItem>
              <MenuItem value="empresa2">Empresa 2</MenuItem>
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
              <MenuItem value="lider1">Líder 1</MenuItem>
              <MenuItem value="lider2">Líder 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary">
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSurveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell>{survey.name}</TableCell>
                    <TableCell>
                      {survey.date.toISOString().substr(0, 10)}
                    </TableCell>
                    <TableCell>{survey.time}</TableCell>
                    <TableCell>
                      {/* <IconButton color="primary" aria-label="Editar">
                        <Edit />
                      </IconButton> */}
                      <IconButton
                        onClick={() => generateReport(survey.id)}
                        aria-label="Generar reporte"
                      >
                        <Description />
                      </IconButton>
                      <IconButton
                        color="error"
                        aria-label="Eliminar"
                        onClick={() => handleDeleteClick(survey)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
