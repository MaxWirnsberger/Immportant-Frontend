"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import styles from "./newPassword.module.css";

interface NewPasswordFormInputs {
  password1: string;
  password2: string;
}

const schema = yup.object().shape({
  password1: yup
    .string()
    .min(6, "Passwort muss mindestens 6 Zeichen lang sein")
    .matches(
      /[^a-zA-Z0-9]/,
      "Passwort muss mindestens ein Sonderzeichen enthalten"
    )
    .required("Passwort ist erforderlich"),
  password2: yup
    .string()
    .oneOf([yup.ref("password1"), ""], "Passwörter müssen übereinstimmen")
    .required("Passwortbestätigung ist erforderlich"),
});

export default function NewPassword() {
  const router = useRouter();
  const pathname = usePathname();  // Nutze usePathname, um den gesamten Pfad zu erhalten

  // Extrahiere den Token aus dem vorletzten Segment des Pfads
  const segments = pathname?.split("/").filter(Boolean); // Filtere leere Segmente heraus
  const token = segments ? segments[segments.length - 1] : ""; 

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<NewPasswordFormInputs> = async (data) => {
    try {
      const response = await axiosInstance.post(
        `user/forgot-password/${token}/`,
        data
      );

      if (response.status === 200) {
        setSuccessMessage("Passwort erfolgreich zurückgesetzt");
        setErrorMessage(null);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000); // Nach 2 Sekunden zur Login-Seite weiterleiten
      } else {
        setErrorMessage("Fehler beim Zurücksetzen des Passworts");
        setSuccessMessage(null);
      }
    } catch (error) {
      setErrorMessage("Fehler beim Zurücksetzen des Passworts. Bitte versuchen Sie es erneut.");
      setSuccessMessage(null);
      console.error("Fehler beim Zurücksetzen des Passworts:", error);
    }
  };

  return (
    <main className={styles.newPasswordContainer}>
      <div className={styles.newPasswordContent}>
        <div className={styles.newPasswordFormContent}>
          <div className="grid gap-2 text-center">
            <h1>Neues Passwort erstellen</h1>
            <p>
              Gib ein neues Passwort ein, damit du dich wieder einloggen kannst.
            </p>
          </div>
          <div className={styles.formElements}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className={styles.fieldLabel}>
                    <Label htmlFor="password1">
                      Neues Passwort<span className="text-red-500">*</span>
                    </Label>
                    {errors.password1 && (
                      <p className="text-red-500">{errors.password1.message}</p>
                    )}
                  </div>
                  <Input
                    id="password1"
                    type="password"
                    {...register("password1")}
                  />
                </div>
                <div className="grid gap-2">
                  <div className={styles.fieldLabel}>
                    <Label htmlFor="password2">
                      Passwort bestätigen<span className="text-red-500">*</span>
                    </Label>
                    {errors.password2 && (
                      <p className="text-red-500">
                        {errors.password2.message}
                      </p>
                    )}
                  </div>
                  <Input
                    id="password2"
                    type="password"
                    {...register("password2")}
                  />
                </div>
                <Button type="submit" className={styles.newPasswordButton}>
                  Passwort zurücksetzen
                </Button>
                {errorMessage && (
                  <div className="text-center text-red-500 mt-4">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="text-center text-green-500 mt-4">
                    {successMessage}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
