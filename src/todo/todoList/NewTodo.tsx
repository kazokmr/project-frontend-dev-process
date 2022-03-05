import React, { useState } from "react";

const NewTodo = ({ addTodo }: { addTodo: (text: string) => void }) => {
  const [textValue, setTextValue] = useState("");
  const [typingText, setTypingText] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !typingText) {
      addTodo(textValue);
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
