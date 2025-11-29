export interface Proposal {
  id: bigint;
  recipient: string;
  amount: bigint;
  deadline: bigint;
  votesFor: bigint;
  votesAgainst: bigint;
  votesAbstain: bigint;
  executed: boolean;
  executedAt: bigint;
}

export enum VoteType {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

export interface ForwardRequest {
  from: string;
  to: string;
  value: bigint;
  gas: bigint;
  nonce: bigint;
  data: string;
}

