"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { InvoiceFormValues } from "@/lib/validators/invoice.schema";

export function MilestoneManager() {
  const { control, watch, setValue } = useFormContext<InvoiceFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
  });

  const hasSchedule = watch("hasPaymentSchedule");
  const totalAmount = watch("totalAmount") || 0;

  const milestones = watch("milestones") || [];
  const milestoneTotal = milestones.reduce(
    (sum, m) => sum + (m.amount || 0),
    0
  );
  const remaining = totalAmount - milestoneTotal;

  const toggleSchedule = (checked: boolean) => {
    setValue("hasPaymentSchedule", checked);
    if (checked && fields.length === 0) {
      const half = totalAmount / 2;
      append({ name: "Initial Deposit", amount: half, dueDate: new Date() });
      append({ name: "Final Payment", amount: half, dueDate: new Date() });
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-lg">Payment Schedule</CardTitle>
          <p className="text-sm text-muted-foreground">
            Split this invoice into multiple payments
          </p>
        </div>
        <Switch checked={hasSchedule} onCheckedChange={toggleSchedule} />
      </CardHeader>

      {hasSchedule && (
        <CardContent className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          {Math.abs(remaining) > 1 && (
            <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>
                {remaining > 0
                  ? `Remaining amount to allocate: ₦${remaining.toLocaleString()}`
                  : `You exceeded the total by ₦${Math.abs(remaining).toLocaleString()}`}
              </span>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex gap-3 items-start">
                  <FormField
                    control={control}
                    name={`milestones.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">
                          Milestone Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Deposit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Amount */}
                  <FormField
                    control={control}
                    name={`milestones.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormLabel className="text-xs">Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 items-end">
                  {/* Date */}
                  <FormField
                    control={control}
                    name={`milestones.${index}.dueDate`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
              append({
                name: "",
                amount: 0,
                dueDate: new Date(),
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
