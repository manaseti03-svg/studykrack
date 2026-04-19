import { storage, db } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";

export async function uploadStudyPDF(file: File, subject: string) {
    // 1. Create a tracking doc in Firestore
    const statusRef = await addDoc(collection(db, "vault_status"), {
        filename: file.name,
        subject: subject,
        status: "uploading",
        progress: 0,
        timestamp: serverTimestamp()
    });

    const storageRef = ref(storage, `study_vault/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // Update Firestore progress
                updateDoc(doc(db, "vault_status", statusRef.id), {
                    progress: Math.round(progress)
                });
            }, 
            (error) => {
                updateDoc(doc(db, "vault_status", statusRef.id), {
                    status: "failed",
                    error: error.message
                });
                reject(error);
            }, 
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await updateDoc(doc(db, "vault_status", statusRef.id), {
                    status: "completed",
                    progress: 100,
                    downloadURL: downloadURL
                });
                resolve({ id: statusRef.id, url: downloadURL });
            }
        );
    });
}
