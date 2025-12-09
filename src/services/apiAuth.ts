import { http } from "@/services/http";

export async function fetchNonce(address: string) {
  const { data } = await http.get(`/auth/nonce?address=${address}`);
  return data;
}

export async function verifySiwe(message: string, signature: string) {
  const { data } = await http.post(`/auth/verify`, {
    message,
    signature,
  });
  return data;
}
