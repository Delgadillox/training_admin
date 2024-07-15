import React, { useEffect, useState } from "react";
import { Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PollIcon from "@mui/icons-material/Poll";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/Assessment";
import Logo from "../assets/logo.jpg";

function Home() {
  const navigate = useNavigate();
  const [surveyCount, setSurveyCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [leaderCount, setLeaderCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const surveyResponse = await axios.get(
        "https://psicologia-aplicada.com/quizz/psicologia-api/quizz/getAll.php"
      );
      const companyResponse = await axios.get(
        "https://psicologia-aplicada.com/quizz/psicologia-api/api/getPlants.php"
      );
      const leaderResponse = await axios.get(
        "https://psicologia-aplicada.com/quizz/psicologia-api/api/getAllLideres.php"
      );

      setSurveyCount(surveyResponse.data.length);
      setCompanyCount(companyResponse.data.length);
      setLeaderCount(leaderResponse.data.length);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  return (
    <div style={styles.container}>
      <img src={Logo} alt="Logo" height="100%" width="100%" />
      {/* <Typography variant="h3" component="h1" style={styles.title}>
        Plataforma de Administración de Encuestas
      </Typography> */}
      {/* <Typography variant="h6" component="p" style={styles.description}>
        Esta es la plataforma para gestionar y administrar encuestas y reportes
        de entrenamiento.
      </Typography> */}

      <Grid container spacing={3} style={styles.grid}>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <PollIcon style={styles.icon} />
              <Typography variant="h5" component="h2">
                Gestionar Encuestas
              </Typography>
              <Typography variant="body2" component="p">
                Crea, edita y elimina encuestas.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={styles.button}
                onClick={() => navigate("/encuestas/ver")}
              >
                Ir a Encuestas
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <ReportIcon style={styles.icon} />
              <Typography variant="h5" component="h2">
                Ver Reportes
              </Typography>
              <Typography variant="body2" component="p">
                Genera y visualiza reportes detallados.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={styles.button}
                onClick={() => navigate("/reportes/ver")}
              >
                Ir a Reportes
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <BusinessIcon style={styles.icon} />
              <Typography variant="h5" component="h2">
                Administración
              </Typography>
              <Typography variant="body2" component="p">
                Administra usuarios y configuraciones.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={styles.button}
                onClick={() => navigate("/panel/leaders")}
              >
                Ir a Administración
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <PollIcon style={styles.icon} />
              <Typography variant="h5" component="h2">
                Encuestas
              </Typography>
              <Typography variant="h6">{surveyCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <BusinessIcon style={styles.icon} />
              <Typography variant="h5" component="h2">
                Empresas
              </Typography>
              <Typography variant="h6">{companyCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <PeopleIcon style={styles.icon} />
              <Typography variant="h5" component="h2">
                Líderes
              </Typography>
              <Typography variant="h6">{leaderCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  description: {
    marginBottom: "40px",
    textAlign: "center",
  },
  grid: {
    justifyContent: "center",
  },
  card: {
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardContent: {
    textAlign: "center",
  },
  icon: {
    fontSize: "50px",
    marginBottom: "10px",
  },
  button: {
    marginTop: "20px",
  },
};

export default Home;
