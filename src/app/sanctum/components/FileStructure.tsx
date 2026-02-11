'use client';

import { useState, useMemo } from 'react';
import { Folder, FolderOpen, FileCode, FileText, ChevronRight, ChevronDown } from 'lucide-react';

interface FileStructureProps {
  code: string;
  contractName?: string;
  onFileSelect?: (filename: string, content: string) => void;
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  icon?: string;
  language?: string;
}

export function FileStructure({ code, contractName = 'my-contract', onFileSelect }: FileStructureProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'tests']));
  const [selectedFile, setSelectedFile] = useState<string>('src/lib.rs');

  const projectStructure = useMemo(() => generateStructure(code, contractName), [code, contractName]);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleFileClick = (path: string, content?: string) => {
    setSelectedFile(path);
    if (onFileSelect && content) {
      onFileSelect(path, content);
    }
  };

  const renderNode = (node: FileNode, path: string = '', depth: number = 0) => {
    const fullPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(fullPath);
    const isSelected = selectedFile === fullPath;

    if (node.type === 'folder') {
      return (
        <div key={fullPath}>
          <button
            onClick={() => toggleFolder(fullPath)}
            className={`w-full flex items-center gap-2 px-2 py-1 text-sm hover:bg-void-purple/10 rounded transition-colors ${
              isExpanded ? 'text-void-cyan' : 'text-gray-400'
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-amber-400 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />
            )}
            <span>{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div>
              {node.children.map(child => renderNode(child, fullPath, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // File
    const FileIcon = node.language === 'rust' ? FileCode : FileText;
    const iconColor = node.language === 'rust' 
      ? 'text-orange-400' 
      : node.name.endsWith('.toml') 
      ? 'text-blue-400'
      : 'text-gray-400';

    return (
      <button
        key={fullPath}
        onClick={() => handleFileClick(fullPath, node.content)}
        className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded transition-colors ${
          isSelected 
            ? 'bg-void-purple/20 text-white' 
            : 'text-gray-400 hover:bg-void-purple/10 hover:text-gray-300'
        }`}
        style={{ paddingLeft: `${depth * 12 + 20}px` }}
      >
        <FileIcon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
        <span className="truncate">{node.name}</span>
        {node.name === 'lib.rs' && (
          <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-near-green/20 text-near-green rounded">
            main
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-void-darker/50 border border-void-purple/20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-void-purple/20 bg-void-black/30 flex items-center gap-2">
        <Folder className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-white">{contractName}</span>
        <span className="text-xs text-gray-500">NEAR Project</span>
      </div>

      {/* File Tree */}
      <div className="p-2 max-h-[300px] overflow-y-auto">
        {projectStructure.map(node => renderNode(node))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-void-purple/20 bg-void-black/30 text-xs text-gray-500">
        {countFiles(projectStructure)} files • Ready to build
      </div>
    </div>
  );
}

function generateStructure(code: string, name: string): FileNode[] {
  const cargoToml = `[package]
name = "${name}"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
near-sdk = "5.0.0"

[profile.release]
codegen-units = 1
opt-level = "z"
lto = true
debug = false
panic = "abort"
overflow-checks = true`;

  const readme = `# ${name}

A NEAR smart contract built with Voidspace Sanctum.

## Quick Start

\`\`\`bash
# Build
cargo build --target wasm32-unknown-unknown --release

# Deploy
near deploy --accountId YOUR_ACCOUNT.testnet --wasmFile target/wasm32-unknown-unknown/release/${name.replace(/-/g, '_')}.wasm

# Test
cargo test
\`\`\``;

  const testFile = `#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;

    fn get_context() -> VMContextBuilder {
        VMContextBuilder::new()
    }

    #[test]
    fn test_contract_init() {
        let context = get_context();
        testing_env!(context.build());
        // Add your tests here
    }
}`;

  return [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'lib.rs', type: 'file', content: code, language: 'rust' },
      ],
    },
    {
      name: 'tests',
      type: 'folder',
      children: [
        { name: 'integration.rs', type: 'file', content: testFile, language: 'rust' },
      ],
    },
    { name: 'Cargo.toml', type: 'file', content: cargoToml, language: 'toml' },
    { name: 'README.md', type: 'file', content: readme, language: 'markdown' },
  ];
}

function countFiles(nodes: FileNode[]): number {
  return nodes.reduce((count, node) => {
    if (node.type === 'file') return count + 1;
    if (node.children) return count + countFiles(node.children);
    return count;
  }, 0);
}

// Compact toggle version
export function FileStructureToggle({ 
  isOpen,
  onToggle 
}: { 
  code?: string; 
  contractName?: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-2 text-sm rounded-lg border transition-all flex items-center gap-2 ${
        isOpen 
          ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
          : 'bg-white/[0.05] border-white/[0.1] text-gray-400 hover:bg-amber-500/10 hover:border-amber-500/20'
      }`}
      title="Toggle file structure"
    >
      <Folder className="w-4 h-4" />
    </button>
  );
}
