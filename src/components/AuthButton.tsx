/**
 * Auth Button Component
 * =====================
 * Shows sign in button or user menu based on auth state.
 */

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn } from "lucide-react";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";

const AuthButton = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (user) {
    return <UserMenu />;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full border-sage/30 hover:border-sage hover:bg-sage/5 transition-all"
        onClick={() => setShowAuthModal(true)}
      >
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default AuthButton;
