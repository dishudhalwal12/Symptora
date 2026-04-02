"use client";

import { useState } from "react";
import { Bell, LogOut, Shield, Sparkles } from "lucide-react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user, logout, resetPassword } = useAuth();
  const [emailForReset, setEmailForReset] = useState(user?.email || "");
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="page-fade-in">
      <PageIntro
        eyebrow="Settings"
        title="Control access, support tools, and workspace handoff settings"
        description="Manage security actions, service availability, and operational preferences from one cleaner control surface."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="accent-panel border-0 p-6">
          <div className="flex items-start gap-3">
            <Shield className="mt-1 h-5 w-5 text-[#10253c]" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#5f7180]">Account</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-950">Security actions</h3>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">Reset password email</Label>
              <Input value={emailForReset} onChange={(event) => setEmailForReset(event.target.value)} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={async () => {
                  await resetPassword(emailForReset);
                  setStatus("Password reset email sent.");
                }}
              >
                Send reset email
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  await logout();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
            {status ? <p className="text-sm text-[#5f7180]">{status}</p> : null}
          </div>
        </Card>

        <Card className="mesh-panel border-0 p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 h-5 w-5 text-[#10253c]" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#5f7180]">Connections</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-950">Product services</h3>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm leading-7 text-gray-600">
            <div className="bubble-card rounded-[22px] p-4">
              Account access, saved records, and workspace data stay connected across the product.
            </div>
            <div className="bubble-card rounded-[22px] p-4">
              Clinical scoring modules use the connected assessment service to generate risk and likelihood outputs.
            </div>
            <div className="bubble-card rounded-[22px] p-4">
              Explanation and summary tools support the product experience without replacing the primary assessment outputs.
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="ink-panel border-0 p-6">
          <div className="flex items-start gap-3">
            <Bell className="mt-1 h-5 w-5 text-white" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/55">Workspace readiness</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Operational preferences</h3>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">Notifications</p>
              <p className="mt-3 text-lg font-semibold text-white">Digest enabled</p>
              <p className="mt-2 text-sm leading-7 text-white/72">Summary-style alerts are ready for dashboard, history, and upload changes.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">Export mode</p>
              <p className="mt-3 text-lg font-semibold text-white">PDF handoff</p>
              <p className="mt-2 text-sm leading-7 text-white/72">Assessment reports are configured for presentation-friendly PDF exports.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">Support tools</p>
              <p className="mt-3 text-lg font-semibold text-white">AI assist active</p>
              <p className="mt-2 text-sm leading-7 text-white/72">Plain-language summary and explanation helpers remain available alongside core model outputs.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
