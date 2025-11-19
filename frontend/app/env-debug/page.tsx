export const dynamic = 'force-dynamic';

export default function EnvDebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">ThirdWeb Configuration</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium">NEXT_PUBLIC_THIRDWEB_CLIENT_ID:</span>
            <code className="ml-2 bg-white p-1 rounded">
              {process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || 'Not set'}
            </code>
          </div>
          <div>
            <span className="font-medium">THIRDWEB_SECRET_KEY:</span>
            <code className="ml-2 bg-white p-1 rounded">
              {process.env.THIRDWEB_SECRET_KEY ? '*** (set but hidden) ***' : 'Not set'}
            </code>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Celo Network</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium">NEXT_PUBLIC_CELO_RPC_URL:</span>
            <code className="ml-2 bg-white p-1 rounded">
              {process.env.NEXT_PUBLIC_CELO_RPC_URL || 'Not set'}
            </code>
          </div>
          <div>
            <span className="font-medium">NEXT_PUBLIC_CHAIN_ID:</span>
            <code className="ml-2 bg-white p-1 rounded">
              {process.env.NEXT_PUBLIC_CHAIN_ID || 'Not set'}
            </code>
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-medium">Troubleshooting Tips:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Make sure your <code>.env</code> file is in the <code>frontend</code> directory</li>
          <li>Restart your Next.js dev server after making changes to <code>.env</code> files</li>
          <li>Check for any syntax errors in your <code>.env</code> file</li>
          <li>Ensure variables are prefixed with <code>NEXT_PUBLIC_</code> if they need to be available in the browser</li>
        </ul>
      </div>
    </div>
  );
}
