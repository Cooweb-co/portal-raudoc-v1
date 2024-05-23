import { getFirebaseBackend } from "../../authUtils.js";
import {
    doc,
    onSnapshot,
    getDoc,
    getDocs,
    collection,
    deleteDoc,
    query,
    where,
} from "firebase/firestore";
import {
    getStorage,
    ref,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";

import store from "@/state/store";

const firestore = getFirebaseBackend().firestore;

export const createClaimID = async (uid) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const docRef = await firestore
            .collection("Companies")
            .doc("BAQVERDE")
            .collection("Claims")
            .add({
                createdAt: new Date(),
                year: new Date().getFullYear(),
                uid,
                status: "DRAFT",
            });

        return docRef.id;
    } catch (error) {
        throw error;
    }
};

export const onListenClaimData = async (claimId, companyId, callback) => {
    try {
        return onSnapshot(
            doc(firestore, "Companies", companyId, "Claims", claimId),
            (doc) => {
                // console.log("onListenClaimData::::OnSnapshot", doc.data());
                callback(doc.data());
            }
        );
    } catch (error) {
        console.error("error: ", error);
    }
    // eslint-disable-next-line no-useless-catch
};

export const saveFile = async (pathDocument, urlPDF, fileName) => {
    // eslint-disable-next-line no-useless-catch
    try {
        // console.log("saveFile:::", pathDocument, urlPDF, fileName);

        await firestore.doc(pathDocument).collection("Files").add({
            name: fileName,
            url: urlPDF,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return true;
    } catch (error) {
        throw error;
    }
};

export const getDocument = async (companyId, claimId) => {
    try {
        const docRef = doc(
            firestore,
            "Companies",
            companyId,
            "Claims",
            claimId
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No existe el document!");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener el documento:", error);
    }
};

export const getDocumentFilesUploads = async (companyId, claimId) => {
    try {
        const collectionRef = collection(
            firestore,
            "Companies",
            companyId,
            "Claims",
            claimId,
            "Files"
        );
        const docsSnap = await getDocs(collectionRef);

        if (!docsSnap.empty) {
            let documents = [];
            docsSnap.forEach((doc) => {
                documents.push(doc.data());
            });
            return documents;
        } else {
            console.log("No existen documentos en la colección!");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener los documentos:", error);
    }
};

export async function openDocument(fileName, filePath) {
    const storage = getStorage();
    const storageRef = ref(storage, `${filePath}/${fileName}`);

    try {
        const url = await getDownloadURL(storageRef);
        window.open(url, "_blank");
    } catch (error) {
        console.error("Error al obtener URL del archivo:", error);
    }
}

export async function getDocStatus(companyId, claimId) {
    try {
        const collectionRef = collection(
            firestore,
            "Companies",
            companyId,
            "Claims",
            claimId,
            "Files"
        );

        onSnapshot(collectionRef, (querySnapshot) => {
            const querySnapshotUpdates = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                querySnapshotUpdates.push(data);
                store.dispatch("createDocState/STATE_DOC", { newValue: data });
            });
        });
        return;
    } catch (error) {
        console.error("Error al obtener los documentos:", error);
    }
}

export const deleteDocumentByName = async (companyId, claimId, fileId, year) => {
    try {
        // Define the query to find the document with the specific name
        const collectionPath = `Companies/${companyId}/Claims/${claimId}/Files`;
        const q = query(
            collection(firestore, collectionPath),
            where("name", "==", fileId)
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Check if any document was found
        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (docSnapshot) => {
                // Get the document reference
                const docRef = doc(firestore, collectionPath, docSnapshot.id);

                // Delete the document
                await deleteDoc(docRef);
                await deleteFile(companyId, year, claimId, fileId);
            });
            return true;
        } else {
            console.error(
                "No se encontró ningún documento con el nombre especificado."
            );
            return false;
        }
    } catch (error) {
        console.error("Error al eliminar el documento:", error);
        return false;
    }
};

export const deleteFile = async (companyId, year, claimId, uniqueFileName) => {
    try {
        const storage = getStorage();
        const storagePath = `Companies/${companyId}/${year}/Claims/${claimId}/${uniqueFileName}`;
        const fileRef = ref(storage, storagePath);

        await deleteObject(fileRef);
        return true;
    } catch (error) {
        console.error("Error al eliminar el archivo:", error);
        return false;
    }
};
