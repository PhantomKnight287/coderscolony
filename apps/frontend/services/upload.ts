import axios from "axios";

export function uploadSingleFile(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post<{ path: string }>("/api/upload", formData, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}
