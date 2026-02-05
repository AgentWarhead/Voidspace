'use client';

import { Download } from 'lucide-react';

interface DownloadContractProps {
  code: string;
  contractName?: string;
}

export function DownloadContract({ code, contractName = 'contract' }: DownloadContractProps) {
  
  const downloadRustFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName}.rs`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={downloadRustFile}
        className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-amber-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-amber-500/30"
        title="Download .rs file"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

// Download button for toolbar
export function DownloadButton({ code, contractName = 'contract' }: { code: string; contractName?: string }) {
  const downloadRustFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName}.rs`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadRustFile}
      disabled={!code}
      className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-amber-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-amber-500/30 disabled:opacity-50"
      title="Download contract"
    >
      <Download className="w-4 h-4" />
    </button>
  );
}
