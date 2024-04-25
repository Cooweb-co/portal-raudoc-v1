import firebase from "firebase/compat/app";
// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/storage";
import { collection, doc, getDoc } from "firebase/firestore";

class FirebaseAuthBackend {
    constructor(firebaseConfig) {
        if (firebaseConfig) {
            // Initialize Firebase

            const app = firebase.initializeApp(firebaseConfig);
            // firebase.initializeApp(firebaseConfig);
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    sessionStorage.setItem("authUser", JSON.stringify(user));
                } else {
                    sessionStorage.removeItem("authUser");
                }
            });

            this.storage = getStorage(app);
            this.firestore = firebase.firestore();
        }
    }

    getStorage() {
        return this.storage;
    }

    getCurrentUser() {
        return firebase.auth().currentUser;
    }

    /**
     * Registers the user with given details
     */
    registerUser(username, email, password) {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line no-unused-vars
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(
                    () => {
                        let user = firebase.auth().currentUser.updateProfile({
                            displayName: username,
                        });
                        resolve(user);
                    },
                    (error) => {
                        reject(this._handleError(error));
                    }
                );
        });
    }

    /**
     * Login user with given details
     */
    loginUser(email, password) {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(
                    async () => {
                        var user = firebase.auth().currentUser;

                        const refUser = firebase
                            .firestore()
                            .collection("Users")
                            .doc(user?.uid);
                        const doc = await refUser.get();

                        user.updateProfile({
                            displayName: doc.get("displayName"),
                        });
                        user = firebase.auth().currentUser;

                        sessionStorage.setItem(
                            "authUser",
                            JSON.stringify(user)
                        );
                        resolve(user);
                    },
                    (error) => {
                        reject(this._handleError(error));
                    }
                );
        });
    }

    /**
     * Get user info from firestore
     */
    async getUserInfo(company, userId) {
        try {
            // Buscar el usuario por su correo electrónico
            const usersCollection = collection(
                this.firestore,
                "Companies",
                company,
                "Users"
            );


            // Obtener el documento por su ID
        const userDocRef = doc(usersCollection, userId);
        const user = await getDoc(userDocRef);
        
        if (user.exists()) {
            // El documento existe, puedes acceder a sus datos
            return user.data()
        } else {
            console.log("No se encontró el documento.");
            return null
        }

        } catch (error) {
            console.error("Error al obtener información del usuario:", error);
            throw error;
        }
    }

    /**
     * forget Password user with given details
     */
    forgetPassword(email) {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .sendPasswordResetEmail(email, {
                    url:
                        window.location.protocol +
                        "//" +
                        window.location.host +
                        "/login",
                })
                .then(() => {
                    resolve(true);
                })
                .catch((error) => {
                    reject(this._handleError(error));
                });
        });
    }

    /**
     * Logout the user
     */
    logout() {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    alert("logout");
                    resolve(true);
                })
                .catch((error) => {
                    reject(this._handleError(error));
                });
        });
    }

    setLoggeedInUser(user) {
        sessionStorage.setItem("authUser", JSON.stringify(user));
    }

    /**
     * Returns the authenticated user
     */
    getAuthenticatedUser() {
        if (!sessionStorage.getItem("authUser")) return null;
        return JSON.parse(sessionStorage.getItem("authUser"));
    }

    /**
     * Handle the error
     * @param {*} error
     */
    _handleError(error) {
        var errorMessage = error.message;
        return errorMessage;
    }
}

let _fireBaseBackend = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config) => {
    console.log("CONFIG:: ", config);
    if (!_fireBaseBackend) {
        _fireBaseBackend = new FirebaseAuthBackend(config);
    }
    return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
    return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
