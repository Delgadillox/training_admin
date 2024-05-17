// src/components/ColorModal.jsx
import React from "react";
import { Modal, Button, TextField, Box } from "@mui/material";

const ColorModal = ({ open, handleClose, colors, handleColorChange }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={styles.modalContent}>
        <h2>Selecciona los colores del gráfico</h2>
        {colors.map((color, index) => (
          <div key={index} style={styles.colorInput}>
            <TextField
              type="color"
              label={`Color ${index + 1}`}
              value={color}
              onChange={(e) => handleColorChange(index, e)}
              fullWidth
            />
          </div>
        ))}
        <Button onClick={handleClose} style={styles.saveButton}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

const styles = {
  modalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  colorInput: {
    margin: "10px 0",
    width: "100%",
  },
  saveButton: {
    marginTop: "20px",
  },
};

export default ColorModal;
