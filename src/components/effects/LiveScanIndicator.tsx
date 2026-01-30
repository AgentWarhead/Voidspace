export function LiveScanIndicator() {
  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-near-green opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-near-green" />
      </span>
      <span className="text-xs font-medium text-near-green">Scanning</span>
    </div>
  );
}
