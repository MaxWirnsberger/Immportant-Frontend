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
  isCancelDialogOpen: boolean;
  setIsCancelDialogOpen: (open: boolean) => void;
  cancelError: string | null;
  cancelLoading: boolean;
  handleConfirmCancel: () => void;
  handleCancelDialogClose: () => void;
};

export function CancelBookingDialog({
  isCancelDialogOpen,
  setIsCancelDialogOpen,
  cancelError,
  cancelLoading,
  handleConfirmCancel,
  handleCancelDialogClose,
}: Props) {
  return (
    <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buchung absagen</DialogTitle>
          <DialogDescription>
            Bist du sicher, dass du diese Buchung absagen möchtest? <br/>
            Der Interessenten wird per Mail über die Absage informiert.
            {cancelError && (
              <p className="text-red-500 mt-2">{cancelError}</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleConfirmCancel}
            className={styles.buttonDelete}
            disabled={cancelLoading}
          >
            {cancelLoading ? "Absagen..." : "Absagen"}
          </Button>
          <Button
            onClick={handleCancelDialogClose}
            className={styles.closeButton}
            disabled={cancelLoading}
          >
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
