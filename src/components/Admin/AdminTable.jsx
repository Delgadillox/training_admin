import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";

function Row({
  empresa,
  handleEditEmpresa,
  handleDeleteEmpresa,
  handleEditLider,
  handleDeleteLider,
}) {
  const [open, setOpen] = useState(false);
  const [editEmpresa, setEditEmpresa] = useState(false);
  const [newEmpresaName, setNewEmpresaName] = useState(empresa.empresa);
  const [editLiderId, setEditLiderId] = useState(null);
  const [liderNames, setLiderNames] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [currentIdToDelete, setCurrentIdToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  const handleOpenDeleteDialog = (id, type) => {
    setCurrentIdToDelete(id);
    setDeleteType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const confirmDelete = () => {
    if (deleteType === "empresa") {
      handleDeleteEmpresa(currentIdToDelete);
    } else if (deleteType === "lider") {
      handleDeleteLider(currentIdToDelete);
      setOpen(!open);
    }
    setOpenDialog(false);
  };

  const toggleEditEmpresa = () => {
    if (editEmpresa) {
      handleEditEmpresa(empresa.id, newEmpresaName);
    }
    setEditEmpresa(!editEmpresa);
  };

  const toggleEditLider = (liderId) => {
    if (editLiderId === liderId) {
      handleEditLider(liderId, liderNames[liderId]);
      setEditLiderId(null);
    } else {
      setEditLiderId(liderId);
    }
  };

  const handleLiderNameChange = (liderId, newName) => {
    setLiderNames((prev) => ({ ...prev, [liderId]: newName }));
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {empresa.lideres.length > 0 && (
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {editEmpresa ? (
            <TextField
              value={newEmpresaName}
              onChange={(e) => setNewEmpresaName(e.target.value)}
              size="small"
              fullWidth
            />
          ) : (
            empresa.empresa
          )}
        </TableCell>
        <TableCell>
          <IconButton onClick={toggleEditEmpresa}>
            {editEmpresa ? <SaveIcon color="primary" /> : <EditIcon />}
          </IconButton>
          {empresa.lideres.length === 0 && (
            <IconButton
              onClick={() => handleOpenDeleteDialog(empresa.id, "empresa")}
            >
              <DeleteIcon color="error" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Líderes
              </Typography>
              <Table size="small" aria-label="subtable">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {empresa.lideres.map((lider) => (
                    <TableRow key={lider.id}>
                      <TableCell component="th" scope="row">
                        {editLiderId === lider.id ? (
                          <TextField
                            value={liderNames[lider.id] || lider.nombre}
                            onChange={(e) =>
                              handleLiderNameChange(lider.id, e.target.value)
                            }
                            size="small"
                            fullWidth
                          />
                        ) : (
                          lider.nombre
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => toggleEditLider(lider.id)}>
                          {editLiderId === lider.id ? (
                            <SaveIcon color="primary" />
                          ) : (
                            <EditIcon />
                          )}
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleOpenDeleteDialog(lider.id, "lider")
                          }
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Eliminación"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro que deseas eliminar este dato?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function AdminTable({
  empresas,
  handleEditEmpresa,
  handleDeleteEmpresa,
  handleEditLider,
  handleDeleteLider,
}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Empresa</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {empresas.map((empresa) => (
            <Row
              key={empresa.id}
              empresa={empresa}
              handleEditEmpresa={handleEditEmpresa}
              handleDeleteEmpresa={handleDeleteEmpresa}
              handleEditLider={handleEditLider}
              handleDeleteLider={handleDeleteLider}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
