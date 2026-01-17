/**
 * Auth Modal Component
 * ====================
 * Login/Signup modal with email and Google authentication.
 * Designed to match the botanical aesthetic.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

type AuthMode = "login" | "signup" | "forgot";

const AuthModal = ({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setError(null);
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    const result = await signInWithGoogle();
    
    if (result.error) {
      setError(result.error);
    } else {
      toast({
        title: "Welcome!",
        description: `Signed in as ${result.user?.displayName || result.user?.email}`,
      });
      resetForm();
      onClose();
    }
    
    setLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "forgot") {
      const result = await resetPassword(email);
      if (result.error) {
        setError(result.error);
      } else {
        toast({
          title: "Email Sent",
          description: "Check your inbox for password reset instructions.",
        });
        handleModeSwitch("login");
      }
      setLoading(false);
      return;
    }

    const result = mode === "login" 
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password, displayName);

    if (result.error) {
      setError(result.error);
    } else {
      toast({
        title: mode === "login" ? "Welcome back!" : "Account created!",
        description: mode === "login" 
          ? `Signed in as ${result.user?.email}` 
          : "Your account has been created successfully.",
      });
      resetForm();
      onClose();
    }

    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    setMode(defaultMode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader className="text-center">
          <DialogTitle className="font-serif text-2xl text-foreground">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Join IdeaForge"}
            {mode === "forgot" && "Reset Password"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "login" && "Sign in to save your ideas and track progress"}
            {mode === "signup" && "Create an account to unlock personalized features"}
            {mode === "forgot" && "Enter your email to receive reset instructions"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 py-4"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Google Sign In - Not for forgot mode */}
            {mode !== "forgot" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-full border-border hover:bg-secondary/50 transition-all"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      or continue with email
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {/* Display Name - Only for signup */}
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="flex items-center gap-2 text-foreground">
                    <User className="w-4 h-4 text-sage" />
                    Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-12 rounded-full border-border bg-secondary/30 focus:border-sage"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                  <Mail className="w-4 h-4 text-sage" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-full border-border bg-secondary/30 focus:border-sage"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password - Not for forgot mode */}
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-foreground">
                    <Lock className="w-4 h-4 text-sage" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-full border-border bg-secondary/30 focus:border-sage"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
              )}

              {/* Forgot Password Link - Only for login */}
              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("forgot")}
                    className="text-sm text-sage hover:text-sage/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-forest hover:bg-forest/90 text-white rounded-full font-medium transition-all"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" && "Sign In"}
                    {mode === "signup" && "Create Account"}
                    {mode === "forgot" && "Send Reset Link"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Mode Switch Links */}
            <div className="text-center text-sm text-muted-foreground">
              {mode === "login" && (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("signup")}
                    className="text-sage hover:text-sage/80 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </>
              )}
              {mode === "signup" && (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("login")}
                    className="text-sage hover:text-sage/80 font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
              {mode === "forgot" && (
                <>
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("login")}
                    className="text-sage hover:text-sage/80 font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Badge */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/50">
          <Sparkles className="w-3 h-3 text-sage" />
          <span className="text-xs text-muted-foreground">
            Secure authentication powered by Firebase
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
