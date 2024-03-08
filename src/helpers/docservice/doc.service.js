import { getFirebaseBackend } from '../../authUtils.js'

// import { authHeader } from '../authservice/auth-header';


const firestore = getFirebaseBackend().firestore

import { doc, onSnapshot } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// const app = getFirebaseBackend().app
// const firestore = getFirestore(app)



export const createClaimID = async (uid) => {

    // eslint-disable-next-line no-useless-catch
    try {
        const docRef = await firestore.collection('Companies').doc('BAQVERDE').collection('Claims').add({
            createdAt: new Date(),
            year: new Date().getFullYear(),
            uid,
            status: 'DRAFT'
        })

        return docRef.id
        
    } catch (error) {
        throw error
    }


}

export const onListenClaimData = async (claimId, companyId, callback) => {

    

    // eslint-disable-next-line no-useless-catch
    return onSnapshot(doc(firestore, "Companies", companyId, "Claims", claimId), (doc) => {

        console.log('onListenClaimData::::OnSnapshot',doc.data());
        callback(doc.data())
    })


}

export const saveFile = async (pathDocument,urlPDF, fileName) => {

    // eslint-disable-next-line no-useless-catch
    try {

        console.log('saveFile:::',pathDocument,urlPDF, fileName);
       
        await firestore.doc(pathDocument).collection('Files').add({
            name: fileName,
            url: urlPDF,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return true
        
    } catch (error) {
        throw error
    }

}