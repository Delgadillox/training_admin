import { Divider, Grid, TextField, Button, IconButton } from "@mui/material";
import { Remove } from "@mui/icons-material";
import React from "react";

const Form = ({
  questions,
  handleQuestionChange,
  handleRemoveQuestion,
  handleOptionChange,
  handleRemoveOption,
  handleAddOption,
}) => {
  return (
    <>
      {questions.map((question, index) => (
        <React.Fragment key={question.id}>
          <Grid item container spacing={2} xs={12}>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                label={`Pregunta ${index + 1}`}
                variant="outlined"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(question.id, e.target.value)
                }
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={() => handleRemoveQuestion(index)}
                disabled={questions.length === 1}
                className="deleteBtn"
              >
                <Remove />
              </IconButton>
            </Grid>
          </Grid>
          {question.options.map((option, optionIndex) => (
            <Grid
              item
              container
              spacing={2}
              xs={12}
              key={`${index}-${optionIndex}`}
            >
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label={`Opción ${optionIndex + 1}`}
                  variant="outlined"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(question.id, optionIndex, e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={2} alignItems="center" justifyContent="center">
                <IconButton
                  onClick={() => handleRemoveOption(question.id, optionIndex)}
                  disabled={question.options.length === 1}
                  className="deleteBtn"
                >
                  <Remove />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleAddOption(question.id)}
            >
              Agregar Opción
            </Button>
          </Grid>
        </React.Fragment>
      ))}
    </>
  );
};
export default Form;
