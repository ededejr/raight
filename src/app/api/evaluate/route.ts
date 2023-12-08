import * as z from "zod";
import { NextRequest } from "next/server";
import { openai } from "@raight/lib/ai";
import { Logger } from "@raight/lib/logger";
import SystemInstructions from "./system-instructions.json";
import { Constants } from "@raight/utils/constants";

const schema = z.object({
  id: z.string(),
  content: z.string(),
  model: z.enum(Constants.llms),
});

type Payload = z.infer<typeof schema>;

const logger = Logger.create("api/evaluate");

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as Payload;
  logger.info(`${payload.id} generating suggestions`);

  let completion: Awaited<ReturnType<typeof openai.chat.completions.create>>;
  try {
    completion = await openai.chat.completions.create({
      model: payload.model,
      messages: [
        { role: "system", content: JSON.stringify(SystemInstructions) },
        { role: "user", content: payload.content },
      ],
      stream: false,
      response_format: { type: "json_object" },
      temperature: 0.1,
    });
    logger.info(`${payload.id} created completion`);
  } catch (error) {
    logger.error(`${payload.id} error creating completion. ${error}`);
    return new Response(null, { status: 500 });
  }

  let data;
  if (completion.choices[0].finish_reason === "stop") {
    const message = completion.choices[0].message.content;

    if (message) {
      try {
        data = JSON.parse(message);
      } catch (error) {
        logger.error(`${payload.id} error parsing message. ${error}`);
      }
    }
  }

  if (data) {
    if (
      "rating" in data &&
      "tone" in data &&
      "style" in data &&
      "suggestions" in data &&
      Array.isArray(data.suggestions)
    ) {
      return Response.json(data);
    } else {
      logger.warn(`${payload.id} llm failed to generate valid json,\n${data}`);
    }
  }

  return new Response(null, { status: 500 });
}
