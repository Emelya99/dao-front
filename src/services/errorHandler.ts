import toast from "react-hot-toast";

export function handleApiError(err: any, fallbackMessage = "Something went wrong") {
  const message =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    fallbackMessage;

  toast.error(message);

  throw new Error(message);
}