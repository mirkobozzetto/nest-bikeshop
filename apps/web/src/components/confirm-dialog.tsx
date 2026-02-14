'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  isPending?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'destructive',
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={isPending}>
            {isPending ? 'En cours...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const confirm = useCallback((action: () => void) => {
    setPendingAction(() => action);
    setOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    pendingAction?.();
    setOpen(false);
    setPendingAction(null);
  }, [pendingAction]);

  const handleOpenChange = useCallback((value: boolean) => {
    setOpen(value);
    if (!value) setPendingAction(null);
  }, []);

  return {
    open,
    onOpenChange: handleOpenChange,
    onConfirm: handleConfirm,
    confirm,
  };
}
