import axios from "axios";
import { LoginResponse, SignUpResponse } from "../types/auth";

export function signIn(email: string, password: string) {
  return axios.post<LoginResponse>("/api/auth/login", { email, password });
}

export function signUp({
  email,
  password,
  username,
}: {
  username: string;
  email: string;
  password: string;
}) {
  return axios.post<SignUpResponse>("/api/auth/signup", {
    username,
    email,
    password,
  });
}
