"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Send, Wallet, Sparkles } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const proFeatures = [
  {
    icon: Send,
    text: "Send invoices directly via email.",
  },
  {
    icon: Sparkles,
    text: "Remove 'Created with Invoiss' watermark.",
  },
  {
    icon: Wallet,
    text: "Track payments with the Wallet feature.",
  },
  {
    text: "Access all premium templates.",
  },
  {
    text: "Invite team members to collaborate.",
  },
];

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Upgrade to Invoiss Pro
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Unlock all Pro features and take your invoicing to the next level.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ul className="space-y-3">
            {proFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-gray-700">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="sm:flex-col sm:space-y-2">
          <Button asChild className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90">
            <Link href="/dashboard/billing">Upgrade Now</Link>
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Maybe Later
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
