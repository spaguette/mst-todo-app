import * as yup from "yup";
import type { ITodoData } from "../models/Todo";

const BASE_URL = "https://61ab99db264ec200176d4283.mockapi.io/api/v1/todos";

const TodoSchema = yup.object({
  id: yup.string().required(),
  text: yup.string().required(),
  done: yup.bool().required(),
});

const decodeTodo = async (res: unknown): Promise<ITodoData> => {
  const todoSchema = TodoSchema.required();
  return todoSchema.validate(res);
};

const decodeTodos = async (res: unknown): Promise<ITodoData[]> => {
  const todoSchema = yup.array(TodoSchema).required();
  return todoSchema.validate(res);
};

export const fetchTodosAPI = async (): Promise<ITodoData[]> => {
  const response = await fetch(BASE_URL);
  const res = await response.json();
  return decodeTodos(res);
};

export const putTodoAPI = async (newTodo: ITodoData): Promise<ITodoData> => {
  const response = await fetch(`${BASE_URL}/${newTodo.id}`, {
    method: "PUT",
    body: JSON.stringify(newTodo),
  });
  const res = await response.json();
  return decodeTodo(res);
};

export const deleteTodoAPI = async (todoId: string): Promise<ITodoData> => {
  const response = await fetch(`${BASE_URL}/${todoId}`, { method: "DELETE" });
  const res = await response.json();
  return decodeTodo(res);
};

export const addTodoAPI = async (todo: ITodoData): Promise<ITodoData> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(todo),
  });
  const res = await response.json();
  return decodeTodo(res);
};
