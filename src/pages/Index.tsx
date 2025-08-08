import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Target, Calendar, CheckCircle, Home, BarChart3 } from 'lucide-react';
import GoalSelection from '../components/GoalSelection';
import ProtocolGeneration from '../components/ProtocolGeneration';
import ProtocolDisplay from '../components/ProtocolDisplay';
import CommitmentSelection from '../components/CommitmentSelection';
import ProgressTracker from '../components/ProgressTracker';
import { useAuthContext } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import LogoutButton from "@/components/LogoutButton";
import { SignInButton } from "./Login";
import { AppNavbar } from "@/components/AppNavbar";

type Step = 'welcome' | 'goals' | 'generating' | 'protocol' | 'commitment' | 'tracking';

export interface WellbeingGoal {
  category: string;
  struggle: string;
  timePerDay: number;
  budget: 'low' | 'medium' | 'high';
}

export interface Protocol {
  name: string;
  summary: string;
  actions: ProtocolAction[];
}

export interface ProtocolAction {
  id: string;
  title: string;
  description: string;
  timing: string;
  why: string;
  category: string;
}

export interface Commitment {
  actionId: string;
  description: string;
  schedule: string;
  targetDate: string;
}

const Index = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [userGoal, setUserGoal] = useState<WellbeingGoal | null>(null);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  // Load persisted step from localStorage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem('wellbeing-current-step') as Step;
    const savedGoal = localStorage.getItem('wellbeing-user-goal');
    const savedProtocol = localStorage.getItem('wellbeing-protocol');
    const savedCommitments = localStorage.getItem('wellbeing-commitments');

    if (savedStep && savedStep !== 'welcome') {
      setCurrentStep(savedStep);
    }
    if (savedGoal) {
      setUserGoal(JSON.parse(savedGoal));
    }
    if (savedProtocol) {
      setProtocol(JSON.parse(savedProtocol));
    }
    if (savedCommitments) {
      setCommitments(JSON.parse(savedCommitments));
    }
  }, []);

  // Persist step changes to localStorage
  useEffect(() => {
    localStorage.setItem('wellbeing-current-step', currentStep);
  }, [currentStep]);

  // Persist data changes to localStorage
  useEffect(() => {
    if (userGoal) {
      localStorage.setItem('wellbeing-user-goal', JSON.stringify(userGoal));
    }
  }, [userGoal]);

  useEffect(() => {
    if (protocol) {
      localStorage.setItem('wellbeing-protocol', JSON.stringify(protocol));
    }
  }, [protocol]);

  useEffect(() => {
    if (commitments.length > 0) {
      localStorage.setItem('wellbeing-commitments', JSON.stringify(commitments));
    }
  }, [commitments]);

  const handleGoalSubmit = (goal: WellbeingGoal) => {
    setUserGoal(goal);
    setCurrentStep('generating');
  };

  const handleProtocolGenerated = (generatedProtocol: Protocol) => {
    setProtocol(generatedProtocol);
    setCurrentStep('protocol');
  };

  const handleProtocolAccept = () => {
    setCurrentStep('commitment');
  };

  const handleCommitmentsSelect = (selectedCommitments: Commitment[]) => {
    setCommitments(selectedCommitments);
    setCurrentStep('tracking');
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <Brain className="w-12 h-12 text-blue-700" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Wellbeing Protocol Coach
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed font-light">
            Generate a personalized, science-based wellbeing protocol tailored to your goals and lifestyle. 
            Build habits that actually work.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="rounded-xl p-6 space-y-3 transition-transform border border-gray-200 bg-white/80 backdrop-blur-md shadow-sm hover:scale-105">
            <Target className="w-8 h-8 text-blue-700 mx-auto" />
            <h3 className="font-semibold text-gray-900">Personalized Goals</h3>
            <p className="text-sm text-gray-700">AI-powered protocols based on your unique needs and constraints</p>
          </div>
          <div className="rounded-xl p-6 space-y-3 transition-transform border border-gray-200 bg-white/80 backdrop-blur-md shadow-sm hover:scale-105">
            <Sparkles className="w-8 h-8 text-blue-700 mx-auto" />
            <h3 className="font-semibold text-gray-900">Science-Backed</h3>
            <p className="text-sm text-gray-700">Evidence-based techniques from leading wellness research</p>
          </div>
          <div className="rounded-xl p-6 space-y-3 transition-transform border border-gray-200 bg-white/80 backdrop-blur-md shadow-sm hover:scale-105">
            <CheckCircle className="w-8 h-8 text-blue-700 mx-auto" />
            <h3 className="font-semibold text-gray-900">Track Progress</h3>
            <p className="text-sm text-gray-700">Simple tracking with positive reinforcement to build lasting habits</p>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-md p-6">
            <button 
              onClick={() => setCurrentStep('goals')}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 shadow-md"
            >
              Start Your Wellbeing Journey
            </button>
            <p className="text-sm text-gray-500 mt-4 font-light">
              Evidence-based. No fluff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'goals':
        return <GoalSelection onSubmit={handleGoalSubmit} onBack={() => setCurrentStep('welcome')} />;
      case 'generating':
        return <ProtocolGeneration userGoal={userGoal!} onProtocolGenerated={handleProtocolGenerated} />;
      case 'protocol':
        return <ProtocolDisplay protocol={protocol!} onAccept={handleProtocolAccept} onBack={() => setCurrentStep('goals')} />;
      case 'commitment':
        return <CommitmentSelection protocol={protocol!} onCommit={handleCommitmentsSelect} onBack={() => setCurrentStep('protocol')} />;
      case 'tracking':
        return <ProgressTracker protocol={protocol!} commitments={commitments} onBack={() => setCurrentStep('commitment')} />;
      default:
        return renderWelcomeScreen();
    }
  };

  const showNavigation = currentStep !== 'welcome' && currentStep !== 'generating';

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* App Navbar for signed-in users */}
      {user && <AppNavbar />}

      {/* Show logout or sign-in button in top right for welcome screen when not signed in */}
      {!user && !loading && (
        <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 1000 }}>
          <SignInButton />
        </div>
      )}

      {/* Main content */}
      <div style={{ paddingTop: user ? '80px' : '0' }}>
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default Index;
