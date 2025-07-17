"use client";
import { AlertCircle, X } from "lucide-react";
import "./start.css";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

interface StartProps {
  on_close: () => void;
  to_login: (email: string) => void;
  to_register: (email: string) => void;
}

const Start = ({ on_close, to_login, to_register }: StartProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showEmailInvalidAlert, setShowEmailInvalidAlert] = useState(false);
  const [showInternalError, setShowInternalError] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handle_next = async () => {
    if (!isEmailValid) {
      setShowEmailInvalidAlert(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/viewers/${email}`, {
        method: "GET",
      });

      if (!response.ok) {
        to_register(email);
        return;
      }
      to_login(email)
    } catch (error) {
      setShowInternalError(true);
      console.error("Error occured in handle_next: ", error);
    }
  }

  const handle_key_down = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handle_next();
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
  };

  return (
    <Card className="relative w-full sm:w-[550px] py-6">
      <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
        <div className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
          <X onClick={on_close} />
        </div>
        <p>Einloggen oder registrieren</p>
      </div>
      <div className="flex flex-col items-strech mt-[25px] mx-6 mb-[15px]">
        <p className="text-[25px] font-medium mb-5">Willkommen bei Mano</p>

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
          (<button
            className="flex flex items-center justify-center gap-[6px] rounded-lg text-white p-4 mt-4 bg-gray-300 h-[56px]"
          >
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s] -m-"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>

          </button>)

          : (<button
            className="flex items-center justify-center rounded-lg text-white p-4 mt-4 WeiterButton"
            onClick={handle_next}
          >
            Weiter
          </button>)
        }

        {/*
        <div className="LoginLineBreak">
          <div className="Line" />
          <p> oder </p>

          <div className="Line" />
        </div>

        <button className="LoginButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
            className="GoogleIcon"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Weiter mit Google
        </button>
          */}
      </div>
    </Card>
  );
};

export default Start;
