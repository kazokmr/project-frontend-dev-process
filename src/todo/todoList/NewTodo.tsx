import React, { ReactElement, useState } from "react";
import { TextField } from "@mui/material";
import { useMutationTodoAdded } from "../hooks/useTodos";

const NewTodo = (): ReactElement => {
  const [textValue, setTextValue] = useState("");
  const [typingText, setTypingText] = useState(false);
  const mutation = useMutationTodoAdded();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTextValue(e.target.value);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !typingText) {
      mutation.mutate({ text: textValue });
      setTextValue("");
    }
  };

  return (
    <TextField
      variant="filled"
      inputProps={{ "aria-label": "input-todo" }}
      fullWidth
      margin="dense"
      placeholder="やること"
      helperText="やることを入力してEnterを押してください"
      value={textValue}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      onCompositionStart={() => setTypingText(true)}
      onCompositionEnd={() => setTypingText(false)}
    />
  );
};

export default NewTodo;
