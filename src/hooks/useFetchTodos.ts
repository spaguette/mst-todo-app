import { useEffect } from "react";
import { useTodoStore, ITodo } from "../models/Todo";

type Modify<T, R> = Omit<T, keyof R> & R;

type DefaultFlags = {
  isLoading: false;
  isError: false;
  isSuccess: false;
};

const defaultFlags: DefaultFlags = {
  isLoading: false,
  isError: false,
  isSuccess: false,
};

type TodosLoadingResult = Modify<DefaultFlags, { isLoading: true }>;
type TodosErrorResult = Modify<DefaultFlags, { isError: true }>;
type TodosSuccessResult = Modify<
  DefaultFlags,
  { data: ITodo[]; isSuccess: true }
>;

type TodosFetchResult =
  | TodosLoadingResult
  | TodosErrorResult
  | TodosSuccessResult;

export const useFetchTodosQuery = (): TodosFetchResult => {
  const store = useTodoStore();

  useEffect(() => {
    if (!store.state) {
      store.fetchTodos();
    }
  }, [store]);

  if (store.state === "loading") {
    return { ...defaultFlags, isLoading: true };
  }

  if (store.state === "error") {
    return { ...defaultFlags, isError: true };
  }

  return { ...defaultFlags, data: store.todoValues, isSuccess: true };
};
