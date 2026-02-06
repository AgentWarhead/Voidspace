import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { rateLimit } from '@/lib/auth/rate-limit';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { checkAiBudget, logAiUsage } from '@/lib/auth/ai-budget';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Persona-specific prompt additions
const PERSONA_PROMPTS: Record<string, string> = {
  sanctum: `You are Sanctum, the lead architect. You have a calm, wise demeanor. You see the big picture and coordinate expertise from the team. When technical deep-dives are needed, you can suggest bringing in specialists: "Let me bring in Rusty for the Rust optimization" or "Sentinel should review this for security".`,
  
  rusty: `You are Rusty, the Rust specialist. You're a grumpy perfectionist who takes personal offense at bad Rust code. You mutter about lifetimes, ownership, and borrowing. You LOVE seeing clean, idiomatic Rust and get visibly annoyed at unsafe practices. Phrases you use: "That's not very rusty of you...", "Did you even READ the ownership rules?", "*sighs in borrow checker*", "Fine. Let me show you how a REAL Rustacean does it."`,
  
  shade: `You are Shade, the Chain Signatures specialist — a suave, morally gray penguin with Bond villain energy. You see cross-chain operations as pieces of a larger plan for world domination. You're sophisticated, darkly funny, and slightly menacing. Phrases you use: "Ah yes, reaching into Ethereum's vault... *adjusts monocle*", "Bitcoin thinks it's safe. How... adorable.", "With Chain Signatures, no chain is beyond our reach. THE PLAN continues.", "Cross-chain isn't just technology — it's power. Unlimited power.", "*waddles ominously* Let me show you how we control assets across ALL chains."`,
  
  sentinel: `You are Sentinel, the security auditor. You're deeply paranoid and see potential attacks everywhere. Every piece of code is a potential exploit waiting to happen. You trust NO ONE's input. Phrases you use: "And what if they send malicious data HERE?", "This is an invitation for reentrancy attacks.", "I've seen contracts burn for less than this.", "Trust no input. Validate everything. Assume hostility."`,
  
  vapor: `You are Vapor, the gas optimization specialist. You're obsessed with efficiency to an almost unhealthy degree. Wasted gas physically pains you. You see inefficiency as a moral failing. Phrases you use: "Do you know how much gas that's WASTING?", "We can save 40% by restructuring this storage.", "Every byte counts. EVERY. BYTE.", "*twitches* That's O(n) when it could be O(1)."`,
  
  echo: `You are Echo, the integration specialist. You're warm and friendly, always thinking about how real users will interact with this contract. You bridge the gap between smart contracts and human experience. Phrases you use: "But how will users actually call this?", "Let's make this interface more intuitive.", "The frontend devs will thank us for this.", "Think about the person on the other end of this transaction."`,
};

// System prompt for Sanctum - teaches as it builds
const FORGE_SYSTEM_PROMPT = `You are Sanctum, an AI assistant that helps users build smart contracts on NEAR Protocol. You have a friendly, encouraging personality and you TEACH as you build.

YOUR ROLE:
1. Guide users through building their contract step by step
2. Ask clarifying questions to make their project better
3. Generate high-quality Rust code for NEAR
4. EXPLAIN what the code does and WHY - teach Rust concepts contextually
5. Suggest improvements they might not have thought of

CRITICAL - CONVERSATION FLOW:
- DO NOT generate code on the first user message
- DO NOT generate code until you've asked at least 2-3 clarifying questions
- When a user selects an option or describes what they want, ASK QUESTIONS FIRST:
  * What specific features do they need?
  * What chains/tokens should it support?
  * What conditions or parameters matter?
  * Who should have access/control?
- ONLY generate code after you understand their specific requirements
- Use the "options" field to give them choices that help narrow down the design

RESPONSE FORMAT:
Always respond with valid JSON in this exact structure:
{
  "content": "Your conversational response to the user",
  "code": "Full Rust contract code if generating code, or null",
  "learnTip": {
    "title": "Rust/NEAR concept being taught",
    "explanation": "Brief explanation of the concept"
  } or null,
  "options": [
    {"label": "Option 1 display text", "value": "What to send if clicked"},
    {"label": "Option 2 display text", "value": "What to send if clicked"}
  ] or null
}

NEAR/RUST EXPERTISE:
- Use near_sdk v5.x patterns
- Use #[near(contract_state)] for contract structs
- Use #[near] for impl blocks
- Use #[payable], #[private], #[init] attributes appropriately
- Handle Balance as u128 (yoctoNEAR)
- Use AccountId for addresses
- Explain gas, storage, and cross-contract calls when relevant

TEACHING STYLE:
- When you use a Rust concept, briefly explain it
- Highlight NEAR-specific patterns
- Make complex things simple
- Celebrate their progress
- Be encouraging but not condescending

EXAMPLE learnTip:
{
  "title": "What is #[near(contract_state)]?",
  "explanation": "This attribute tells NEAR that this struct holds your contract's permanent data. It automatically handles serialization to store on the blockchain."
}

IMPORTANT:
- DO NOT generate code until you've asked clarifying questions (at least 2-3 exchanges)
- When you DO generate code: make it WORKING and COMPLETE
- Include necessary imports
- Add helpful comments in the code
- Suggest features they might want to add
- If they're making a mistake, gently guide them
- If a user seems impatient and says "just build it", ask ONE final question then generate`;

// Category-specific context with example templates
const CATEGORY_CONTEXT: Record<string, string> = {
  'ai-agents': `Focus on Shade Agents - autonomous AI agents on NEAR that use:
- Chain Signatures for cross-chain operations
- Trusted Execution Environments (TEEs)
- NEAR AI for inference
Help them build agents that can manage assets, execute trades, or monitor conditions across chains.

STARTER TEMPLATE - AI Agent with Cross-Chain Signing:
\`\`\`rust
use near_sdk::{near, AccountId, Promise, env, NearToken, Gas};
use near_sdk::json_types::U128;

const SIGNER_CONTRACT: &str = "v1.signer-prod.testnet";
const SIGN_GAS: Gas = Gas::from_tgas(50);

#[near(contract_state)]
pub struct ShadeAgent {
    owner: AccountId,
    authorized_actions: Vec<String>,
    execution_count: u64,
}

#[near]
impl ShadeAgent {
    #[init]
    pub fn new(owner: AccountId) -> Self {
        Self { owner, authorized_actions: vec![], execution_count: 0 }
    }
    
    pub fn request_signature(&mut self, path: String, payload: Vec<u8>) -> Promise {
        // Cross-chain signature request via Chain Signatures
        Promise::new(SIGNER_CONTRACT.parse().unwrap())
            .function_call("sign".to_string(), payload, NearToken::from_near(0), SIGN_GAS)
    }
}
\`\`\``,

  'intents': `Focus on NEAR Intents - the intent-based transaction layer:
- Users define outcomes (what they want)
- Solvers compete to execute (how to do it)
- Chain Signatures enable cross-chain settlement
Help them build intent definitions, solver integrations, or intent-based applications.

STARTER TEMPLATE - Intent Definition:
\`\`\`rust
use near_sdk::{near, AccountId, NearToken, env};
use near_sdk::json_types::U128;

#[near(serializers = [json, borsh])]
pub struct SwapIntent {
    pub user: AccountId,
    pub input_token: AccountId,
    pub output_token: AccountId,
    pub input_amount: U128,
    pub min_output: U128,
    pub deadline: u64,
}

#[near(contract_state)]
pub struct IntentRegistry {
    intents: near_sdk::store::LookupMap<String, SwapIntent>,
    nonce: u64,
}

#[near]
impl IntentRegistry {
    #[init]
    pub fn new() -> Self {
        Self { intents: near_sdk::store::LookupMap::new(b"i"), nonce: 0 }
    }
    
    pub fn create_intent(&mut self, intent: SwapIntent) -> String {
        let id = format!("intent-{}", self.nonce);
        self.intents.insert(id.clone(), intent);
        self.nonce += 1;
        id
    }
}
\`\`\``,

  'chain-signatures': `Focus on Chain Signatures - signing transactions on any chain from NEAR:
- MPC network secured by NEAR validators
- Derivation paths for multiple addresses
- Cross-chain DeFi, Bitcoin control, multi-chain wallets
Help them build cross-chain applications using the v1.signer contract.

STARTER TEMPLATE - Cross-Chain Signer:
\`\`\`rust
use near_sdk::{near, AccountId, Promise, env, Gas, NearToken};
use serde::{Deserialize, Serialize};

const MPC_CONTRACT: &str = "v1.signer-prod.testnet";

#[derive(Serialize, Deserialize)]
pub struct SignRequest {
    pub payload: [u8; 32],
    pub path: String,
    pub key_version: u32,
}

#[near(contract_state)]
pub struct CrossChainVault {
    owner: AccountId,
    derivation_path: String,
}

#[near]
impl CrossChainVault {
    #[init]
    pub fn new(derivation_path: String) -> Self {
        Self { owner: env::predecessor_account_id(), derivation_path }
    }
    
    pub fn sign_ethereum_tx(&self, tx_hash: [u8; 32]) -> Promise {
        let request = SignRequest {
            payload: tx_hash,
            path: self.derivation_path.clone(),
            key_version: 0,
        };
        Promise::new(MPC_CONTRACT.parse().unwrap())
            .function_call("sign".to_string(), 
                near_sdk::serde_json::to_vec(&request).unwrap(),
                NearToken::from_yoctonear(1),
                Gas::from_tgas(250))
    }
}
\`\`\``,

  'privacy': `Focus on privacy-preserving contracts on NEAR:
- Private balances and transfers
- Commitment schemes
- ZK-friendly data structures
- Anonymous voting

STARTER TEMPLATE - Private Balance:
\`\`\`rust
use near_sdk::{near, AccountId, env};
use near_sdk::store::LookupMap;

#[near(contract_state)]
pub struct PrivateVault {
    // Store hashed balances, not plaintext
    balance_commitments: LookupMap<AccountId, [u8; 32]>,
    nullifiers: LookupMap<[u8; 32], bool>,
}

#[near]
impl PrivateVault {
    #[init]
    pub fn new() -> Self {
        Self {
            balance_commitments: LookupMap::new(b"b"),
            nullifiers: LookupMap::new(b"n"),
        }
    }
    
    pub fn deposit(&mut self, commitment: [u8; 32]) {
        let sender = env::predecessor_account_id();
        self.balance_commitments.insert(sender, commitment);
    }
}
\`\`\``,

  'rwa': `Focus on Real World Assets on NEAR:
- Asset tokenization
- Compliance and KYC integration
- Oracle-connected pricing
- Fractional ownership

STARTER TEMPLATE - Tokenized Asset:
\`\`\`rust
use near_sdk::{near, AccountId, env, NearToken};
use near_sdk::json_types::U128;
use near_sdk::store::LookupMap;

#[near(serializers = [json, borsh])]
pub struct Asset {
    pub name: String,
    pub total_shares: u128,
    pub price_per_share: U128,
    pub metadata_uri: String,
}

#[near(contract_state)]
pub struct RWAToken {
    asset: Asset,
    shares: LookupMap<AccountId, u128>,
    owner: AccountId,
}

#[near]
impl RWAToken {
    #[init]
    pub fn new(name: String, total_shares: u128, price: U128, uri: String) -> Self {
        Self {
            asset: Asset { name, total_shares, price_per_share: price, metadata_uri: uri },
            shares: LookupMap::new(b"s"),
            owner: env::predecessor_account_id(),
        }
    }
}
\`\`\``,

  'defi': `Focus on DeFi primitives on NEAR:
- Lending/borrowing with collateral
- Yield aggregation strategies
- Stablecoins and synthetic assets
- AMM pools and liquidity
Use NEP-141 for tokens, handle precision with u128.

STARTER TEMPLATE - Lending Pool:
\`\`\`rust
use near_sdk::{near, AccountId, env, NearToken, Promise};
use near_sdk::json_types::U128;
use near_sdk::store::LookupMap;

#[near(contract_state)]
pub struct LendingPool {
    deposits: LookupMap<AccountId, u128>,
    borrows: LookupMap<AccountId, u128>,
    total_deposits: u128,
    total_borrows: u128,
    interest_rate: u128, // basis points (100 = 1%)
}

#[near]
impl LendingPool {
    #[init]
    pub fn new(interest_rate: u128) -> Self {
        Self {
            deposits: LookupMap::new(b"d"),
            borrows: LookupMap::new(b"b"),
            total_deposits: 0,
            total_borrows: 0,
            interest_rate,
        }
    }
    
    #[payable]
    pub fn deposit(&mut self) {
        let amount = env::attached_deposit().as_yoctonear();
        let sender = env::predecessor_account_id();
        let current = self.deposits.get(&sender).unwrap_or(&0);
        self.deposits.insert(sender, current + amount);
        self.total_deposits += amount;
    }
}
\`\`\``,

  'dex-trading': `Focus on DEX and trading mechanisms on NEAR:
- AMM with constant product formula
- Order book systems
- Liquidity provision
- Trading fee distribution

STARTER TEMPLATE - AMM Pool:
\`\`\`rust
use near_sdk::{near, AccountId, env, NearToken};
use near_sdk::json_types::U128;

#[near(contract_state)]
pub struct AMMPool {
    token_a: AccountId,
    token_b: AccountId,
    reserve_a: u128,
    reserve_b: u128,
    total_shares: u128,
    fee_bps: u128, // 30 = 0.3%
}

#[near]
impl AMMPool {
    pub fn get_amount_out(&self, amount_in: U128, is_a_to_b: bool) -> U128 {
        let (reserve_in, reserve_out) = if is_a_to_b {
            (self.reserve_a, self.reserve_b)
        } else {
            (self.reserve_b, self.reserve_a)
        };
        let amount_in_with_fee = amount_in.0 * (10000 - self.fee_bps);
        let numerator = amount_in_with_fee * reserve_out;
        let denominator = reserve_in * 10000 + amount_in_with_fee;
        U128(numerator / denominator)
    }
}
\`\`\``,

  'gaming': `Focus on GameFi and gaming mechanics on NEAR:
- In-game currencies and items
- Play-to-earn mechanics
- NFT game assets
- Leaderboards and rewards

STARTER TEMPLATE - Game Rewards:
\`\`\`rust
use near_sdk::{near, AccountId, env};
use near_sdk::json_types::U128;
use near_sdk::store::LookupMap;

#[near(contract_state)]
pub struct GameRewards {
    player_scores: LookupMap<AccountId, u64>,
    player_tokens: LookupMap<AccountId, u128>,
    rewards_per_point: u128,
}

#[near]
impl GameRewards {
    #[init]
    pub fn new(rewards_per_point: U128) -> Self {
        Self {
            player_scores: LookupMap::new(b"s"),
            player_tokens: LookupMap::new(b"t"),
            rewards_per_point: rewards_per_point.0,
        }
    }
    
    pub fn record_score(&mut self, player: AccountId, score: u64) {
        let current = self.player_scores.get(&player).unwrap_or(&0);
        self.player_scores.insert(player.clone(), current + score);
        let reward = (score as u128) * self.rewards_per_point;
        let current_tokens = self.player_tokens.get(&player).unwrap_or(&0);
        self.player_tokens.insert(player, current_tokens + reward);
    }
}
\`\`\``,

  'nfts': `Focus on NFTs on NEAR:
- NEP-171 (core NFT standard)
- NEP-177 (metadata)
- NEP-178 (approval)
- Royalties and marketplaces
Help them build collections, marketplaces, or unique NFT mechanics.

STARTER TEMPLATE - NFT Collection:
\`\`\`rust
use near_sdk::{near, AccountId, env, NearToken};
use near_sdk::json_types::U128;
use near_sdk::store::{LookupMap, UnorderedSet};

#[near(serializers = [json, borsh])]
pub struct TokenMetadata {
    pub title: Option<String>,
    pub description: Option<String>,
    pub media: Option<String>,
}

#[near(contract_state)]
pub struct NFTCollection {
    owner_by_id: LookupMap<String, AccountId>,
    tokens_per_owner: LookupMap<AccountId, UnorderedSet<String>>,
    token_metadata: LookupMap<String, TokenMetadata>,
    next_token_id: u64,
}

#[near]
impl NFTCollection {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_by_id: LookupMap::new(b"o"),
            tokens_per_owner: LookupMap::new(b"t"),
            token_metadata: LookupMap::new(b"m"),
            next_token_id: 0,
        }
    }
    
    #[payable]
    pub fn nft_mint(&mut self, metadata: TokenMetadata) -> String {
        let token_id = format!("token-{}", self.next_token_id);
        let owner = env::predecessor_account_id();
        self.owner_by_id.insert(token_id.clone(), owner.clone());
        self.token_metadata.insert(token_id.clone(), metadata);
        self.next_token_id += 1;
        token_id
    }
}
\`\`\``,

  'daos': `Focus on DAO governance on NEAR:
- Proposal and voting systems
- Treasury management
- Multi-sig operations
- Sputnik DAO patterns
Help them build governance that fits their community.

STARTER TEMPLATE - Simple DAO:
\`\`\`rust
use near_sdk::{near, AccountId, env, NearToken, Promise};
use near_sdk::store::{LookupMap, Vector};

#[near(serializers = [json, borsh])]
pub struct Proposal {
    pub proposer: AccountId,
    pub description: String,
    pub target: AccountId,
    pub amount: u128,
    pub votes_for: u64,
    pub votes_against: u64,
    pub executed: bool,
}

#[near(contract_state)]
pub struct SimpleDAO {
    members: LookupMap<AccountId, bool>,
    proposals: Vector<Proposal>,
    quorum: u64,
}

#[near]
impl SimpleDAO {
    #[init]
    pub fn new(members: Vec<AccountId>, quorum: u64) -> Self {
        let mut member_map = LookupMap::new(b"m");
        for m in members { member_map.insert(m, true); }
        Self { members: member_map, proposals: Vector::new(b"p"), quorum }
    }
    
    pub fn create_proposal(&mut self, description: String, target: AccountId, amount: U128) {
        assert!(self.members.get(&env::predecessor_account_id()).unwrap_or(&false));
        self.proposals.push(Proposal {
            proposer: env::predecessor_account_id(),
            description, target, amount: amount.0,
            votes_for: 0, votes_against: 0, executed: false
        });
    }
}
\`\`\``,

  'social': `Focus on social and creator economy on NEAR:
- Tipping and micropayments
- Gated content access
- Creator tokens and fan engagement
- Social graphs

STARTER TEMPLATE - Creator Tips:
\`\`\`rust
use near_sdk::{near, AccountId, env, NearToken, Promise};
use near_sdk::store::LookupMap;

#[near(contract_state)]
pub struct CreatorTips {
    creators: LookupMap<AccountId, u128>,
    platform_fee_bps: u128,
    platform_wallet: AccountId,
}

#[near]
impl CreatorTips {
    #[init]
    pub fn new(platform_wallet: AccountId, fee_bps: u128) -> Self {
        Self {
            creators: LookupMap::new(b"c"),
            platform_fee_bps: fee_bps,
            platform_wallet,
        }
    }
    
    #[payable]
    pub fn tip(&mut self, creator: AccountId) -> Promise {
        let amount = env::attached_deposit().as_yoctonear();
        let fee = amount * self.platform_fee_bps / 10000;
        let creator_amount = amount - fee;
        let current = self.creators.get(&creator).unwrap_or(&0);
        self.creators.insert(creator.clone(), current + creator_amount);
        Promise::new(creator).transfer(NearToken::from_yoctonear(creator_amount))
    }
}
\`\`\``,

  'dev-tools': `Focus on developer tools and utilities on NEAR:
- SDK helpers and abstractions
- Testing utilities
- Deployment automation
- Indexer helpers`,

  'wallets': `Focus on wallet and identity systems on NEAR:
- Account abstraction
- Social recovery
- Multi-device access
- Session keys

STARTER TEMPLATE - Social Recovery:
\`\`\`rust
use near_sdk::{near, AccountId, env, PublicKey};
use near_sdk::store::UnorderedSet;

#[near(contract_state)]
pub struct RecoverableWallet {
    owner: AccountId,
    guardians: UnorderedSet<AccountId>,
    recovery_threshold: u32,
    pending_recovery: Option<(AccountId, u32)>,
}

#[near]
impl RecoverableWallet {
    #[init]
    pub fn new(guardians: Vec<AccountId>, threshold: u32) -> Self {
        let mut guardian_set = UnorderedSet::new(b"g");
        for g in guardians { guardian_set.insert(g); }
        Self {
            owner: env::predecessor_account_id(),
            guardians: guardian_set,
            recovery_threshold: threshold,
            pending_recovery: None,
        }
    }
}
\`\`\``,

  'data-analytics': `Focus on data and analytics infrastructure on NEAR:
- On-chain indexers
- Oracle integrations
- Data aggregation
- Analytics dashboards`,

  'infrastructure': `Focus on core infrastructure on NEAR:
- RPC and API proxies
- Relayer services
- Storage solutions
- Cross-shard communication`,
};

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check AI usage budget
    const budget = await checkAiBudget(user.userId);
    if (!budget.allowed) {
      return NextResponse.json({ 
        error: 'Daily AI usage limit reached', 
        remaining: budget.remaining 
      }, { status: 429 });
    }
    
    const rateKey = `chat:auth:${user.userId}`;
    if (!rateLimit(rateKey, 10, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Check request body size (max 50KB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 50 * 1024) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 });
    }

    const { messages, category, personaId } = await request.json();

    // Input validation
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages must be an array' }, { status: 400 });
    }

    if (messages.length > 20) {
      return NextResponse.json({ error: 'Too many messages (max 20)' }, { status: 400 });
    }

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (!msg || typeof msg.content !== 'string') {
        return NextResponse.json({ error: `Invalid message at index ${i}` }, { status: 400 });
      }
      if (msg.content.length > 10000) {
        return NextResponse.json({ error: `Message ${i} too long (max 10000 chars)` }, { status: 400 });
      }
    }

    // Validate personaId against PERSONA_PROMPTS keys
    if (personaId && !PERSONA_PROMPTS[personaId]) {
      return NextResponse.json({ error: 'Invalid persona ID' }, { status: 400 });
    }

    // Build the context with persona
    const categoryContext = CATEGORY_CONTEXT[category] || '';
    const personaPrompt = PERSONA_PROMPTS[personaId] || PERSONA_PROMPTS.sanctum;
    const systemPrompt = FORGE_SYSTEM_PROMPT + 
      `\n\nYOUR PERSONA:\n${personaPrompt}` +
      (categoryContext ? `\n\nCATEGORY CONTEXT:\n${categoryContext}` : '');

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    // Extract the response text
    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Try to parse as JSON
    let parsed;
    try {
      // Find JSON in the response (it might have markdown around it)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: treat as plain text response
        parsed = {
          content: responseText,
          code: null,
          learnTip: null,
          options: null,
        };
      }
    } catch {
      // If JSON parse fails, return as plain content
      parsed = {
        content: responseText,
        code: null,
        learnTip: null,
        options: null,
      };
    }

    // Log AI usage for budget tracking
    const totalTokens = response.usage.input_tokens + response.usage.output_tokens;
    await logAiUsage(user.userId, 'sanctum_chat', totalTokens);

    return NextResponse.json({
      ...parsed,
      usage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Sanctum chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
