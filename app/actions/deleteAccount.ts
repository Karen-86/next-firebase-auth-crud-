// already have a deleteUserAction.ts which does both, delete own account and other users, so delete this code after some time

// "use server";

// import { admin } from "@/lib/firebaseAdmin";

// interface DeleteAccountResult {
//   success: boolean;
//   error?: string;
// }

// /**
//  * Deletes the Firebase account of the user associated with the provided ID token
//  */
// export async function deleteAccountAction(idToken: string): Promise<DeleteAccountResult> {
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const uid = decodedToken.uid;

//     // Delete Firebase Auth user
//     await admin.auth().deleteUser(uid);

//     // Delete Firestore user data
//     await admin.firestore().collection("users").doc(uid).delete();

//     return { success: true };
//   } catch (error: any) {
//     console.error("Delete account error:", error);
//     return { success: false, error: error.message };
//   }
// }
