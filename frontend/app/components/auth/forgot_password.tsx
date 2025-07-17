"use client";

import { AlertCircle, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { useBanner } from "@/context/BannerContext";
import { BannerType } from "@/types/BannerType";

interface LoginProps {
  back_to_login: () => void;
  on_close: () => void;
}

export default function ForgotPassword({ back_to_login, on_close }: LoginProps) {
  const [email, setEmail] = useState("");
  const [show_email_not_found_alert, set_show_email_not_found_alert] = useState(false);
  const { setBanner, setBannerEmail } = useBanner();

  const [showInternalError, setShowInternalError] = useState(false);
  const [showEmailInvalidAlert, setShowEmailInvalidAlert] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handle_send_reset_link = async () => {
    if (!isEmailValid) {
      setShowEmailInvalidAlert(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/pre-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        set_show_email_not_found_alert(true);
        setLoading(false);
        return;
      }
      on_close();
      setBanner(BannerType.ResetPassword);
      setBannerEmail(email);
    } catch (error) {
      setShowInternalError(true);
      console.error("Error occured in handle_send_reset_link: ", error);
    }
  };

  const handle_key_down = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handle_send_reset_link();
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handle_email_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
    setShowEmailInvalidAlert(false);
    setShowInternalError(false);
    set_show_email_not_found_alert(false);
  };

  return (
    <Card className="relative w-full sm:w-[550px] py-6">
      <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
        <div onClick={back_to_login} className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
          <ChevronLeft />
        </div>
        <p>Password vergessen?</p>
      </div>
      <div className="flex flex-col items-stretch mt-[25px] mx-6 mb-[15px]">
        <p className="mb-4">Gib die E-Mail Addresse ein, welche mit deinem Konto verbunden ist und wir schicken dir eine E-Mail um dein Passwort zurückzusetzen. </p>



        <label
          htmlFor="UserEmail"
          className={`relative block overflow-hidden rounded-lg border 
                    border-gray-400 px-3 pt-8 peer-placeholder-shown:border-black
                    ${email !== "" && !isEmailValid
              ? " focus-within:ring-1 focus-within:ring-red-600 focus-within:border-red-600"
              : " focus-within:ring-1 focus-within:ring-gray-600 focus-within:border-gray-600"
            }
                    `}
        >
          <input
            ref={emailInputRef}
            type="email"
            id="UserEmail"
            placeholder="E-Mail"
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent text-lg focus:border-transparent focus:outline-none focus:ring-0"
            onChange={(e) => handle_email_change(e)}
            onKeyDown={handle_key_down}

          />

          <span className={`absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black 
                    ${email !== "" && !isEmailValid ? "text-red-600" : "text-gray-600"} `}>
            E-Mail
          </span>
        </label>
        {show_email_not_found_alert && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start">
            <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Lass uns das nochmal versuchen</h4>
              <p className="text-gray-600">Es existiert kein Konto für die angeforderte E-Mail-Adresse</p>
            </div>
          </div>
        )}
        {showEmailInvalidAlert && (
          <div className="bg-white rounded-lg p-4 flex items-start">
            <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-red-600">E-Mail nicht gültig.</p>
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
        {loading ?
          <button
            className="flex items-center justify-center rounded-lg text-white p-4 mt-4 bg-gray-300 gap-[6px] h-[56px]"
          >
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s] -m-"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
          </button>
          :
          <button
            className="flex items-center justify-center rounded-lg text-white p-4 mt-4 bg-darkButton-light hover:bg-darkButton-dark"
            onClick={handle_send_reset_link}
          >
            Zurücksetzungslink schicken
          </button>
        }
      </div>
    </Card>
  );
}
