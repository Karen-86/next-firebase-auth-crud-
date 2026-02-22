"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuthContext } from "@/context/FirebaseAuthContext";
import Link from "next/link";
import { ButtonDemo, InputDemo } from "@/components/index";
import localData from "@/localData";
import useAlert from "@/hooks/useAlert";
import useJoiValidation from "@/hooks/useJoiValidation";
const { googleLogoIcon } = localData.images;

type ValidationResult = {
  error?: {
    details: {
      path: string[];
      message: string;
    }[];
  };
};

const SignInForm = () => {
  const [state, setState] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { successAlert } = useAlert();
  const { handleSignIn, handleSignInWithGoogle } = useFirebaseAuthContext();

  const { validateSignIn } = useJoiValidation();
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [result, setResult] = useState<ValidationResult>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = validateSignIn(state);
    if (!error) {
      handleSignIn({ email: state.email, password: state.password, setIsLoading });
      console.log("Submit");
    }
    if (!error) return;
    setWasSubmitted(true);
  };

  useEffect(() => setResult(validateSignIn(state)), [state]);

  useEffect(() => {
    if (!wasSubmitted) return;
    const errors: Record<string, string> = {};
    result?.error?.details.forEach((item) => {
      if (errors[item.path[0]]) return;
      errors[item.path[0]] = item.message;
    });
    setErrorMessages(errors);
  }, [result, wasSubmitted]);

  useEffect(() => {
    const isSignedOut = sessionStorage.getItem("isSignedOut");
    if (isSignedOut) {
      setTimeout(() => successAlert("You’ve signed out successfully!"), 100);
      sessionStorage.removeItem("isSignedOut");
    }
    const isPasswordAdded = sessionStorage.getItem("isPasswordAdded");
    if (isPasswordAdded) {
      setTimeout(() => {
        successAlert("Verification email sent! Please check your inbox.");
        successAlert("Successfully linked email/password account! Please sign in again.");
      }, 100);
      sessionStorage.removeItem("isPasswordAdded");
    }
    const isPasswordUpdated = sessionStorage.getItem("isPasswordUpdated");
    if (isPasswordUpdated) {
      setTimeout(() => successAlert("Your password has been updated successfully! Please sign in again."), 100);
      sessionStorage.removeItem("isPasswordUpdated");
    }
  }, []);

  return (
    <div>
      <div className="sign-in-form font-sans bg-white w-full max-w-[384px] mx-auto shadow-sm border p-[24px] rounded-[15px]">
        <form onSubmit={onSubmit} className={`${wasSubmitted ? "was-submitted" : ""}`}>
          <h2 className="text-xl !font-semibold text-center mb-5">Sign In</h2>
          <InputDemo
            label="Email"
            placeholder="Email"
            name="email"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.email}
            errorMessage={errorMessages.email}
            inputClassName={errorMessages.email ? "is-invalid" : "is-valid"}
          />
          <InputDemo
            label="Password"
            placeholder="Password"
            name="password"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-7"
            value={state.password}
            errorMessage={errorMessages.password}
            inputClassName={errorMessages.password ? "is-invalid" : "is-valid"}
          />

          <Link href="/forgot-password" className="text-xs mb-3 text-blue-400 hover:underline inline-block">
            Forgot Password
          </Link>

          <ButtonDemo
            text={`${isLoading ? "Signing In..." : "Sign In"}`}
            className={`w-full mb-3 text-sm`}
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500 text-center mb-5">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className=" underline hover:text-black">
              Sign Up
            </Link>
          </p>
        </form>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-full border-t border-input"></div>
          <span className="text-gray-500 text-xs font-medium">OR</span>
          <div className="w-full border-t border-input"></div>
        </div>
        <ButtonDemo
          startIcon={<img src={googleLogoIcon} className="h-[16px]" />}
          text={`${isLoading ? "Signing In..." : "Continue with Google"} `}
          className={`w-full text-sm text-gray-700 `}
          disabled={isLoading}
          variant="outline"
          onClick={() => handleSignInWithGoogle({})}
        />
      </div>
    </div>
  );
};

export default SignInForm;
