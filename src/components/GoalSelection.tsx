
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Moon, Zap, Brain, Heart, Target, Clock } from 'lucide-react';
import { WellbeingGoal } from '../pages/Index';

interface GoalSelectionProps {
  onSubmit: (goal: WellbeingGoal) => void;
  onBack: () => void;
}

const GOAL_CATEGORIES = [
  { id: 'sleep', label: 'Better Sleep', icon: Moon, color: 'from-blue-500 to-purple-500' },
  { id: 'energy', label: 'More Energy', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 'focus', label: 'Improved Focus', icon: Brain, color: 'from-emerald-500 to-blue-500' },
  { id: 'mood', label: 'Better Mood', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'longevity', label: 'Longevity', icon: Target, color: 'from-purple-500 to-indigo-500' },
  { id: 'stress', label: 'Stress Management', icon: Clock, color: 'from-teal-500 to-green-500' }
];

const GoalSelection: React.FC<GoalSelectionProps> = ({ onSubmit, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [struggle, setStruggle] = useState('');
  const [timePerDay, setTimePerDay] = useState(15);
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('low');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory.trim() || !struggle.trim()) return;

    onSubmit({
      category: selectedCategory,
      struggle: struggle.trim(),
      timePerDay,
      budget
    });
  };

  const isValid = selectedCategory && struggle.trim();

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
          <div className="text-sm text-gray-500">Step 1 of 4</div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What's your main wellbeing goal?</h2>
          <p className="text-gray-600 text-lg">Choose the area you'd like to improve most</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Goal Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Primary Goal</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {GOAL_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'border-emerald-500 bg-emerald-50 scale-105'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-25'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-gray-800">{category.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Struggle */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">What's your biggest struggle?</h3>
            <textarea
              value={struggle}
              onChange={(e) => setStruggle(e.target.value)}
              placeholder="e.g., I can't fall asleep because my mind races with work thoughts..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-32"
              maxLength={500}
            />
            <p className="text-sm text-gray-500">{struggle.length}/500 characters</p>
          </div>

          {/* Time Commitment */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Daily time commitment</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="60"
                value={timePerDay}
                onChange={(e) => setTimePerDay(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 min</span>
                <span className="font-medium text-emerald-600">{timePerDay} minutes per day</span>
                <span>60 min</span>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Budget preference</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'low', label: 'Free/Low Cost', desc: '$0-20/month' },
                { value: 'medium', label: 'Moderate', desc: '$20-100/month' },
                { value: 'high', label: 'Premium', desc: '$100+/month' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBudget(option.value as 'low' | 'medium' | 'high')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    budget === option.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <p className="font-medium text-gray-800">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
              isValid
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center">
              Generate My Protocol
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalSelection;
