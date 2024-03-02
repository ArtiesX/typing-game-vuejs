import { defineStore } from 'pinia'
import { auth } from "@/firebase";
import { collection,
  getDocs,
  doc,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  query, onSnapshot } from "firebase/firestore";
import { db } from '@/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, getAuth, updateProfile, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail } from 'firebase/auth';
import { useGameStore } from '@/stores/game';
import { useSpecialStore } from '@/stores/special';
import { useRoute } from 'vue-router';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAdmin: false,
        isLoggedIn: false,
        user: {},
        allUid: [],
    }),
    actions: {

        async saveUid(val) {
            try {
                await setDoc(doc(collection(db,"uid"),val.uid), {
                    uid: val.uid,
                    name: val.displayName,
                })
            } catch(err) {
                console.log('Error', err);
            }
        },

        async getAllUid() {
             try {
                let uidCol = query(collection(db, "uid"));
                const uidSnapshot = await getDocs(uidCol);
                this.allUid=[]; 
                uidSnapshot.forEach((doc) => {
                    this.allUid.push(doc.data());
                })
            } catch (err) {
                console.log("Err", err);
            }
        },
        async checkAuthState() {
            
            return new Promise(async(resolove) => {
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        this.user = user;
                         this.isLoggedIn = true
                        if (this.user.email === 'admin@admin.com') {
                            this.isAdmin = true;
                        }
                        await this.getAllUid();
                        await useGameStore().resetGame();
                        await useSpecialStore().newGame();
                         resolove(true)
                        
                    } else {
                        this.isLoggedIn = false;
                        this.isAdmin = false;
                        resolove(false)
                    }
                })
            })

        },
        async login(email, password) {
            try {
                const userCredentail = await signInWithEmailAndPassword(auth, email, password);
                this.user = userCredentail.user;
                if (email === 'admin@admin.com') {
                    this.isAdmin = true;
                }
                this.isLoggedIn = true;

            } catch (err) {
                //    switch (err.code) {
                //     case "auth/invalid-email":
                //         alert("invalid email");
                //         break;
                //     case "auth/invalid-credential":
                //         alert("invalid password");
                //         break;
                //    } 
                console.log("error : ", err.code);
            }
        },

        async register(name, email, password) {
            try {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                if (res) {
                    const auth = getAuth();
                    updateProfile(auth.currentUser, {
                        displayName: name,
                    }).then(async () => {
                        this.user = auth.currentUser;
                        await this.saveUid(auth.currentUser);
                    }).catch((err) => {
                        switch (err.code) {
                            case "auth/email-already-in-use":
                        }
                        console.log(err);
                    })
                } else {
                    throw new Error('Unable to register user')
                }
            } catch (err) {
                console.log("error", err);
            }

        },
        async logout() {
            try {
                await signOut(auth);
                this.isLoggedIn = false;
                this.isAdmin = false;
            } catch (err) {
                console.log("Logout err", err);
            }
        },

        async removeAccount(password) {
            await this.reAuth(password);
            await useGameStore().getAllDataByUser();
            await useSpecialStore().getAllDataByUser();
              await useGameStore().removeAllData();
              await deleteDoc(doc(db, "uid", this.user.uid));
                await useSpecialStore().removeAllData();
            await auth.currentUser.delete().then(async(val) => {
              
                await this.checkAuthState();

            }).catch((err) => {
                console.log("Error", err);
            })
        },

        async reAuth(password) {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
            await reauthenticateWithCredential(auth.currentUser, credential).then(() => {  }).catch((err) => {
                console.log("reauth error", err);
            })
        },

        async resetPassword(email) {
            sendPasswordResetEmail(auth,email).then(() => {

            }).catch((error)  => {
            console.log("reset password error", error);
            })
        }
    }
})