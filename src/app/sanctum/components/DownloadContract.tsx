'use client';

import { useState } from 'react';
// @ts-ignore
import { Download, Package, FileCode, ChevronDown } from 'lucide-react';

interface DownloadContractProps {
  code: string;
  contractName?: string;
  category?: string;
}

export function DownloadContract({ code, contractName = 'contract', category }: DownloadContractProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const safeName = contractName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const crateNameSnake = safeName.replace(/-/g, '_');

  const downloadRustFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}.rs`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const downloadProjectZip = async () => {
    setIsGenerating(true);
    try {
      // Dynamic import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const projectFolder = zip.folder(safeName)!;

      // Cargo.toml
      projectFolder.file('Cargo.toml', generateCargoToml(safeName));

      // src/lib.rs
      const srcFolder = projectFolder.folder('src')!;
      srcFolder.file('lib.rs', code);

      // build.sh
      projectFolder.file('build.sh', generateBuildSh(crateNameSnake));

      // deploy.sh
      projectFolder.file('deploy.sh', generateDeploySh(crateNameSnake));

      // tests/integration.rs
      const testsFolder = projectFolder.folder('tests')!;
      testsFolder.file('integration.rs', generateIntegrationTests(code, crateNameSnake));

      // README.md
      projectFolder.file('README.md', generateReadme(safeName, crateNameSnake, code, category));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setIsGenerating(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-amber-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-amber-500/30"
        title="Download contract"
      >
        <Download className="w-4 h-4" />
        <ChevronDown className="w-3 h-3" />
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-void-darker border border-void-purple/30 rounded-xl shadow-2xl shadow-void-purple/20 overflow-hidden w-56">
            <button
              onClick={downloadProjectZip}
              disabled={isGenerating || !code}
              className="w-full px-4 py-3 flex items-center gap-3 text-sm text-white hover:bg-near-green/10 transition-colors disabled:opacity-50"
            >
              <Package className="w-4 h-4 text-near-green" />
              <div className="text-left">
                <div className="font-medium">
                  {isGenerating ? 'Generating...' : '📦 Download Project'}
                </div>
                <div className="text-xs text-gray-500">Full cargo-near scaffold</div>
              </div>
            </button>
            <div className="border-t border-white/[0.05]" />
            <button
              onClick={downloadRustFile}
              disabled={!code}
              className="w-full px-4 py-3 flex items-center gap-3 text-sm text-white hover:bg-amber-500/10 transition-colors disabled:opacity-50"
            >
              <FileCode className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="font-medium">Download .rs only</div>
                <div className="text-xs text-gray-500">Just the contract file</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Download button for toolbar (replaces old DownloadButton)
export function DownloadButton({ code, contractName = 'contract', category }: { code: string; contractName?: string; category?: string }) {
  return (
    <DownloadContract code={code} contractName={contractName} category={category} />
  );
}

// --- Generators ---

function generateCargoToml(name: string): string {
  return `[package]
name = "${name}"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
near-sdk = "5.6.0"
serde = { version = "1", features = ["derive"] }
serde_json = "1"

[profile.release]
codegen-units = 1
opt-level = "z"
lto = true
debug = false
panic = "abort"
overflow-checks = true
`;
}

function generateBuildSh(crateName: string): string {
  return `#!/bin/bash
set -e
echo "🔨 Building contract..."
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
echo "✅ Build complete! WASM at: target/wasm32-unknown-unknown/release/${crateName}.wasm"
`;
}

function generateDeploySh(crateName: string): string {
  return `#!/bin/bash
set -e
CONTRACT_NAME="\${1:-mycontract.testnet}"
echo "🚀 Deploying to $CONTRACT_NAME..."
near deploy "$CONTRACT_NAME" ./target/wasm32-unknown-unknown/release/${crateName}.wasm
echo "✅ Deployed! View at: https://explorer.testnet.near.org/accounts/$CONTRACT_NAME"
`;
}

function generateReadme(name: string, crateName: string, code: string, category?: string): string {
  const methods = parsePublicMethods(code);
  const categoryLabel = category ? category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Smart Contract';

  let methodDocs = '';
  if (methods.length > 0) {
    methodDocs = `## Public Methods\n\n| Method | Parameters | Attributes |\n|--------|-----------|------------|\n`;
    for (const m of methods) {
      const attrs = m.attributes.length > 0 ? m.attributes.join(', ') : '—';
      const params = m.params.length > 0 ? m.params.map(p => `\`${p}\``).join(', ') : '—';
      methodDocs += `| \`${m.name}\` | ${params} | ${attrs} |\n`;
    }
  }

  return `# ${name}

A NEAR Protocol ${categoryLabel} smart contract built with [Voidspace Sanctum](https://voidspace.io/sanctum).

## Prerequisites

- **Rust** — [Install](https://rustup.rs/)
  \`\`\`bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  \`\`\`
- **WASM target**
  \`\`\`bash
  rustup target add wasm32-unknown-unknown
  \`\`\`
- **NEAR CLI**
  \`\`\`bash
  npm install -g near-cli-rs
  \`\`\`

## Build

\`\`\`bash
chmod +x build.sh
./build.sh
\`\`\`

Or manually:

\`\`\`bash
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
\`\`\`

The compiled WASM will be at \`target/wasm32-unknown-unknown/release/${crateName}.wasm\`.

## Deploy

\`\`\`bash
chmod +x deploy.sh
./deploy.sh YOUR_ACCOUNT.testnet
\`\`\`

Or manually:

\`\`\`bash
near contract deploy YOUR_ACCOUNT.testnet use-file ./target/wasm32-unknown-unknown/release/${crateName}.wasm without-init-call network-config testnet sign-with-keychain send
\`\`\`

## Test

\`\`\`bash
cargo test
\`\`\`

${methodDocs}

## License

MIT
`;
}

function generateIntegrationTests(code: string, crateName: string): string {
  const methods = parsePublicMethods(code);
  const initMethod = methods.find(m => m.attributes.includes('#[init]'));
  const otherMethods = methods.filter(m => !m.attributes.includes('#[init]'));

  let testCases = '';
  if (initMethod) {
    testCases += `
    #[tokio::test]
    async fn test_init() -> anyhow::Result<()> {
        let (worker, contract) = setup().await?;
        // Contract should be initialized after setup
        // Add assertions here based on your init return values
        println!("Contract deployed at: {}", contract.id());
        Ok(())
    }
`;
  }

  for (const m of otherMethods.slice(0, 5)) {
    const isView = !m.attributes.includes('#[payable]') && m.name.startsWith('get');
    if (isView) {
      testCases += `
    #[tokio::test]
    async fn test_${m.name}() -> anyhow::Result<()> {
        let (_worker, contract) = setup().await?;
        let result: serde_json::Value = contract
            .view("${m.name}")
            .args_json(serde_json::json!({}))
            .await?
            .json()?;
        println!("${m.name} returned: {:?}", result);
        Ok(())
    }
`;
    } else {
      testCases += `
    #[tokio::test]
    async fn test_${m.name}() -> anyhow::Result<()> {
        let (_worker, contract) = setup().await?;
        let result = contract
            .call("${m.name}")
            .args_json(serde_json::json!({}))
            .max_gas()
            .transact()
            .await?;
        assert!(result.is_success(), "${m.name} should succeed");
        Ok(())
    }
`;
    }
  }

  if (testCases === '') {
    testCases = `
    #[tokio::test]
    async fn test_contract_deploys() -> anyhow::Result<()> {
        let (_worker, contract) = setup().await?;
        println!("Contract deployed at: {}", contract.id());
        Ok(())
    }
`;
  }

  return `use near_workspaces::{Account, Contract, Worker};
use serde_json;

async fn setup() -> anyhow::Result<(Worker<near_workspaces::network::Sandbox>, Contract)> {
    let worker = near_workspaces::sandbox().await?;
    let wasm = near_workspaces::compile_project("./").await?;
    let contract = worker.dev_deploy(&wasm).await?;

    // Initialize contract if needed
    let _outcome = contract
        .call("new")
        .args_json(serde_json::json!({}))
        .max_gas()
        .transact()
        .await?;

    Ok((worker, contract))
}

#[cfg(test)]
mod tests {
    use super::*;
${testCases}
}
`;
}

// --- Code Parsing Helpers ---

export interface ParsedMethod {
  name: string;
  params: string[];
  returnType: string;
  attributes: string[];
  isPayable: boolean;
  isPrivate: boolean;
  isInit: boolean;
}

export function parsePublicMethods(code: string): ParsedMethod[] {
  const methods: ParsedMethod[] = [];
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this line is a pub fn declaration
    const fnMatch = line.match(/pub\s+fn\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*(.+?))?\s*\{?$/);
    if (!fnMatch) continue;

    const [, name, paramsStr, returnType] = fnMatch;

    // Look backwards for attributes
    const attributes: string[] = [];
    for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
      const attrLine = lines[j].trim();
      if (attrLine.startsWith('#[')) {
        attributes.push(attrLine);
      } else if (attrLine === '' || attrLine.startsWith('//') || attrLine.startsWith('///')) {
        continue;
      } else {
        break;
      }
    }

    // Parse params (skip &self, &mut self)
    const params = paramsStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p && !p.includes('&self') && !p.includes('&mut self'));

    const isPayable = attributes.some(a => a.includes('payable'));
    const isPrivate = attributes.some(a => a.includes('private'));
    const isInit = attributes.some(a => a.includes('init'));

    methods.push({
      name,
      params,
      returnType: returnType?.trim() || 'void',
      attributes,
      isPayable,
      isPrivate,
      isInit,
    });
  }

  return methods;
}
