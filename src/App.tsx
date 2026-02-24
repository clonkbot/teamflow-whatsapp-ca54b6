import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-emerald-400/60 font-mono text-sm tracking-wider">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthScreen />;
}
