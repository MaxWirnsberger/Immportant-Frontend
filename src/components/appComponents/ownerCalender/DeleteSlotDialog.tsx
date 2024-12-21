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
  isDeleteSlotDialogOpen: boolean;
  setIsDeleteSlotDialogOpen: (open: boolean) => void;
  deleteSlotError: string | null;
  deleteSlotLoading: boolean;
  handleConfirmDeleteSlot: () => void;
  handleCancelDeleteSlot: () => void;
};

export function DeleteSlotDialog({
  isDeleteSlotDialogOpen,
  setIsDeleteSlotDialogOpen,
  deleteSlotError,
  deleteSlotLoading,
  handleConfirmDeleteSlot,
  handleCancelDeleteSlot,
}: Props) {
  return (
    <Dialog open={isDeleteSlotDialogOpen} onOpenChange={setIsDeleteSlotDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slot löschen</DialogTitle>
          <DialogDescription>
            Bist du sicher, dass du diesen Slot löschen möchtest?
            {deleteSlotError && (
              <p className="text-red-500 mt-2">{deleteSlotError}</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleConfirmDeleteSlot}
            className={styles.buttonDelete}
            disabled={deleteSlotLoading}
          >
            {deleteSlotLoading ? "Löschen..." : "Löschen"}
          </Button>
          <Button
            onClick={handleCancelDeleteSlot}
            className={styles.buttonCancel}
            disabled={deleteSlotLoading}
          >
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
