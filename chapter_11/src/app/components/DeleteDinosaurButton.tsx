"use client";

import { useTransition } from "react";
import { deleteDinosaur } from "../actions/dinosaurs";

interface DeleteDinosaurButtonProps {
  name: string;
}

export function DeleteDinosaurButton(props: DeleteDinosaurButtonProps) {
  const { name } = props;
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await deleteDinosaur(name);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs text-red-300 hover:text-red-200 underline underline-offset-2 disabled:opacity-50"
      disabled={isPending}
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}

