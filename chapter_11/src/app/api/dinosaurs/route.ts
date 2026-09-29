import data from "../data.json" with { type: "json" };
import type { Dino } from "../../types";

export function GET() {
  const dinosaurs = data as Dino[];

  return Response.json(dinosaurs);
}

