import React, { useState } from "react";
import { Tabs, Tab, Box, useMediaQuery, useTheme } from "@mui/material";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PolarAreaChart from "./PolarAreaChart";
import RadarChart from "./RadarChart";
import DoughnutChart from "./DoughnutChart";
import StackedBarChart from "./StackedBarChart";
import PieChart from "./PieChart";

const SurveyTabs = ({ questions, responses }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "fullWidth"}
        scrollButtons={isMobile ? "auto" : "off"}
        centered={!isMobile}
        allowScrollButtonsMobile
      >
        <Tab label="Gráfico de Barras" />
        <Tab label="Gráfico de Líneas" />
        <Tab label="Gráfico de Área Polar" />
        <Tab label="Gráfico de Radar" />
        <Tab label="Gráfico de Donut" />
        <Tab label="Gráfico de Barras Apiladas" />
        <Tab label="Gráfico de Pastel" />
      </Tabs>
      <Box sx={{ padding: 3 }}>
        {tabIndex === 0 && (
          <BarChart questions={questions} responses={responses} />
        )}
        {tabIndex === 1 && (
          <LineChart questions={questions} responses={responses} />
        )}
        {tabIndex === 2 && (
          <PolarAreaChart questions={questions} responses={responses} />
        )}
        {tabIndex === 3 && (
          <RadarChart questions={questions} responses={responses} />
        )}
        {tabIndex === 4 && (
          <DoughnutChart questions={questions} responses={responses} />
        )}
        {tabIndex === 5 && (
          <StackedBarChart questions={questions} responses={responses} />
        )}
        {tabIndex === 6 && (
          <PieChart questions={questions} responses={responses} />
        )}
      </Box>
    </Box>
  );
};

export default SurveyTabs;
