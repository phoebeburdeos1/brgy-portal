export function EnvSetupMessage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">Supabase not configured</h2>
        <p className="text-amber-800 dark:text-amber-300 mb-4">
          Add your Supabase URL and keys so the app can connect to your database.
        </p>
        <ol className="list-decimal list-inside text-sm text-amber-800 dark:text-amber-300 space-y-2 mb-4">
          <li>In the <code className="bg-amber-100 px-1 rounded">next-app</code> folder, copy <code className="bg-amber-100 px-1 rounded">.env.local.example</code> to <code className="bg-amber-100 px-1 rounded">.env.local</code>.</li>
          <li>Open Supabase Dashboard → your project → <strong>Settings → API</strong>.</li>
          <li>Paste <strong>Project URL</strong> into <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>.</li>
          <li>Paste the <strong>anon public</strong> key into <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
          <li>Paste the <strong>service_role</strong> key into <code className="bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> (keep this secret).</li>
          <li>Set <code className="bg-amber-100 px-1 rounded">ADMIN_PASSWORD</code> to any password for the admin login.</li>
          <li>Save the file and restart the dev server (<code className="bg-amber-100 px-1 rounded">npm run dev</code>).</li>
        </ol>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          After that, refresh this page and the app will load.
        </p>
      </div>
    </div>
  )
}
