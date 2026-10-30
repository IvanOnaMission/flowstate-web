-- The Notion CRM was retired on 31 October 2026; CRM outcomes now import from Twenty.
-- Before applying, add twenty_api_url and twenty_api_key to the flowstate_marketing_config
-- Vault secret via mkt_set_config, then deploy the meta-sync function.
select cron.unschedule('flowstate-marketing-leads-sync');
select cron.schedule('flowstate-marketing-leads-sync', '*/15 * * * *', $job$
  select net.http_post(
    url := 'https://ypsejvbfbfnpszxtwwoa.supabase.co/functions/v1/meta-sync',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization',
      'Bearer ' || (select decrypted_secret::jsonb->>'cron_auth' from vault.decrypted_secrets where name = 'flowstate_marketing_config')),
    body := '{"sources":["forms","calendly","twenty"]}'::jsonb,
    timeout_milliseconds := 120000
  );
$job$);
