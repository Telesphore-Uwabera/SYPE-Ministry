export default function WelcomeSplash() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center text-center px-6">
        <div className="mb-6 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border border-accent/70 flex items-center justify-center animate-welcome-glow">
            <div className="h-24 w-24 rounded-full border border-accent/40 bg-white/5 flex items-center justify-center animate-welcome-float">
              <picture className="h-16 w-16 flex items-center justify-center">
                <source srcSet="/Images/sype-logo.webp" type="image/webp" />
                <img
                  src="/Images/Sype logo.png"
                  alt="SYPE Ministry logo"
                  className="h-16 w-16 object-contain"
                />
              </picture>
            </div>
          </div>
        </div>

        <p className="text-base md:text-lg font-semibold text-white/90">
          Welcome to SYPE Ministry
        </p>
        <p className="mt-2 text-sm md:text-base text-white/60 max-w-md">
          Seventh-Day Adventist Young Professionals in Evangelism
        </p>

        <div className="mt-6 h-1.5 w-56 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-accent animate-welcome-progress" />
        </div>
      </div>
    </div>
  );
}
