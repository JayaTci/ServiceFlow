"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequestForm } from "@/components/requests/request-form";
import { updateRequest } from "@/lib/actions/requests";
import type { UpdateRequestInput } from "@/lib/validations/request";

interface RequestEditFormProps {
  requestId: number;
  defaultValues: UpdateRequestInput;
}

export function RequestEditForm({ requestId, defaultValues }: RequestEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: UpdateRequestInput) => {
    setLoading(true);
    const result = await updateRequest(requestId, data);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Request updated successfully");
    router.push(`/requests/${requestId}`);
    router.refresh();
  };

  return (
    <RequestForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
