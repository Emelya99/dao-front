import { http } from "@/services/http";
import { handleApiError } from "@/services/errorHandler";

export async function fetchNonce(address: string) {
  try {
    const { data } = await http.get(`/auth/nonce?address=${address}`);
    return data;
  } catch (err) {
    handleApiError(err, "Failed to fetch nonce");
  }
}

export async function verifySiwe(message: string, signature: string) {
  try {
    const { data } = await http.post(`/auth/verify`, {
      message,
      signature,
    });
    return data;
  } catch (err) {
    handleApiError(err, "SIWE verification failed");
  }
}
