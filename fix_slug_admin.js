const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vqwbfcxvffbbsgyibgjz.supabase.co';
// USING SERVICE ROLE KEY TO BYPASS RLS
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxd2JmY3h2ZmZiYnNneWliZ2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQzMDY0NywiZXhwIjoyMDkwMDA2NjQ3fQ.j751VtSUXjh8FfTgiKVB5I8i2xG-0GwxGYCdkfOQHLU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data, error } = await supabase
    .from('productos')
    .update({ slug: 'medicube-pdrn-pink-collagen-capsule-cream' })
    .eq('id', '2035080b-d37d-4f35-9875-9b36626bfaf2')
    .select();
    
  if (error) console.error(error);
  else {
    console.log('Updated rows:', data.length);
    console.log(data);
  }
}

fix();
