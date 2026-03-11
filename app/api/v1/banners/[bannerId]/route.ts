import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/middlewares/auth/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/middlewares/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/middlewares/auth/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/middlewares/validate.middleware";
import { createBannerSchema, updateBannerSchema } from "../banners.validator";
import allowRolesMiddleware from "@/lib/middlewares/auth/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/middlewares/auth/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/middlewares/auth/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/middlewares/auth/isResourceOwner.middleware";

// UPDATE
// export async function PATCH(req: NextRequest, { params }: { params: Promise<{ bannerId: string }> }) {
//   try {
//     const decoded = await isAuthenticatedMiddleware(req);

//     const body = await req.json();
//     const value = validateMiddleware({ schema: updateBannerSchema, body });

//     const { bannerId } = await params;
//     const {
//       resourceRef: bannerRef,
//       resourceSnap: bannerSnap,
//       resourceData: bannerData,
//     } = await loadResourceMiddleware({
//       id: bannerId,
//       documentName: "banner",
//       collectionName: "banners",
//     });

//     const isAllowed = isResourceOwnerMiddleware({ actingUser: decoded, resource: bannerData });

//     const updatedBanner = {
//       ...value,
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     };
//     await bannerRef.update(updatedBanner);

//     const updatedBannerSnap = await bannerRef.get();
//     const banner = updatedBannerSnap.data();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "banner updated successfully",
//         data: banner,
//       },
//       { status: 200 },
//     );
//   } catch (err: any) {
//     return errorHandlerMiddleware(err);
//   }
// }

// UPSERT
export async function PATCH(req: NextRequest, { params }: {params: Promise<{ bannerId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const body = await req.json();
    const value = validateMiddleware({ schema: updateBannerSchema, body });

    const { bannerId } = await params;
    const bannerRef = db.collection("banners").doc(bannerId);
    const bannerSnap = await bannerRef.get();
    const bannerData = bannerSnap.data();

    // check ownership if banner exists
    if (bannerSnap.exists && !isResourceOwnerMiddleware({ actingUser: decoded, resource: bannerData }))
      throw createError("Not allowed to update this banner", 403);

    const updatedBanner: any = {
      ...value,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!bannerSnap.exists) {
      updatedBanner.userId = decoded.uid;
      updatedBanner.author = decoded.email;
      updatedBanner.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await bannerRef.set(updatedBanner, { merge: true });

    const updatedBannerSnap = await bannerRef.get();
    const banner = updatedBannerSnap.data();

    return NextResponse.json({ success: true, message: "Banner updated successfully", data: banner }, { status: 200 });
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
