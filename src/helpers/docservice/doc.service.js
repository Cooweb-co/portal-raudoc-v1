// import { getFirebaseBackend } from '../../authUtils.js'

// import { authHeader } from '../authservice/auth-header';






export const createDocumentID = async (uid) => {

    // eslint-disable-next-line no-useless-catch
    try {

        // let user = getFirebaseBackend().getCurrentUser()

        // console.log(user.id);

        return uid


        // const firestore = getFirebaseBackend().firestore
        // //
        // const docRef = await firestore.collection('Documents').add({
        //     createdAt: new Date(),
        //     uid,
        //     status: 'DRAFT'
        // })

        // return docRef.id
        
    } catch (error) {
        throw error
    }


}