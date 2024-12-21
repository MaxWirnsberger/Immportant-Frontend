"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import styles from "@/pages/app/calender/ownerCalender.module.css";

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  deleteAvailabilityError: string | null;
  deleteAvailabilityLoading: boolean;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
};

export function DeleteAvailabilityDialog({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  deleteAvailabilityError,
  deleteAvailabilityLoading,
  handleConfirmDelete,
  handleCancelDelete,
}: Props) {
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verfügbarkeit löschen</DialogTitle>
          <DialogDescription>
            Bist du sicher, dass du diese Verfügbarkeit löschen möchtest?
            {deleteAvailabilityError && (
              <p className="text-red-500 mt-2">{deleteAvailabilityError}</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleConfirmDelete}
            className={styles.buttonDelete}
            disabled={deleteAvailabilityLoading}
          >
            {deleteAvailabilityLoading ? "Löschen..." : "Löschen"}
          </Button>
          <Button
            onClick={handleCancelDelete}
            className={styles.buttonCancel}
            disabled={deleteAvailabilityLoading}
          >
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
