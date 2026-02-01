import toast from "react-hot-toast";
import { ApiError } from "@/types/web3";

export function handleApiError(err: ApiError | Error | unknown, fallbackMessage = "Something went wrong") {
  const error = err as ApiError | Error
  const message =
    (error as ApiError)?.response?.data?.error ||
    (error as ApiError)?.response?.data?.message ||
    error?.message ||
    fallbackMessage;

  toast.error(message);

  throw new Error(message);
}