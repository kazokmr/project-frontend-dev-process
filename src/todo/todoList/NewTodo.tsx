import { ChangeEvent, useState } from "react";

const NewTodo = () => {
  const [textValue, setTextValue] = useState("");

  const textOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  return (
    <input
      type="text"
      aria-label={"input-todo"}
      placeholder={"やることを入力してください"}
      value={textValue}
      onChange={textOnChange}
    />
  );
};

export default NewTodo;
