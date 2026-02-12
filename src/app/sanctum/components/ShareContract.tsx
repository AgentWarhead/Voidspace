'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Link2, Send } from 'lucide-react';

interface ShareContractProps {
  code: string;
  contractName?: string;
  category?: string;
  onClose: () => void;
}

export function ShareContract({ code, contractName = 'My Contract', category, onClose }: ShareContractProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Generate a shareable URL (in production, this would save to backend)
  const generateShareUrl = () => {
    // Base64 encode the contract for URL sharing
    const encoded = btoa(encodeURIComponent(code));
    const params = new URLSearchParams({
      code: encoded,
      name: contractName,
      ...(category && { cat: category })
    });
    const url = `${window.location.origin}/sanctum?remix=${params.toString()}`;
    setShareUrl(url);
    return url;
  };

  const copyToClipboard = async () => {
    const url = shareUrl || generateShareUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const url = shareUrl || generateShareUrl();
    const text = `🔮 Just built "${contractName}" on Voidspace Sanctum!\n\nBuild your own smart contracts with AI → `;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToTelegram = () => {
    const url = shareUrl || generateShareUrl();
    const text = `🔮 Check out this smart contract I built on Voidspace Sanctum!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-void-darker border border-void-purple/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-void-purple/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-void-purple to-void-cyan flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Share Contract</h3>
            <p className="text-sm text-gray-400">Let others remix your creation</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Contract Preview */}
          <div className="bg-void-black/50 rounded-lg p-4 border border-void-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-void-cyan font-mono text-sm">📄 {contractName}</span>
              {category && (
                <span className="px-2 py-0.5 bg-void-purple/20 text-void-purple text-xs rounded-full">
                  {category}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-xs">
              {code.split('\n').length} lines of Rust
            </p>
          </div>

          {/* Share URL */}
          {shareUrl && (
            <div className="bg-void-black/50 rounded-lg p-3 border border-void-purple/20">
              <p className="text-xs text-gray-400 mb-1">Share Link</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-void-cyan truncate flex-1">
                  {shareUrl.slice(0, 50)}...
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-1 hover:bg-void-purple/20 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={copyToClipboard}
              className="flex flex-col items-center gap-2 p-4 bg-void-black/50 hover:bg-void-purple/20 border border-void-purple/20 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-void-purple/20 flex items-center justify-center group-hover:bg-void-purple/30 transition-colors">
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Link2 className="w-5 h-5 text-void-purple" />
                )}
              </div>
              <span className="text-xs text-gray-400">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={shareToTwitter}
              className="flex flex-col items-center gap-2 p-4 bg-void-black/50 hover:bg-blue-500/20 border border-void-purple/20 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <span className="text-lg">𝕏</span>
              </div>
              <span className="text-xs text-gray-400">Twitter</span>
            </button>

            <button
              onClick={shareToTelegram}
              className="flex flex-col items-center gap-2 p-4 bg-void-black/50 hover:bg-cyan-500/20 border border-void-purple/20 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                <Send className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-gray-400">Telegram</span>
            </button>
          </div>

          {/* Remix Info */}
          <div className="bg-gradient-to-r from-void-purple/10 to-void-cyan/10 rounded-lg p-4 border border-void-purple/20">
            <p className="text-sm text-gray-300">
              <span className="text-void-cyan font-semibold">🔄 Remix Mode:</span> Anyone with this link can open your contract in Sanctum and customize it!
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-void-purple/20 hover:bg-void-purple/30 text-white rounded-xl transition-colors font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
}
