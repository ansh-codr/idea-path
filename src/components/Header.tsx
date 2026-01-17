import udhbhavLogo from "@/assets/udhbhav-logo.jpeg";
import AuthButton from "./AuthButton";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
          <img 
            src={udhbhavLogo} 
            alt="UDHBHAV AI Logo" 
            className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-sage/30"
          />
          <div className="hidden sm:block">
            <h1 className="font-display text-lg font-bold text-white leading-tight">UDHBHAV AI</h1>
            <p className="text-xs text-white/70">Connecting Skills & Opportunities</p>
          </div>
        </div>

        {/* Auth Button */}
        <div className="bg-black/80 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 shadow-lg">
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
