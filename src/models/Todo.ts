import { createContext, useContext } from "react";
import {
  types,
  Instance,
  flow,
  toGenerator,
  SnapshotIn,
} from "mobx-state-tree";
import { nanoid } from "nanoid";
import {
  deleteTodoAPI,
  fetchTodosAPI,
  putTodoAPI,
  addTodoAPI,
} from "../api/todos";

const TodoModel = types.model({
  id: types.identifier,
  text: types.string,
  done: false,
});
export interface ITodoData extends SnapshotIn<typeof TodoModel> {}

export const Todo = TodoModel.actions((self) => ({
  toggle: flow(function* toggle() {
    self.done = !self.done;
    try {
      yield* toGenerator(putTodoAPI(self));
    } catch (e) {
      console.error(e);
    }
  }),
}));
export interface ITodo extends Instance<typeof Todo> {}

const TodoStore = types
  .model({
    todos: types.map(Todo),
    state: types.optional(
      types.enumeration("State", ["idle", "loading", "error", "success"]),
      "idle"
    ),
  })
  .actions((self) => ({
    addTodo: flow(function* addTodo(text: string) {
      const id = nanoid();
      // Optimistically create and add a new todo
      const newTodo = Todo.create({ id, text });
      self.todos.put(newTodo);
      try {
        const serverTodo = yield* toGenerator(addTodoAPI(newTodo));
        // After the server created the new todo, exchange the optimistically created one
        // with the server Todo
        self.todos.delete(newTodo.id);
        self.todos.set(serverTodo.id, { ...serverTodo, text });
      } catch (e) {
        console.error(e);
      }
    }),

    removeTodo: flow(function* removeTodo(todoId: string) {
      self.todos.delete(todoId);
      try {
        yield* toGenerator(deleteTodoAPI(todoId));
      } catch (e) {
        console.error(e);
      }
    }),

    fetchTodos: flow(function* fetchTodos() {
      self.state = "loading";
      try {
        const todosArr = yield* toGenerator(fetchTodosAPI());
        todosArr.forEach((todo) => {
          self.todos.put(todo);
        });
        self.state = "success";
      } catch (e) {
        console.error(e);
        self.state = "error";
      }
      return self.todos;
    }),
  }))
  .views((self) => ({
    get todoValues() {
      return [...self.todos.values()];
    },
  }));

export const todoStore = TodoStore.create();
export const TodoStoreContext = createContext(todoStore);
export const useTodoStore = () => useContext(TodoStoreContext);
