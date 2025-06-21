
import React from 'react';
import { ArrowLeft, ArrowRight, Clock, Lightbulb, CheckCircle } from 'lucide-react';
import { Protocol } from '../pages/Index';

interface ProtocolDisplayProps {
  protocol: Protocol;
  onAccept: () => void;
  onBack: () => void;
}

const ProtocolDisplay: React.FC<ProtocolDisplayProps> = ({ protocol, onAccept, onBack }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'light': return '💡';
      case 'environment': return '🌡️';
      case 'supplement': return '💊';
      case 'temperature': return '❄️';
      case 'nutrition': return '🍎';
      case 'breathing': return '🫁';
      case 'focus': return '🎯';
      case 'mindfulness': return '🧘';
      default: return '✨';
    }
  };

  const getTimingColor = (timing: string) => {
    if (timing.toLowerCase().includes('morning')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (timing.toLowerCase().includes('evening')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (timing.toLowerCase().includes('afternoon')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="text-sm text-gray-500">Step 2 of 4</div>
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Personal Protocol</h2>
          <h3 className="text-2xl font-semibold text-emerald-600 mb-4">{protocol.name}</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{protocol.summary}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-8">
          <h4 className="text-xl font-semibold text-gray-800 mb-6">Your Daily Actions</h4>
          <div className="space-y-6">
            {protocol.actions.map((action, index) => (
              <div key={action.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h5 className="text-lg font-semibold text-gray-800">{action.title}</h5>
                      <span className="text-2xl">{getCategoryIcon(action.category)}</span>
                    </div>
                    <p className="text-gray-700">{action.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getTimingColor(action.timing)}`}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{action.timing}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">Why this works:</p>
                          <p className="text-sm text-blue-700">{action.why}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white text-center mb-8">
          <h4 className="text-lg font-semibold mb-2">🎯 Success Tip</h4>
          <p>Start with just 1-2 actions that feel most manageable. You can always add more later. Consistency beats perfection!</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Regenerate Protocol
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <span className="flex items-center justify-center">
              I Love This Protocol!
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolDisplay;
