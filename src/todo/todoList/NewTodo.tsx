import React, { useState } from "react";

const NewTodo = ({ createTodo }: { createTodo: (text: string) => void }) => {
  const [textValue, setTextValue] = useState("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTodo(textValue);
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
    />
  );
};

export default NewTodo;
