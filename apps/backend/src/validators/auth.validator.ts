/* eslint-disable prettier/prettier */
import * as JOI from 'joi';
export const SignUp = JOI.object({
  email: JOI.string().email().required(),
  password: JOI.string().required(),
  username: JOI.string().alphanum().required(),
});

export const Login = JOI.object({
  email: JOI.string().email().required(),
  password: JOI.string().required(),
});
