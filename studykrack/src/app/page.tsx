import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-on-background selection:bg-secondary/30 overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 opacity-40 liquid-mesh"></div>

      {/* Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center px-6 md:px-12 h-20 shadow-[0_8px_32px_0_rgba(68,216,241,0.05)] border-b border-white/5">
        <div className="text-2xl font-extrabold tracking-tighter text-indigo-100 font-headline">studyKrack</div>
        <div className="hidden md:flex items-center gap-10 font-headline font-bold text-sm">
          <Link href="#features" className="text-slate-400 hover:text-cyan-400 transition-colors">Features</Link>
          <Link href="#methodology" className="text-slate-400 hover:text-cyan-400 transition-colors">Methodology</Link>
          <Link href="#pricing" className="text-slate-400 hover:text-cyan-400 transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-primary font-headline font-bold hover:text-secondary transition-colors">Log In</Link>
          <Link href="/signup" className="px-6 py-2.5 bg-primary-container text-white rounded-xl font-bold font-headline shadow-lg hover:bg-primary transition-all active:scale-95">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center z-10">
        <div className="max-w-5xl animate-fade-in-up">
          <h1 className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8">
            Your Academic <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Mastery, Redefined</span>
          </h1>
          <p className="max-w-2xl mx-auto text-on-surface-variant font-body text-lg md:text-xl mb-12">
            Elevate your research through a high-viscosity interface designed for deep cognitive flow and multi-dimensional organization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup" className="px-10 py-5 bg-gradient-to-r from-primary-container to-secondary-container rounded-lg font-headline font-bold text-white scale-105 transition-transform shadow-xl hover:brightness-110 active:scale-95">
              Start Your Mastery
            </Link>
            <Link href="#features" className="px-10 py-5 bg-surface-container-high/50 backdrop-blur-md border border-outline-variant/20 rounded-lg font-headline font-bold text-on-surface hover:bg-surface-variant transition-all">
              View Features
            </Link>
          </div>
        </div>

        {/* Hero Image Mockup (Conceptual) */}
        <div className="mt-24 relative w-full max-w-4xl animate-scale-in">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 blur-3xl opacity-50"></div>
          <div className="relative glass-panel rounded-2xl overflow-hidden shadow-2xl p-4 border border-white/10">
            <div className="w-full h-96 lg:h-[30rem] rounded-xl bg-surface-container-lowest overflow-hidden relative">
              <Image 
                src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1200&auto=format&fit=crop" 
                alt="studyKrack Preview" 
                fill
                priority
                className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Highlight */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 p-12 glass-panel rounded-3xl flex flex-col justify-between overflow-hidden relative group border-white/10 hover:-translate-y-2 transition-transform">
            <div className="space-y-4">
              <span className="material-symbols-outlined text-secondary text-5xl">auto_stories</span>
              <h3 className="font-headline text-4xl font-bold tracking-tight">The Translucent Archive</h3>
              <p className="text-on-surface-variant max-w-md">Our archival system utilizes refraction-based layering to ensure your research notes are always in sight but never in the way.</p>
            </div>
            <div className="mt-12 h-64 rounded-xl bg-gradient-to-tr from-surface-container-lowest to-surface-container-high overflow-hidden opacity-40 group-hover:opacity-60 transition-opacity relative">
              <Image 
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop" 
                alt="Library" 
                fill
                className="object-cover" 
              />
            </div>
          </div>

          <div className="p-8 glass-panel rounded-3xl flex flex-col items-center text-center justify-center space-y-6 hover:-translate-y-2 transition-transform border-white/10">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-4xl">analytics</span>
            </div>
            <h3 className="font-headline text-2xl font-bold">Deep Analytics</h3>
            <p className="text-on-surface-variant text-sm">Real-time metrics on your study patterns and knowledge retention cycles.</p>
          </div>

          <div className="p-8 glass-panel rounded-3xl flex flex-col items-center text-center justify-center space-y-6 hover:-translate-y-2 transition-transform border-white/10">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-4xl">edit_note</span>
            </div>
            <h3 className="font-headline text-2xl font-bold">Fluid Notes</h3>
            <p className="text-on-surface-variant text-sm">Asymmetric note-taking that adapts to your mental model, not a template.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center p-20 glass-panel rounded-3xl border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>
          <h2 className="font-headline text-5xl font-extrabold mb-6">Ready to redefine your mastery?</h2>
          <p className="text-on-surface-variant mb-12 max-w-xl mx-auto text-lg leading-relaxed">Join thousands of researchers and students who have already stepped into the translucent archive.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup" className="px-12 py-5 bg-primary text-on-primary rounded-full font-headline font-bold text-lg hover:brightness-110 active:scale-95 transition-all">Create Account</Link>
            <Link href="/login" className="px-12 py-5 border border-secondary/30 text-secondary rounded-full font-headline font-bold text-lg hover:bg-secondary/5 active:scale-95 transition-all">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-surface-container-lowest/50 border-t border-white/5 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="text-2xl font-extrabold tracking-tighter text-indigo-100 font-headline">studyKrack</div>
            <p className="text-on-surface-variant text-sm leading-relaxed">Building the future of academic research through liquid-glass design principles.</p>
          </div>
          <div className="space-y-4">
             <h5 className="font-headline font-bold uppercase text-[10px] tracking-widest text-primary">Platform</h5>
             <ul className="space-y-3 text-on-surface-variant text-sm">
               <li><Link href="/dashboard" className="hover:text-secondary">Explore Dashboard</Link></li>
               <li><Link href="/dashboard/focus" className="hover:text-secondary">Focus Sanctum</Link></li>
               <li><Link href="/dashboard/academics" className="hover:text-secondary">Academic Analytics</Link></li>
             </ul>
          </div>
          <div className="space-y-4">
             <h5 className="font-headline font-bold uppercase text-[10px] tracking-widest text-primary">Resources</h5>
             <ul className="space-y-3 text-on-surface-variant text-sm">
               <li><Link href="#" className="hover:text-secondary">Methodology</Link></li>
               <li><Link href="#" className="hover:text-secondary">Privacy Archival</Link></li>
               <li><Link href="#" className="hover:text-secondary">Scholarship Docs</Link></li>
             </ul>
          </div>
          <div className="space-y-4">
             <h5 className="font-headline font-bold uppercase text-[10px] tracking-widest text-primary">Connect</h5>
             <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-secondary/10 hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-sm">public</span>
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-secondary/10 hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </button>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-outline">
          © {new Date().getFullYear()} studyKrack Research Systems. All rights academic.
        </div>
      </footer>
    </main>
  );
}
