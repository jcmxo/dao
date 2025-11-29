// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC2771Context.sol";

/**
 * @title DAOVoting
 * @dev DAO contract with gasless voting using meta-transactions (EIP-2771)
 */
contract DAOVoting is ERC2771Context {
    enum VoteType {
        AGAINST,
        FOR,
        ABSTAIN
    }

    struct Proposal {
        uint256 id;
        address recipient;
        uint256 amount;
        uint256 deadline;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesAbstain;
        bool executed;
        uint256 executedAt;
    }

    struct UserVote {
        VoteType voteType;
        bool hasVoted;
    }

    // Minimum balance required to vote (in wei)
    uint256 public constant MIN_VOTING_BALANCE = 0.01 ether;
    
    // Minimum percentage of total balance required to create proposal (10%)
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 10;
    
    // Security period after deadline before execution (24 hours)
    uint256 public constant SECURITY_PERIOD = 24 hours;

    // Total balance of the DAO
    uint256 public totalBalance;

    // Mapping from user address to their balance
    mapping(address => uint256) public userBalances;

    // Mapping from proposal ID to Proposal
    mapping(uint256 => Proposal) public proposals;

    // Mapping from proposal ID => user address => UserVote
    mapping(uint256 => mapping(address => UserVote)) public userVotes;

    // Next proposal ID
    uint256 public nextProposalId = 1;

    event DAOFunded(address indexed user, uint256 amount, uint256 newBalance);
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed creator,
        address recipient,
        uint256 amount,
        uint256 deadline
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        VoteType voteType
    );
    event ProposalExecuted(
        uint256 indexed proposalId,
        address indexed recipient,
        uint256 amount
    );

    modifier onlyActiveProposal(uint256 proposalId) {
        require(proposals[proposalId].id != 0, "Proposal does not exist");
        require(
            block.timestamp <= proposals[proposalId].deadline,
            "Proposal deadline has passed"
        );
        _;
    }

    modifier onlyAfterDeadline(uint256 proposalId) {
        require(proposals[proposalId].id != 0, "Proposal does not exist");
        require(
            block.timestamp > proposals[proposalId].deadline,
            "Proposal deadline has not passed"
        );
        _;
    }

    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    /**
     * @dev Allow users to fund the DAO
     */
    function fundDAO() external payable {
        require(msg.value > 0, "Must send ETH");
        userBalances[_msgSender()] += msg.value;
        totalBalance += msg.value;
        emit DAOFunded(_msgSender(), msg.value, userBalances[_msgSender()]);
    }

    /**
     * @dev Get the balance of a user
     */
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }

    /**
     * @dev Create a new proposal
     * Requires caller to have at least 10% of total balance
     */
    function createProposal(
        address recipient,
        uint256 amount,
        uint256 deadline
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        require(
            deadline > block.timestamp,
            "Deadline must be in the future"
        );
        require(
            totalBalance == 0 ||
                (userBalances[_msgSender()] * 100) / totalBalance >=
                MIN_PROPOSAL_THRESHOLD,
            "Insufficient balance to create proposal"
        );

        uint256 proposalId = nextProposalId++;
        proposals[proposalId] = Proposal({
            id: proposalId,
            recipient: recipient,
            amount: amount,
            deadline: deadline,
            votesFor: 0,
            votesAgainst: 0,
            votesAbstain: 0,
            executed: false,
            executedAt: 0
        });

        emit ProposalCreated(
            proposalId,
            _msgSender(),
            recipient,
            amount,
            deadline
        );

        return proposalId;
    }

    /**
     * @dev Vote on a proposal
     * Requires minimum balance and proposal to be active
     */
    function vote(uint256 proposalId, VoteType voteType)
        external
        onlyActiveProposal(proposalId)
    {
        require(
            userBalances[_msgSender()] >= MIN_VOTING_BALANCE,
            "Insufficient balance to vote"
        );

        UserVote storage userVote = userVotes[proposalId][_msgSender()];
        Proposal storage proposal = proposals[proposalId];

        // If user has already voted, remove their previous vote
        if (userVote.hasVoted) {
            if (userVote.voteType == VoteType.FOR) {
                proposal.votesFor--;
            } else if (userVote.voteType == VoteType.AGAINST) {
                proposal.votesAgainst--;
            } else if (userVote.voteType == VoteType.ABSTAIN) {
                proposal.votesAbstain--;
            }
        }

        // Add new vote
        if (voteType == VoteType.FOR) {
            proposal.votesFor++;
        } else if (voteType == VoteType.AGAINST) {
            proposal.votesAgainst++;
        } else if (voteType == VoteType.ABSTAIN) {
            proposal.votesAbstain++;
        }

        userVote.voteType = voteType;
        userVote.hasVoted = true;

        emit VoteCast(proposalId, _msgSender(), voteType);
    }

    /**
     * @dev Execute a proposal if it passed and security period elapsed
     */
    function executeProposal(uint256 proposalId)
        external
        onlyAfterDeadline(proposalId)
    {
        Proposal storage proposal = proposals[proposalId];
        
        require(!proposal.executed, "Proposal already executed");
        require(
            proposal.votesFor > proposal.votesAgainst,
            "Proposal did not pass"
        );
        require(
            block.timestamp >= proposal.deadline + SECURITY_PERIOD,
            "Security period has not elapsed"
        );
        require(
            address(this).balance >= proposal.amount,
            "Insufficient DAO balance"
        );

        proposal.executed = true;
        proposal.executedAt = block.timestamp;

        (bool success, ) = proposal.recipient.call{value: proposal.amount}("");
        require(success, "Transfer failed");

        emit ProposalExecuted(proposalId, proposal.recipient, proposal.amount);
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId)
        external
        view
        returns (Proposal memory)
    {
        return proposals[proposalId];
    }

    /**
     * @dev Check if a user can vote (has minimum balance)
     */
    function canVote(address user) external view returns (bool) {
        return userBalances[user] >= MIN_VOTING_BALANCE;
    }

    /**
     * @dev Check if a user can create proposals (has 10% of total balance)
     */
    function canCreateProposal(address user) external view returns (bool) {
        return
            totalBalance == 0 ||
            (userBalances[user] * 100) / totalBalance >= MIN_PROPOSAL_THRESHOLD;
    }

    // Receive function to accept ETH
    receive() external payable {
        userBalances[_msgSender()] += msg.value;
        totalBalance += msg.value;
        emit DAOFunded(_msgSender(), msg.value, userBalances[_msgSender()]);
    }
}

