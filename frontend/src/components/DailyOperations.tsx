"use client"
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Calendar, BookOpen, FileText, FlaskConical } from 'lucide-react';

export default function DailyOperations() {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.active_semester?.timetable) {
          const tt = data.active_semester.timetable;
          setTimetable(tt);
          
          const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const today = days[new Date().getDay()];
          setTodayClasses(tt.filter((entry: any) => entry.day === today));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || todayClasses.length === 0) return null;

  return (
    <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-secondary w-5 h-5" />
        <h3 className="text-sm font-headline font-bold text-white uppercase tracking-widest italic">Today's Academic Matrix</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {todayClasses.map((cls, idx) => (
          <div key={idx} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 relative group hover:bg-white/[0.05] transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-20 transition-opacity group-hover:opacity-100 italic">
               <span className="text-[10px] font-mono text-zinc-500">{cls.time}</span>
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                    <BookOpen className="text-secondary w-5 h-5" />
                 </div>
                 <h4 className="text-base font-headline font-bold text-white uppercase tracking-tight">{cls.subject}</h4>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                   {cls.subject.toLowerCase().includes("lab") 
                     ? "You have a lab session. Ready to structure your observations?" 
                     : "New class today. Remember to upload your notes for indexing."}
                </p>
                
                <div className="flex gap-2">
                   <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                      {cls.subject.toLowerCase().includes("lab") ? "GENERATE RECORD" : "UPLOAD NOTES"}
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
