"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import styles from "./profile.module.css";
import globalstyle from "../../globalApp.module.css";
import { useRouter } from "next/navigation";

interface ProfileFormInputs {
  firstname: string;
  lastname: string;
  email: string;
  gender?: string;
  age: number;
  job?: string;
  phone: string;
}

interface PasswordFormInputs {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

const profileSchema = yup.object().shape({
  firstname: yup.string().required("Vorname ist erforderlich"),
  lastname: yup.string().required("Nachname ist erforderlich"),
  email: yup
    .string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
  gender: yup.string().optional(),
  age: yup
    .number()
    .required("Alter ist erforderlich")
    .min(0, "Alter muss positiv sein")
    .integer("Alter muss eine ganze Zahl sein"),
  job: yup.string().optional(),
  phone: yup
    .string()
    .required("Rufnummer ist erforderlich")
    .matches(
      /^\+\d{1,3}\s\d{2,5}\s\d{5,10}$/,
      "Rufnummer: +Land Vorwahl Nummer Beispiel: +49 660 6162416 | Leerzeichen nicht vergessen"
    ),
});

const passwordSchema = yup.object().shape({
  old_password: yup.string().required("Aktuelles Passwort ist erforderlich"),
  new_password1: yup
    .string()
    .required("Neues Passwort ist erforderlich")
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein"),
  new_password2: yup
    .string()
    .oneOf([yup.ref("new_password1")], "Die Passwörter stimmen nicht überein")
    .required("Bestätigung des neuen Passworts ist erforderlich"),
});

export default function ProfilePage() {
  const router = useRouter();

  // Zustände für Fehlermeldungen
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Hooks für das Profilformular
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInputs>({
    resolver: yupResolver(profileSchema),
  });

  // Hooks für das Passwortformular
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordFormInputs>({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/user/profile/");
        const data = response.data;
        reset(data);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit = async (data: ProfileFormInputs) => {
    setProfileError(null); // Vorherige Fehlermeldungen löschen
    try {
      const response = await axiosInstance.put("/user/profile/", data);
      console.log("Profil erfolgreich aktualisiert:", response.data);
      // Nach erfolgreicher Übertragung weiterleiten
      router.push("/app/settings/");
    } catch (error: any) {
      console.error("Fehler beim Aktualisieren der Daten:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const errorMessage =
          typeof errorData === "string" ? errorData : JSON.stringify(errorData);
        setProfileError(errorMessage);
      } else {
        setProfileError("Ein unerwarteter Fehler ist aufgetreten.");
      }
    }
  };

  const onChangePassword = async (data: PasswordFormInputs) => {
    setPasswordError(null); // Vorherige Fehlermeldungen löschen
    try {
      const response = await axiosInstance.put("/user/change-password/", data);
      console.log("Passwort erfolgreich geändert:", response.data);
      // Nach erfolgreicher Übertragung weiterleiten
      router.push("/app/settings/");
    } catch (error: any) {
      console.error("Fehler beim Ändern des Passworts:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const errorMessage =
          typeof errorData === "string" ? errorData : JSON.stringify(errorData);
        setPasswordError(errorMessage);
      } else {
        setPasswordError("Ein unerwarteter Fehler ist aufgetreten.");
      }
    }
  };

  return (
    <main className={globalstyle.appMainContainer}>
      <h2>Einstellungen</h2>
      {/* Profilformular */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.profileFormFields}>
          <h3 className={styles.profileHeadline}>Profil</h3>
          {/* Vorname und Nachname */}
          <div className={styles.nextByFields}>
            <div className="grid gap-2">
              <div className={styles.fieldLabel}>
                <Label>
                  Vorname<span className="text-red-500">*</span>
                </Label>
                {errors.firstname && (
                  <p className="text-red-500">{errors.firstname.message}</p>
                )}
              </div>
              <Input
                id="firstname"
                type="text"
                placeholder="Max"
                {...register("firstname")}
              />
            </div>
            <div className="grid gap-2">
              <div className={styles.fieldLabel}>
                <Label>
                  Nachname<span className="text-red-500">*</span>
                </Label>
                {errors.lastname && (
                  <p className="text-red-500">{errors.lastname.message}</p>
                )}
              </div>
              <Input
                id="lastname"
                type="text"
                placeholder="Mustermann"
                {...register("lastname")}
              />
            </div>
          </div>
          {/* E-Mail */}
          <div className="grid gap-2">
            <div className={styles.fieldLabel}>
              <Label>
                Email<span className="text-red-500">*</span>
              </Label>
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <Input
              id="email"
              type="email"
              disabled
              placeholder="max.mustermann@example.com"
              {...register("email")}
            />
          </div>
          {/* Geschlecht und Alter */}
          <div className={styles.nextByFields}>
            <div className="grid gap-2">
              <div className={styles.fieldLabel}>
                <Label>Geschlecht (optional)</Label>
                {errors.gender && (
                  <p className="text-red-500">{errors.gender.message}</p>
                )}
              </div>
              <select
                id="gender"
                {...register("gender")}
                className="border rounded p-2"
                defaultValue=""
                style={{ fontSize: "14px" }}
              >
                <option value="" disabled>
                  Wählen Sie Ihr Geschlecht
                </option>
                <option value="male">Mann</option>
                <option value="female">Frau</option>
                <option value="other">Divers</option>
              </select>
            </div>
            <div className="grid gap-2">
              <div className={styles.fieldLabel}>
                <Label>Alter</Label>
                {errors.age && (
                  <p className="text-red-500">{errors.age.message}</p>
                )}
              </div>
              <Input
                id="age"
                type="number"
                placeholder="Alter"
                {...register("age")}
              />
            </div>
          </div>
          {/* Beruf und Rufnummer */}
          <div className={styles.nextByFields}>
            <div className="grid gap-2">
              <div className={styles.fieldLabel}>
                <Label>Beruf (optional)</Label>
                {errors.job && (
                  <p className="text-red-500">{errors.job.message}</p>
                )}
              </div>
              <Input
                id="job"
                type="text"
                placeholder="bsp.: Maler"
                {...register("job")}
              />
            </div>
            <div className="grid gap-2">
              <div className={styles.fieldLabel}>
                <Label>
                  Rufnummer<span className="text-red-500">*</span>
                </Label>
                {errors.phone && (
                  <p className="text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <Input
                id="phone"
                type="text"
                placeholder="+49 123 456789"
                {...register("phone")}
              />
            </div>
          </div>
          {/* Anzeige der Fehlermeldung */}
          {profileError && <p className="text-red-500 mb-2">{profileError}</p>}
          {/* Aktualisieren Button */}
          <div className={styles.buttonContainer}>
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bitte warten...
              </Button>
            ) : (
              <Button type="submit" className={styles.updateButton}>
                Aktualisieren
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Passwortänderungsformular */}
      <div className={styles.passwordChangeContainer}>
        <form onSubmit={handleSubmitPassword(onChangePassword)}>
          <div className={styles.profileFormFields}>
            <h3 className={styles.profileHeadline}>Passwort ändern</h3>
            {/* Altes Passwort */}
            <div className="grid gap-2">
              <div className={styles.fieldLabel}>
                <Label>
                  Aktuelles Passwort<span className="text-red-500">*</span>
                </Label>
                {passwordErrors.old_password && (
                  <p className="text-red-500">
                    {passwordErrors.old_password.message}
                  </p>
                )}
              </div>
              <Input
                id="old_password"
                type="password"
                {...registerPassword("old_password")}
              />
            </div>
            {/* Neues Passwort */}
            <div className="grid gap-2">
              <div className={styles.fieldLabel}>
                <Label>
                  Neues Passwort<span className="text-red-500">*</span>
                </Label>
                {passwordErrors.new_password1 && (
                  <p className="text-red-500">
                    {passwordErrors.new_password1.message}
                  </p>
                )}
              </div>
              <Input
                id="new_password1"
                type="password"
                {...registerPassword("new_password1")}
              />
            </div>
            {/* Neues Passwort bestätigen */}
            <div className="grid gap-2">
              <div className={styles.fieldLabel}>
                <Label>
                  Neues Passwort bestätigen
                  <span className="text-red-500">*</span>
                </Label>
                {passwordErrors.new_password2 && (
                  <p className="text-red-500">
                    {passwordErrors.new_password2.message}
                  </p>
                )}
              </div>
              <Input
                id="new_password2"
                type="password"
                {...registerPassword("new_password2")}
              />
            </div>
            {/* Anzeige der Fehlermeldung */}
            {passwordError && (
              <p className="text-red-500 mb-2">{passwordError}</p>
            )}
            {/* Passwort ändern Button */}
            <div className={styles.buttonContainer}>
              {isSubmittingPassword ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bitte warten...
                </Button>
              ) : (
                <Button type="submit" className={styles.updateButton}>
                  Passwort ändern
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
