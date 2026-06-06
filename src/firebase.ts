import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc,
  query, 
  where, 
  updateDoc,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import { Product, Order, UserProfile } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';

// The user-provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE-7ETMvElAPydPlqNUBT8CGUNi2IWpII",
  authDomain: "my-project-c71d4.firebaseapp.com",
  databaseURL: "https://my-project-c71d4-default-rtdb.firebaseio.com",
  projectId: "my-project-c71d4",
  storageBucket: "my-project-c71d4.firebasestorage.app",
  messagingSenderId: "852401080164",
  appId: "1:852401080164:web:2df2d13116b8d85fdd1c71",
  measurementId: "G-NHVP8SXLC3"
};

let app;
let auth: any = null;
let db: any = null;
let isFirebaseAvailable = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  isFirebaseAvailable = true;
  console.log("Firebase initialized successfully with provided config!");
} catch (error) {
  console.warn("Could not connect to Firebase. Falling back to local storage.", error);
  isFirebaseAvailable = false;
}

export { auth, db, isFirebaseAvailable };

// Local Emulation State for fallback
const LOCAL_STORAGE_PREFIX = 'green_mango_';

function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {}
}

// Ensure products exist either in Local Storage or Firestore
export async function loadProducts(): Promise<Product[]> {
  if (isFirebaseAvailable && db) {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (snap.empty) {
        // Seed initial products to Firestore
        console.log("Seeding initial products to Firestore...");
        for (const prod of INITIAL_PRODUCTS) {
          await setDoc(doc(db, 'products', prod.id), prod);
        }
        return INITIAL_PRODUCTS;
      } else {
        const prodList: Product[] = [];
        snap.forEach((docSnap) => {
          prodList.push({ id: docSnap.id, ...(docSnap.data() as object) } as Product);
        });
        return prodList;
      }
    } catch (e) {
      console.error("Firestore loading products failed, using backup dataset", e);
    }
  }

  // Backup or Emulation
  const localProds = getLocalStorage<Product[]>('products', []);
  if (localProds.length === 0) {
    setLocalStorage('products', INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  return localProds;
}

// Function to update single product (stock, price, etc. for Admin)
export async function updateProductInDb(product: Product): Promise<void> {
  if (isFirebaseAvailable && db) {
    try {
      await setDoc(doc(db, 'products', product.id), product);
      return;
    } catch (e) {
      console.error("Firebase updateProduct failed", e);
    }
  }

  // Local Storage fallback
  const prods = await loadProducts();
  const index = prods.findIndex(p => p.id === product.id);
  if (index !== -1) {
    prods[index] = product;
  } else {
    prods.push(product);
  }
  setLocalStorage('products', prods);
}

// Function to delete single product (for Admin)
export async function deleteProductFromDb(productId: string): Promise<void> {
  if (isFirebaseAvailable && db) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      return;
    } catch (e) {
      console.error("Firebase deleteProduct failed", e);
    }
  }

  // Local Storage fallback
  const prods = await loadProducts();
  const updatedProds = prods.filter(p => p.id !== productId);
  setLocalStorage('products', updatedProds);
}

// Load Orders
export async function fetchOrders(userId?: string): Promise<Order[]> {
  if (isFirebaseAvailable && db) {
    try {
      let q;
      if (userId) {
        q = query(collection(db, 'orders'), where('userId', '==', userId));
      } else {
        q = collection(db, 'orders'); // Admins fetch all
      }
      const snap = await getDocs(q);
      const orders: Order[] = [];
      snap.forEach((docSnap) => {
        orders.push({ id: docSnap.id, ...(docSnap.data() as object) } as any);
      });
      // Sort by newest
      return orders.sort((a, b) => b.createdAt - a.createdAt);
    } catch (e) {
      console.error("Firestore fetching orders failed, falling back to local storage", e);
    }
  }

  const localOrders = getLocalStorage<Order[]>('orders', []);
  const filtered = userId ? localOrders.filter(o => o.userId === userId) : localOrders;
  return filtered.sort((a, b) => b.createdAt - a.createdAt);
}

// Create Order (Checkout)
export async function createOrderInDb(order: Order): Promise<void> {
  if (isFirebaseAvailable && db) {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
      // Let's also adjust stock of products in Firestore
      for (const item of order.items) {
        try {
          const prodDoc = await getDoc(doc(db, 'products', item.productId));
          if (prodDoc.exists()) {
            const currentStock = prodDoc.data().stock || 0;
            const newStock = Math.max(0, currentStock - item.quantity);
            await updateDoc(doc(db, 'products', item.productId), { stock: newStock });
          }
        } catch (stockErr) {
          console.warn("Stock reduction failed", stockErr);
        }
      }
      return;
    } catch (e) {
      console.error("Firestore order creation failed", e);
    }
  }

  // Local Storage fallback
  const orders = getLocalStorage<Order[]>('orders', []);
  orders.push(order);
  setLocalStorage('orders', orders);

  // Reduce local stock
  const prods = getLocalStorage<Product[]>('products', INITIAL_PRODUCTS);
  for (const item of order.items) {
    const idx = prods.findIndex(p => p.id === item.productId);
    if (idx !== -1) {
      prods[idx].stock = Math.max(0, (prods[idx].stock || 0) - item.quantity);
    }
  }
  setLocalStorage('products', prods);
}

// Load / Save User Profile
export async function saveProfile(profile: UserProfile): Promise<void> {
  if (isFirebaseAvailable && db) {
    try {
      await setDoc(doc(db, 'users', profile.uid), profile);
      return;
    } catch (e) {
      console.error("Firestore user profile save failed", e);
    }
  }
  setLocalStorage(`user_profile_${profile.uid}`, profile);
}

export async function fetchProfile(uid: string, defaultEmail: string, defaultName: string): Promise<UserProfile> {
  if (isFirebaseAvailable && db) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (e) {
      console.error("Firestore user profile load failed", e);
    }
  }

  const localProfile = getLocalStorage<UserProfile | null>(`user_profile_${uid}`, null);
  if (localProfile) {
    return localProfile;
  }

  // If no profile, create default
  const newProfile: UserProfile = {
    uid,
    email: defaultEmail,
    displayName: defaultName,
    role: defaultEmail.includes('nazrul') || defaultEmail === 'admin@greenmango.com' ? 'admin' : 'customer' // Seed Nazrul as admin
  };
  setLocalStorage(`user_profile_${uid}`, newProfile);
  return newProfile;
}
