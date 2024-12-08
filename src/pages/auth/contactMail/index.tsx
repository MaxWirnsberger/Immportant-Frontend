"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import styles from "./contactMail.module.css";

interface ContactFormInputs {
  firstname: string;
  lastname: string;
  email: string;
  gender?: string;
  age: number;
  job?: string;
  phone?: string;
  agreed: boolean;
}

const schema = yup.object().shape({
  firstname: yup.string().required("Vorname ist erforderlich"),
  lastname: yup.string().required("Nachname ist erforderlich"),
  email: yup
    .string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
  gender: yup.string().optional(),
  age: yup.number().default(0),
  job: yup.string(),
  phone: yup.string(),
  agreed: yup
    .boolean()
    .oneOf([true], "Du musst die Richtlinien zum Datenschutz bestätigen")
    .required("Du musst die Richtlinien zum Datenschutz bestätigen"),
});

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    try {
      const response = await axiosInstance.post("contact/newsletter/", {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        gender: data.gender,
        age: data.age,
        job: data.job,
        phone: data.phone,
      });
      router.push("/thankyou?type=register");
    } catch (error) {
      console.error("Fehler bei der Registrierung:", error);
    }
  };

  return (
    <main className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.FormContent}>
          <div>
            <h1>Sei dabei, wenn Immportant startet! 🚀</h1>
            <p>
              Bald ist es soweit – Immportant revolutioniert den
              Immobilienmarkt! Verpasse keine Neuigkeiten und sei von Anfang an
              mit dabei. Trage jetzt deine E-Mail-Adresse ein und erfahre
              sofort, wenn wir live gehen.
            </p>
            <br />
            <p>
              ✔ Exklusive Updates direkt in dein Postfach <br />
              ✔ Keine Verpflichtungen, nur Vorteile <br />
              ✔ Sei Teil der Innovation <br />
            </p>
            <br />
            <p>
              Immportant – dein Partner für die moderne Vermarktung
              deiner Immobilie.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.FormFields}>
              <div className={styles.nextByFields}>
                <div className="grid gap-2">
                  <div className={styles.fieldLabel}>
                    <Label htmlFor="firstname">
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
                    <Label htmlFor="lastname">
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
              <div className="grid gap-2">
                <div className={styles.fieldLabel}>
                  <Label htmlFor="email">
                    Email<span className="text-red-500">*</span>
                  </Label>
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
              <div className={styles.nextByFields}>
                <div className="grid gap-2">
                  <div className={styles.fieldLabel}>
                    <Label htmlFor="gender">Geschlecht (optional)</Label>
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
                    <Label htmlFor="age">Alter (optional)</Label>
                    {errors.age && (
                      <p className="text-red-500">{errors.age.message}</p>
                    )}
                  </div>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Alter"
                    {...register("age", {
                      setValueAs: (value) => (value === "" ? 0 : Number(value)),
                    })}
                  />
                </div>
              </div>
              <div className={styles.nextByFields}>
                <div className="grid gap-2">
                  <div className={styles.fieldLabel}>
                    <Label htmlFor="job">Beruf (optoinal)</Label>
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
                    <Label htmlFor="phone">Rufnummer</Label>
                    {errors.phone && (
                      <p className="text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="+43 123 456789"
                    {...register("phone")}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="agreed"
                  onCheckedChange={(checked) =>
                    setValue("agreed", checked as boolean)
                  }
                />
                <div className={styles.fieldLabel}>
                  <Label htmlFor="agreed" className="ml-2">
                    Ich bin mit den{" "}
                    <Link href="/legal/privacy" className={styles.formLink}>
                      Datenschutzbestimmungen
                    </Link>{" "}
                    einverstanden
                  </Label>
                </div>
              </div>
              <Label className="ml-2">
                {errors.agreed && (
                  <p className="text-red-500">{errors.agreed?.message}</p>
                )}
              </Label>
              {isSubmitting ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bitte warten...
                </Button>
              ) : (
                <Button type="submit" className={styles.Button}>
                  Jetzt anmelden
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
