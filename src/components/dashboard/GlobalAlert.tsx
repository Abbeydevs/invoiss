"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, AlertOctagon, X } from "lucide-react";
import { getActiveBroadcast } from "@/lib/api/broadcast-actions";
import { Button } from "@/components/ui/button";

type Broadcast = {
  id: string;
  message: string;
  type: "INFO" | "WARNING" | "CRITICAL";
};

export function GlobalAlert() {
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const data = await getActiveBroadcast();
        setBroadcast(data);
      } catch (error) {
        console.error("Failed to fetch broadcast", error);
      }
    };
    fetchBroadcast();
  }, []);

  if (!broadcast || !isVisible) return null;

  let styles = "border-blue-200 bg-blue-50 text-blue-800";
  let Icon = Info;

  if (broadcast.type === "WARNING") {
    styles = "border-yellow-200 bg-yellow-50 text-yellow-800";
    Icon = AlertTriangle;
  } else if (broadcast.type === "CRITICAL") {
    styles = "border-red-200 bg-red-50 text-red-800";
    Icon = AlertOctagon;
  }

  return (
    <div className="mb-6 animate-in slide-in-from-top-2">
      <Alert className={`${styles} relative shadow-sm`}>
        <Icon className="h-4 w-4" />
        <div className="flex-1 mr-6">
          <AlertTitle className="font-bold mb-1">
            {broadcast.type === "CRITICAL"
              ? "Important System Notice"
              : "Announcement"}
          </AlertTitle>
          <AlertDescription>{broadcast.message}</AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 hover:bg-black/5"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3 w-3" />
        </Button>
      </Alert>
    </div>
  );
}
