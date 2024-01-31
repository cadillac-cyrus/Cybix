import { OpenAIStream } from "@/utils/openai";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  runtime: "edge",
};

async function handler(req, res) {
  const supabase = createMiddlewareClient({ req, res });
  const body = await req.json();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = await OpenAIStream(body);

  return new Response(stream, { status: 200 });
}

export default handler;