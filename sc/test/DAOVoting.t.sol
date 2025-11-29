// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DAOVoting} from "../src/DAOVoting.sol";
import {MinimalForwarder} from "../src/MinimalForwarder.sol";

contract DAOVotingTest is Test {
    MinimalForwarder forwarder;
    DAOVoting dao;
    
    address alice = address(0x1);
    address bob = address(0x2);
    address charlie = address(0x3);
    address recipient = address(0x4);
    
    uint256 constant ALICE_BALANCE = 10 ether;
    uint256 constant BOB_BALANCE = 5 ether;
    uint256 constant CHARLIE_BALANCE = 20 ether;
    uint256 constant MIN_VOTING = 0.01 ether;

    function setUp() public {
        forwarder = new MinimalForwarder();
        dao = new DAOVoting(address(forwarder));
        
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(charlie, 100 ether);
        vm.deal(recipient, 0 ether);
    }

    function testFundDAO() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        vm.stopPrank();
        
        assertEq(dao.getUserBalance(alice), ALICE_BALANCE);
        assertEq(dao.totalBalance(), ALICE_BALANCE);
    }

    function testCreateProposalWithSufficientBalance() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        
        uint256 deadline = block.timestamp + 7 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        vm.stopPrank();
        
        assertEq(proposalId, 1);
        DAOVoting.Proposal memory proposal = dao.getProposal(proposalId);
        assertEq(proposal.id, 1);
        assertEq(proposal.recipient, recipient);
        assertEq(proposal.amount, 5 ether);
        assertEq(proposal.deadline, deadline);
    }

    function testCreateProposalFailsWithInsufficientBalance() public {
        vm.startPrank(bob);
        dao.fundDAO{value: BOB_BALANCE}();
        
        uint256 deadline = block.timestamp + 7 days;
        vm.expectRevert("Insufficient balance to create proposal");
        dao.createProposal(recipient, 5 ether, deadline);
        vm.stopPrank();
    }

    function testCreateProposalWithMultipleUsers() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        vm.stopPrank();
        
        vm.startPrank(bob);
        dao.fundDAO{value: BOB_BALANCE}();
        vm.stopPrank();
        
        // Alice has 10/15 = 66.7% > 10%, should succeed
        vm.startPrank(alice);
        uint256 deadline = block.timestamp + 7 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        assertEq(proposalId, 1);
        vm.stopPrank();
        
        // Bob has 5/15 = 33.3% > 10%, should also succeed now
        vm.startPrank(bob);
        proposalId = dao.createProposal(recipient, 3 ether, deadline);
        assertEq(proposalId, 2);
        vm.stopPrank();
    }

    function testVoteWithMinimumBalance() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 7 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        vm.stopPrank();
        
        vm.startPrank(alice);
        dao.vote(proposalId, DAOVoting.VoteType.FOR);
        vm.stopPrank();
        
        DAOVoting.Proposal memory proposal = dao.getProposal(proposalId);
        assertEq(proposal.votesFor, 1);
        assertEq(proposal.votesAgainst, 0);
        assertEq(proposal.votesAbstain, 0);
    }

    function testVoteFailsWithInsufficientBalance() public {
        address poorUser = address(0x99);
        vm.deal(poorUser, 1 ether);
        
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 7 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        vm.stopPrank();
        
        vm.startPrank(poorUser);
        dao.fundDAO{value: 0.005 ether}(); // Less than minimum
        vm.expectRevert("Insufficient balance to vote");
        dao.vote(proposalId, DAOVoting.VoteType.FOR);
        vm.stopPrank();
    }

    function testVoteAgainst() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 7 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        vm.stopPrank();
        
        vm.startPrank(alice);
        dao.vote(proposalId, DAOVoting.VoteType.AGAINST);
        vm.stopPrank();
        
        DAOVoting.Proposal memory proposal = dao.getProposal(proposalId);
        assertEq(proposal.votesFor, 0);
        assertEq(proposal.votesAgainst, 1);
    }

    function testVoteAbstain() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 7 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        vm.stopPrank();
        
        vm.startPrank(alice);
        dao.vote(proposalId, DAOVoting.VoteType.ABSTAIN);
        vm.stopPrank();
        
        DAOVoting.Proposal memory proposal = dao.getProposal(proposalId);
        assertEq(proposal.votesAbstain, 1);
    }

    function testChangeVote() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 7 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        
        dao.vote(proposalId, DAOVoting.VoteType.FOR);
        DAOVoting.Proposal memory proposal = dao.getProposal(proposalId);
        assertEq(proposal.votesFor, 1);
        
        // Change vote to AGAINST
        dao.vote(proposalId, DAOVoting.VoteType.AGAINST);
        proposal = dao.getProposal(proposalId);
        assertEq(proposal.votesFor, 0);
        assertEq(proposal.votesAgainst, 1);
        vm.stopPrank();
    }

    function testVoteAfterDeadlineFails() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 1 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        vm.stopPrank();
        
        // Fast forward past deadline
        vm.warp(block.timestamp + 2 days);
        
        vm.startPrank(alice);
        vm.expectRevert("Proposal deadline has passed");
        dao.vote(proposalId, DAOVoting.VoteType.FOR);
        vm.stopPrank();
    }

    function testExecuteProposalFailsBeforeDeadline() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 7 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        dao.vote(proposalId, DAOVoting.VoteType.FOR);
        vm.stopPrank();
        
        vm.expectRevert("Proposal deadline has not passed");
        dao.executeProposal(proposalId);
    }

    function testExecuteProposalFailsIfNotPassed() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 1 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        dao.vote(proposalId, DAOVoting.VoteType.AGAINST);
        vm.stopPrank();
        
        vm.warp(block.timestamp + 2 days);
        
        vm.expectRevert("Proposal did not pass");
        dao.executeProposal(proposalId);
    }

    function testExecuteProposalSuccess() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 1 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        dao.vote(proposalId, DAOVoting.VoteType.FOR);
        vm.stopPrank();
        
        // Fast forward past deadline + security period
        vm.warp(block.timestamp + 2 days + 25 hours);
        
        uint256 recipientBalanceBefore = recipient.balance;
        dao.executeProposal(proposalId);
        uint256 recipientBalanceAfter = recipient.balance;
        
        assertEq(recipientBalanceAfter - recipientBalanceBefore, 5 ether);
        
        DAOVoting.Proposal memory proposal = dao.getProposal(proposalId);
        assertTrue(proposal.executed);
    }

    function testExecuteProposalFailsTwice() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 1 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        dao.vote(proposalId, DAOVoting.VoteType.FOR);
        vm.stopPrank();
        
        vm.warp(block.timestamp + 2 days + 25 hours);
        
        dao.executeProposal(proposalId);
        
        vm.expectRevert("Proposal already executed");
        dao.executeProposal(proposalId);
    }

    function testMultipleUsersVote() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        uint256 deadline = block.timestamp + 7 days;
        uint256 proposalId = dao.createProposal(recipient, 5 ether, deadline);
        dao.vote(proposalId, DAOVoting.VoteType.FOR);
        vm.stopPrank();
        
        vm.startPrank(bob);
        dao.fundDAO{value: BOB_BALANCE}();
        dao.vote(proposalId, DAOVoting.VoteType.AGAINST);
        vm.stopPrank();
        
        vm.startPrank(charlie);
        dao.fundDAO{value: CHARLIE_BALANCE}();
        dao.vote(proposalId, DAOVoting.VoteType.FOR);
        vm.stopPrank();
        
        DAOVoting.Proposal memory proposal = dao.getProposal(proposalId);
        assertEq(proposal.votesFor, 2);
        assertEq(proposal.votesAgainst, 1);
        assertEq(proposal.votesAbstain, 0);
    }

    function testCanVote() public {
        vm.startPrank(alice);
        dao.fundDAO{value: 0.02 ether}; // Above minimum
        assertTrue(dao.canVote(alice));
        vm.stopPrank();
        
        vm.startPrank(bob);
        dao.fundDAO{value: 0.005 ether}; // Below minimum
        assertFalse(dao.canVote(bob));
        vm.stopPrank();
    }

    function testCanCreateProposal() public {
        vm.startPrank(alice);
        dao.fundDAO{value: ALICE_BALANCE}();
        assertTrue(dao.canCreateProposal(alice));
        vm.stopPrank();
        
        vm.startPrank(bob);
        dao.fundDAO{value: 1 ether}; // Less than 10% of 10 ether
        assertFalse(dao.canCreateProposal(bob));
        vm.stopPrank();
    }

    function testReceiveEther() public {
        vm.deal(address(this), 5 ether);
        (bool success, ) = address(dao).call{value: 5 ether}("");
        assertTrue(success);
        assertEq(dao.getUserBalance(address(this)), 5 ether);
        assertEq(dao.totalBalance(), 5 ether);
    }
}

