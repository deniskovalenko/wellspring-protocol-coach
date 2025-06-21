import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

export const SignInButton: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <button
        onClick={() => signInWithGoogle()}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-lg transition-all duration-300 shadow-lg"
        disabled={loading}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.383 0-6.148-2.805-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.719-2.648c-1.711-1.57-3.93-2.523-6.688-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.773 0 9.594-4.055 9.594-9.773 0-.656-.07-1.156-.156-1.523z" fill="#fff"/>
            <path d="M12.04 22c2.7 0 4.963-.89 6.617-2.42l-3.148-2.57c-.883.62-2.07.99-3.469.99-2.664 0-4.922-1.8-5.73-4.22h-3.242v2.65c1.648 3.25 5.09 5.57 9.012 5.57z" fill="#34A853"/>
            <path d="M6.31 13.78c-.2-.6-.32-1.24-.32-1.78s.12-1.18.32-1.78v-2.65h-3.242c-.66 1.32-1.04 2.8-1.04 4.43s.38 3.11 1.04 4.43l3.242-2.65z" fill="#FBBC05"/>
            <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.383 0-6.148-2.805-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.719-2.648c-1.711-1.57-3.93-2.523-6.688-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.773 0 9.594-4.055 9.594-9.773 0-.656-.07-1.156-.156-1.523z" fill="#4285F4"/>
            <path d="M12.04 22c2.7 0 4.963-.89 6.617-2.42l-3.148-2.57c-.883.62-2.07.99-3.469.99-2.664 0-4.922-1.8-5.73-4.22h-3.242v2.65c1.648 3.25 5.09 5.57 9.012 5.57z" fill="none"/>
            <path d="M6.31 13.78c-.2-.6-.32-1.24-.32-1.78s.12-1.18.32-1.78v-2.65h-3.242c-.66 1.32-1.04 2.8-1.04 4.43s.38 3.11 1.04 4.43l3.242-2.65z" fill="none"/>
          </g>
        </svg>
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error.message}</div>}
    </>
  );
};

const Login: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
    <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign in to Wellbeing Coach</h1>
      <p className="text-gray-600 mb-6">Sign in with your Google account to continue</p>
      <SignInButton />
    </div>
  </div>
);

export default Login; 