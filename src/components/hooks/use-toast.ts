"use client";

import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

let count = 0;
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Utility to generate unique IDs
const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

// Helper to remove a toast after a delay
const addToRemoveQueue = (toastId: string, dispatch: (action: Action) => void) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// Reducer for toast state management
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST":
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId, dispatch);
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id, dispatch));
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || !toastId
            ? { ...t, open: false }
            : t
        ),
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: action.toastId
          ? state.toasts.filter((t) => t.id !== action.toastId)
          : [],
      };

    default:
      return state;
  }
};

// Memory state to hold the current toast state
let memoryState: State = { toasts: [] };
const listeners: Array<(state: State) => void> = [];

// Dispatch function to handle state changes
const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
};

// Toast creation function
const toast = ({ ...props }: Omit<ToasterToast, "id">) => {
  const id = genId();

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
};

// Custom hook to use the toast system
const useToast = () => {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const dismiss = (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId });

  return {
    ...state,
    toast,
    dismiss,
  };
};

export { useToast, toast };
