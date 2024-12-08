"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import styles from "./forgotPassword.module.css";

interface ForgotPasswordFormInputs {
  email: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
});

export default function ForgotPassword() {
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { type } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(schema),
  });

  const handleButtonClick = () => {
    router.push("/");
  };

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    try {
      const response = await axiosInstance.post(
        "user/password-reset-request/",
        data
      );
      setMessage(
        "Wenn die E-Mail existiert, haben wir Ihnen eine Nachricht geschickt."
      );
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        "Es gab ein Problem beim Senden der E-Mail. Bitte versuchen Sie es erneut."
      );
      setMessage(null);
      console.error("Fehler beim Senden der E-Mail:", error);
    }
  };

  return (
    <main className={styles.forgotPasswordContainer}>
      <div className={styles.forgotPasswordContent}>
        <div>
          <div className={styles.forgotPasswordFormContent}>
            <div className="grid gap-2 text-center">
              <h1>Passwort vergessen?</h1>
              <p>
                Gib deine E-Mail-Adresse an, damit wir dir weiterhelfen können.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.formElements}
            >
              <div className="grid gap-2">
                <div className={styles.fieldLabel}>
                  <Label htmlFor="email">Email</Label>
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="max.mustermann@example.com"
                  {...register("email")}
                />
              </div>
              <Button type="submit" className={styles.forgotPasswordButton}>
                E-Mail senden
              </Button>
            </form>
            {message && (
              <div className={styles.successMessage}>
                {message} 
                <Button
                  className={styles.backToHomeButton}
                  onClick={handleButtonClick}
                >
                  Zurück zur Homepage
                </Button> 
              </div>
            )}
            {errorMessage && (
              <div className="text-center text-red-500 mt-4">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
