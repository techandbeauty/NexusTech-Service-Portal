// Firebase Configuration
// Replace with your actual Firebase config values
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/"
};

// For production, use environment variables
// This configuration will be overridden by Netlify environment variables
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  // Production environment - these will be injected by Netlify
  const prodConfig = {
    apiKey: window.env?.FIREBASE_API_KEY || firebaseConfig.apiKey,
    authDomain: window.env?.FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
    projectId: window.env?.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
    storageBucket: window.env?.FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
    messagingSenderId: window.env?.FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
    appId: window.env?.FIREBASE_APP_ID || firebaseConfig.appId,
    databaseURL: window.env?.FIREBASE_DATABASE_URL || firebaseConfig.databaseURL
  };
  Object.assign(firebaseConfig, prodConfig);
}

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Export for use in other files
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseAnalytics = analytics;

// Authentication functions
window.authFunctions = {
  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        role: 'client',
        ...userData
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          role: 'client'
        });
      }
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen for auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

// Database functions
window.dbFunctions = {
  // Submit project inquiry
  submitProjectInquiry: async (projectData) => {
    try {
      const docRef = await addDoc(collection(db, 'projectInquiries'), {
        ...projectData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's project inquiries
  getUserInquiries: async (userId) => {
    try {
      const q = query(
        collection(db, 'projectInquiries'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const inquiries = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === userId) {
          inquiries.push({ id: doc.id, ...data });
        }
      });
      return { success: true, data: inquiries };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Initialize auth state listener
window.authFunctions.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log('User signed in:', user.email);
    // Update UI to show signed-in state
    document.dispatchEvent(new CustomEvent('userSignedIn', { detail: user }));
  } else {
    // User is signed out
    console.log('User signed out');
    // Update UI to show signed-out state
    document.dispatchEvent(new CustomEvent('userSignedOut'));
  }
});

console.log('Firebase initialized successfully');