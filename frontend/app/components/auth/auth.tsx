"use client";

import { useState } from "react";
import Start from "./start/start";
import Login from "./login";
import Register from "./register";
import ForgotPassword from "./forgot_password";

interface AuthProps {
  on_close: () => void;
}

enum AuthState {
  Start, Login, Register, ForgotPassword, ResetPassword
}

const Auth = ({ on_close }: AuthProps) => {
  const [state, setState] = useState<AuthState>(AuthState.Start);
  const [email, setEmail] = useState<string>("");


  const to_start = () => {
    setState(AuthState.Start);
  }

  const to_login = (email: string) => {
    setEmail(email);
    setState(AuthState.Login);
  }

  const back_to_login = () => {
    setState(AuthState.Login);
  }

  const to_register = (email: string) => {
    setEmail(email)
    setState(AuthState.Register);
  }

  const to_forgot_password = () => {
    setState(AuthState.ForgotPassword);
  }

  return (
    <>
      {state === AuthState.Start ? (
        <Start on_close={on_close} to_login={to_login} to_register={to_register} />
      ) : state === AuthState.Login ? (
        <Login to_start={to_start} to_forgot_password={to_forgot_password} on_close={on_close} email={email} />
      ) : state === AuthState.Register ? (
        <Register to_start={to_start} on_close={on_close} email={email} />
      ) : state === AuthState.ForgotPassword ? (
        <ForgotPassword back_to_login={back_to_login} on_close={on_close} />
      ) : null}
    </>
  );
};

export default Auth;
