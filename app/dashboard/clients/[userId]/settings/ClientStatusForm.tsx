"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { updateClientActiveStatus } from "@/app/actions/updateClientStatus";

interface ClientStatusFormProps {
  userId: string;
  initialActive: boolean;
  clientName: string;
}

export default function ClientStatusForm({
  userId,
  initialActive,
  clientName,
}: ClientStatusFormProps) {
  const [isActive, setIsActive] = useState(initialActive);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateClientActiveStatus(userId, isActive);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Client status updated successfully",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update client status",
        });
        // Revert the switch state if the update failed
        setIsActive(initialActive);
      }
    } catch (error) {
      console.error("Error updating client status:", error);
      setMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
      // Revert the switch state if there was an error
      setIsActive(initialActive);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = isActive !== initialActive;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label className="text-sm font-medium">Active Client</label>
          <p className="text-sm text-gray-600">
            Toggle whether this client is active. Inactive clients are grouped
            separately in the sidebar. Only active clients count toward your
            billing.
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

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
          className="min-w-[100px]"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
