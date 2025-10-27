import React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import Link from "next/link";
import { ButtonDemo } from "@/components/index";
import { ChevronLeft } from "lucide-react";

const page = () => {
  return (
    <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 !pt-[80px]">
      <nav className="absolute top-0 left-0 py-3 w-full">
        <div className="container">
          <Link href="/">
            <ButtonDemo variant="ghostStrong"  text="Back" startIcon={<ChevronLeft />} />
          </Link>
        </div>
      </nav>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default page;
