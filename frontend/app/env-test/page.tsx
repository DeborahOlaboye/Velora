export default function EnvTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">NEXT_PUBLIC_THIRDWEB_CLIENT_ID:</h2>
          <code className="bg-gray-100 p-2 rounded block overflow-x-auto">
            {process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || 'Not set'}
          </code>
        </div>
        <div>
          <h2 className="font-semibold">THIRDWEB_SECRET_KEY:</h2>
          <code className="bg-gray-100 p-2 rounded block overflow-x-auto">
            {process.env.THIRDWEB_SECRET_KEY ? 'Set (hidden for security)' : 'Not set'}
          </code>
        </div>
      </div>
    </div>
  );
}
