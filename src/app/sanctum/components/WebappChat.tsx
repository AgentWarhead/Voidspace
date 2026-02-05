'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';
import { ExtractedMethod } from './ImportContract';

interface WebappChatProps {
  contractName: string;
  methods: ExtractedMethod[];
  onPreviewUpdate: (html: string) => void;
  onComponentAdd: (component: WebappComponent) => void;
  onTokensUsed: (tokens: number) => void;
}

export interface WebappComponent {
  id: string;
  type: 'header' | 'hero' | 'method-card' | 'footer' | 'stats' | 'wallet-button' | 'custom';
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  order: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  action?: 'template' | 'component' | 'style' | 'preview';
  componentAdded?: WebappComponent;
}

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal', emoji: '🖤', description: 'Clean and focused' },
  { id: 'dashboard', name: 'Dashboard', emoji: '📊', description: 'Data-rich with stats' },
  { id: 'marketplace', name: 'Marketplace', emoji: '🛒', description: 'Grid layouts and cards' },
  { id: 'social', name: 'Social', emoji: '👥', description: 'Profiles and feeds' },
];

const QUICK_ACTIONS = [
  { label: 'Add dark mode', icon: '🌙' },
  { label: 'Make it pop more', icon: '✨' },
  { label: 'Add animations', icon: '🎬' },
  { label: 'Mobile first', icon: '📱' },
];

export function WebappChat({ 
  contractName, 
  methods, 
  onPreviewUpdate,
  onComponentAdd,
  onTokensUsed 
}: WebappChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [components, setComponents] = useState<WebappComponent[]>([]);
  const [currentStep, setCurrentStep] = useState<'template' | 'customize' | 'polish'>('template');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `🎨 **Welcome to Webapp Builder!**\n\nI'll help you create a beautiful frontend for **${contractName}**.\n\nI found **${methods.length} methods** in your contract:\n${methods.slice(0, 5).map(m => `• \`${m.name}\` (${m.isView ? 'view' : 'change'})`).join('\n')}${methods.length > 5 ? `\n• ...and ${methods.length - 5} more` : ''}\n\n**First, pick a template style:**`,
      timestamp: new Date(),
      action: 'template',
    };
    setMessages([welcomeMessage]);
  }, [contractName, methods]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplates(false);
    setCurrentStep('customize');
    
    const template = TEMPLATES.find(t => t.id === templateId);
    
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: `I want the ${template?.name} template`,
      timestamp: new Date(),
    };

    // Add assistant response
    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: `${template?.emoji} **${template?.name} template selected!**\n\nI'm generating your webapp with:\n• Header with wallet connection\n• Hero section with your contract name\n• Cards for each contract method\n• Responsive footer\n\n*Building your preview...*`,
      timestamp: new Date(),
      action: 'preview',
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    
    // Generate initial components
    generateInitialComponents(templateId);
    onTokensUsed(500);
  };

  const generateInitialComponents = (templateId: string) => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const initialComponents: WebappComponent[] = [
        {
          id: 'header',
          type: 'header',
          name: 'Header',
          props: { 
            title: contractName,
            showWallet: true,
            sticky: true,
            theme: templateId === 'minimal' ? 'light' : 'dark',
          },
          order: 0,
        },
        {
          id: 'hero',
          type: 'hero',
          name: 'Hero Section',
          props: {
            title: `Welcome to ${contractName}`,
            subtitle: 'Interact with your NEAR smart contract',
            showStats: templateId === 'dashboard',
          },
          order: 1,
        },
        ...methods.map((method, i) => ({
          id: `method-${method.name}`,
          type: 'method-card' as const,
          name: method.name,
          props: {
            methodName: method.name,
            isView: method.isView,
            args: method.args,
          },
          order: 2 + i,
        })),
        {
          id: 'footer',
          type: 'footer',
          name: 'Footer',
          props: {
            showPoweredBy: true,
            links: ['Docs', 'GitHub', 'Discord'],
          },
          order: 100,
        },
      ];

      setComponents(initialComponents);
      initialComponents.forEach(c => onComponentAdd(c));
      
      // Generate preview
      const { html } = generatePreview(initialComponents, templateId);
      onPreviewUpdate(html);

      // Add completion message
      const completeMsg: ChatMessage = {
        id: `complete-${Date.now()}`,
        role: 'assistant',
        content: `✅ **Your webapp is ready!**\n\nI've created:\n• Sticky header with wallet button\n• Hero section\n• ${methods.length} method cards\n• Footer\n\n**Now let's customize it!** Tell me what you'd like to change:\n• "Make the header purple"\n• "Add a loading animation"\n• "Make the buttons bigger"\n• Or anything else!`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, completeMsg]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);
    onTokensUsed(100);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(input, components);
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        action: response.action,
        componentAdded: response.newComponent,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.updatedComponents) {
        setComponents(response.updatedComponents);
        const { html } = generatePreview(response.updatedComponents, selectedTemplate || 'minimal');
        onPreviewUpdate(html);
      }
      
      if (response.newComponent) {
        onComponentAdd(response.newComponent);
      }

      setIsGenerating(false);
    }, 1500);
  }, [input, isGenerating, components, selectedTemplate, onPreviewUpdate, onComponentAdd, onTokensUsed]);

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="flex flex-col h-full bg-void-black">
      {/* Progress Bar */}
      <div className="px-4 py-2 border-b border-void-purple/20 bg-void-darker/50">
        <div className="flex items-center gap-4">
          <StepIndicator 
            step={1} 
            label="Template" 
            active={currentStep === 'template'} 
            complete={currentStep !== 'template'} 
          />
          <div className="h-px flex-1 bg-void-purple/20" />
          <StepIndicator 
            step={2} 
            label="Customize" 
            active={currentStep === 'customize'} 
            complete={currentStep === 'polish'} 
          />
          <div className="h-px flex-1 bg-void-purple/20" />
          <StepIndicator 
            step={3} 
            label="Polish" 
            active={currentStep === 'polish'} 
            complete={false} 
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30'
                  : 'bg-void-darker border border-void-purple/20'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('•') ? 'ml-2' : ''}>
                    {line.includes('**') ? (
                      <span dangerouslySetInnerHTML={{ 
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                    .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-void-black/50 rounded text-cyan-400 text-xs">$1</code>')
                      }} />
                    ) : line}
                  </p>
                ))}
              </div>
              
              {/* Template Selection */}
              {msg.action === 'template' && showTemplates && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="p-3 rounded-xl bg-void-black/50 border border-void-purple/30 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-left group"
                    >
                      <span className="text-2xl mb-2 block">{template.emoji}</span>
                      <span className="text-sm font-medium text-white block">{template.name}</span>
                      <span className="text-xs text-gray-500">{template.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Generating indicator */}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-void-darker border border-void-purple/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Sparkles className="w-4 h-4 animate-pulse text-cyan-400" />
                <span>Generating...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {!showTemplates && !isGenerating && (
        <div className="px-4 py-2 border-t border-void-purple/20 bg-void-darker/30">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.label)}
                className="flex-shrink-0 px-3 py-1.5 bg-void-black/50 border border-void-purple/20 rounded-full text-xs text-gray-400 hover:text-white hover:border-cyan-500/30 transition-colors flex items-center gap-1.5"
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-void-purple/20 bg-void-darker/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={showTemplates ? "Pick a template above..." : "Describe what you want to change..."}
            disabled={showTemplates || isGenerating}
            className="flex-1 bg-void-black border border-void-purple/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating || showTemplates}
            className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white rounded-xl transition-colors flex items-center gap-2"
          >
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step, label, active, complete }: { step: number; label: string; active: boolean; complete: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
        complete 
          ? 'bg-cyan-500 text-white' 
          : active 
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
          : 'bg-void-gray text-gray-500'
      }`}>
        {complete ? <CheckCircle className="w-4 h-4" /> : step}
      </div>
      <span className={`text-xs ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
}

// AI response generator (mock)
type ActionType = 'template' | 'component' | 'style' | 'preview';

function generateAIResponse(
  input: string, 
  components: WebappComponent[]
): { message: string; action?: ActionType; updatedComponents?: WebappComponent[]; newComponent?: WebappComponent } {
  const inputLower = input.toLowerCase();
  
  if (inputLower.includes('dark mode') || inputLower.includes('dark')) {
    const updated = components.map(c => ({
      ...c,
      props: { ...c.props, theme: 'dark' }
    }));
    return {
      message: "🌙 **Dark mode activated!**\n\nI've updated all components to use a dark theme. The preview should update now.\n\nWant me to adjust the contrast or accent colors?",
      action: 'style',
      updatedComponents: updated,
    };
  }
  
  if (inputLower.includes('animation') || inputLower.includes('animate')) {
    const updated = components.map(c => ({
      ...c,
      props: { ...c.props, animated: true }
    }));
    return {
      message: "🎬 **Animations added!**\n\nI've added:\n• Fade-in on scroll\n• Hover effects on buttons\n• Loading spinners\n• Smooth transitions\n\nWant me to make them faster or slower?",
      action: 'style',
      updatedComponents: updated,
    };
  }
  
  if (inputLower.includes('button') && inputLower.includes('big')) {
    const updated = components.map(c => ({
      ...c,
      props: { ...c.props, buttonSize: 'large' }
    }));
    return {
      message: "🔘 **Buttons enlarged!**\n\nAll buttons are now larger and more prominent. This should improve the mobile experience too.\n\nAnything else to adjust?",
      action: 'style',
      updatedComponents: updated,
    };
  }
  
  if (inputLower.includes('purple') || inputLower.includes('color')) {
    const color = inputLower.includes('purple') ? 'purple' : inputLower.includes('blue') ? 'blue' : inputLower.includes('green') ? 'green' : 'purple';
    const updated = components.map(c => ({
      ...c,
      props: { ...c.props, accentColor: color }
    }));
    return {
      message: `🎨 **Color updated to ${color}!**\n\nThe accent color has been changed across all components:\n• Header\n• Buttons\n• Links\n• Highlights\n\nLooks great! What's next?`,
      action: 'style',
      updatedComponents: updated,
    };
  }
  
  if (inputLower.includes('pop') || inputLower.includes('stand out')) {
    const updated = components.map(c => ({
      ...c,
      props: { ...c.props, contrast: 'high', shadows: true, gradients: true }
    }));
    return {
      message: "✨ **Made it pop!**\n\nI've added:\n• Gradient backgrounds\n• Drop shadows\n• Higher contrast\n• Glowing accents\n\nYour webapp is looking 🔥 now!",
      action: 'style',
      updatedComponents: updated,
    };
  }
  
  if (inputLower.includes('mobile') || inputLower.includes('responsive')) {
    const updated = components.map(c => ({
      ...c,
      props: { ...c.props, mobileFirst: true, stackOnMobile: true }
    }));
    return {
      message: "📱 **Mobile optimized!**\n\nI've updated the layout:\n• Cards stack on mobile\n• Larger touch targets\n• Simplified navigation\n• Responsive text sizes\n\nCheck the mobile preview!",
      action: 'style',
      updatedComponents: updated,
    };
  }
  
  if (inputLower.includes('add') && (inputLower.includes('stats') || inputLower.includes('counter'))) {
    const newComponent: WebappComponent = {
      id: `stats-${Date.now()}`,
      type: 'stats',
      name: 'Stats Section',
      props: {
        stats: [
          { label: 'Total Users', value: '1,234' },
          { label: 'Transactions', value: '5,678' },
          { label: 'TVL', value: '$10.5K' },
        ]
      },
      order: 1.5,
    };
    return {
      message: "📊 **Stats section added!**\n\nI've added a statistics display showing:\n• Total Users\n• Transactions\n• TVL\n\nThese will pull from your contract once connected. Want to customize the metrics?",
      action: 'component',
      newComponent,
      updatedComponents: [...components, newComponent].sort((a, b) => a.order - b.order),
    };
  }
  
  // Default response
  return {
    message: `Got it! I'll work on "${input}".\n\n*Processing your request...*\n\nThis change has been applied to your preview. Let me know what else you'd like to adjust!`,
    updatedComponents: components,
  };
}

// Generate preview HTML/CSS
function generatePreview(components: WebappComponent[], template: string): { html: string; css: string } {
  const isDark = template !== 'minimal';
  
  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      background: ${isDark ? '#0a0a0f' : '#ffffff'};
      color: ${isDark ? '#ffffff' : '#1a1a2e'};
      min-height: 100vh;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .header { 
      padding: 16px 0;
      border-bottom: 1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : '#eee'};
      position: sticky;
      top: 0;
      background: ${isDark ? 'rgba(10, 10, 15, 0.9)' : 'rgba(255,255,255,0.9)'};
      backdrop-filter: blur(10px);
    }
    .header-content { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 20px; font-weight: bold; }
    .wallet-btn { 
      padding: 10px 20px;
      background: linear-gradient(135deg, #00EC97, #06b6d4);
      border: none;
      border-radius: 10px;
      color: black;
      font-weight: 600;
      cursor: pointer;
    }
    .hero {
      padding: 80px 0;
      text-align: center;
      background: ${isDark ? 'linear-gradient(180deg, rgba(139, 92, 246, 0.1), transparent)' : 'linear-gradient(180deg, #f8f9ff, transparent)'};
    }
    .hero h1 { font-size: 48px; margin-bottom: 16px; }
    .hero p { font-size: 18px; color: ${isDark ? '#a0a0a0' : '#666'}; }
    .methods { padding: 60px 0; }
    .methods-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .method-card {
      padding: 24px;
      background: ${isDark ? 'rgba(139, 92, 246, 0.1)' : '#f8f9ff'};
      border: 1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : '#eee'};
      border-radius: 16px;
    }
    .method-name { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
    .method-type { 
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      margin-bottom: 12px;
    }
    .method-type.view { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .method-type.change { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .method-btn {
      width: 100%;
      padding: 12px;
      background: ${isDark ? 'rgba(0, 236, 151, 0.2)' : '#00EC97'};
      border: 1px solid rgba(0, 236, 151, 0.3);
      border-radius: 10px;
      color: ${isDark ? '#00EC97' : 'black'};
      font-weight: 500;
      cursor: pointer;
      margin-top: 12px;
    }
    .footer {
      padding: 40px 0;
      border-top: 1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : '#eee'};
      text-align: center;
      color: ${isDark ? '#666' : '#999'};
    }
  `;
  
  const methodCards = components
    .filter(c => c.type === 'method-card')
    .map(c => `
      <div class="method-card">
        <div class="method-name">${c.props.methodName}</div>
        <span class="method-type ${c.props.isView ? 'view' : 'change'}">${c.props.isView ? 'View' : 'Change'}</span>
        ${c.props.args?.length > 0 ? `
          <div style="margin-bottom: 12px;">
            ${c.props.args.map((arg: string) => `
              <input type="text" placeholder="${arg}" style="width: 100%; padding: 10px; border: 1px solid ${isDark ? 'rgba(139,92,246,0.3)' : '#ddd'}; border-radius: 8px; background: ${isDark ? 'rgba(0,0,0,0.3)' : '#fff'}; color: ${isDark ? '#fff' : '#000'}; margin-bottom: 8px;" />
            `).join('')}
          </div>
        ` : ''}
        <button class="method-btn">Call ${c.props.methodName}</button>
      </div>
    `).join('');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${css}</style></head>
    <body>
      <header class="header">
        <div class="container header-content">
          <div class="logo">🔮 ${components.find(c => c.type === 'header')?.props.title || 'My dApp'}</div>
          <button class="wallet-btn">Connect Wallet</button>
        </div>
      </header>
      
      <section class="hero">
        <div class="container">
          <h1>${components.find(c => c.type === 'hero')?.props.title || 'Welcome'}</h1>
          <p>${components.find(c => c.type === 'hero')?.props.subtitle || 'Interact with your smart contract'}</p>
        </div>
      </section>
      
      <section class="methods">
        <div class="container">
          <div class="methods-grid">
            ${methodCards}
          </div>
        </div>
      </section>
      
      <footer class="footer">
        <div class="container">
          <p>Built with 🔮 Voidspace Sanctum</p>
        </div>
      </footer>
    </body>
    </html>
  `;
  
  return { html, css };
}
