import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/middlewares/auth/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/middlewares/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/middlewares/auth/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/middlewares/validate.middleware";
import { createBannerSchema, updateBannerSchema } from "./banners.validator";
import allowRolesMiddleware from "@/lib/middlewares/auth/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/middlewares/auth/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/middlewares/auth/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/middlewares/auth/isResourceOwner.middleware";

// GET
export async function GET(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const userId = req.nextUrl.searchParams.get("userId");

    let bannersRef:any = db.collection("banners")
    if (userId) bannersRef = bannersRef.where("userId", "==", userId);
    // bannersRef = bannersRef.orderBy("createdAt", "desc");

    const bannersSnap = await bannersRef.get();
    const bannersData = bannersSnap.docs.map((doc:any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "banners found successfully",
        data: bannersData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

// CREATE
// export async function POST(req: NextRequest) {
//   try {
//     const decoded = await isAuthenticatedMiddleware(req);

//     const body = await req.json();
//     const value = validateMiddleware({ schema: createBannerSchema, body });

//     const createdBanner = {
//       ...value,
//       userId: decoded.uid,
//       author: decoded.email,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     const duplicateRef = db.collection("banners");
//     const duplicateSnap = await duplicateRef.where("userId", "==", decoded.uid).get();

//     if (!duplicateSnap.empty) throw createError("Banner already exists", 403);
//     const bannerRef = db.collection("banners");
//     const createdBannerRef = await bannerRef.add(createdBanner);

//     const bannerSnap = await createdBannerRef.get();
//     if (!bannerSnap.exists) throw createError("Banner not found", 404);

//     const banner = bannerSnap.data();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "banner created successfully",
//         data: banner,
//       },
//       { status: 201 },
//     );
//   } catch (err: any) {
//     return errorHandlerMiddleware(err);
//   }
// }
