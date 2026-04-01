import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="w-full mt-20 pt-16 pb-8 bg-sjcs-surface-container-low dark:bg-background border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="space-y-6">
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

      {/* Bottom bar */}
      <div className="mt-16 pt-8 px-8 border-t border-border max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
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
