import { Link } from "@tanstack/react-router";
import { SiGoogleplay } from "react-icons/si";
import lumoraTutorImg from "@/assets/lumora-tutor.png";

export function Footer() {
  return (
    <footer className="w-full mt-20 pt-16 pb-8 bg-sjcs-surface-container-low dark:bg-background border-t border-border">
      {/* Top Section: Main Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="space-y-6 md:col-span-1">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SJCS Logo" className="w-10 h-10 object-contain rounded-full" />
            <div className="text-xl font-bold text-foreground font-headline">
              Saint Joseph Catholic School
            </div>
          </div>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">
            Dedicated to forming Christian leaders who think critically, act
            justly, and serve selflessly.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined p-2 bg-card rounded-full shadow-sm text-sjcs-secondary cursor-pointer hover:bg-sjcs-secondary hover:text-sjcs-on-secondary transition-smooth">
              public
            </span>
            <span className="material-symbols-outlined p-2 bg-card rounded-full shadow-sm text-sjcs-secondary cursor-pointer hover:bg-sjcs-secondary hover:text-sjcs-on-secondary transition-smooth">
              mail
            </span>
            <span className="material-symbols-outlined p-2 bg-card rounded-full shadow-sm text-sjcs-secondary cursor-pointer hover:bg-sjcs-secondary hover:text-sjcs-on-secondary transition-smooth">
              phone
            </span>
          </div>
        </div>

        {/* Academics */}
        <div>
          <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-[0.2em]">
            Academics
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                to="/academics"
                className="text-muted-foreground hover:text-sjcs-primary transition-all text-sm"
              >
                Curriculum Overview
              </Link>
            </li>
            <li>
              <Link
                to="/academics"
                className="text-muted-foreground hover:text-sjcs-primary transition-all text-sm"
              >
                Honors & AP Courses
              </Link>
            </li>
            <li>
              <Link
                to="/academics"
                className="text-muted-foreground hover:text-sjcs-primary transition-all text-sm"
              >
                Library Services
              </Link>
            </li>
            <li>
              <Link
                to="/admissions"
                className="text-muted-foreground hover:text-sjcs-primary transition-all text-sm"
              >
                College Counseling
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-[0.2em]">
            Resources
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-sjcs-primary transition-all text-sm"
              >
                Campus Map
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-sjcs-primary transition-all text-sm"
              >
                Directory
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-sjcs-primary transition-all text-sm"
              >
                Student Handbook
              </Link>
            </li>
            <li>
              <Link
                to="/clubs"
                className="text-muted-foreground hover:text-sjcs-primary transition-all text-sm"
              >
                Student Life
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-[0.2em]">
            Contact Us
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            123 Scholar Way
            <br />
            St. Joseph, SC 29000
          </p>
          <p className="text-muted-foreground text-sm">(555) 123-4567</p>
          <p className="text-muted-foreground text-sm">admissions@sjcs.edu</p>
        </div>
      </div>

      {/* Dominant Full-Width Mobile App Feature Banner */}
      <div className="mt-16 pt-10 border-t border-border/60 max-w-7xl mx-auto px-8">
        <div className="bg-card dark:bg-sjcs-surface-container-low border border-border/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
          <div className="text-center md:text-left space-y-2 flex-1">
            <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-sjcs-primary bg-sjcs-primary/10 rounded-full">
              Mobile Learning Portal
            </span>
            <h3 className="text-xl font-bold text-foreground font-headline">
              Take Learning on the Go
            </h3>
            <p className="text-muted-foreground text-sm max-w-xl">
              Download the official <strong className="text-foreground font-semibold">Lumora Tutor</strong> application on your Android device to manage study hours, book review sessions, and track assignments seamlessly.
            </p>
            <div className="pt-2 flex justify-center md:justify-start">
              {/* Leadership Gradient Play Store Badge Capsule */}
              <a 
                href="https://play.google.com/store" 
                target="_blank" 
                rel="noopener noreferrer"
                className="leadership-gradient flex items-center gap-3 px-5 py-2 rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sjcs-primary"
                aria-label="Get it on Google Play"
              >
                <SiGoogleplay size={22} className="text-white" />
                <div className="flex flex-col text-left select-none">
                  <span className="text-[8px] font-medium text-white/50 uppercase tracking-widest leading-none">
                    GET IT ON
                  </span>
                  <span className="text-xs font-bold text-white tracking-wide leading-tight mt-0.5">
                    Google Play
                  </span>
                </div>
              </a>
            </div>
          </div>
          
          <div className="flex shrink-0 max-w-[120px] rounded-xl overflow-hidden shadow-md border border-border/10">
            <img
              src={lumoraTutorImg}
              alt="Lumora Tutor App"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="mt-12 pt-8 px-8 border-t border-border max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted-foreground font-body text-sm">
          © {new Date().getFullYear()} Saint Joseph Catholic School. All Rights
          Reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-sjcs-on-surface-variant/60 hover:text-sjcs-primary text-sm">
            Privacy Policy
          </a>
          <a href="#" className="text-sjcs-on-surface-variant/60 hover:text-sjcs-primary text-sm">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}