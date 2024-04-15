import { getFirebaseBackend } from "../../authUtils.js";
import {
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
        console.log("onListenClaimData::::OnSnapshot", doc.data());
        callback(doc.data());
      }
    );
  } catch (error) {
    console.log("error: ", error);
  }
  // eslint-disable-next-line no-useless-catch
};

export const saveFile = async (pathDocument, urlPDF, fileName) => {
  // eslint-disable-next-line no-useless-catch
  try {
    console.log("saveFile:::", pathDocument, urlPDF, fileName);

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
    const docRef = doc(firestore, "Companies", companyId, "Claims", claimId);
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

    const docsSnap = await getDocs(collectionRef);

    if (!docsSnap.empty) {
      console.log('entre a la validacion');
      let documents = [];
      console.log('documentos vacios');
      docsSnap.forEach((doc) => {
        documents.push(doc.data());
        console.log(doc.data());
      });

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("Nuevo estado del documento:", doc.data());
          let status = doc.data?.status
          if (status === 'ERROR') {
            return false
          } else if (status === 'PROCESSED') {
            return true
          }
        });
      });

    }
  } catch (error) {
    console.error("Error al obtener los documentos:", error);
  }
}
