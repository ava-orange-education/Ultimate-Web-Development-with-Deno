import { define } from "../../utils.ts";

interface Comment {
  postId: string;
  name: string;
  comment: string;
  timestamp: string;
}

interface CommentInput {
  postId: string;
  name: string;
  comment: string;
}

// In-memory store — in a real application this would be a database.
const comments: Comment[] = [];

function parseCommentInput(value: unknown): CommentInput | null {
  if (typeof value !== "object" || value === null) return null;
  const input = value as Record<string, unknown>;

  const { postId, name, comment } = input;
  if (
    typeof postId !== "string" || postId.trim() === "" ||
    typeof name !== "string" || name.trim() === "" ||
    typeof comment !== "string" || comment.trim() === ""
  ) {
    return null;
  }

  return { postId, name, comment };
}

export const handler = define.handlers({
  GET(ctx) {
    const postId = ctx.url.searchParams.get("postId");
    const result = postId
      ? comments.filter((comment) => comment.postId === postId)
      : comments;

    return Response.json(result);
  },

  async POST(ctx) {
    let payload: unknown;
    try {
      payload = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const input = parseCommentInput(payload);
    if (!input) {
      return Response.json(
        { error: "postId, name and comment are required" },
        { status: 400 },
      );
    }

    const comment: Comment = {
      ...input,
      timestamp: new Date().toISOString(),
    };
    comments.push(comment);

    return Response.json(comment, { status: 201 });
  },
});
