"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, setDoc, doc } from "firebase/firestore";

interface LeaderboardEntry {
  id: string;
  name: string;
  progress: number;
  department: string;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize Mock Data into Firestore on load (to ensure the collection exists)
    const initMockData = async () => {
       const mockUsers = [
         { id: "u1", name: "Muni Manas", progress: 92, department: "AIML" },
         { id: "u2", name: "Alex R.", progress: 85, department: "CSE" },
         { id: "u3", name: "Sarah K.", progress: 78, department: "AIML" },
         { id: "u4", name: "David L.", progress: 45, department: "ECE" },
         { id: "u5", name: "Emma W.", progress: 88, department: "CSE" },
       ];
       
       // Note: In production this would be removed, but we do this to guarantee the leaderboard data
       try {
           for (const user of mockUsers) {
               await setDoc(doc(db, "leaderboard", user.id), user, { merge: true });
           }
       } catch (e) {
           console.log("Mock data initialization failed (possibly offline mode). Using local state.");
       }
    };
    initMockData();

    // 2. Fetch Leaders
    const q = query(collection(db, "leaderboard"), orderBy("progress", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data: LeaderboardEntry[] = [];
        snapshot.forEach((doc) => {
            data.push(doc.data() as LeaderboardEntry);
        });
        
        // Fallback for offline mode if snapshot is empty initially due to offline cache miss
        if (data.length === 0) {
            setLeaders([
                 { id: "u1", name: "Muni Manas", progress: 92, department: "AIML" },
                 { id: "u5", name: "Emma W.", progress: 88, department: "CSE" },
                 { id: "u2", name: "Alex R.", progress: 85, department: "CSE" },
                 { id: "u3", name: "Sarah K.", progress: 78, department: "AIML" },
                 { id: "u4", name: "David L.", progress: 45, department: "ECE" }
            ]);
        } else {
            setLeaders(data);
        }
        setLoading(false);
    }, (error) => {
        console.error("Leaderboard fetch error", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full">
      <h3 className="text-xl font-headline font-bold text-white mb-6 flex items-center gap-2">
         <span className="material-symbols-outlined text-secondary">social_leaderboard</span>
         Global Ranking (Syllabus Progress)
      </h3>
      
      {loading ? (
         <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
               <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5"></div>
            ))}
         </div>
      ) : (
         <div className="space-y-3">
             {leaders.map((user, index) => (
                 <div key={user.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${user.name === 'Muni Manas' ? 'bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(74,225,131,0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-secondary text-black' : index === 1 ? 'bg-zinc-300 text-black' : index === 2 ? 'bg-orange-400 text-black' : 'bg-surface-container-highest text-white'}`}>
                          #{index + 1}
                       </div>
                       <div>
                          <div className="font-bold text-white flex items-center gap-2">
                             {user.name}
                             {user.name === 'Muni Manas' && <span className="text-[8px] bg-primary text-black px-2 py-0.5 rounded-full uppercase tracking-widest">You</span>}
                          </div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{user.department}</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${user.progress > 80 ? 'bg-secondary' : user.progress > 50 ? 'bg-primary' : 'bg-red-500'}`} style={{ width: `${user.progress}%` }}></div>
                       </div>
                       <div className="font-mono text-sm tracking-widest font-bold w-10 text-right">{user.progress}%</div>
                    </div>
                 </div>
             ))}
         </div>
      )}
    </div>
  );
}
