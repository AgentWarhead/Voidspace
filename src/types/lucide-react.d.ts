// Fix for lucide-react v0.453.0 barrel export TS resolution issues with Next.js
// All icons exist at runtime but TS can't resolve them from the massive .d.ts
declare module 'lucide-react' {
  import { ForwardRefExoticComponent, RefAttributes, SVGAttributes } from 'react';
  
  interface LucideProps extends SVGAttributes<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  
  type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;

  // All icons used across the project
  export const Activity: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const BarChart3: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Bot: LucideIcon;
  export const Boxes: LucideIcon;
  export const Brain: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Clock: LucideIcon;
  export const Code: LucideIcon;
  export const Code2: LucideIcon;
  export const Coins: LucideIcon;
  export const Copy: LucideIcon;
  export const Cpu: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Download: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const FileCode: LucideIcon;
  export const FileText: LucideIcon;
  export const Filter: LucideIcon;
  export const Flame: LucideIcon;
  export const FlaskConical: LucideIcon;
  export const Gamepad: LucideIcon;
  export const Gamepad2: LucideIcon;
  export const GitBranch: LucideIcon;
  export const Github: LucideIcon;
  export const Globe: LucideIcon;
  export const Heart: LucideIcon;
  export const Image: LucideIcon;
  export const Info: LucideIcon;
  export const Joystick: LucideIcon;
  export const KeyRound: LucideIcon;
  export const Layers: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Link2: LucideIcon;
  export const Loader2: LucideIcon;
  export const Lock: LucideIcon;
  export const MapPin: LucideIcon;
  export const Maximize2: LucideIcon;
  export const Menu: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Minimize2: LucideIcon;
  export const Monitor: LucideIcon;
  export const Moon: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Play: LucideIcon;
  export const Puzzle: LucideIcon;
  export const Quote: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Rocket: LucideIcon;
  export const Search: LucideIcon;
  export const Send: LucideIcon;
  export const Settings: LucideIcon;
  export const Share2: LucideIcon;
  export const Shield: LucideIcon;
  export const Smartphone: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const Sun: LucideIcon;
  export const Target: LucideIcon;
  export const Terminal: LucideIcon;
  export const Trash2: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Users: LucideIcon;
  export const Video: LucideIcon;
  export const Vote: LucideIcon;
  export const Wallet: LucideIcon;
  export const Wrench: LucideIcon;
  export const X: LucideIcon;
  export const Zap: LucideIcon;

  // Learn page icons
  export const AppWindow: LucideIcon;
  export const BadgeCheck: LucideIcon;
  export const Box: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Bug: LucideIcon;
  export const CircleAlert: LucideIcon;
  export const CircleDollarSign: LucideIcon;
  export const CircleDot: LucideIcon;
  export const Coins: LucideIcon;
  export const Compass: LucideIcon;
  export const Crown: LucideIcon;
  export const Database: LucideIcon;
  export const FileCode2: LucideIcon;
  export const Fingerprint: LucideIcon;
  export const Gauge: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const HardDrive: LucideIcon;
  export const Key: LucideIcon;
  export const Layout: LucideIcon;
  export const ListChecks: LucideIcon;
  export const Network: LucideIcon;
  export const Play: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const TestTube2: LucideIcon;
  export const Trophy: LucideIcon;
  export const Upload: LucideIcon;
  
  // Additional icons used across the project
  export const Bookmark: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Circle: LucideIcon;
  export const Equal: LucideIcon;
  export const Folder: LucideIcon;
  export const FolderOpen: LucideIcon;
  export const GitCompare: LucideIcon;
  export const GitFork: LucideIcon;
  export const Grid3X3: LucideIcon;
  export const Hammer: LucideIcon;
  export const Home: LucideIcon;
  export const Landmark: LucideIcon;
  export const LogOut: LucideIcon;
  export const Mic: LucideIcon;
  export const MicOff: LucideIcon;
  export const Minus: LucideIcon;
  export const Plus: LucideIcon;
  export const Scan: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const Square: LucideIcon;
  export const Swords: LucideIcon;
  export const TrendingDown: LucideIcon;
  export const User: LucideIcon;
  export const XCircle: LucideIcon;
  export const ZoomIn: LucideIcon;
  export const ZoomOut: LucideIcon;

  // Icon creation utility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function createLucideIcon(name: string, paths: unknown[]): LucideIcon;
}
