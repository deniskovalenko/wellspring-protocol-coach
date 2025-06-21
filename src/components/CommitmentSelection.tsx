
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Target, Calendar, CheckCircle2 } from 'lucide-react';
import { Protocol, Commitment } from '../pages/Index';

interface CommitmentSelectionProps {
  protocol: Protocol;
  onCommit: (commitments: Commitment[]) => void;
  onBack: () => void;
}

const CommitmentSelection: React.FC<CommitmentSelectionProps> = ({ protocol, onCommit, onBack }) => {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [commitmentText, setCommitmentText] = useState('');
  const [targetDate, setTargetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });

  const toggleAction = (actionId: string) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleCommit = () => {
    if (selectedActions.length === 0 || !commitmentText.trim()) return;

    const commitments: Commitment[] = selectedActions.map(actionId => ({
      actionId,
      description: commitmentText.trim(),
      schedule: 'daily',
      targetDate
    }));

    onCommit(commitments);
  };

  const isValid = selectedActions.length > 0 && commitmentText.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="text-sm text-gray-500">Step 3 of 4</div>
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Target className="w-16 h-16 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Make Your Commitment</h2>
          <p className="text-lg text-gray-600">Choose 1-3 actions to start with and write your personal commitment</p>
        </div>

        <div className="space-y-8">
          {/* Action Selection */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Select actions to commit to</h3>
            <div className="space-y-4">
              {protocol.actions.map((action) => (
                <label key={action.id} className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:bg-white/50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={selectedActions.includes(action.id)}
                    onChange={() => toggleAction(action.id)}
                    className="mt-1 w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{action.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      {action.timing}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {selectedActions.length > 3 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-700">
                  💡 We recommend starting with 1-3 actions for better success rates. You can always add more later!
                </p>
              </div>
            )}
          </div>

          {/* Commitment Text */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Write your commitment</h3>
            <p className="text-gray-600 mb-4">Be specific about when and how you'll do these actions. This helps with follow-through!</p>
            <textarea
              value={commitmentText}
              onChange={(e) => setCommitmentText(e.target.value)}
              placeholder="e.g., I will get morning sunlight by taking a 10-minute walk outside every day at 7 AM, and I will wear blue light glasses every evening starting at 8 PM while watching TV or using my phone..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-32"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-2">{commitmentText.length}/500 characters</p>
          </div>

          {/* Target Date */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Commitment period</h3>
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <label className="flex items-center space-x-3">
                <span className="text-gray-700">I will follow this protocol until:</span>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Starting with a 7-day commitment gives you time to build the habit without overwhelming yourself.</p>
          </div>

          {/* Commitment Preview */}
          {selectedActions.length > 0 && commitmentText.trim() && (
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Your Commitment</h3>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <p className="mb-3">{commitmentText}</p>
                <p className="text-sm opacity-90">
                  Selected actions: {selectedActions.length} • Target date: {new Date(targetDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleCommit}
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
              isValid
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center">
              Lock In My Commitment
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommitmentSelection;
