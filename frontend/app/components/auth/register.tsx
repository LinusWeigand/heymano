"use client";

import { AlertCircle, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { useBanner } from "@/context/BannerContext";
import { BannerType } from "@/types/BannerType";

interface RegisterProps {
  to_start: () => void;
  on_close: () => void;
  email: string;
}

export default function Register({ to_start, on_close, email }: RegisterProps) {
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordVerify, setPasswordVerify] = useState("");
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const [showPasswordMissmatchAlert, setShowPasswordMissmatchAlert] = useState(false);
  const [showInternalError, setShowInternalError] = useState(false);
  const [showPasswordLengthError, setShowPasswordLengthError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstNameInputRef.current) {
      firstNameInputRef.current.focus();
    }
  }, []);

  const { setBanner, setBannerEmail } = useBanner();

  const handle_pre_register = async () => {
    if (password !== passwordVerify) {
      return;
    }
    if (password.length < 8) {
      setShowPasswordLengthError(true);
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/pre-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, first_name, last_name, password }),
      });

      if (!response.ok) {
        setShowInternalError(true);
        setIsLoading(false);
        throw new Error("Failed to register");
      }

      setBannerEmail(email);
      setBanner(BannerType.VerifyEmail)

      on_close();
    } catch (error) {
      setShowInternalError(true);
      setIsLoading(false);
      console.error("Error occured in handle_pre_register: ", error);
    }
  }

  const handle_key_down = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handle_pre_register();
    }
  };

  const handle_password_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setShowPasswordMissmatchAlert(value !== passwordVerify);
    setShowPasswordLengthError(false);
    setShowInternalError(false);
  };

  const handle_password_verify_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordVerify(value);
    setShowPasswordMissmatchAlert(password !== value);
    setShowPasswordLengthError(false);
    setShowInternalError(false);
  };


  return (
    <Card className="relative w-full sm:w-[550px] py-6">
      <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
        <div onClick={to_start} className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
          <ChevronLeft />
        </div>
        <p>Anmeldung abschließen</p>
      </div>
      <div className="flex flex-col items-stretch mt-[25px] mx-6 mb-[15px]">
        <p className="text-lg font-semibold mb-2">Name</p>
        <div className="flex gap-4 mb-4">
          <label
            htmlFor="FirstName"
            className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 flex-1"
          >
            <input
              ref={firstNameInputRef}
              type="text"
              id="FirstName"
              placeholder="First name"
              className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
              onChange={(e) => set_first_name(e.target.value)}
            />
            <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
              Vorname
            </span>
          </label>
          <label
            htmlFor="LastName"
            className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 flex-1"
          >
            <input
              id="LastName"
              placeholder="Last name"
              className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
              onChange={(e) => set_last_name(e.target.value)}
            />
            <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
              Nachname
            </span>
          </label>
        </div>


        <p className="text-lg font-semibold mb-2">Passwort</p>
        <label
          htmlFor="UserPassword"
          className="relative block overflow-hidden rounded-lg border border-gray-400 pr-[104px] pl-3 pt-8 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 mb-4"
        >
          <input
            type={showPassword ? "text" : "password"}
            id="UserPassword"
            placeholder="Passwort"
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
            onChange={(e) => handle_password_change(e)}
          />
          <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
            Passwort
          </span>
          <div onClick={(e) => { setShowPassword(!showPassword); e.preventDefault() }} className="z-50 hover:cursor-pointer">
            <p className="absolute top-1/3 right-4 text-black text-sm font-medium underline"
              style={{ userSelect: 'none' }}
            >{showPassword ? "Ausblenden" : "Anzeigen"}</p>
          </div>
        </label>
        <label
          htmlFor="UserPasswordVerify"
          className="relative block overflow-hidden rounded-lg border border-gray-400 pr-[104px] pl-3 pt-8 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 mb-4"
        >
          <input
            type={showPasswordVerify ? "text" : "password"}
            id="UserPasswordVerify"
            placeholder="Passwort erneut eingeben"
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
            onChange={(e) => handle_password_verify_change(e)}
            onKeyDown={handle_key_down}
          />
          <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
            Passwort erneut eingeben
          </span>
          <div onClick={(e) => { setShowPasswordVerify(!showPasswordVerify); e.preventDefault() }} className="z-50 hover:cursor-pointer">
            <p className="absolute top-1/3 right-4 text-black text-sm font-medium underline"
              style={{ userSelect: 'none' }}
            >{showPasswordVerify ? "Ausblenden" : "Anzeigen"}</p>
          </div>
        </label>


        {showPasswordMissmatchAlert && (
          <div className="bg-white rounded-lg p-4 flex items-start">
            <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-red-600">Passwörter stimmen nicht überein.</p>
            </div>
          </div>
        )
        }
        {showPasswordLengthError && (
          <div className="bg-white rounded-lg p-4 flex items-start">
            <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-red-600">Passwort muss mindestens 8 Zeichen lang sein.</p>
            </div>
          </div>
        )
        }
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

        <p className="text-sm text-gray-600 my-4">
          Indem ich Zustimmen und weiter wähle, erkläre ich mich mit den Nutzungsbedingungen von Mano einverstanden und erkenne die Datenschutzbestimmungen an.
        </p>


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
            className={`flex items-center justify-center rounded-lg text-white p-4 WeiterButton ${showPasswordMissmatchAlert || first_name === "" || last_name === "" || password === "" || passwordVerify === "" ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            onClick={handle_pre_register}
            disabled={showPasswordMissmatchAlert || first_name === "" || last_name === "" || password === "" || passwordVerify === ""}
          >
            Zustimmen und weiter
          </button>
        }
      </div >
    </Card >
  );
}
