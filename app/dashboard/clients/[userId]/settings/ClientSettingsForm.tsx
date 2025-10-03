"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { updateClientSettings } from "@/app/actions/updateClientSettings";

interface ClientSettingsFormProps {
  userId: string;
  initialFirstName: string;
  initialLastName: string;
  initialActive: boolean;
  clientName: string;
}

export default function ClientSettingsForm({
  userId,
  initialFirstName,
  initialLastName,
  initialActive,
  clientName,
}: ClientSettingsFormProps) {
  const initialFullName = `${initialFirstName} ${initialLastName}`.trim();
  const [fullName, setFullName] = useState(initialFullName);
  const [isActive, setIsActive] = useState(initialActive);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const parseFullName = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return { firstName: "", lastName: "" };

    const nameParts = trimmedName.split(/\s+/);
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: "" };
    }

    const lastName = nameParts[nameParts.length - 1];
    const firstName = nameParts.slice(0, -1).join(" ");
    return { firstName, lastName };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { firstName, lastName } = parseFullName(fullName);
      const result = await updateClientSettings(
        userId,
        firstName,
        lastName,
        isActive
      );

      if (result.success) {
        setMessage({
          type: "success",
          text: "Client settings updated successfully",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update client settings",
        });
      }
    } catch (error) {
      console.error("Error updating client settings:", error);
      setMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = fullName !== initialFullName || isActive !== initialActive;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-gray-700"
        >
          Client Name
        </label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter full name"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label className="text-sm font-medium">Active Client</label>
          <p className="text-sm text-gray-600">
            Deactivated clients will lose access to the ReactivityTracker mobile app. Only active clients count toward your billing.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
            disabled={isLoading}
            aria-label={`Toggle ${clientName} active status`}
          />
          <span className="text-sm text-gray-700">
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading || !hasChanges}
          className="min-w-[120px]"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
