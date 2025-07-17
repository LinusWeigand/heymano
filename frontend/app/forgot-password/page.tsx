"use client";
import { useRouter } from "next/navigation";
import ForgotPassword from "../components/auth/forgot_password";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col  min-h-screen relative">
      <div className="flex justify-center h-full items-center m-w-screen border-t border-[#ddd] flex-grow">
        <ForgotPassword back_to_login={() => router.push("/login")} on_close={() => router.push("/")} />
      </div>
    </div >
  );
}
