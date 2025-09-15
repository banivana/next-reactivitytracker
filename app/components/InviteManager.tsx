"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash2, Plus, Check } from "lucide-react";
import {
  createInvite,
  deleteInvite,
  getTrainerInvite,
} from "@/app/auth/invite/actions";

interface Invite {
  id: string;
  invite_id: string;
  trainer_id: string;
  created_at: string;
}

export default function InviteManager() {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadInvite();
  }, []);

  const loadInvite = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTrainerInvite();

      if (result.success) {
        setInvite(result.data);
      } else {
        setError(result.error || "Failed to load invite");
      }
    } catch (error) {
      console.error("Error loading invite:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const result = await createInvite();

      if (result.success) {
        setInvite(result.data);
      } else {
        setError(result.error || "Failed to create invite");
      }
    } catch (error) {
      console.error("Error creating invite:", error);
      setError("An unexpected error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInvite = async () => {
    if (!invite) return;

    try {
      setActionLoading(true);
      setError(null);
      const result = await deleteInvite(invite.invite_id);

      if (result.success) {
        setInvite(null);
      } else {
        setError(result.error || "Failed to delete invite");
      }
    } catch (error) {
      console.error("Error deleting invite:", error);
      setError("An unexpected error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyInviteUrl = async () => {
    if (!invite) return;

    const inviteUrl = `${window.location.origin}/invite/${invite.invite_id}`;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = inviteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Invite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Invite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        {!invite ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              You don&apos;t have an active invite. Create one to invite new
              clients.
            </p>
            <Button
              onClick={handleCreateInvite}
              disabled={actionLoading}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {actionLoading ? "Creating..." : "Create Invite"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">
                  Invite URL
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white border rounded text-sm text-gray-800 overflow-hidden">
                  {window.location.origin}/invite/{invite.invite_id}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyInviteUrl}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteInvite}
                disabled={actionLoading}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {actionLoading ? "Deleting..." : "Delete Invite"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
