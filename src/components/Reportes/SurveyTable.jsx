import React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Checkbox,
  TablePagination,
  Button,
} from "@mui/material";
import { Edit, Delete, Description } from "@mui/icons-material";

const SurveyTable = ({
  surveys,
  selectedSurveys,
  handleSelectSurvey,
  handleSelectAllSurveys,
  handleEditClick,
  handleDeleteClick,
  generateReport,
  generateDynamicReport,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedSurveys.length > 0 &&
                    selectedSurveys.length < surveys.length
                  }
                  checked={
                    surveys.length > 0 &&
                    selectedSurveys.length === surveys.length
                  }
                  onChange={handleSelectAllSurveys}
                />
              </TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Líder</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {surveys
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((survey) => (
                <TableRow
                  key={survey.idResultados}
                  selected={selectedSurveys.indexOf(survey.idResultados) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selectedSurveys.indexOf(survey.idResultados) !== -1
                      }
                      onChange={() => handleSelectSurvey(survey.idResultados)}
                    />
                  </TableCell>
                  <TableCell>{survey.company}</TableCell>
                  <TableCell>{survey.nombre}</TableCell>
                  <TableCell>{survey.date}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      aria-label="Editar"
                      onClick={() =>
                        handleEditClick(survey.idEncuesta, survey.idResultados)
                      }
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => generateReport(survey.idResultados)}
                      aria-label="Generar reporte"
                    >
                      <Description />
                    </IconButton>
                    <IconButton
                      color="error"
                      aria-label="Eliminar"
                      onClick={() => handleDeleteClick(survey.idResultados)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={surveys.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {selectedSurveys.length > 1 ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => generateDynamicReport(selectedSurveys)}
        >
          Generar Reporte Dinámico
        </Button>
      ) : (
        ""
      )}
    </Paper>
  );
};

export default SurveyTable;
