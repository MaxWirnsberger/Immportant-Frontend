import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "@/lib/axiosInstance";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import style from "../../formContent.module.css";

interface Bild {
  tempId?: string;
  id?: string;
  file?: File | null;
  url?: string | null;
  type?:
    | "TITELBILD"
    | "INNENANSICHTEN"
    | "AUSSENANSICHTEN"
    | "GRUNDRISS"
    | null;
  previewUrl?: string;
}

interface Energiepass {
  id?: string;
  file?: File | null;
  url?: string | null;
}

interface EnergyCertificateFormValues {
  epart?: "BEDARF" | "VERBRAUCH" | null;
  valid_until?: string | null;
  issue_date?: string | null;
  energy_consumption_value?: string | null;
  hwb_value?: string | null;
  hwb_class?: string | null;
  fgee_value?: string | null;
  fgee_class?: string | null;
  energy_id?: string;
}

interface DocumentFormProps {
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

const attachmentSchema = yup.object().shape({
  bilder: yup
    .array()
    .of(
      yup.object().shape({
        tempId: yup.string().notRequired(),
        id: yup.string().notRequired(),
        file: yup
          .mixed<File>()
          .nullable()
          .notRequired()
          .test(
            "fileType",
            "Ungültiger Dateityp",
            (value) => value === null || value instanceof File
          ),
        url: yup.string().nullable(),
        type: yup
          .string()
          .nullable()
          .oneOf([
            "TITELBILD",
            "INNENANSICHTEN",
            "AUSSENANSICHTEN",
            "GRUNDRISS",
            null,
          ])
          .notRequired(),
        previewUrl: yup.string().notRequired(),
      })
    )
    .nullable()
    .notRequired(),
  dokumente: yup
    .array()
    .of(
      yup.object().shape({
        tempId: yup.string().notRequired(),
        id: yup.string().notRequired(),
        file: yup
          .mixed<File>()
          .nullable()
          .notRequired()
          .test(
            "fileType",
            "Ungültiger Dateityp",
            (value) => value === null || value instanceof File
          ),
        url: yup.string().nullable(),
      })
    )
    .nullable()
    .notRequired(),
  energiepass: yup
    .object()
    .shape({
      tempId: yup.string().notRequired(),
      id: yup.string().notRequired(),
      file: yup
        .mixed<File>()
        .nullable()
        .notRequired()
        .test(
          "fileType",
          "Ungültiger Dateityp",
          (value) => value === null || value instanceof File
        ),
      url: yup.string().nullable(),
    })
    .nullable()
    .notRequired(),
});

const energyCertificateSchema = yup.object().shape({
  epart: yup.string().oneOf(["BEDARF", "VERBRAUCH"]).nullable(),
  valid_until: yup.string().nullable(),
  issue_date: yup.string().nullable(),
  energy_consumption_value: yup.string().nullable(),
  hwb_value: yup.string().nullable(),
  hwb_class: yup
    .string()
    .nullable()
    .oneOf(["A++", "A+", "+A", "A", "B", "C", "D", "E", "F", "G"]),
  fgee_value: yup.string().nullable(),
  fgee_class: yup
    .string()
    .nullable()
    .oneOf(["A++", "A+", "+A", "A", "B", "C", "D", "E", "F", "G"]),
});

type AttachmentFormValues = yup.InferType<typeof attachmentSchema>;

type SectionType = keyof AttachmentFormValues;

export const AttachmentDataForm = forwardRef<FormHandle, DocumentFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [loading, setLoading] = useState(true);
    const [selectedSections, setSelectedSections] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState<string | null>(null);
    const [isGrundstueck, setIsGrundstueck] = useState(false);

    const {
      control: attachmentControl,
      watch: watchAttachment,
      setValue,
      reset,
      getValues,
      trigger,
      formState: { errors: attachmentErrors },
    } = useForm<AttachmentFormValues>({
      resolver: yupResolver(attachmentSchema),
      defaultValues: {
        bilder: [],
        dokumente: [],
        energiepass: null,
      },
    });

    const {
      control: energyCertificateControl,
      getValues: getEnergyCertificateValues,
      reset: resetEnergyCertificate,
      trigger: triggerEnergyCertificate,
    } = useForm<EnergyCertificateFormValues>({
      resolver: yupResolver(energyCertificateSchema),
      defaultValues: {
        epart: null,
        valid_until: null,
        issue_date: null,
        energy_consumption_value: null,
        hwb_value: null,
        hwb_class: null,
        fgee_value: null,
        fgee_class: null,
      },
    });

    const bilder = watchAttachment("bilder") as Bild[] | null | undefined;
    const dokumente = watchAttachment("dokumente");
    const energiepass = watchAttachment("energiepass");

    const toggleSection = (section: SectionType) => {
      setSelectedSections((prev) =>
        prev.includes(section)
          ? prev.filter((s) => s !== section)
          : [...prev, section]
      );
    };

    const handleDrag = (
      e: React.DragEvent<HTMLDivElement>,
      section: SectionType
    ) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(section);
      } else if (e.type === "dragleave") {
        setDragActive(null);
      }
    };

    const handleDrop = (
      e: React.DragEvent<HTMLDivElement>,
      section: SectionType
    ) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(null);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files, section);
      }
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      section: SectionType
    ) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files, section);
      }
    };

    const handleFiles = async (files: FileList, section: SectionType) => {
      let currentBilder = getValues("bilder") || [];
      let currentDokumente = getValues("dokumente") || [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const tempId = "temp_" + Date.now().toString() + "_" + i;

        if (section === "bilder" && file.type.startsWith("image/")) {
          const filePreview: Bild = {
            tempId,
            file,
            previewUrl: URL.createObjectURL(file),
            type: "INNENANSICHTEN",
          };

          currentBilder = [...currentBilder, filePreview];
          setValue("bilder", currentBilder);

          uploadFile(filePreview, "bilder");
        } else if (section === "dokumente") {
          const fileItem = {
            tempId,
            file,
          };

          currentDokumente = [...currentDokumente, fileItem];
          setValue("dokumente", currentDokumente);

          uploadFile(fileItem, "dokumente");
        } else if (
          section === "energiepass" &&
          file.type === "application/pdf"
        ) {
          const fileItem = {
            tempId,
            file,
          };

          setValue("energiepass", fileItem);

          uploadFile(fileItem, "energiepass");
        }
      }
    };

    const uploadFile = async (fileItem: any, section: SectionType) => {
      const formData = new FormData();

      if (section === "energiepass") {
        const existingEnergiepass = getValues("energiepass");
        if (existingEnergiepass && existingEnergiepass.id) {
          try {
            await axiosInstance.delete(
              `/real-estate/document/${realEstateId}/`,
              {
                data: { attachment_id: existingEnergiepass.id },
              }
            );
          } catch (error) {
            console.error(
              "Fehler beim Löschen der alten Energieausweis-Datei:",
              error
            );
          }
        }

        formData.append("file", fileItem.file, "Energieausweis.pdf");
        formData.append("group", "DOKUMENTE");
      } else {
        formData.append("file", fileItem.file);
        if (section === "bilder") {
          formData.append("group", fileItem.type || "INNENANSICHTEN");
        } else if (section === "dokumente") {
          formData.append("group", "DOKUMENTE");
        }
      }

      try {
        const response = await axiosInstance.post(
          `/real-estate/document/${realEstateId}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const uploadedFile = response.data;

        if (section === "energiepass") {
          const energiepassData = {
            id: uploadedFile.id,
            file: null,
            url: uploadedFile.document
              ? `${axiosInstance.defaults.baseURL}${uploadedFile.document}`
              : null,
          };
          setValue("energiepass", energiepassData);
        } else {
          const updatedFileData = {
            ...fileItem,
            id: uploadedFile.id,
            url: uploadedFile.document
              ? `${axiosInstance.defaults.baseURL}${uploadedFile.document}`
              : null,
          };

          setValue(
            section,
            (getValues(section) || []).map((item: any) =>
              item.tempId === fileItem.tempId ? updatedFileData : item
            )
          );
        }
      } catch (error) {
        console.error("Fehler beim Hochladen der Datei:", error);
      }
    };

    const removeFile = async (
      fileOrUrl: File | string,
      section: SectionType
    ) => {
      let attachmentId: string | null | undefined;

      if (section === "bilder") {
        const updatedBilder = (getValues("bilder") || []).filter((item) => {
          if (item.file === fileOrUrl || item.url === fileOrUrl) {
            if (item.previewUrl) {
              URL.revokeObjectURL(item.previewUrl);
            }
            if (item.id && !item.id.startsWith("temp_")) {
              attachmentId = item.id;
            } else {
              attachmentId = null;
            }
            return false;
          }
          return true;
        });
        setValue("bilder", updatedBilder);
      } else if (section === "dokumente") {
        const updatedDokumente = (getValues("dokumente") || []).filter(
          (item) => {
            if (item.file === fileOrUrl || item.url === fileOrUrl) {
              if (item.id && !item.id.startsWith("temp_")) {
                attachmentId = item.id;
              } else {
                attachmentId = null;
              }
              return false;
            }
            return true;
          }
        );
        setValue("dokumente", updatedDokumente);
      } else if (section === "energiepass") {
        if (
          energiepass &&
          (energiepass.file === fileOrUrl || energiepass.url === fileOrUrl)
        ) {
          attachmentId = energiepass.id;
          setValue("energiepass", null);
        }
      }

      if (attachmentId) {
        try {
          await axiosInstance.delete(`/real-estate/document/${realEstateId}/`, {
            data: { attachment_id: attachmentId },
          });
        } catch (error) {
          console.error("Fehler beim Löschen der Datei:", error);
        }
      }
    };

    const setImageType = async (
      fileOrUrl: File | string,
      type: "TITELBILD" | "INNENANSICHTEN" | "AUSSENANSICHTEN" | "GRUNDRISS"
    ) => {
      setValue(
        "bilder",
        (getValues("bilder") || []).map((item) => {
          if (item.file === fileOrUrl || item.url === fileOrUrl) {
            return { ...item, type };
          } else if (type === "TITELBILD" && item.type === "TITELBILD") {
            return { ...item, type: null };
          } else {
            return item;
          }
        })
      );

      const itemToUpdate = (getValues("bilder") || []).find(
        (item) => item.file === fileOrUrl || item.url === fileOrUrl
      );

      if (itemToUpdate && itemToUpdate.id) {
        try {
          await axiosInstance.patch(
            `/real-estate/document/${realEstateId}/${itemToUpdate.id}/`,
            { group: type }
          );
        } catch (error) {
          console.error("Fehler beim Aktualisieren des Bildtyps:", error);
        }
      }
    };

    const getFileNameFromUrl = (url: string) => {
      try {
        const urlObj = new URL(url, window.location.origin);
        return urlObj.pathname.split("/").pop();
      } catch (e) {
        return url;
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=attachments,energy_certificate,object_category`
          );
          const data = response.data;
          const baseURL = axiosInstance.defaults.baseURL;

          const propertyType = data.object_category?.property_type;
          const isGrundstueck = propertyType === "GRUNDSTUECK";
          setIsGrundstueck(isGrundstueck);

          const bilderGroups = [
            "TITELBILD",
            "INNENANSICHTEN",
            "AUSSENANSICHTEN",
            "GRUNDRISS",
          ];

          const bilderData: Bild[] =
            data.attachments
              ?.filter((item: any) => bilderGroups.includes(item.group))
              .map((item: any) => ({
                id: item.id,
                file: null,
                url: `${baseURL}${item.document}`,
                type: item.group ?? null,
              })) || [];

          let dokumenteData =
            data.attachments
              ?.filter((item: any) => !bilderGroups.includes(item.group))
              .map((item: any) => ({
                id: item.id,
                file: null,
                url: `${baseURL}${item.document}`,
                filename: item.document.split("/").pop(),
              })) || [];
          let energiepassData: Energiepass | null = null;

          const energiepassDocument = dokumenteData.find(
            (doc: any) =>
              doc.filename && doc.filename.includes("Energieausweis_")
          );

          if (energiepassDocument) {
            energiepassData = {
              id: energiepassDocument.id,
              file: null,
              url: energiepassDocument.url,
            };
            dokumenteData = dokumenteData.filter(
              (doc: any) => doc.id !== energiepassDocument.id
            );
          }

          const formData: AttachmentFormValues = {
            bilder: bilderData,
            dokumente: dokumenteData,
            energiepass: energiepassData,
          };

          reset(formData);

          if (data.energy_certificate) {
            const energyCertificateData = {
              epart: data.energy_certificate.epart,
              valid_until: data.energy_certificate.valid_until,
              issue_date: data.energy_certificate.issue_date,
              energy_consumption_value:
                data.energy_certificate.energy_consumption_value,
              hwb_value: data.energy_certificate.hwb_value,
              hwb_class: data.energy_certificate.hwb_class,
              fgee_value: data.energy_certificate.fgee_value,
              fgee_class: data.energy_certificate.fgee_class,
              energy_id: data.energy_certificate.id,
            };

            resetEnergyCertificate(energyCertificateData);
          }

          if (bilderData.length > 0 && !selectedSections.includes("bilder")) {
            setSelectedSections((prev) => [...prev, "bilder"]);
          }
          if (
            dokumenteData.length > 0 &&
            !selectedSections.includes("dokumente")
          ) {
            setSelectedSections((prev) => [...prev, "dokumente"]);
          }
          if (
            !isGrundstueck &&
            (energiepassData || data.energy_certificate) &&
            !selectedSections.includes("energiepass")
          ) {
            setSelectedSections((prev) => [...prev, "energiepass"]);
          }

          setLoading(false);
        } catch (error) {
          console.error("Fehler beim Laden der Daten:", error);
          setLoading(false);
        }
      };

      if (realEstateId) {
        fetchData();
      }
    }, [
      realEstateId,
      reset,
      resetEnergyCertificate,
      selectedSections,
      setIsGrundstueck,
    ]);

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let isValid = false;
        try {
          const energyCertificateIsValid = await triggerEnergyCertificate();
          const energyCertificateData = getEnergyCertificateValues();
          if (energyCertificateIsValid) {
            const energyCertificateObject = {
              epart: energyCertificateData.epart,
              valid_until: energyCertificateData.valid_until,
              issue_date: energyCertificateData.issue_date,
              energy_consumption_value:
                energyCertificateData.energy_consumption_value,
              hwb_value: energyCertificateData.hwb_value,
              hwb_class: energyCertificateData.hwb_class,
              fgee_value: energyCertificateData.fgee_value,
              fgee_class: energyCertificateData.fgee_class,
              ...(energyCertificateData.energy_id
                ? { id: energyCertificateData.energy_id }
                : {}),
            };

            const nestedData = {
              energy_certificate: energyCertificateObject,
            };

            await axiosInstance.put(
              `/real-estate/update/${realEstateId}/`,
              nestedData
            );
            isValid = true;
          } else {
            console.error("Formularvalidierung fehlgeschlagen");
          }
        } catch (error) {
          console.error("Fehler beim Senden der Daten:", error);
        }
        return isValid;
      },
    }));

    if (loading) {
      return <div>Lädt...</div>;
    }

    return (
      <div className={style.form}>
        {/* Abschnittsauswahl */}
        <div className={style.formGroup}>
          <Label className={style.formLabel}>Anhangsarten</Label>
          <div className={style.buttonGroup}>
            <button
              type="button"
              className={
                selectedSections.includes("bilder")
                  ? style.buttonActive
                  : style.buttonInactive
              }
              onClick={() => toggleSection("bilder")}
            >
              Bilder
            </button>
            <button
              type="button"
              className={
                selectedSections.includes("dokumente")
                  ? style.buttonActive
                  : style.buttonInactive
              }
              onClick={() => toggleSection("dokumente")}
            >
              Dokumente
            </button>
            {!isGrundstueck && (
              <button
                type="button"
                className={
                  selectedSections.includes("energiepass")
                    ? style.buttonActive
                    : style.buttonInactive
                }
                onClick={() => toggleSection("energiepass")}
              >
                Energiepass
              </button>
            )}
          </div>
        </div>

        {/* Bilder */}
        {selectedSections.includes("bilder") && (
          <div className={style.formSection}>
            <h3 className={style.subheadline}>Bilder</h3>
            <div
              onDragEnter={(e) => handleDrag(e, "bilder")}
              onDragLeave={(e) => handleDrag(e, "bilder")}
              onDragOver={(e) => handleDrag(e, "bilder")}
              onDrop={(e) => handleDrop(e, "bilder")}
              className={`${style.dropzone} ${
                dragActive === "bilder" ? style.dropzoneActive : ""
              }`}
            >
              <input
                type="file"
                id="bilder-upload"
                multiple
                accept="image/*"
                onChange={(e) => handleChange(e, "bilder")}
                className={style.inputFile}
              />
              <label htmlFor="bilder-upload" className={style.dropzoneLabel}>
                <div className={style.dropzoneText}>
                  Bilder hier ablegen oder{" "}
                  <span className={style.textPrimary}>auswählen</span>
                </div>
              </label>
            </div>
            <div className={style.filePreviewGrid}>
              {bilder?.map((item, index) => (
                <div
                  key={item.tempId || item.id || index}
                  className={style.filePreviewItem}
                >
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={`Bild ${index + 1}`}
                      className={style.imagePreview}
                    />
                  ) : item.url ? (
                    <img
                      src={item.url}
                      alt={`Bild ${index + 1}`}
                      className={style.imagePreview}
                    />
                  ) : null}
                  <Select
                    onValueChange={(value) =>
                      setImageType(
                        item.file || item.url || "",
                        value as
                          | "TITELBILD"
                          | "INNENANSICHTEN"
                          | "AUSSENANSICHTEN"
                          | "GRUNDRISS"
                      )
                    }
                    value={item.type || ""}
                  >
                    <SelectTrigger className={style.selectTrigger}>
                      <SelectValue placeholder="Bildtyp wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TITELBILD">Titelbild</SelectItem>
                      <SelectItem value="INNENANSICHTEN">
                        Innenansicht
                      </SelectItem>
                      <SelectItem value="AUSSENANSICHTEN">
                        Außenansicht
                      </SelectItem>
                      <SelectItem value="GRUNDRISS">Grundriss</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={style.removeButton}
                    onClick={() =>
                      removeFile(item.file || item.url || "", "bilder")
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dokumente */}
        {selectedSections.includes("dokumente") && (
          <div className={style.formSection}>
            <h3 className={style.subheadline}>Dokumente</h3>
            <div
              onDragEnter={(e) => handleDrag(e, "dokumente")}
              onDragLeave={(e) => handleDrag(e, "dokumente")}
              onDragOver={(e) => handleDrag(e, "dokumente")}
              onDrop={(e) => handleDrop(e, "dokumente")}
              className={`${style.dropzone} ${
                dragActive === "dokumente" ? style.dropzoneActive : ""
              }`}
            >
              <input
                type="file"
                id="dokumente-upload"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => handleChange(e, "dokumente")}
                className={style.inputFile}
              />
              <label htmlFor="dokumente-upload" className={style.dropzoneLabel}>
                <div className={style.dropzoneText}>
                  Dokumente hier ablegen oder{" "}
                  <span className={style.textPrimary}>auswählen</span>
                </div>
              </label>
            </div>
            <div className={style.fileList}>
              {dokumente?.map((item, index) => (
                <div
                  key={item.tempId || item.id || index}
                  className={style.fileListItem}
                >
                  <span>
                    <a
                      href={item.url ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.file
                        ? item.file.name
                        : getFileNameFromUrl(item.url || "")}
                    </a>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeFile(item.file || item.url || "", "dokumente")
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Energiepass */}
        {!isGrundstueck && selectedSections.includes("energiepass") && (
          <div className={style.formSection}>
            <h3 className={style.subheadline}>Energiepass</h3>
            <div
              onDragEnter={(e) => handleDrag(e, "energiepass")}
              onDragLeave={(e) => handleDrag(e, "energiepass")}
              onDragOver={(e) => handleDrag(e, "energiepass")}
              onDrop={(e) => handleDrop(e, "energiepass")}
              className={`${style.dropzone} ${
                dragActive === "energiepass" ? style.dropzoneActive : ""
              }`}
            >
              <input
                type="file"
                id="energiepass-upload"
                accept=".pdf"
                onChange={(e) => handleChange(e, "energiepass")}
                className={style.inputFile}
              />
              <label
                htmlFor="energiepass-upload"
                className={style.dropzoneLabel}
              >
                <div className={style.dropzoneText}>
                  Energiepass hier ablegen oder{" "}
                  <span className={style.textPrimary}>auswählen</span>
                </div>
              </label>
            </div>
            {energiepass && (
              <div className={style.fileListItem}>
                <span>
                  <a
                    href={energiepass.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {energiepass.file
                      ? energiepass.file.name
                      : getFileNameFromUrl(energiepass.url || "")}
                  </a>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeFile(
                      energiepass.file || energiepass.url || "",
                      "energiepass"
                    )
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Energiepass Formular */}
            <form className={style.form}>
              {/* Energiepassart */}
              <div className={style.threeFormGroupRow}>
                <div className={style.formGroup}>
                  <Label className={style.formLabel}>Energiepassart</Label>
                  <Controller
                    name="epart"
                    control={energyCertificateControl}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen Sie eine Energiepassart" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEDARF">Bedarf</SelectItem>
                          <SelectItem value="VERBRAUCH">Verbrauch</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {/* Gültig bis */}
                <div className={style.formGroup}>
                  <Label className={style.formLabel}>Gültig bis</Label>
                  <Controller
                    name="valid_until"
                    control={energyCertificateControl}
                    render={({ field }) => (
                      <Input type="date" {...field} value={field.value || ""} />
                    )}
                  />
                </div>

                {/* Ausstelldatum */}
                <div className={style.formGroup}>
                  <Label className={style.formLabel}>Ausstelldatum</Label>
                  <Controller
                    name="issue_date"
                    control={energyCertificateControl}
                    render={({ field }) => (
                      <Input type="date" {...field} value={field.value || ""} />
                    )}
                  />
                </div>
              </div>

              {/* Energieverbrauchskennwert */}
              <div className={`${style.formGroup} ${style.halfRow}`}>
                <Label className={style.formLabel}>
                  Energieverbrauchskennwert
                </Label>
                <Controller
                  name="energy_consumption_value"
                  control={energyCertificateControl}
                  render={({ field }) => (
                    <Input type="number" {...field} value={field.value || ""} />
                  )}
                />
              </div>

              {/* HWB-Wert und HWB-Klasse */}
              <div className={style.formGroupRow}>
                {/* HWB-Wert */}
                <div className={`${style.formGroup} ${style.halfRow}`}>
                  <Label className={style.formLabel}>HWB-Wert</Label>
                  <Controller
                    name="hwb_value"
                    control={energyCertificateControl}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                      />
                    )}
                  />
                </div>

                {/* HWB-Klasse */}
                <div className={`${style.formGroup} ${style.halfRow}`}>
                  <Label className={style.formLabel}>HWB-Klasse</Label>
                  <Controller
                    name="hwb_class"
                    control={energyCertificateControl}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="HWB-Klasse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A++">A++</SelectItem>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="+A">+A</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* fGEE-Wert und fGEE-Klasse */}
              <div className={style.formGroupRow}>
                {/* fGEE-Wert */}
                <div className={`${style.formGroup} ${style.halfRow}`}>
                  <Label className={style.formLabel}>fGEE-Wert</Label>
                  <Controller
                    name="fgee_value"
                    control={energyCertificateControl}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                      />
                    )}
                  />
                </div>

                {/* fGEE-Klasse */}
                <div className={`${style.formGroup} ${style.halfRow}`}>
                  <Label className={style.formLabel}>fGEE-Klasse</Label>
                  <Controller
                    name="fgee_class"
                    control={energyCertificateControl}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="fGEE-Klasse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A++">A++</SelectItem>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="+A">+A</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
);
