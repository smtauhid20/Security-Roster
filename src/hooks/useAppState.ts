import { useState, useEffect } from 'react';
import { Staff, PostRequirement, LeaveRecord, OTRecord } from '../types';
import { allStaff as initialStaff, postRequirements as initialPosts } from '../data';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const useAppState = () => {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [posts, setPosts] = useState<PostRequirement[]>(initialPosts);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [ots, setOts] = useState<OTRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'shared_roster', 'state'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.staff) setStaff(data.staff);
        if (data.posts) setPosts(data.posts);
        if (data.leaves) setLeaves(data.leaves);
        if (data.ots) setOts(data.ots);
      } else {
        // If it doesn't exist in Firestore, maybe load from localStorage once to migrate
        const savedStaff = localStorage.getItem('roster_staff_v2');
        const savedPosts = localStorage.getItem('roster_posts_v2');
        const savedLeaves = localStorage.getItem('roster_leaves_v2');
        const savedOts = localStorage.getItem('roster_ots_v2');
        
        if (savedStaff) setStaff(JSON.parse(savedStaff));
        if (savedPosts) setPosts(JSON.parse(savedPosts));
        if (savedLeaves) setLeaves(JSON.parse(savedLeaves));
        if (savedOts) setOts(JSON.parse(savedOts));
      }
      setIsLoaded(true);
    });
    
    return () => unsub();
  }, []);

  // Save to Firestore when state changes (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    
    const timeout = setTimeout(() => {
      setDoc(doc(db, 'shared_roster', 'state'), {
        staff,
        posts,
        leaves,
        ots,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(console.error);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [staff, posts, leaves, ots, isLoaded]);

  return { staff, setStaff, posts, setPosts, leaves, setLeaves, ots, setOts };
};
