import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useAcademicMatrix() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [matrix, setMatrix] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const unsubscribeProfile = onSnapshot(doc(db, "users", user.uid), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setMatrix(data.active_semester);
          
          if (!data.active_semester && !data.setup_skipped && pathname !== '/setup' && pathname !== '/auth') {
            router.push('/setup');
          }
        } else {
          if (pathname !== '/setup' && pathname !== '/auth') {
            router.push('/setup');
          }
        }
        setLoading(false);
      });

      return () => unsubscribeProfile();
    });

    return () => unsubscribeAuth();
  }, [pathname, router]);

  return { matrix, loading };
}
