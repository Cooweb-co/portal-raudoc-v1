import { getFirebaseBackend } from '../../authUtils.js'

// import { authHeader } from '../authservice/auth-header';


const firestore = getFirebaseBackend().firestore



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