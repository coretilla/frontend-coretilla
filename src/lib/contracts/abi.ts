// Contract addresses
export const CONTRACTS = {
  MBTC: '0xf96c5C189a949C73745a277A4Acf071B1B9f6DF5',
  STAKING_VAULT: '0x3EF7d600DB474F1a544602Bd7dA33c53d98B7B1b'
} as const;

// mBTC Token ABI
export const MBTC_ABI = [
  {
    "inputs": [
      {"name": "initialOwner", "internalType": "address", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"name": "spender", "internalType": "address", "type": "address"},
      {"name": "allowance", "internalType": "uint256", "type": "uint256"},
      {"name": "needed", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {"name": "sender", "internalType": "address", "type": "address"},
      {"name": "balance", "internalType": "uint256", "type": "uint256"},
      {"name": "needed", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {"name": "approver", "internalType": "address", "type": "address"}
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {"name": "receiver", "internalType": "address", "type": "address"}
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {"name": "sender", "internalType": "address", "type": "address"}
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {"name": "spender", "internalType": "address", "type": "address"}
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [
      {"indexed": true, "name": "owner", "internalType": "address", "type": "address"},
      {"indexed": true, "name": "spender", "internalType": "address", "type": "address"},
      {"indexed": false, "name": "value", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "Approval",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {"indexed": true, "name": "from", "internalType": "address", "type": "address"},
      {"indexed": true, "name": "to", "internalType": "address", "type": "address"},
      {"indexed": false, "name": "value", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "Transfer",
    "anonymous": false,
    "type": "event"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [
      {"name": "owner", "internalType": "address", "type": "address"},
      {"name": "spender", "internalType": "address", "type": "address"}
    ],
    "name": "allowance",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "bool", "type": "bool"}
    ],
    "inputs": [
      {"name": "spender", "internalType": "address", "type": "address"},
      {"name": "value", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "approve",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [
      {"name": "account", "internalType": "address", "type": "address"}
    ],
    "name": "balanceOf",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {"name": "amount", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "burn",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint8", "type": "uint8"}
    ],
    "inputs": [],
    "name": "decimals",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {"name": "to", "internalType": "address", "type": "address"},
      {"name": "amount", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "mint",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "string", "type": "string"}
    ],
    "inputs": [],
    "name": "name",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "string", "type": "string"}
    ],
    "inputs": [],
    "name": "symbol",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "totalSupply",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "bool", "type": "bool"}
    ],
    "inputs": [
      {"name": "to", "internalType": "address", "type": "address"},
      {"name": "value", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "transfer",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "bool", "type": "bool"}
    ],
    "inputs": [
      {"name": "from", "internalType": "address", "type": "address"},
      {"name": "to", "internalType": "address", "type": "address"},
      {"name": "value", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "transferFrom",
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// StakingVault ABI
export const STAKING_VAULT_ABI = [
  {
    "inputs": [
      {"name": "_stakingToken", "internalType": "address", "type": "address"},
      {"name": "_rewardToken", "internalType": "address", "type": "address"},
      {"name": "_owner", "internalType": "address", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CooldownNotFinished",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EnforcedPause",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ExpectedPause",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientStake",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoRewardsToClaim",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInCooldown",
    "type": "error"
  },
  {
    "inputs": [
      {"name": "owner", "internalType": "address", "type": "address"}
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {"name": "account", "internalType": "address", "type": "address"}
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [
      {"name": "token", "internalType": "address", "type": "address"}
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UnstakeWindowExpired",
    "type": "error"
  },
  {
    "inputs": [
      {"indexed": true, "name": "user", "internalType": "address", "type": "address"},
      {"indexed": false, "name": "startTime", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "CooldownStarted",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {"indexed": true, "name": "previousOwner", "internalType": "address", "type": "address"},
      {"indexed": true, "name": "newOwner", "internalType": "address", "type": "address"}
    ],
    "name": "OwnershipTransferred",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {"indexed": false, "name": "account", "internalType": "address", "type": "address"}
    ],
    "name": "Paused",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {"indexed": false, "name": "newRate", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "RewardRateUpdated",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {"indexed": true, "name": "user", "internalType": "address", "type": "address"},
      {"indexed": false, "name": "amount", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "RewardsClaimed",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {"indexed": true, "name": "user", "internalType": "address", "type": "address"},
      {"indexed": false, "name": "amount", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "Staked",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {"indexed": false, "name": "account", "internalType": "address", "type": "address"}
    ],
    "name": "Unpaused",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {"indexed": true, "name": "user", "internalType": "address", "type": "address"},
      {"indexed": false, "name": "amount", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "Unstaked",
    "anonymous": false,
    "type": "event"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "APY",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "COOLDOWN_PERIOD",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "PRECISION",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "SECONDS_PER_YEAR",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "UNSTAKE_WINDOW",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "accRewardPerShare",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [
      {"name": "stakeAmount", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "calculateYearlyRewards",
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [],
    "name": "claimRewards",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {"name": "token", "internalType": "address", "type": "address"},
      {"name": "amount", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "emergencyWithdraw",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "getAccRewardPerShare",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "totalStaked_", "internalType": "uint256", "type": "uint256"},
      {"name": "rewardRate_", "internalType": "uint256", "type": "uint256"},
      {"name": "currentAPY_", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "getContractStats",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "getCurrentAPR",
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [
      {"name": "account", "internalType": "address", "type": "address"}
    ],
    "name": "getPendingRewards",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "stakedAmount", "internalType": "uint256", "type": "uint256"},
      {"name": "pendingRewards", "internalType": "uint256", "type": "uint256"},
      {"name": "canUnstake", "internalType": "bool", "type": "bool"},
      {"name": "cooldownEnd", "internalType": "uint256", "type": "uint256"},
      {"name": "unstakeWindowEnd", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [
      {"name": "account", "internalType": "address", "type": "address"}
    ],
    "name": "getUserInfo",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "lastUpdateTime",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "address", "type": "address"}
    ],
    "inputs": [],
    "name": "owner",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [],
    "name": "pause",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "bool", "type": "bool"}
    ],
    "inputs": [],
    "name": "paused",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [],
    "name": "renounceOwnership",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "rewardRate",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "contract IERC20", "type": "address"}
    ],
    "inputs": [],
    "name": "rewardToken",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {"name": "amount", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "stake",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "contract IERC20", "type": "address"}
    ],
    "inputs": [],
    "name": "stakingToken",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [],
    "name": "startCooldown",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [],
    "name": "totalStaked",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {"name": "newOwner", "internalType": "address", "type": "address"}
    ],
    "name": "transferOwnership",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [],
    "name": "unpause",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {"name": "amount", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "unstake",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {"name": "newAPY", "internalType": "uint256", "type": "uint256"}
    ],
    "name": "updateRewardRate",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {"name": "stakedAmount", "internalType": "uint256", "type": "uint256"},
      {"name": "rewardDebt", "internalType": "uint256", "type": "uint256"},
      {"name": "lastStakeTime", "internalType": "uint256", "type": "uint256"},
      {"name": "cooldownStart", "internalType": "uint256", "type": "uint256"},
      {"name": "inCooldown", "internalType": "bool", "type": "bool"},
      {"name": "pendingRewards", "internalType": "uint256", "type": "uint256"},
      {"name": "lastRewardUpdate", "internalType": "uint256", "type": "uint256"}
    ],
    "inputs": [
      {"name": "", "internalType": "address", "type": "address"}
    ],
    "name": "userInfo",
    "stateMutability": "view",
    "type": "function"
  }
] as const;