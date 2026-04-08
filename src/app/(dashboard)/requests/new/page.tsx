"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestForm } from "@/components/requests/request-form";
import { createRequest } from "@/lib/actions/requests";
import type { CreateRequestInput } from "@/lib/validations/request";

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateRequestInput) => {
    setLoading(true);
    const result = await createRequest(data);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`Request ${result.requestCode} created successfully`);
    router.push("/requests");
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/requests" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Request</h1>
          <p className="text-sm text-muted-foreground">Submit a new service request</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestForm mode="create" onSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
