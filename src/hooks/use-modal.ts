import { useState } from "react";

interface State {
  open: boolean;
}

const initialState: State = {
  open: false,
};

interface UseModalHook extends State {
  handleOpen: () => void;
  handleClose: () => void;
}
export const useModal = (): UseModalHook => {
  const [state, setState] = useState<State>(initialState);

  const handleOpen = () => setState((state) => ({ open: true }));
  const handleClose = () => setState((state) => ({ open: false }));

  return { ...state, handleClose, handleOpen };
};
