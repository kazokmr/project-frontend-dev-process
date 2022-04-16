import React, { useState } from "react";
import { useMutationTodoAdded } from "../hooks/useTodos";

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
    <input
      type="text"
      aria-label={"input-todo"}
      placeholder={"やることを入力してください"}
      value={textValue}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      onCompositionStart={() => setTypingText(true)}
      onCompositionEnd={() => setTypingText(false)}
    />
  );
};

export default NewTodo;
