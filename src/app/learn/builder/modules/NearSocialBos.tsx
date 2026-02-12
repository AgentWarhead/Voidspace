'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Globe, ExternalLink, CheckCircle, Blocks, Database, GitFork } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NearSocialBosProps {
  isActive: boolean;
  onToggle: () => void;
}

const NearSocialBos: React.FC<NearSocialBosProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEAR Social & BOS</h3>
            <p className="text-text-muted text-sm">Build composable widgets on the Blockchain Operating System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">60 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-purple-500/20 p-6">
          <div className="flex gap-2 mb-6 border-b border-border">
            {['overview', 'learn', 'practice', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={cn(
                  'px-4 py-2 font-medium transition-colors text-sm',
                  selectedTab === tab
                    ? 'text-purple-400 border-b-2 border-purple-500'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {selectedTab === 'overview' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-violet-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'NEAR Social and BOS (Blockchain Operating System) overview and architecture',
                    'Building widgets and components that live on-chain in Social DB',
                    'Social DB: the on-chain key-value store powering the social graph',
                    'Composability: importing and using other developers\' components in your widgets',
                    'Forking, remixing, and extending existing community widgets',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-violet-400" />
                    What Is NEAR Social / BOS?
                  </h4>
                  <p className="text-text-secondary mb-3">
                    BOS (Blockchain Operating System) is NEAR&apos;s vision for a decentralized frontend layer. Components (widgets) are stored on-chain in Social DB (<code className="text-purple-400 bg-purple-500/10 px-1 rounded">social.near</code>) and rendered by gateways like near.social:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// A simple BOS widget'}</div>
                    <div><span className="text-purple-400">const</span> greeting = <span className="text-yellow-300">&quot;Hello from BOS!&quot;</span>;</div>
                    <div className="mt-2"><span className="text-purple-400">return</span> (</div>
                    <div>  &lt;<span className="text-cyan-400">div</span>&gt;</div>
                    <div>    &lt;<span className="text-cyan-400">h1</span>&gt;{'{'}greeting{'}'}&lt;/<span className="text-cyan-400">h1</span>&gt;</div>
                    <div>    &lt;<span className="text-cyan-400">p</span>&gt;Account: {'{'}context.accountId{'}'}&lt;/<span className="text-cyan-400">p</span>&gt;</div>
                    <div>    &lt;<span className="text-cyan-400">Widget</span> src=<span className="text-yellow-300">&quot;mob.near/widget/Profile&quot;</span> props={'{'}{'{'} accountId: context.accountId {'}'}{'}'}  /&gt;</div>
                    <div>  &lt;/<span className="text-cyan-400">div</span>&gt;</div>
                    <div>);</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-violet-500/20 bg-violet-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-violet-400 font-semibold">Key concept:</span> Widgets are stored on-chain as source code in Social DB. Any gateway can render them. This means your frontend is censorship-resistant and composable — anyone can fork your widget or embed it in theirs.
                    </p>
                  </Card>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    Social DB
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Social DB is a smart contract (<code className="text-purple-400 bg-purple-500/10 px-1 rounded">social.near</code>) that stores key-value data for every NEAR account. It powers profiles, posts, follows, likes, and widget source code:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Read data from Social DB'}</div>
                    <div><span className="text-purple-400">const</span> profile = Social.getr(<span className="text-yellow-300">`${'${'}accountId{'}'}/profile`</span>);</div>
                    <div className="mt-2 text-text-muted">{'// Write data to Social DB'}</div>
                    <div>Social.set({'{'}</div>
                    <div>  post: {'{'}</div>
                    <div>    main: JSON.stringify({'{'}</div>
                    <div>      type: <span className="text-yellow-300">&quot;md&quot;</span>,</div>
                    <div>      text: <span className="text-yellow-300">&quot;My first on-chain post!&quot;</span>,</div>
                    <div>    {'}'}),</div>
                    <div>  {'}'},</div>
                    <div>{'}'});</div>
                    <div className="mt-2 text-text-muted">{'// Data structure in Social DB'}</div>
                    <div><span className="text-text-muted">{'// alice.near/profile/name → "Alice"'}</span></div>
                    <div><span className="text-text-muted">{'// alice.near/profile/image/url → "https://..."'}</span></div>
                    <div><span className="text-text-muted">{'// alice.near/widget/MyWidget → "<source code>"'}</span></div>
                    <div><span className="text-text-muted">{'// alice.near/graph/follow/bob.near → ""'}</span></div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Blocks className="w-5 h-5 text-emerald-400" />
                    Composability
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The killer feature of BOS is composability. You can import and use any widget published by any developer:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Use someone else\'s widget in yours'}</div>
                    <div>&lt;<span className="text-cyan-400">Widget</span></div>
                    <div>  src=<span className="text-yellow-300">&quot;mob.near/widget/MainPage.N.Post&quot;</span></div>
                    <div>  props={'{'}{'{'} accountId: <span className="text-yellow-300">&quot;alice.near&quot;</span>, blockHeight: 12345 {'}'}{'}'}  </div>
                    <div>/&gt;</div>
                    <div className="mt-3 text-text-muted">{'// Common composable widgets'}</div>
                    <div><span className="text-text-muted">{'// mob.near/widget/Profile — user profile card'}</span></div>
                    <div><span className="text-text-muted">{'// mob.near/widget/FollowButton — follow/unfollow'}</span></div>
                    <div><span className="text-text-muted">{'// near/widget/DIG.Button — design system button'}</span></div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    Think of it like npm packages, but on-chain. No installs, no builds — just reference the widget by account and name.
                  </p>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <GitFork className="w-5 h-5 text-amber-400" />
                    Forking and Remixing
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md" className="border-violet-500/20">
                      <h5 className="font-semibold text-violet-400 text-sm mb-2">How to Fork</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Find a widget on near.social</li>
                        <li>• Click the source code viewer ({"</>"})</li>
                        <li>• Copy the code to your own widget</li>
                        <li>• Modify and publish under your account</li>
                        <li>• Your fork: yourname.near/widget/MyFork</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">Why Fork?</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Customize UI for your community</li>
                        <li>• Add features the original lacks</li>
                        <li>• Learn from production widget code</li>
                        <li>• Experiment without breaking the original</li>
                        <li>• Open source by default — all code is on-chain</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Create Your First Widget</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Go to <code className="text-purple-400 bg-purple-500/10 px-1 rounded">near.social</code> and open the widget editor. Build a simple profile card that reads your profile from Social DB using <code className="text-purple-400 bg-purple-500/10 px-1 rounded">Social.getr</code>.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Write to Social DB</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Build a widget with a form that creates posts using <code className="text-purple-400 bg-purple-500/10 px-1 rounded">Social.set</code>. Add a feed that displays recent posts using <code className="text-purple-400 bg-purple-500/10 px-1 rounded">Social.index</code>.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Compose with Existing Widgets</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Build a dashboard that embeds 3 existing community widgets using the <code className="text-purple-400 bg-purple-500/10 px-1 rounded">&lt;Widget&gt;</code> component. Pass props to customize their behavior.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Browse near.social to discover popular widgets you can compose with.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Fork and Improve a Widget</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Find a widget on near.social, fork it, and add a meaningful improvement — a new feature, better styling, or additional data display. Publish it under your account.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR Social', url: 'https://near.social', desc: 'The main BOS gateway — browse, create, and fork widgets' },
                  { title: 'BOS Documentation', url: 'https://docs.near.org/bos', desc: 'Official BOS docs with tutorials and API reference' },
                  { title: 'Social DB Contract', url: 'https://github.com/nickldev/social-db', desc: 'Social DB smart contract source code' },
                  { title: 'BOS Component Library', url: 'https://near.social/near/widget/ComponentDetailsPage', desc: 'Browse community-built components' },
                  { title: 'BOS Loader (Local Dev)', url: 'https://github.com/nickldev/bos-loader', desc: 'Develop BOS widgets locally with hot reload' },
                  { title: 'NEAR Social Docs', url: 'https://thewiki.near.page/near.social', desc: 'Community wiki with BOS patterns and guides' },
                ].map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border hover:border-purple-500/30 transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-300 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-text-primary group-hover:text-purple-300">{link.title}</div>
                      <div className="text-xs text-text-muted">{link.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default NearSocialBos;
