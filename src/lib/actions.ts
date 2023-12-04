"use server";
import { openai } from "@raight/lib/ai";
import { Logger } from "@raight/lib/logger";

export async function createThread() {
  const logger = Logger.create("createNote");
  const thread = await openai.beta.threads.create();
  logger.info("created thread");
  return thread;
}

export async function deleteThread(threadId: string) {
  const logger = Logger.create("deleteThread");
  await openai.beta.threads.del(threadId);
  logger.info("deleted thread");
}
