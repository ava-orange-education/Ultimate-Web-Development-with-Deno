import data from "../../data.json" with { type: "json" };
import type { Dino } from "../../../types";

type RouteParams = { params: Promise<{ dinosaur: string }> };

export const GET = async (_request: Request, context: RouteParams) => {
  const { params } = context;
  const { dinosaur } = await params;

  if (!dinosaur) {
    return Response.json(
      { error: "No dinosaur name provided." },
      { status: 400 },
    );
  }

  const dinosaurs = data as Dino[];

  const dinosaurData = dinosaurs.find((item) =>
    item.name.toLowerCase() === dinosaur.toLowerCase()
  );

  if (!dinosaurData) {
    return Response.json({ error: "No dinosaur found." }, { status: 404 });
  }

  return Response.json(dinosaurData);
};

