import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://edztkjyaksuxprxefgzj.supabase.co";
const SUPABASE_KEY = "sb_publishable_PpsBHw9T1M_9kbJICwtW9g_HYy5QkXH";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
