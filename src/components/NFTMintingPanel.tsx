import React, { useState } from 'react';
import { Sparkles, Award, Zap, Clock, Trophy, Gift, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { User, ProgressNFT } from '../types';
import { useNFTMinting } from '../hooks/useNFTMinting';
import { useWeb3 } from '../context/Web3Context';

interface NFTMintingPanelProps {
  user: User;
  isDarkMode: boolean;
  onRedeemNFT: (nftId: string, rewardId: string) => void;
}

const NFTMintingPanel: React.FC<NFTMintingPanelProps> = ({ user, isDarkMode, onRedeemNFT }) => {
  const { isConnected } = useWeb3();
  const { 
    isMinting, 
    mintingError, 
    userNFTs, 
    canMintNFT, 
    mintProgressNFT, 
    redeemNFT,
    getWorkoutsUntilNextNFT 
  } = useNFTMinting();
  const [showMintSuccess, setShowMintSuccess] = useState(false);
  const [lastMintedNFT, setLastMintedNFT] = useState<ProgressNFT | null>(null);

  const handleMintNFT = async () => {
    try {
      const newNFT = await mintProgressNFT(user);
      setLastMintedNFT(newNFT);
      setShowMintSuccess(true);
      setTimeout(() => setShowMintSuccess(false), 5000);
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  const handleRedeemNFT = (nft: ProgressNFT, rewardId: string) => {
    redeemNFT(nft.id, rewardId);
    onRedeemNFT(nft.id, rewardId);
  };

  const workoutsUntilNext = getWorkoutsUntilNextNFT(user.totalWorkouts);
  const nextMilestone = user.totalWorkouts + workoutsUntilNext;

  const redeemableRewards = [
    {
      id: 'premium-workout-nft',
      title: 'Premium Workout Pack',
      description: 'Unlock 10 exclusive advanced workouts',
      icon: '🏋️‍♀️',
      requiredMilestone: 30
    },
    {
      id: 'personal-trainer-nft',
      title: '1-on-1 Virtual Session',
      description: '30-minute session with certified trainer',
      icon: '🙌',
      requiredMilestone: 60
    },
    {
      id: 'nutrition-guide-nft',
      title: 'Custom Nutrition Plan',
      description: 'Personalized meal plans for your goals',
      icon: '🧬',
      requiredMilestone: 90
    }
  ];

  if (!isConnected) {
    return (
      <div className={`rounded-xl p-6 border-2 text-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700'
          : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50 border-gray-300'
      }`}>
        <AlertCircle className={`h-12 w-12 mx-auto mb-4 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`} />
        <h3 className={`text-lg font-bold mb-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Connect Wallet to Collect Your Progress
        </h3>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}>
          Connect your XDC wallet to mint progress NFTs and unlock exclusive rewards
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Minting Success Animation */}
      {showMintSuccess && lastMintedNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className={`relative p-8 rounded-2xl border-4 text-center ${
            isDarkMode 
              ? 'bg-gradient-to-br from-green-900 via-green-800 to-green-900 border-green-600'
              : 'bg-gradient-to-br from-green-100 via-green-200 to-green-100 border-green-400'
          }`}>
            {/* Floating sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${10 + (i * 4)}%`,
                    top: `${10 + (i * 4)}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '2s'
                  }}
                >
                  <Sparkles className={`h-3 w-3 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="text-8xl mb-4 animate-bounce">🏆</div>
              <h3 className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-green-200' : 'text-green-800'
              }`}>
                NFT Minted Successfully! ✨
              </h3>
              <p className={`text-lg mb-4 ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>
                Your {lastMintedNFT.workoutsMilestone} workout milestone is now immortalized on XDC!
              </p>
              <div className={`px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-black/40 border-green-700/50 text-green-400'
                  : 'bg-white/60 border-green-300/50 text-green-600'
              }`}>
                Token ID: #{lastMintedNFT.tokenId}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NFT Minting Status */}
      <div className={`rounded-xl p-6 border-2 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700'
          : 'bg-gradient-to-br from-purple-100/30 to-blue-100/30 border-purple-400'
      }`}>
        {/* Animated background */}
        <div className={`absolute inset-0 ${isDarkMode ? 'opacity-10' : 'opacity-5'}`}>
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {[...Array(48)].map((_, i) => (
              <div 
                key={i} 
                className={`border animate-pulse ${
                  isDarkMode ? 'border-purple-400/20' : 'border-purple-500/15'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏆</div>
              <div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-800'
                }`}>
                  Progress NFTs
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-600'
                }`}>
                  Mint your milestones on XDC blockchain
                </p>
              </div>
            </div>
            <Sparkles className={`h-6 w-6 animate-pulse ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`} />
          </div>

          {/* Current Progress */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-6`}>
            <div className={`p-4 rounded-lg border ${
              isDarkMode 
                ? 'bg-black/40 border-purple-700/50'
                : 'bg-white/60 border-purple-300/50'
            }`}>
              <h3 className={`text-lg font-bold mb-3 ${
                isDarkMode ? 'text-purple-200' : 'text-purple-800'
              }`}>
                Current Progress
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-600'
                  }`}>Total Workouts:</span>
                  <span className={`font-bold ${
                    isDarkMode ? 'text-purple-200' : 'text-purple-800'
                  }`}>{user.totalWorkouts}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-600'
                  }`}>Next Milestone:</span>
                  <span className={`font-bold ${
                    isDarkMode ? 'text-purple-200' : 'text-purple-800'
                  }`}>{nextMilestone}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-600'
                  }`}>Workouts Needed:</span>
                  <span className={`font-bold ${
                    isDarkMode ? 'text-purple-200' : 'text-purple-800'
                  }`}>{workoutsUntilNext}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className={`w-full rounded-full h-3 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}>
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500'
                    }`}
                    style={{ width: `${((user.totalWorkouts % 30) / 30) * 100}%` }}
                  ></div>
                </div>
                <div className={`text-center mt-2 text-xs ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-600'
                }`}>
                  {Math.round(((user.totalWorkouts % 30) / 30) * 100)}% to next NFT
                </div>
              </div>
            </div>

            {/* Mint Button */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode 
                ? 'bg-black/40 border-purple-700/50'
                : 'bg-white/60 border-purple-300/50'
            }`}>
              <h3 className={`text-lg font-bold mb-3 ${
                isDarkMode ? 'text-purple-200' : 'text-purple-800'
              }`}>
                Mint NFT
              </h3>
              
              {canMintNFT(user) ? (
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-green-900/30 border-green-700/50'
                      : 'bg-green-100/30 border-green-300/50'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className={`h-4 w-4 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`text-sm font-bold ${
                        isDarkMode ? 'text-green-200' : 'text-green-800'
                      }`}>
                        Ready to Mint!
                      </span>
                    </div>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-green-300' : 'text-green-600'
                    }`}>
                      You've completed {Math.floor(user.totalWorkouts / 30) * 30} workouts milestone
                    </p>
                  </div>
                  
                  <button
                    onClick={handleMintNFT}
                    disabled={isMinting}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 active:scale-95 ${
                      isMinting
                        ? isDarkMode
                          ? 'bg-yellow-700 text-yellow-200 cursor-wait'
                          : 'bg-yellow-600 text-yellow-100 cursor-wait'
                        : isDarkMode
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isMinting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="h-5 w-5 animate-spin" />
                        <span>Minting on XDC...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Mint Progress NFT</span>
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                <div className={`p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800/30 border-gray-700/50'
                    : 'bg-gray-100/30 border-gray-300/50'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className={`h-4 w-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-bold ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Keep Training!
                    </span>
                  </div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Complete {workoutsUntilNext} more workouts to unlock NFT minting
                  </p>
                </div>
              )}

              {mintingError && (
                <div className={`mt-3 p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-red-900/30 border-red-700/50'
                    : 'bg-red-100/30 border-red-300/50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className={`h-4 w-4 ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`} />
                    <span className={`text-sm ${
                      isDarkMode ? 'text-red-300' : 'text-red-700'
                    }`}>
                      {mintingError}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User's NFT Collection */}
        {userNFTs.length > 0 && (
          <div className={`rounded-xl p-6 border-2 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-700'
              : 'bg-gradient-to-br from-blue-100/30 to-purple-100/30 border-blue-400'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isDarkMode ? 'text-blue-200' : 'text-blue-800'
            }`}>
              Your Progress NFTs 🎨
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
                    nft.isRedeemed
                      ? isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 opacity-75'
                        : 'bg-gray-100/50 border-gray-400 opacity-75'
                      : isDarkMode
                        ? 'bg-gradient-to-br from-blue-800/50 to-purple-800/50 border-blue-600 hover:border-blue-500'
                        : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50 border-blue-400 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">
                      {nft.isRedeemed ? '🏅' : '🏆'}
                    </div>
                    <h4 className={`font-bold ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-800'
                    }`}>
                      {nft.workoutsMilestone} Workout Milestone
                    </h4>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}>
                      Token #{nft.tokenId}
                    </p>
                  </div>

                  <div className={`space-y-2 text-xs ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-bold">{nft.metadata.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streak:</span>
                      <span className="font-bold">{nft.metadata.streak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CRUSH Earned:</span>
                      <span className="font-bold">{nft.metadata.tokensEarned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Creature:</span>
                      <span className="font-bold">{nft.metadata.creatureName} Lv.{nft.metadata.creatureLevel}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-blue-600/30">
                    {nft.isRedeemed ? (
                      <div className={`text-center text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        ✅ Redeemed for {nft.redeemedFor}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className={`text-xs text-center ${
                          isDarkMode ? 'text-blue-300' : 'text-blue-600'
                        }`}>
                          Use this NFT to redeem premium rewards!
                        </p>
                        <a
                          href={`https://explorer.xinfin.network/tx/${nft.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center space-x-1 text-xs font-medium transition-colors duration-200 ${
                            isDarkMode 
                              ? 'text-blue-400 hover:text-blue-300'
                              : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View on XDC Explorer</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NFT Redeemable Rewards */}
        {userNFTs.some(nft => !nft.isRedeemed) && (
          <div className={`rounded-xl p-6 border-2 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-700'
              : 'bg-gradient-to-br from-orange-100/30 to-red-100/30 border-orange-400'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isDarkMode ? 'text-orange-200' : 'text-orange-800'
            }`}>
              NFT Exclusive Rewards 🎁
            </h3>
            <p className={`text-sm mb-4 ${
              isDarkMode ? 'text-orange-300' : 'text-orange-600'
            }`}>
              Use your minted NFTs to unlock these exclusive rewards!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {redeemableRewards.map((reward) => {
                const eligibleNFTs = userNFTs.filter(
                  nft => !nft.isRedeemed && nft.workoutsMilestone >= reward.requiredMilestone
                );
                const hasEligibleNFT = eligibleNFTs.length > 0;
                
                return (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      hasEligibleNFT
                        ? isDarkMode
                          ? 'bg-gradient-to-br from-orange-800/50 to-red-800/50 border-orange-600 hover:border-orange-500'
                          : 'bg-gradient-to-br from-orange-100/50 to-red-100/50 border-orange-400 hover:border-orange-300'
                        : isDarkMode
                          ? 'bg-gray-800/30 border-gray-700 opacity-75'
                          : 'bg-gray-100/30 border-gray-400 opacity-75'
                    }`}
                  >
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{reward.icon}</div>
                      <h4 className={`font-bold text-sm ${
                        isDarkMode ? 'text-orange-200' : 'text-orange-800'
                      }`}>
                        {reward.title}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        isDarkMode ? 'text-orange-300' : 'text-orange-600'
                      }`}>
                        {reward.description}
                      </p>
                    </div>

                    <div className={`text-center text-xs mb-3 ${
                      isDarkMode ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      Requires {reward.requiredMilestone}+ workout NFT
                    </div>

                    {hasEligibleNFT ? (
                      <button
                        onClick={() => handleRedeemNFT(eligibleNFTs[0], reward.id)}
                        className={`w-full py-2 px-3 rounded-lg font-bold text-xs transition-all duration-200 active:scale-95 ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
                            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <Gift className="h-3 w-3" />
                          <span>Redeem with NFT</span>
                        </div>
                      </button>
                    ) : (
                      <div className={`text-center text-xs ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        No eligible NFTs
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className={`rounded-xl p-4 border-2 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700'
            : 'bg-gradient-to-br from-gray-100/30 to-gray-200/30 border-gray-400'
        }`}>
          <h3 className={`text-lg font-bold mb-3 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            🔗 How Progress NFTs Work
          </h3>
          <ul className={`space-y-2 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <li>• Complete 30 workouts to unlock your first NFT mint</li>
            <li>• Each NFT captures your exact progress at that milestone</li>
            <li>• NFTs are minted on XDC Network for low fees and fast transactions</li>
            <li>• Use NFTs to redeem exclusive rewards not available with CRUSH tokens</li>
            <li>• Your NFTs prove your fitness journey achievements forever</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NFTMintingPanel;