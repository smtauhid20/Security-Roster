import { useState, useEffect } from 'react';
import { Staff, PostRequirement, LeaveRecord, OTRecord } from '../types';
import { allStaff as initialStaff, postRequirements as initialPosts } from '../data';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useAppState = () => {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [posts, setPosts] = useState<PostRequirement[]>(initialPosts);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [ots, setOts] = useState<OTRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load initial data once when auth is ready
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, 'shared_roster', 'state'));
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.staff) setStaff(data.staff);
            if (data.posts) setPosts(data.posts);
            if (data.leaves) setLeaves(data.leaves);
            if (data.ots) setOts(data.ots);
          } else {
            // Fallback to localStorage if exists
            const savedStaff = localStorage.getItem('roster_staff_v2');
            const savedPosts = localStorage.getItem('roster_posts_v2');
            const savedLeaves = localStorage.getItem('roster_leaves_v2');
            const savedOts = localStorage.getItem('roster_ots_v2');
            
            if (savedStaff) setStaff(JSON.parse(savedStaff));
            if (savedPosts) setPosts(JSON.parse(savedPosts));
            if (savedLeaves) setLeaves(JSON.parse(savedLeaves));
            if (savedOts) setOts(JSON.parse(savedOts));
          }
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setIsLoaded(true);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const saveData = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await setDoc(doc(db, 'shared_roster', 'state'), {
        staff,
        posts,
        leaves,
        ots,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Also save to localStorage as backup
      localStorage.setItem('roster_staff_v2', JSON.stringify(staff));
      localStorage.setItem('roster_posts_v2', JSON.stringify(posts));
      localStorage.setItem('roster_leaves_v2', JSON.stringify(leaves));
      localStorage.setItem('roster_ots_v2', JSON.stringify(ots));
      
      setSaveMessage('success');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveMessage('error');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return { staff, setStaff, posts, setPosts, leaves, setLeaves, ots, setOts, isLoaded, saveData, isSaving, saveMessage };
};
