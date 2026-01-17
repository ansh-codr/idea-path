/**
 * User Menu Component
 * ===================
 * Dropdown menu for authenticated users.
 */

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, History, Settings, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await logout();
    
    if (result.error) {
      toast({
        title: "Logout failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
    
    setIsLoggingOut(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-sage/20 hover:ring-sage/40 transition-all"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
            <AvatarFallback className="bg-forest text-white font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <History className="mr-2 h-4 w-4" />
          <span>My Ideas</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Saved Results</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
