"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

interface LoginFormInputs {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
  password: yup.string().required("Passwort ist erforderlich"),
});

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axiosInstance.post('user/login/', {
        username: data.email,
        password: data.password,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        router.push("/app/realEstates/");
      }
    } catch (error) {
      setErrorMessage(
        "Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten."
      );
      console.error("Fehler beim Login:", error);
    }
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <div>
          <div className={styles.loginFormContent}>
            <div className="grid gap-2 text-center">
              <h1>Login</h1>
              <p>Einfach anmelden und deine Immobilie anbieten</p>
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <div className={styles.fieldLabel}>
                    <Label htmlFor="password">Passwort</Label>
                    {errors.password && (
                      <p className="text-red-500">{errors.password.message}</p>
                    )}
                  </div>
                  <Link
                    href="/auth/forgotPassword"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Passwort vergessen?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
              </div>
              {errorMessage && (
                <div className={styles.loginErrorMessage}>
                  {errorMessage}
                </div>
              )}
              <Button type="submit" className={styles.loginButton}>
                Login
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Du hast noch keinen Account?{" "}
              <Link href="/auth/contactMail/" className="underline">
                Jetzt bei uns melden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
