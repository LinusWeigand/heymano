"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./header";

function VerificationHandler() {
  const searchParams = useSearchParams();
  const verification_code = decodeURIComponent(searchParams.get("vc") || "");
  const email = decodeURIComponent(searchParams.get("e") || "");

  return <Header verification_code={verification_code} email={email} />;
}

export default function WrappedHeader() {
  return (
    <Suspense fallback={<div></div>}>
      <VerificationHandler />
    </Suspense>
  );
}
