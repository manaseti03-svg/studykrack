import Link from 'next/link';
import Image from 'next/image';
import GlassPanel from '@/components/ui/GlassPanel';
import LiquidBackground from '@/components/ui/LiquidBackground';
import ScholarisButton from '@/components/ui/ScholarisButton';
import Icon from '@/components/ui/Icon';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-on-background selection:bg-secondary/30 overflow-x-hidden">
      <LiquidBackground />

      {/* Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center px-6 md:px-12 h-20 border-b border-white/5">
        <div className="text-2xl font-extrabold tracking-tighter text-indigo-100 font-headline">studyKrack</div>
        <div className="hidden md:flex items-center gap-10 font-headline font-bold text-sm">
          <Link href="#features" className="text-slate-400 hover:text-cyan-400 transition-colors">Features</Link>
          <Link href="#methodology" className="text-slate-400 hover:text-cyan-400 transition-colors">Methodology</Link>
          <Link href="#pricing" className="text-slate-400 hover:text-cyan-400 transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-primary font-headline font-bold hover:text-secondary transition-colors px-4">Log In</Link>
          <ScholarisButton href="/signup" variant="primary" className="!px-6 !py-2.5">Get Started</ScholarisButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center z-10">
        <div className="max-w-5xl">
          <h1 className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8 animate-fade-in-up">
            Your Academic <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Mastery, Redefined</span>
          </h1>
          <p className="max-w-2xl mx-auto text-on-surface-variant font-body text-lg md:text-xl mb-12">
            Elevate your research through a high-viscosity interface designed for deep cognitive flow and multi-dimensional organization. Spin the archive.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <ScholarisButton href="/signup" className="!px-10 !py-5 scale-110">Start Your Mastery</ScholarisButton>
            <ScholarisButton href="#features" variant="secondary" className="!px-10 !py-5">View Features</ScholarisButton>
          </div>
        </div>

        {/* Hero Image Mockup (Consolidated) */}
        <div className="mt-24 relative w-full max-w-4xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 blur-3xl opacity-50"></div>
          <GlassPanel className="p-4" animate={true} hoverable={true}>
            <div className="w-full h-96 lg:h-[30rem] rounded-xl bg-surface-container-lowest overflow-hidden relative">
              <Image 
                src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1200&auto=format&fit=crop" 
                alt="studyKrack Preview" 
                fill
                priority
                className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Bento Grid Features (Refactored to GlassPanel) */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassPanel className="md:col-span-2 p-12 flex flex-col justify-between group">
            <div className="space-y-4">
              <Icon name="auto_stories" className="text-secondary text-5xl" />
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
          </GlassPanel>

          <GlassPanel className="p-8 flex flex-col items-center text-center justify-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
              <Icon name="analytics" className="text-secondary text-4xl" />
            </div>
            <h3 className="font-headline text-2xl font-bold">Deep Analytics</h3>
            <p className="text-on-surface-variant text-sm">Real-time metrics on your study patterns and knowledge retention cycles.</p>
          </GlassPanel>

          <GlassPanel className="p-8 flex flex-col items-center text-center justify-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="edit_note" className="text-primary text-4xl" />
            </div>
            <h3 className="font-headline text-2xl font-bold">Fluid Notes</h3>
            <p className="text-on-surface-variant text-sm">Asymmetric note-taking that adapts to your mental model, not a template.</p>
          </GlassPanel>
        </div>
      </section>

      {/* Evolutionary Comparison Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-32 space-y-6">
             <h2 className="text-6xl font-headline font-black text-white tracking-tighter uppercase italic drop-shadow-[0_0_20px_#44d8f140]">The Evolutionary Leap</h2>
             <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-12 bg-secondary/50"></div>
                <p className="text-secondary font-bold text-xs uppercase tracking-[0.5em] opacity-80">Beyond Legacy Architecture</p>
                <div className="h-0.5 w-12 bg-secondary/50"></div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Standard Apps Column */}
            <div className="lg:col-span-5">
              <GlassPanel className="p-16 h-full border-white/5 opacity-40 grayscale blur-[1px] hover:grayscale-0 hover:blur-none hover:opacity-60 transition-all duration-1000 bg-white/5" hoverable={false} animate={false}>
                <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-6 text-slate-500">
                  <h3 className="text-xl font-headline font-bold uppercase tracking-widest">Standard Legacy</h3>
                  <Icon name="block" className="text-2xl" />
                </div>
                <div className="space-y-20">
                    {[
                      { f: 'Doubts', d: 'Google Search (Slow)', i: 'search_off' },
                      { f: 'Focus', d: 'Manual Timer', i: 'timer_off' },
                      { f: 'Persistence', d: 'Local Storage (Lost)', i: 'sd_card_alert' }
                    ].map(item => (
                      <div key={item.f} className="flex items-center gap-10">
                        <Icon name={item.i} className="text-4xl text-slate-800" />
                        <div>
                          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-2">{item.f}</div>
                          <div className="text-xl font-headline font-medium text-slate-600 leading-tight">{item.d}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </GlassPanel>
            </div>

            {/* Middle Divider Icon */}
            <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
               <div className="w-12 h-12 rounded-full border border-secondary/30 flex items-center justify-center text-secondary shadow-[0_0_20px_#44d8f130]">
                  <Icon name="arrow_forward" className="text-2xl" />
               </div>
            </div>

            {/* Scholaris / studyKrack Column */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-4 bg-secondary/10 blur-3xl rounded-[3rem] animate-pulse-slow" />
              <GlassPanel className="p-16 h-full border-secondary/40 bg-secondary/5 relative overflow-hidden backdrop-blur-2xl" hoverable={false} animate={true}>
                <div className="flex items-center justify-between mb-16 border-b border-secondary/20 pb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-headline font-black text-white uppercase tracking-tighter italic">
                      <span className="text-secondary">Scholaris</span> 2.0
                    </h3>
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping shadow-[0_0_15px_#44d8f1]" />
                  </div>
                  <Icon name="verified" className="text-3xl text-secondary animate-bounce-slow" />
                </div>

                <div className="space-y-20">
                    {[
                      { f: 'Neural Intelligence', d: 'Instant AI Tutor (Context-aware)', i: 'psychology', c: 'text-secondary' },
                      { f: 'Cognitive Sanctum', d: 'Fullscreen Shield + Silent Notifications', i: 'shield', c: 'text-amber-400' },
                      { f: 'Quantum Persistence', d: 'Supabase Cloud + Firebase Security', i: 'cloud_done', c: 'text-secondary' }
                    ].map(item => (
                      <div key={item.f} className="flex items-center gap-10 relative z-10 group/item">
                        <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(68,216,241,0.1)] group-hover/item:border-secondary transition-all duration-500`}>
                          <Icon name={item.i} className={`text-4xl ${item.c}`} />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-secondary uppercase tracking-[0.4em] mb-2 drop-shadow-[0_0_10px_rgba(68,216,241,0.4)]">{item.f}</div>
                          <div className="text-2xl font-headline font-black text-white italic tracking-tighter leading-tight drop-shadow-lg">{item.d}</div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-24 relative z-10">
                  <ScholarisButton href="/login" variant="primary" className="!w-full !h-24 !text-base !font-black !italic !uppercase !tracking-[0.3em] !rounded-3xl shadow-[0_0_50px_rgba(68,216,241,0.2)] hover:shadow-[0_0_60px_rgba(68,216,241,0.4)] transition-all">
                    Initiate Ascension
                  </ScholarisButton>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
        
        {/* Deep background mesh behind comparison */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-secondary/10 via-transparent to-transparent opacity-30 select-none pointer-events-none" />
      </section>

      {/* CTA Section (Refactored) */}
      <section className="py-40 px-6 relative z-10">
        <GlassPanel className="max-w-4xl mx-auto text-center p-20">
          <h2 className="font-headline text-5xl font-extrabold mb-6">Ready to redefine your mastery?</h2>
          <p className="text-on-surface-variant mb-12 max-w-xl mx-auto text-lg leading-relaxed">Join thousands of researchers and students who have already stepped into the translucent archive.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <ScholarisButton href="/signup" variant="primary" className="!px-12">Create Account</ScholarisButton>
            <ScholarisButton href="/login" variant="secondary" className="!px-12">Sign In</ScholarisButton>
          </div>
        </GlassPanel>
      </section>

      {/* Footer (Optimized) */}
      <footer className="py-20 bg-surface-container-lowest/50 border-t border-white/5 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="space-y-6">
            <div className="text-2xl font-extrabold tracking-tighter text-indigo-100 font-headline">studyKrack</div>
            <p className="text-on-surface-variant leading-relaxed">Building the future of academic research through liquid-glass design principles.</p>
          </div>
          <div className="space-y-4">
             <h5 className="font-headline font-bold uppercase text-[10px] tracking-widest text-primary">Platform</h5>
             <ul className="space-y-3 text-on-surface-variant">
               <li><Link href="/dashboard" className="hover:text-secondary">Explore Dashboard</Link></li>
               <li><Link href="/dashboard/focus" className="hover:text-secondary">Focus Sanctum</Link></li>
               <li><Link href="/dashboard/academics" className="hover:text-secondary">Academic Analytics</Link></li>
             </ul>
          </div>
          <div className="space-y-4">
             <h5 className="font-headline font-bold uppercase text-[10px] tracking-widest text-primary">Resources</h5>
             <ul className="space-y-3 text-on-surface-variant">
               <li><Link href="#" className="hover:text-secondary">Methodology</Link></li>
               <li><Link href="#" className="hover:text-secondary">Privacy Archival</Link></li>
               <li><Link href="#" className="hover:text-secondary">Scholarship Docs</Link></li>
             </ul>
          </div>
          <div className="space-y-4">
             <h5 className="font-headline font-bold uppercase text-[10px] tracking-widest text-primary">Connect</h5>
             <div className="flex gap-4">
                <Icon name="public" className="text-slate-500 hover:text-secondary cursor-pointer" />
                <Icon name="alternate_email" className="text-slate-500 hover:text-secondary cursor-pointer" />
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-outline">
          © {new Date().getFullYear()} studyKrack Research Systems
        </div>
      </footer>
    </main>
  );
}
