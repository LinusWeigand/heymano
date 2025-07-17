"use client";

import { AlertCircle, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface LoginProps {
  to_start: () => void;
  to_forgot_password: () => void;
  on_close: () => void;
  email: string;
}

export default function Login({ to_start, to_forgot_password, on_close, email }: LoginProps) {
  const [password, setPassword] = useState("");
  const [show_password_incorrect_alert, set_show_password_incorrect_alert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInternalError, setShowInternalError] = useState(false);
  const { setIsLoggedIn, setAuthEmail, setHasProfile } = useAuth();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        set_show_password_incorrect_alert(true);
        setIsLoading(false);
        return;
      }
      on_close();
      setIsLoading(false);
      setIsLoggedIn(true);

      const data = await response.json();
      if (data.hasProfile) {
        setHasProfile(true)
      } else {
        setHasProfile(false)
      }
      setAuthEmail(email);
    } catch (error) {
      setShowInternalError(true);
      setIsLoading(false);
      console.error("Error occured in handleLogin: ", error);
    }
  };

  const handle_key_down = (e: React.KeyboardEvent) => {
    set_show_password_incorrect_alert(false);
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Card className="relative w-full sm:w-[550px] py-6">
      <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
        <div onClick={to_start} className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
          <ChevronLeft />
        </div>
        <p>Anmelden</p>
      </div>
      <div className="flex flex-col items-stretch mt-[25px] mx-6 mb-[15px]">

        {show_password_incorrect_alert && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start">
            <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Lass uns das nochmal versuchen</h4>
              <p className="text-gray-600">Passwort ist inkorrekt.</p>
            </div>
          </div>
        )}
        <label
          htmlFor="UserPassword"
          className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8  focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 peer-placeholder-shown:border-black"
        >
          <input
            ref={passwordInputRef}
            type="password"
            id="UserPassword"
            placeholder="Passwort"
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handle_key_down}

          />

          <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
            Passwort
          </span>
        </label>
        {showInternalError && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start">
            <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Irgendwas ist schiefgelaufen.</h4>
              <p className="text-gray-600">Versuche es später noch einmal.</p>
            </div>
          </div>
        )}

        {isLoading ?
          <button
            className="flex flex items-center justify-center gap-[6px] rounded-lg text-white p-4 mt-4 bg-gray-300 h-[56px]"
          >
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s] -m-"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
          </button>
          :
          <button
            className="flex items-center justify-center rounded-lg text-white p-4 mt-4 WeiterButton"
            onClick={handleLogin}
          >
            Anmelden
          </button>
        }

        <p className="text-md text-left underline mt-4 text-black hover:underline cursor-pointer" onClick={to_forgot_password}>
          Passwort vergessen?
        </p>
      </div>
    </Card>
  );
}
