import React, { useState } from "react";
import { useMutationTodoAdded } from "../hooks/useTodos";
import { TextField } from "@mui/material";

const NewTodo = (): JSX.Element => {
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
      variant={"filled"}
      inputProps={{ "aria-label": "input-todo" }}
      fullWidth={true}
      margin={"dense"}
      placeholder={"やること"}
      helperText={"やることを入力してEnterを押してください"}
      value={textValue}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      onCompositionStart={() => setTypingText(true)}
      onCompositionEnd={() => setTypingText(false)}
    />
  );
};

export default NewTodo;
