import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import admin from "firebase-admin";
import isAuthenticatedMiddleware from "@/lib/middlewares/auth/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/middlewares/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/middlewares/auth/loadResource.middleware";
import validateMiddleware from "@/lib/middlewares/validate.middleware";
// import { createBlogSchema, updateBlogSchema } from "../blogs.validator";
import allowRolesMiddleware from "@/lib/middlewares/auth/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/middlewares/auth/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/middlewares/auth/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/middlewares/auth/isResourceOwner.middleware";

export async function PATCH(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { userRef } = await loadUserMiddleware({ decoded });

    const updatedUser = { email: decoded.email, updatedAt: admin.firestore.FieldValue.serverTimestamp() };

    await userRef.set(updatedUser, { merge: true });

    const userSnap = await userRef.get();
    if (!userSnap.exists) throw createError("User not found", 404);

    const user = userSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "User email updated successfully",
        data: user,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
