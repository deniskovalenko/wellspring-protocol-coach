
import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { WellbeingGoal, Protocol } from '../pages/Index';

interface ProtocolGenerationProps {
  userGoal: WellbeingGoal;
  onProtocolGenerated: (protocol: Protocol) => void;
}

const ProtocolGeneration: React.FC<ProtocolGenerationProps> = ({ userGoal, onProtocolGenerated }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Analyzing your goals...');

  useEffect(() => {
    generateProtocol();
  }, []);

  const generateProtocol = async () => {
    const steps = [
      { delay: 1000, progress: 25, status: 'Analyzing your goals...' },
      { delay: 1500, progress: 50, status: 'Researching science-backed techniques...' },
      { delay: 2000, progress: 75, status: 'Personalizing your protocol...' },
      { delay: 1000, progress: 100, status: 'Almost ready!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProgress(step.progress);
      setStatus(step.status);
    }

    // Simulate AI protocol generation with realistic data
    const protocol: Protocol = generateMockProtocol(userGoal);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    onProtocolGenerated(protocol);
  };

  const generateMockProtocol = (goal: WellbeingGoal): Protocol => {
    const protocolTemplates = {
      sleep: {
        name: "Deep Sleep Optimization Protocol",
        summary: "A 7-day protocol focused on optimizing your circadian rhythm and sleep quality through light exposure, temperature regulation, and evening routines.",
        actions: [
          {
            id: '1',
            title: "Morning Light Exposure",
            description: "Get 10-15 minutes of direct sunlight within 1 hour of waking",
            timing: "Morning (6-8 AM)",
            why: "Sunlight exposure helps regulate your circadian rhythm and promotes melatonin production at night.",
            category: "light"
          },
          {
            id: '2',
            title: "Blue Light Blocking",
            description: "Wear blue-light blocking glasses or use blue light filters 2 hours before bed",
            timing: "Evening (8-10 PM)",
            why: "Blue light suppresses melatonin production, making it harder to fall asleep naturally.",
            category: "light"
          },
          {
            id: '3',
            title: "Cool Sleep Environment",
            description: "Keep bedroom temperature between 65-68°F (18-20°C)",
            timing: "Bedtime",
            why: "Core body temperature naturally drops before sleep, and a cool environment supports this process.",
            category: "environment"
          },
          {
            id: '4',
            title: "Magnesium Supplement",
            description: "Take 200-400mg magnesium glycinate 1 hour before bed",
            timing: "Evening (9 PM)",
            why: "Magnesium helps activate the parasympathetic nervous system and promotes muscle relaxation.",
            category: "supplement"
          }
        ]
      },
      energy: {
        name: "Natural Energy Boost Protocol",
        summary: "A 5-day protocol to increase sustained energy through strategic nutrition, movement, and breathing techniques.",
        actions: [
          {
            id: '1',
            title: "Cold Water Exposure",
            description: "Take a 30-60 second cold shower or splash cold water on face and wrists",
            timing: "Morning",
            why: "Cold exposure activates the sympathetic nervous system and releases adrenaline for natural energy.",
            category: "temperature"
          },
          {
            id: '2',
            title: "Protein-Rich Breakfast",
            description: "Eat 20-30g protein within 1 hour of waking",
            timing: "Morning (7-9 AM)",
            why: "Protein provides steady amino acids and helps stabilize blood sugar for sustained energy.",
            category: "nutrition"
          },
          {
            id: '3',
            title: "Energizing Breathwork",
            description: "Practice 4-7-8 breathing: inhale 4 counts, hold 7, exhale 8. Repeat 4 cycles.",
            timing: "Afternoon (2-3 PM)",
            why: "Controlled breathing increases oxygen delivery and can combat afternoon energy dips.",
            category: "breathing"
          }
        ]
      },
      focus: {
        name: "Cognitive Enhancement Protocol",
        summary: "A 6-day protocol to improve focus and mental clarity through targeted exercises and environmental optimization.",
        actions: [
          {
            id: '1',
            title: "Focused Work Blocks",
            description: "Work in 25-minute focused sessions with 5-minute breaks (Pomodoro Technique)",
            timing: "Work hours",
            why: "Time-boxing prevents mental fatigue and maintains high cognitive performance throughout the day.",
            category: "focus"
          },
          {
            id: '2',
            title: "Single-Tasking Practice",
            description: "Focus on only one task at a time, close unnecessary tabs and notifications",
            timing: "Throughout day",
            why: "Multitasking reduces cognitive efficiency by up to 40% and increases mental fatigue.",
            category: "focus"
          },
          {
            id: '3',
            title: "Meditation Practice",
            description: "Practice 10 minutes of focused breathing meditation",
            timing: "Morning or evening",
            why: "Regular meditation strengthens attention networks in the brain and improves sustained focus.",
            category: "mindfulness"
          }
        ]
      }
    };

    return protocolTemplates[goal.category as keyof typeof protocolTemplates] || protocolTemplates.sleep;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full p-6 animate-pulse">
            <Brain className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">Creating Your Protocol</h2>
          <p className="text-xl text-gray-600">
            Our AI is analyzing your goals and crafting a personalized wellbeing plan...
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-center space-x-3 text-lg font-medium text-gray-700">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span>{status}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-sm text-gray-500">{progress}% complete</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Science-backed techniques</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Brain className="w-4 h-4 text-blue-500" />
            <span>Personalized for you</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Easy to follow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolGeneration;
