import React, { FC, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useTodoStore, ITodo } from "../../../models/Todo";
import { TodoList } from "./TodoList";
import { useFetchTodosQuery } from "../../../hooks/useFetchTodos";

const TodoListController: FC = () => {
  const store = useTodoStore();
  const todosQuery = useFetchTodosQuery();

  const onTodoDelete = useCallback(
    (todo: ITodo) => store.removeTodo(todo.id),
    [store]
  );

  if (todosQuery.isLoading) {
    return <div>LOADING...</div>;
  }

  if (todosQuery.isError) {
    return <div>ERROR :(</div>;
  }

  return <TodoList onTodoDelete={onTodoDelete} todoValues={todosQuery.data} />;
};

export default observer(TodoListController);
