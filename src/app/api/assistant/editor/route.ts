import * as z from "zod";
import { NextRequest } from "next/server";
import { openai } from "@raight/lib/ai";
import { Settings } from "@raight/lib/settings";
import { Logger } from "@raight/lib/logger";

const schema = z.object({
  id: z.string(),
  threadId: z.string(),
  content: z.string(),
});

type Payload = z.infer<typeof schema>;

const logger = Logger.create("api/assistant/editor");

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as Payload;
  logger.info(`${payload.id} synthesizing thread`);

  let thread: Awaited<ReturnType<typeof openai.beta.threads.retrieve>>;
  try {
    thread = await openai.beta.threads.retrieve(payload.threadId);
    logger.info(`${payload.id} retrieved thread`);
  } catch (error) {
    logger.error(`${payload.id} error retrieving thread. ${error}`);
    return new Response(null, { status: 400 });
  }

  let assistant: Awaited<ReturnType<typeof openai.beta.assistants.retrieve>>;
  try {
    assistant = await openai.beta.assistants.retrieve(
      Settings.apis.openai.assistants.jorja
    );
    logger.info(`${payload.id} retrieved assistant`);
  } catch (error) {
    logger.error(`${payload.id} error retrieving assistant. ${error}`);
    return new Response(null, { status: 500 });
  }

  let messages: Awaited<ReturnType<typeof openai.beta.threads.messages.create>>;
  try {
    messages = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: payload.content,
    });
    logger.info(`${payload.id} created message`);
  } catch (error) {
    logger.error(`${payload.id} error creating message. ${error}`);
    return new Response(null, { status: 500 });
  }

  let run: Awaited<ReturnType<typeof openai.beta.threads.runs.create>>;
  try {
    run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      tools: [{ type: "retrieval" }],
      metadata: { noteId: payload.id },
    });
    logger.info(`${payload.id} created thread run`);
  } catch (error) {
    logger.error(`${payload.id} error creating run. ${error}`);
    return new Response(null, { status: 500 });
  }

  return Response.json({
    id: run.id,
    status: run.status,
  });
}
