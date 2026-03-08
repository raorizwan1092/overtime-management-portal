"use client";
import React, { useState } from "react";
import { ProgressBar } from "react-bootstrap";
import SendCode from "./ForgotPassword/SendCode";
import VerifyCode from "./ForgotPassword/VerifyCode";
import NewPassword from "./ForgotPassword/NewPassword";

const ForgotPasswordStepper = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="w-100 p-3">
      <ProgressBar now={(step / 3) * 100} className="mb-4" />

      {step === 1 && (
        <SendCode
          onSuccess={(userEmail) => {
            setEmail(userEmail);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <VerifyCode
          email={email}
          onBack={handleBack}
          onSuccess={(receivedToken) => {
            setToken(receivedToken);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <NewPassword
          email={email}
          token={token}
          onBack={handleBack}
          onSuccess={() => {
            setStep(1);
            setEmail("");
            setToken("");
          }}
        />
      )}
    </div>
  );
};

export default ForgotPasswordStepper;
