"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Trash2,
  AlertTriangle,
  Info,
  AlertOctagon,
  Loader2,
} from "lucide-react";
import {
  createBroadcast,
  toggleBroadcast,
  deleteBroadcast,
} from "@/lib/api/broadcast-actions";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Broadcast = {
  id: string;
  message: string;
  type: "INFO" | "WARNING" | "CRITICAL";
  isActive: boolean;
  createdAt: Date;
};

export function BroadcastManager({
  initialBroadcasts,
}: {
  initialBroadcasts: Broadcast[];
}) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"INFO" | "WARNING" | "CRITICAL">("INFO");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setIsSubmitting(true);
    try {
      await createBroadcast(message, type);
      toast.success("Broadcast created and active");
      setMessage("");
    } catch {
      toast.error("Failed to create broadcast");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    try {
      await toggleBroadcast(id, currentState);
      toast.success(
        currentState ? "Broadcast deactivated" : "Broadcast activated"
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBroadcast(id);
      toast.success("Broadcast deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border"
      >
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Message</label>
          <Input
            placeholder="e.g. Scheduled maintenance this Saturday at 2 AM..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="w-[150px] space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as "INFO" | "WARNING" | "CRITICAL")}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INFO">Info (Blue)</SelectItem>
              <SelectItem value="WARNING">Warning (Yellow)</SelectItem>
              <SelectItem value="CRITICAL">Critical (Red)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting || !message}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Post Alert
        </Button>
      </form>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialBroadcasts.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={() => handleToggle(item.id, item.isActive)}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.message}</TableCell>
                <TableCell>
                  {item.type === "INFO" && (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      <Info className="w-3 h-3 mr-1" /> Info
                    </Badge>
                  )}
                  {item.type === "WARNING" && (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Warning
                    </Badge>
                  )}
                  {item.type === "CRITICAL" && (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                      <AlertOctagon className="w-3 h-3 mr-1" /> Critical
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {format(new Date(item.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Broadcast?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove this message from
                          history.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {initialBroadcasts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-slate-500"
                >
                  No announcements yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
