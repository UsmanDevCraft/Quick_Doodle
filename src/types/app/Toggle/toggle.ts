export type ToggleProps = {
  setToggleMode: (mode: "riddle" | "draw") => void;
  toggleMode: "riddle" | "draw";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
  roomId: string;
};
