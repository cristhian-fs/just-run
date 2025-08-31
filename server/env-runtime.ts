import { config } from "dotenv";
import { parseEnv } from "@/env";

config();

export default parseEnv(Object.assign(process.env));
