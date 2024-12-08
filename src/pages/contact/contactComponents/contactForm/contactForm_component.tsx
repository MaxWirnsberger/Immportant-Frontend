// "use client";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { BACKEND_URL } from "@/lib/config";
// import { useRouter } from 'next/router';
// import styles from "./contactForm.module.css";

// interface IFormInputs {
//   name: string;
//   email: string;
//   phone: string;
//   location: string;
//   message?: string;
//   agreed: boolean;
// } 

// const router = useRouter();

// const schema = yup.object().shape({
//   name: yup.string().required("Name ist erforderlich"),
//   email: yup
//     .string()
//     .email("Ungültige E-Mail-Adresse")
//     .required("E-Mail ist erforderlich"),
//   phone: yup
//     .string()
//     .matches(/^\+?[1-9]\d{1,14}$/, "Ungültige Telefonnummer")
//     .required("Telefonnummer ist erforderlich"),
//   location: yup.string().required("Bitte wählen Sie einen Standort aus"),
//   agreed: yup
//     .boolean()
//     .oneOf([true], "Du musst die Richtlinien zum Datenschutz bestätigen")
//     .required("Du musst die Richtlinien zum Datenschutz bestätigen"),
// });

// export default function ContactFormComponent() {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     reset,
//   } = useForm<IFormInputs>({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
//     try {
//       const response = await fetch(`${BACKEND_URL}contact/sendMail/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
  
//       if (!response.ok) {
//         throw new Error("Fehler beim Senden der Daten. Bitte versuchen Sie es erneut.");
//       }
  
//       reset();
//       router.push('/thankyou?type=contact');
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error("Fehler:", error.message);
//       } else {
//         console.error("Ein unbekannter Fehler ist aufgetreten.");
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <div className={styles.fieldLabel}>
//             <Label htmlFor="name">Name</Label>
//             {errors.name && (
//               <p className="text-red-500">{errors.name?.message}</p>
//             )}
//           </div>
//           <Input id="name" {...register("name")} />
//         </div>
//         <div>
//           <div className={styles.fieldLabel}>
//             <Label htmlFor="email">Email</Label>
//             {errors.email && (
//               <p className="text-red-500">{errors.email?.message}</p>
//             )}
//           </div>
//           <Input id="email" type="email" {...register("email")} />
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <div className={styles.fieldLabel}>
//             <Label htmlFor="phone">Telefon</Label>
//             {errors.phone && (
//               <p className="text-red-500">{errors.phone?.message}</p>
//             )}
//           </div>
//           <Input id="phone" {...register("phone")} />
//         </div>
//         <div>
//           <div className={styles.fieldLabel}>
//             <Label htmlFor="location">Standort</Label>
//             {errors.location && (
//               <p className="text-red-500">{errors.location?.message}</p>
//             )}
//           </div>
//           <Select
//             onValueChange={(value) =>
//               setValue("location", value, { shouldValidate: true })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Wähle einen Standort" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="DE">Deutschland</SelectItem>
//               <SelectItem value="AT">Österreich</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <div>
//         <Label htmlFor="message">Message</Label>
//         <Textarea id="message" {...register("message")} rows={6} />
//       </div>
//       <div className="flex items-center">
//         <Checkbox
//           id="agreed"
//           onCheckedChange={(checked) => setValue("agreed", checked as boolean)}
//         />
//         <div className={styles.fieldLabel}>
//           <Label htmlFor="agreed" className="ml-2">
//             Ich bin mit den{" "}
//             <Link href="/legal/privacy" className={styles.formLink}>
//               Datenschutzbestimmungen
//             </Link>{" "}
//             einverstanden
//           </Label>
//           {errors.agreed && (
//             <p className="text-red-500">{errors.agreed?.message}</p>
//           )}
//         </div>
//       </div>
//       <Button type="submit" className={styles.formButton}>
//         Senden
//       </Button>
//     </form>
//   );
// }

"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { BACKEND_URL } from "@/lib/config";
import { useRouter } from 'next/router'; // Verwende useRouter innerhalb der Komponente
import styles from "./contactForm.module.css";

// Definiere das Schema hier
const schema = yup.object().shape({
  name: yup.string().required("Name ist erforderlich"),
  email: yup
    .string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
  phone: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Ungültige Telefonnummer")
    .required("Telefonnummer ist erforderlich"),
  location: yup.string().required("Bitte wählen Sie einen Standort aus"),
  agreed: yup
    .boolean()
    .oneOf([true], "Du musst die Richtlinien zum Datenschutz bestätigen")
    .required("Du musst die Richtlinien zum Datenschutz bestätigen"),
});

interface IFormInputs {
  name: string;
  email: string;
  phone: string;
  location: string;
  message?: string;
  agreed: boolean;
} 

export default function ContactFormComponent() {
  const router = useRouter(); 

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema), 
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const response = await fetch(`${BACKEND_URL}/contact/sendMail/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Fehler beim Senden der Daten. Bitte versuchen Sie es erneut.");
      }
  
      reset();
      router.push('/thankyou?type=contact'); // Verwende router.push zur Weiterleitung
    } catch (error) {
      if (error instanceof Error) {
        console.error("Fehler:", error.message);
      } else {
        console.error("Ein unbekannter Fehler ist aufgetreten.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className={styles.fieldLabel}>
            <Label htmlFor="name">Name</Label>
            {errors.name && (
              <p className="text-red-500">{errors.name?.message}</p>
            )}
          </div>
          <Input id="name" {...register("name")} />
        </div>
        <div>
          <div className={styles.fieldLabel}>
            <Label htmlFor="email">Email</Label>
            {errors.email && (
              <p className="text-red-500">{errors.email?.message}</p>
            )}
          </div>
          <Input id="email" type="email" {...register("email")} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className={styles.fieldLabel}>
            <Label htmlFor="phone">Telefon</Label>
            {errors.phone && (
              <p className="text-red-500">{errors.phone?.message}</p>
            )}
          </div>
          <Input id="phone" {...register("phone")} />
        </div>
        <div>
          <div className={styles.fieldLabel}>
            <Label htmlFor="location">Standort</Label>
            {errors.location && (
              <p className="text-red-500">{errors.location?.message}</p>
            )}
          </div>
          <Select
            onValueChange={(value) =>
              setValue("location", value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Wähle einen Standort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DE">Deutschland</SelectItem>
              <SelectItem value="AT">Österreich</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...register("message")} rows={6} />
      </div>
      <div className="flex items-center">
        <Checkbox
          id="agreed"
          onCheckedChange={(checked) => setValue("agreed", checked as boolean)}
        />
        <div className={styles.fieldLabel}>
          <Label htmlFor="agreed" className="ml-2">
            Ich bin mit den{" "}
            <Link href="/legal/privacy" className={styles.formLink}>
              Datenschutzbestimmungen
            </Link>{" "}
            einverstanden
          </Label>
          {errors.agreed && (
            <p className="text-red-500">{errors.agreed?.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" className={styles.formButton}>
        Senden
      </Button>
    </form>
  );
}
