import * as z from "zod";
import { NextRequest } from "next/server";
import { openai } from "@raight/lib/ai";
import { Logger } from "@raight/lib/logger";

const schema = z.object({
  id: z.string(),
  runId: z.string(),
  threadId: z.string(),
});

type Payload = z.infer<typeof schema>;

const logger = Logger.create("api/assistant/run");

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as Payload;
  logger.info(`${payload.id} fetching run`);

  let run: Awaited<ReturnType<typeof openai.beta.threads.runs.create>>;
  try {
    run = await openai.beta.threads.runs.retrieve(
      payload.threadId,
      payload.runId
    );
    logger.info(`${payload.id} retrieved run`);
  } catch (error) {
    logger.error(`${payload.id} error creating run. ${error}`);
    return new Response(null, { status: 500 });
  }

  logger.info(`${payload.id} run status ${run.status}`);
  let message: string | undefined = undefined;

  if (run.status === "completed") {
    let messages: Awaited<ReturnType<typeof openai.beta.threads.messages.list>>;
    try {
      messages = await openai.beta.threads.messages.list(payload.threadId);
      logger.info(`${payload.id} retrieved thread messages`);
    } catch (error) {
      logger.error(`${payload.id} error creating message. ${error}`);
      return new Response(null, { status: 500 });
    }

    if (messages) {
      const textMessage = messages.data
        .at(0)
        ?.content.find((c) => c.type === "text");

      if (textMessage && "text" in textMessage) {
        message = textMessage.text.value;

        if (message.startsWith("```json") && message.endsWith("```")) {
          message = message
            .trim()
            .slice("```json".length, message.length - "```".length);
        }
      }
    }
  }

  return Response.json({
    id: run.id,
    status: run.status,
    message,
  });
}
