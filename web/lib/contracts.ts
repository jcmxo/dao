export const DAO_ABI = [
  "function fundDAO() external payable",
  "function createProposal(address recipient, uint256 amount, uint256 deadline) external returns (uint256)",
  "function vote(uint256 proposalId, uint8 voteType) external",
  "function executeProposal(uint256 proposalId) external",
  "function getProposal(uint256 proposalId) external view returns (tuple(uint256 id, address recipient, uint256 amount, uint256 deadline, uint256 votesFor, uint256 votesAgainst, uint256 votesAbstain, bool executed, uint256 executedAt))",
  "function getUserBalance(address user) external view returns (uint256)",
  "function totalBalance() external view returns (uint256)",
  "function nextProposalId() external view returns (uint256)",
  "function canVote(address user) external view returns (bool)",
  "function canCreateProposal(address user) external view returns (bool)",
  "function MIN_VOTING_BALANCE() external view returns (uint256)",
  "event DAOFunded(address indexed user, uint256 amount, uint256 newBalance)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed creator, address recipient, uint256 amount, uint256 deadline)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 voteType)",
  "event ProposalExecuted(uint256 indexed proposalId, address indexed recipient, uint256 amount)",
] as const;

export const FORWARDER_ABI = [
  "function getNonce(address from) external view returns (uint256)",
  "function verify(tuple(address from, address to, uint256 value, uint256 gas, uint256 nonce, bytes data) req, bytes signature) external view returns (bool)",
  "function execute(tuple(address from, address to, uint256 value, uint256 gas, uint256 nonce, bytes data) req, bytes signature) external payable returns (bool, bytes)",
] as const;

