import React from 'react';
import { Gift, Star, Zap, Award, Crown, Gem, Trophy } from 'lucide-react';
import { User } from '../types';
import NFTMintingPanel from './NFTMintingPanel';
import { useNFTMinting } from '../hooks/useNFTMinting';

interface RewardsPanelProps {
  user: User;
  onClaimReward: (rewardId: string, cost: number) => void;
  onRedeemNFT: (nftId: string, rewardId: string) => void;
  isDarkMode: boolean;
}

const RewardsPanel: React.FC<RewardsPanelProps> = ({ user, onClaimReward, onRedeemNFT, isDarkMode }) => {
  const { canRedeemWithNFT, getEligibleNFTForReward } = useNFTMinting();
  
  const rewards = [
    {
      id: 'premium-workout',
      title: 'Premium Workout Pack',
      description: 'Unlock 10 exclusive advanced workouts',
      cost: 500,
      nftRedeemable: true,
      requiredMilestone: 30,
      icon: '🏋️‍♀️',
      category: 'Premium Content',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'personal-trainer',
      title: '1-on-1 Virtual Session',
      description: '30-minute session with certified trainer',
      cost: 1000,
      nftRedeemable: true,
      requiredMilestone: 60,
      icon: '🙌',
      category: 'Coaching',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'nutrition-guide',
      title: 'Custom Nutrition Plan',
      description: 'Personalized meal plans for your goals',
      cost: 750,
      nftRedeemable: true,
      requiredMilestone: 90,
      icon: '🧬',
      category: 'Nutrition',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'equipment-discount',
      title: '20% Equipment Discount',
      description: 'Discount code for fitness equipment',
      cost: 300,
      nftRedeemable: false,
      requiredMilestone: 0,
      icon: Gift,
      category: 'Shopping',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'streak-booster',
      title: 'Streak Shield',
      description: 'Protect your streak for 3 days',
      cost: 200,
      nftRedeemable: false,
      requiredMilestone: 0,
      icon: Zap,
      category: 'Booster',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'double-points',
      title: 'Double Points Weekend',
      description: 'Earn 2x points for 48 hours',
      cost: 400,
      nftRedeemable: false,
      requiredMilestone: 0,
      icon: Award,
      category: 'Booster',
      color: 'from-red-500 to-red-600'
    }
  ];

  const handleClaim = (reward: typeof rewards[0], useNFT: boolean = false) => {
    if (useNFT && reward.nftRedeemable) {
      const eligibleNFT = getEligibleNFTForReward(reward.id, reward.requiredMilestone);
      if (eligibleNFT) {
        onRedeemNFT(eligibleNFT.id, reward.id);
        return;
      }
    }
    
    if (!useNFT && user.tokens >= reward.cost) {
      onClaimReward(reward.id, reward.cost);
    }
  };

  const categories = [...new Set(rewards.map(r => r.category))];

  return (
    <div className="max-w-6xl mx-auto">
      {/* NFT Minting Section */}
      <div className="mb-8">
        <NFTMintingPanel 
          user={user} 
          isDarkMode={isDarkMode}
          onRedeemNFT={onRedeemNFT}
        />
      </div>

      <div className={`rounded-xl shadow-lg p-6 mb-8 border-2 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-red-900 to-gray-900 text-white border-red-700'
          : 'bg-gradient-to-r from-gray-100 to-yellow-100 text-gray-800 border-gray-300'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-yellow-200' : 'text-gray-800'
            }`}>Rewards Store</h1>
            <p className={`${
              isDarkMode ? 'text-red-200' : 'text-gray-600'
            }`}>Exchange your FQ tokens for amazing rewards</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              isDarkMode ? 'text-yellow-200' : 'text-gray-800'
            }`}>{user.tokens}</div>
            <div className={`${
              isDarkMode ? 'text-red-200' : 'text-gray-600'
            }`}>Available CRUSH</div>
          </div>
        </div>
      </div>

      {/* Premium Content & Coaching Row */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-4 ${
          isDarkMode ? 'text-yellow-200' : 'text-gray-800'
        }`}>Premium Content & Coaching</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards
            .filter(reward => reward.category === 'Premium Content' || reward.category === 'Coaching')
            .map(reward => {
              const canAfford = user.tokens >= reward.cost;
              const canUseNFT = reward.nftRedeemable && canRedeemWithNFT(reward.id, reward.requiredMilestone);
              
              return (
                <div
                  key={reward.id}
                  className={`rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                    isDarkMode 
                      ? `bg-gradient-to-br from-red-900 to-gray-900 ${
                          canAfford ? 'border-red-700 hover:border-red-600' : 'border-red-800 opacity-75'
                        }`
                      : `bg-gradient-to-br from-gray-100 to-yellow-100 ${
                          canAfford ? 'border-gray-300 hover:border-gray-400' : 'border-gray-400 opacity-75'
                        }`
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-gradient-to-r ${reward.color} p-3 rounded-lg`}>
                      {typeof reward.icon === 'string' ? (
                        <span className="text-2xl">{reward.icon}</span>
                      ) : (
                        <reward.icon className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                      }`}>{reward.cost} FQ</div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{reward.category}</div>
                    </div>
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                  }`}>{reward.title}</h3>
                  <p className={`text-sm mb-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{reward.description}</p>
                  
                  <div className="space-y-2">
                    {/* NFT Redemption Button */}
                    {reward.nftRedeemable && (
                      <button
                        onClick={() => handleClaim(reward, true)}
                        disabled={!canUseNFT}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 active:scale-95 ${
                          canUseNFT
                            ? isDarkMode
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                            : isDarkMode 
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {canUseNFT ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Trophy className="h-4 w-4" />
                            <span>Redeem with NFT ({reward.requiredMilestone}+ workouts)</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Trophy className="h-4 w-4" />
                            <span>Need {reward.requiredMilestone}+ workout NFT</span>
                          </div>
                        )}
                      </button>
                    )}
                    
                    {/* CRUSH Token Button */}
                    <button
                      onClick={() => handleClaim(reward, false)}
                      disabled={!canAfford}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        canAfford
                          ? `bg-gradient-to-r ${reward.color} hover:opacity-90 shadow-lg hover:shadow-xl ${
                              isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
                            }`
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `Claim with ${reward.cost} CRUSH` : 'Insufficient CRUSH'}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Nutrition & Shopping Row */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-4 ${
          isDarkMode ? 'text-yellow-200' : 'text-gray-800'
        }`}>Nutrition & Shopping</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards
            .filter(reward => reward.category === 'Nutrition' || reward.category === 'Shopping')
            .map(reward => {
              const canAfford = user.tokens >= reward.cost;
              const canUseNFT = reward.nftRedeemable && canRedeemWithNFT(reward.id, reward.requiredMilestone);
              
              return (
                <div
                  key={reward.id}
                  className={`rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                    isDarkMode 
                      ? `bg-gradient-to-br from-red-900 to-gray-900 ${
                          canAfford ? 'border-red-700 hover:border-red-600' : 'border-red-800 opacity-75'
                        }`
                      : `bg-gradient-to-br from-gray-100 to-yellow-100 ${
                          canAfford ? 'border-gray-300 hover:border-gray-400' : 'border-gray-400 opacity-75'
                        }`
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-gradient-to-r ${reward.color} p-3 rounded-lg`}>
                      {typeof reward.icon === 'string' ? (
                        <span className="text-2xl">{reward.icon}</span>
                      ) : (
                        <reward.icon className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                      }`}>{reward.cost} FQ</div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{reward.category}</div>
                    </div>
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                  }`}>{reward.title}</h3>
                  <p className={`text-sm mb-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{reward.description}</p>
                  
                  <div className="space-y-2">
                    {/* NFT Redemption Button */}
                    {reward.nftRedeemable && (
                      <button
                        onClick={() => handleClaim(reward, true)}
                        disabled={!canUseNFT}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 active:scale-95 ${
                          canUseNFT
                            ? isDarkMode
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                            : isDarkMode 
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {canUseNFT ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Trophy className="h-4 w-4" />
                            <span>Redeem with NFT ({reward.requiredMilestone}+ workouts)</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Trophy className="h-4 w-4" />
                            <span>Need {reward.requiredMilestone}+ workout NFT</span>
                          </div>
                        )}
                      </button>
                    )}
                    
                    {/* CRUSH Token Button */}
                    <button
                      onClick={() => handleClaim(reward, false)}
                      disabled={!canAfford}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        canAfford
                          ? `bg-gradient-to-r ${reward.color} hover:opacity-90 shadow-lg hover:shadow-xl ${
                              isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
                            }`
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `Claim with ${reward.cost} CRUSH` : 'Insufficient CRUSH'}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Booster Row */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-4 ${
          isDarkMode ? 'text-yellow-200' : 'text-gray-800'
        }`}>Booster</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards
            .filter(reward => reward.category === 'Booster')
            .map(reward => {
              const canAfford = user.tokens >= reward.cost;
              const canUseNFT = reward.nftRedeemable && canRedeemWithNFT(reward.id, reward.requiredMilestone);
              
              return (
                <div
                  key={reward.id}
                  className={`rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                    isDarkMode 
                      ? `bg-gradient-to-br from-red-900 to-gray-900 ${
                          canAfford ? 'border-red-700 hover:border-red-600' : 'border-red-800 opacity-75'
                        }`
                      : `bg-gradient-to-br from-gray-100 to-yellow-100 ${
                          canAfford ? 'border-gray-300 hover:border-gray-400' : 'border-gray-400 opacity-75'
                        }`
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-gradient-to-r ${reward.color} p-3 rounded-lg`}>
                      {typeof reward.icon === 'string' ? (
                        <span className="text-2xl">{reward.icon}</span>
                      ) : (
                        <reward.icon className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                      }`}>{reward.cost} FQ</div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{reward.category}</div>
                    </div>
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                  }`}>{reward.title}</h3>
                  <p className={`text-sm mb-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{reward.description}</p>
                  
                  <div className="space-y-2">
                    {/* NFT Redemption Button */}
                    {reward.nftRedeemable && (
                      <button
                        onClick={() => handleClaim(reward, true)}
                        disabled={!canUseNFT}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 active:scale-95 ${
                          canUseNFT
                            ? isDarkMode
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                            : isDarkMode 
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {canUseNFT ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Trophy className="h-4 w-4" />
                            <span>Redeem with NFT ({reward.requiredMilestone}+ workouts)</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Trophy className="h-4 w-4" />
                            <span>Need {reward.requiredMilestone}+ workout NFT</span>
                          </div>
                        )}
                      </button>
                    )}
                    
                    {/* CRUSH Token Button */}
                    <button
                      onClick={() => handleClaim(reward, false)}
                      disabled={!canAfford}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        canAfford
                          ? `bg-gradient-to-r ${reward.color} hover:opacity-90 shadow-lg hover:shadow-xl ${
                              isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
                            }`
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `Claim with ${reward.cost} CRUSH` : 'Insufficient CRUSH'}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className={`rounded-xl p-6 border-2 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-red-900 to-gray-900 border-red-700'
          : 'bg-gradient-to-br from-gray-100 to-yellow-100 border-gray-300'
      }`}>
        <h3 className={`text-lg font-semibold mb-2 ${
          isDarkMode ? 'text-yellow-200' : 'text-gray-800'
        }`}>💡 How to earn more CRUSH tokens:</h3>
        <ul className={`space-y-1 text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <li>• Complete daily workouts to earn 100-250 CRUSH tokens</li>
          <li>• Complete 30+ workouts to mint progress NFTs on XDC</li>
          <li>• Use NFTs to redeem premium rewards without spending CRUSH</li>
          <li>• Maintain workout streaks for bonus points</li>
          <li>• Participate in weekly challenges</li>
          <li>• Climb the leaderboard rankings</li>
          <li>• Refer friends to join WODgachi</li>
        </ul>
      </div>
    </div>
  );
};

export default RewardsPanel;