const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vqwbfcxvffbbsgyibgjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxd2JmY3h2ZmZiYnNneWliZ2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MzA2NDcsImV4cCI6MjA5MDAwNjY0N30.Ozn0vB1L-4PydK03e6LhrK8kNJDh3ODu62MlR-pqZZE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { error } = await supabase
    .from('productos')
    .update({ slug: 'medicube-pdrn-pink-collagen-capsule-cream' })
    .eq('id', '2035080b-d37d-4f35-9875-9b36626bfaf2');
    
  if (error) console.error(error);
  else console.log('Slug successfully corrected!');
}

fix();
