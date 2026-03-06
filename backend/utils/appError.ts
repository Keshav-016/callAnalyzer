export interface AppErrorShape extends Error {
  status?: number;
}

export const createAppError = (message: string, status: number): AppErrorShape => {
  const error = new Error(message) as AppErrorShape;
  error.status = status;
  return error;
};
