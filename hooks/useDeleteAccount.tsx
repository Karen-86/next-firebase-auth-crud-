// already have a useDeleteUser.tsx which does both, delete own account and other users, so delete this code after some time


// import { auth } from "@/config/firebase";
// import useAlert from "./useAlert";
// import { deleteAccountAction } from "@/app/actions/deleteAccount";
// // import { useRouter } from "next/navigation";

// export const useDeleteAccount = () => {
//   const { errorAlert, successAlert } = useAlert();
// //   const router = useRouter();

//   const deleteAccount = async ({ setIsLoading = (_: boolean) => {} }) => {
//     setIsLoading(true); // ✅ works immediately
//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error("No user signed in");

//       // Get Firebase ID token
//       const idToken = await user.getIdToken();

//       // Call server action
//       const res = await deleteAccountAction(idToken);

//       if (res.success) {
//         successAlert("Account deleted successfully");

//         // Sign out locally
//         await auth.signOut();
//         //   router.push("/");
//       } else {
//         errorAlert(res.error || "Failed to delete account");
//       }
//     } catch (err: any) {
//       errorAlert(err.message);
//     } finally {
//       setIsLoading(false); // ✅ reset loading
//     }
//   };

//   return { deleteAccount };
// };
