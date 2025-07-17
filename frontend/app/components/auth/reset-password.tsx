"use client";

import { AlertCircle, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useBanner } from "@/context/BannerContext";
import { BannerType } from "@/types/BannerType";

interface ResetPasswordProps {
  on_close?: () => void;
}

export default function ResetPassword({ on_close }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const router = useRouter();
  const { setBanner } = useBanner();

  const searchParams = useSearchParams();
  const reset_password_token = decodeURIComponent(searchParams.get('c') || '');
  const email = decodeURIComponent(searchParams.get('e') || '');
  const [showInternalError, setShowInternalError] = useState(false);
  const [showPasswordLengthError, setShowPasswordLengthError] = useState(false);
  const [showPasswordMissmatchAlert, setShowPasswordMissmatchAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (on_close) {
      on_close();
    }
  }

  const handle_reset_password = async () => {
    if (password !== passwordVerify) {
      return;
    }
    if (password.length < 8) {
      setShowPasswordLengthError(true);
      return;
    }
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, reset_password_token }),
      });

      if (!response.ok) {
        setBanner(BannerType.ResetPasswordExpired);
        router.push('/forgot-password');
        return;
      }

      setBanner(BannerType.PasswordResetted);
      router.push('/');
    } catch (error) {
      console.error("Error occured in handleLogin: ", error);
      setShowInternalError(true);
    }
  };

  const handle_key_down = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handle_reset_password();
    }
  };
  const handle_password_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setShowPasswordMissmatchAlert(value !== passwordVerify);
    setShowInternalError(false);
  };

  const handle_password_verify_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordVerify(value);
    setShowPasswordMissmatchAlert(password !== value);
    setShowInternalError(false);
  };

  useEffect(() => {
    setShowPasswordLengthError(password.length < 8 && password.length > 1 && !showPasswordLengthError);

  }, [showPasswordMissmatchAlert]);

  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex min-w-screen flex-col min-h-screen relative">
      <div className="flex justify-center h-full items-center border-t min-w-screen border-[#ddd] flex-grow">
        <Card className="relative w-full sm:w-[550px] py-6 border-gray-400">
          <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
            <div onClick={handleClose} className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
              <ChevronLeft />
            </div>
            <p>Passwort aktualisieren</p>
          </div>
          <div className="flex flex-col items-stretch mt-[25px] mx-6 mb-[15px]">
            <label
              htmlFor="UserPassword"
              className="relative block overflow-hidden rounded-lg border border-gray-400 pr-[104px] pl-3 pt-8  focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 peer-placeholder-shown:border-black"
            >
              <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                id="UserPassword"
                placeholder="Password"
                className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
                onChange={(e) => handle_password_change(e)}

              />

              <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
                Password
              </span>
              <div onClick={(e) => { setShowPassword(!showPassword); e.preventDefault() }} className="z-50 hover:cursor-pointer">
                <p className="absolute top-1/3 right-4 text-black text-sm font-medium underline"
                  style={{ userSelect: 'none' }}
                >{showPassword ? "Ausblenden" : "Anzeigen"}</p>
              </div>
            </label>
            <label
              htmlFor="UserPasswordVerify"
              className="relative block mt-4 overflow-hidden rounded-lg border border-gray-400 pr-[104px] pl-3 pt-8  focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 peer-placeholder-shown:border-black"
            >
              <input
                type={showPasswordVerify ? "text" : "password"}
                id="UserPasswordVerify"
                placeholder="Password"
                className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
                onChange={(e) => handle_password_verify_change(e)}
                onKeyDown={handle_key_down}

              />

              <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
                Password erneut eingeben
              </span>
              <div onClick={(e) => { setShowPasswordVerify(!showPasswordVerify); e.preventDefault() }} className="z-50 hover:cursor-pointer">
                <p className="absolute top-1/3 right-4 text-black text-sm font-medium underline"
                  style={{ userSelect: 'none' }}
                >{showPasswordVerify ? "Ausblenden" : "Anzeigen"}</p>
              </div>
            </label>
            {(showPasswordMissmatchAlert || showPasswordLengthError) && (
              <div className="bg-white rounded-lg p-4 flex items-start">
                <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-red-600">{showPasswordMissmatchAlert
                    ? "Passwörter stimmen nicht überein."
                    : "Passwort muss mindestens 8 Zeichen lang sein."}</p>
                </div>
              </div>
            )}
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

            <button
              className="flex items-center justify-center rounded-lg text-white p-4 mt-4 bg-darkButton-light hover:bg-darkButton-dark"
              onClick={handle_reset_password}
            >
              Aktualisieren
            </button>
          </div>
        </Card>
      </div>
    </div >
  );
}
