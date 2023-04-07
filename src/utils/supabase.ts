import { createClient } from "@supabase/supabase-js";
import { env } from "../env.mjs";

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
  env.NEXT_PUBLIC_SUPABASE_API_KEY
);

export const CDNURL = `${env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/images/`;
