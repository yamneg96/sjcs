import { Link } from "@tanstack/react-router";

export default function ContactPage() {
  return (
    <main>
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <nav className="flex mb-8 text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label">
            <Link to="/">Home</Link><span className="mx-2">/</span>
            <span className="text-sjcs-on-surface-variant/60">Contact Us</span>
          </nav>
          <h1 className="text-7xl font-headline font-extrabold tracking-tight text-sjcs-on-surface max-w-4xl leading-[1.1]">
            Get in <span className="text-sjcs-primary italic">Touch</span>
          </h1>
          <p className="mt-8 text-xl text-sjcs-on-surface-variant max-w-2xl leading-relaxed">
            We'd love to hear from you. Reach out for inquiries about admissions, academics, or campus life.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sjcs-surface-container -z-10 translate-x-20 skew-x-12"></div>
      </header>

      <section className="py-24 px-8 bg-sjcs-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-sjcs-surface-container-lowest p-12 rounded-xl shadow-ambient">
            <h2 className="font-headline text-2xl font-bold mb-2">Send a Message</h2>
            <p className="text-sm text-label-md text-sjcs-on-surface-variant/60 mb-10">We'll respond within 24 hours</p>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">First Name</label>
                  <input className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none" placeholder="John" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Last Name</label>
                  <input className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none" placeholder="Smith" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Email Address</label>
                <input className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none" placeholder="john@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Subject</label>
                <input className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none" placeholder="Admissions Inquiry" type="text" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Message</label>
                <textarea className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none h-32 resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full leadership-gradient text-white py-4 rounded-lg font-label text-xs font-bold tracking-[0.2em] uppercase shadow-lg hover:shadow-sjcs-primary/30 transition-all">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {[
              { icon: "location_on", title: "Visit Us", lines: ["123 Scholar Way", "St. Joseph, SC 29000"] },
              { icon: "phone", title: "Call Us", lines: ["Main Office: (555) 123-4567", "Admissions: (555) 123-4568"] },
              { icon: "mail", title: "Email Us", lines: ["admissions@sjcs.edu", "info@sjcs.edu"] },
              { icon: "schedule", title: "Office Hours", lines: ["Monday – Friday: 7:30 AM – 4:00 PM", "Saturday: 9:00 AM – 12:00 PM"] },
            ].map((info) => (
              <div key={info.title} className="bg-sjcs-surface-container-lowest p-8 rounded-xl flex gap-6 items-start">
                <div className="w-14 h-14 rounded-xl bg-sjcs-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sjcs-primary text-2xl">{info.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold mb-2">{info.title}</h3>
                  {info.lines.map((line) => (
                    <p key={line} className="text-sm text-sjcs-on-surface-variant">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
