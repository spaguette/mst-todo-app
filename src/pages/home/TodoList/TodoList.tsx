import React, { FC } from "react";
import TodoItem from "../../../components/TodoItem";
import type { ITodo } from "../../../models/Todo";

export type TodoListProps = {
  todoValues: ITodo[];
  onTodoDelete: (todo: ITodo) => void;
};

export const TodoList: FC<TodoListProps> = ({ todoValues, onTodoDelete }) => (
  <ul>
    {todoValues.map((todo) => (
      <li key={todo.id}>
        <TodoItem todo={todo} onDelete={onTodoDelete} />
      </li>
    ))}
  </ul>
);
