// src/components/GroupModal.jsx
import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";

const GroupModal = ({
  groups,
  setGroups,
  open,
  handleClose,
  questions,
  handleGroupCreation,
}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);

  const addGroup = () => {
    if (groupName.trim() !== "" && selectedQuestions.length > 0) {
      setGroups([...groups, { name: groupName, questions: selectedQuestions }]);
      setGroupName("");
      setSelectedQuestions([]);
    }
  };

  const handleQuestionToggle = (question) => {
    setSelectedQuestions((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  const toggleGroup = (index) => {
    setExpandedGroups((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDeleteGroup = (index) => {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateGroups = (option) => {
    handleGroupCreation(option, groups);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={styles.modalContent}>
        <Typography variant="h4" component="h2">
          Crear Grupos
        </Typography>
        <TextField
          label="Nombre del Grupo"
          variant="outlined"
          fullWidth
          margin="normal"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <Typography variant="h6">Preguntas</Typography>
        <List sx={styles.questionList}>
          {questions.map((question, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleQuestionToggle(question)}
            >
              <ListItemText primary={question} />
              <Checkbox checked={selectedQuestions.includes(question)} />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={addGroup}
          style={styles.addButton}
        >
          <AddIcon /> Agregar Grupo
        </Button>
        <Typography variant="h6" sx={styles.groupsTitle}>
          Grupos Creados
        </Typography>
        <List sx={styles.groupsList}>
          {groups.map((group, index) => (
            <Box key={index} sx={styles.groupBox}>
              <ListItem button onClick={() => toggleGroup(index)}>
                <ListItemText primary={group.name} />
                {expandedGroups.includes(index) ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Collapse
                in={expandedGroups.includes(index)}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {group.questions.map((question, qIndex) => (
                    <ListItem key={qIndex} sx={styles.nested}>
                      <ListItemText primary={question} />
                    </ListItem>
                  ))}
                </List>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteGroup(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </Collapse>
            </Box>
          ))}
        </List>
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCreateGroups(1)}
            style={styles.button}
          >
            Ver Detalle
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleCreateGroups(2)}
            style={styles.button}
          >
            Ver Resumen
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const styles = {
  modalContent: {
    position: "absolute",
    top: "5%",
    left: "5%",
    right: "5%",
    bottom: "5%",
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "auto",
  },
  questionList: {
    width: "100%",
    height: "300px", // Fijar la altura de la lista de preguntas
    overflowY: "auto",
    marginBottom: "20px",
  },
  addButton: {
    marginTop: "20px",
    width: "100%",
  },
  saveButton: {
    marginTop: "10px",
    width: "100%",
  },
  groupsTitle: {
    marginTop: "30px",
  },
  groupsList: {
    width: "100%",
    flexGrow: 1, // Permitir que la lista de grupos crezca
    overflowY: "auto",
  },
  groupBox: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  nested: {
    paddingLeft: "30px",
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    marginTop: "10px",
  },
  button: {
    flex: 1,
    margin: "0 5px",
  },
};

export default GroupModal;
