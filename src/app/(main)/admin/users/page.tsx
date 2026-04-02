"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminTabs } from "@/components/admin/AdminTabs";
import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { RecoveryState } from "@/components/ui/recovery-state";
import { getDemoUserDirectory } from "@/lib/demo-data";
import { adminService } from "@/services/admin.service";
import { UserDocument } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService.getUserDirectory().then((payload) => {
      setUsers(payload.length > 0 ? payload : getDemoUserDirectory());
    }).catch((err) => {
      setError(err instanceof Error ? err.message : "Unable to load the user directory.");
      setUsers(getDemoUserDirectory());
    });
  }, []);

  return (
    <div className="page-fade-in">
      <PageIntro
        eyebrow="Admin"
        title="User directory"
        description="Inspect user roles, open profiles, and review each user’s assessments and uploads."
      />
      <AdminTabs />

      {error ? (
        <div className="mb-4">
          <RecoveryState
            title="Live user directory unavailable"
            description={error}
            actionLabel="Retry user directory"
            onAction={() => window.location.reload()}
          />
        </div>
      ) : null}
      <Card className="shell-card border-0 p-6">
        <div className="space-y-3">
          {users.length > 0 ? users.map((user) => (
            <Link key={user.uid} href={`/admin/users/${user.uid}`} className="block rounded-[22px] bg-[#f7f4ef] p-4 hover:bg-white">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-gray-950">{user.fullName}</p>
                  <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-gray-600">{user.role}</div>
              </div>
            </Link>
          )) : <EmptyState title="No users to display" description="The directory will populate once Firestore has user documents to show." />}
        </div>
      </Card>
    </div>
  );
}
