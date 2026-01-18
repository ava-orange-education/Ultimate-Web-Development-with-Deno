"use server";

import { revalidatePath } from "next/cache";

export async function deleteDinosaur(name: string) {
  console.log(`Deleting dinosaur ${name} on the server...`);

  // In a real application, you would mutate a database here.

  revalidatePath("/");
}

