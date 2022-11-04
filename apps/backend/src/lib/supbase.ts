/* eslint-disable prettier/prettier */

import { createClient } from '@supabase/supabase-js';
export const client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);
