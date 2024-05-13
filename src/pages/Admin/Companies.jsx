import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import AdminTable from "../../components/Admin/AdminTable";

function CompanyForm() {
  const [companyName, setCompanyName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [openDialogCompany, setOpenDialogCompany] = useState(false);
  const [openDialogLeader, setOpenDialogLeader] = useState(false);
  const [dataTable, setDataTable] = useState([]);

  const getCompanies = async () => {
    const response = await axios.get(
      "https://psicologia-aplicada.com/quizz/psicologia-api/api/getPlants.php"
    );
    const results = response.data;
    return results;
  };

  const getLideres = async () => {
    const response = await axios.get(
      "https://psicologia-aplicada.com/quizz/psicologia-api/api/getAllLideres.php"
    );
    const results = response.data;
    return results;
  };

  useEffect(() => {
    const loadState = async () => {
      const [companiesResults, lideresResults] = await Promise.all([
        getCompanies(),
        getLideres(),
      ]);
      setCompanies(companiesResults);
      const companies = companiesResults.map((company) => ({
        id: parseInt(company.IdPlanta),
        empresa: company.Planta,
        lideres: [],
      }));

      const lideres = lideresResults.map((lider) => ({
        id: lider.idLider,
        nombre: lider.Nombre,
        idPlanta: parseInt(lider.idPlanta),
      }));

      const combinedResults = companies.map((company) => ({
        ...company,
        lideres: lideres.filter((lider) => lider.idPlanta === company.id),
      }));

      setDataTable(combinedResults);
    };

    loadState();
  }, []);

  const handleAddCompany = async () => {
    const call = await axios.post(
      "https://psicologia-aplicada.com/quizz/psicologia-api/api/savePlant.php",
      {
        plant: companyName,
      }
    );

    console.log("company", call);
    if (call.data && !call.data.error) {
      window.alert(call.data.errorMsg);
    } else if (call.data && call.data.error) {
      window.alert(call.data.errorMsg);
    } else {
      window.alert("Ha ocurrido un error, por favor contacta al administrador");
    }

    const results = await getCompanies();
    setCompanies(results);
    setCompanyName("");
    setOpenDialogCompany(false);
  };

  const handleAddLeader = async () => {
    const call = await axios.post(
      "https://psicologia-aplicada.com/quizz/psicologia-api/api/saveLeader.php",
      {
        plant: selectedCompany,
        leader: leaderName,
      }
    );

    console.log("leader", call);
    if (call.data && !call.data.error) {
      window.alert(call.data.errorMsg);
    } else if (call.data && call.data.error) {
      window.alert(call.data.errorMsg);
    } else {
      window.alert("Ha ocurrido un error, por favor contacta al administrador");
    }

    setLeaderName("");
    setSelectedCompany("");
    setOpenDialogLeader(false);
  };

  const handleOpenDialogCompany = () => {
    setOpenDialogCompany(true);
  };

  const handleOpenDialogLeader = () => {
    setOpenDialogLeader(true);
  };

  const handleEditEmpresa = (id, newName) => {
    const updatedEmpresas = dataTable.map((empresa) => {
      if (empresa.id === id) {
        return { ...empresa, empresa: newName };
      }
      return empresa;
    });
    setDataTable(updatedEmpresas);
  };

  const handleDeleteEmpresa = (id) => {
    const updatedEmpresas = dataTable.filter((empresa) => empresa.id !== id);
    setDataTable(updatedEmpresas);
  };

  const handleEditLider = (liderId, nuevoNombre) => {
    const empresasActualizadas = dataTable.map((empresa) => {
      const lideresActualizados = dataTable.lideres.map((lider) => {
        if (lider.id === liderId) {
          return { ...lider, nombre: nuevoNombre };
        }
        return lider;
      });

      return { ...empresa, lideres: lideresActualizados };
    });

    setDataTable(empresasActualizadas);
  };

  const handleDeleteLider = (liderId) => {
    const empresasActualizadas = dataTable.map((empresa) => {
      const lideresActualizados = empresa.lideres.filter(
        (lider) => lider.id !== liderId
      );

      return { ...empresa, lideres: lideresActualizados };
    });

    setDataTable(empresasActualizadas);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Gestión de Empresas y Líderes
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre de la empresa"
            variant="outlined"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={handleOpenDialogCompany}
            variant="contained"
            color="primary"
            fullWidth
          >
            Agregar Empresa
          </Button>
          <Dialog
            open={openDialogCompany}
            onClose={() => setOpenDialogCompany(false)}
          >
            <DialogTitle>{"Agregar Empresa"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que quieres agregar esta empresa?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDialogCompany(false)}
                color="primary"
              >
                Cancelar
              </Button>
              <Button onClick={handleAddCompany} color="primary" autoFocus>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre del líder"
            variant="outlined"
            value={leaderName}
            onChange={(e) => setLeaderName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Selecciona una empresa</InputLabel>
            <Select
              value={selectedCompany}
              label="Selecciona una empresa"
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companies.map((company) => (
                <MenuItem key={company.IdPlanta} value={company.IdPlanta}>
                  {company.Planta}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={handleOpenDialogLeader}
            variant="contained"
            color="primary"
            fullWidth
          >
            Agregar Líder
          </Button>
          <Dialog
            open={openDialogLeader}
            onClose={() => setOpenDialogLeader(false)}
          >
            <DialogTitle>{"Agregar Líder"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que quieres agregar este líder a la empresa
                seleccionada?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDialogLeader(false)}
                color="primary"
              >
                Cancelar
              </Button>
              <Button onClick={handleAddLeader} color="primary" autoFocus>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AdminTable
            empresas={dataTable}
            handleEditEmpresa={handleEditEmpresa}
            handleDeleteEmpresa={handleDeleteEmpresa}
            handleEditLider={handleEditLider}
            handleDeleteLider={handleDeleteLider}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default CompanyForm;
