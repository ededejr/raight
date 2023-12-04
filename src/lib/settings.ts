import dotenv from "dotenv";
dotenv.config();

const isDevelopmentEnvironment = process.env["NODE_ENV"] === "development";

const env = (args: TemplateStringsArray) => {
  const key = args[0];
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const Settings = {
  isDevelopmentEnvironment,
  site: {
    host: isDevelopmentEnvironment ? "http://localhost:3000" : env`SITE_URL`,
  },
  apis: {
    openai: {
      token: env`OPENAI_API_KEY`,
      assistants: {
        arry: env`OPENAI_ARRY_ASSISSTANT_ID`,
        jorja: env`OPENAI_JORJA_ASSISSTANT_ID`,
      },
    },
  },
};

export type ISettings = typeof Settings;
