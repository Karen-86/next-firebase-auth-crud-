import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/middlewares/auth/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/middlewares/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/middlewares/auth/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/middlewares/validate.middleware";
import { updateUserRolesSchema } from "../../users.validator";
import allowRolesMiddleware from "@/lib/middlewares/auth/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/middlewares/auth/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/middlewares/auth/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/middlewares/auth/isResourceOwner.middleware";
import isOwnerMiddleware from "@/lib/middlewares/auth/isOwner.middleware";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { userData: user } = await loadUserMiddleware({ decoded });

    const body = await req.json();
    if (!body.roles) throw createError("Field roles is required", 400);

    const value = validateMiddleware({ schema: updateUserRolesSchema, body });
    const { userId } = await params;
    const {
      resourceRef: userRef,
      resourceSnap: userSnap,
      resourceData: foundUser,
    } = await loadResourceMiddleware({
      id: userId,
      documentName: "user",
      collectionName: "users",
    });

    const isAllowed = checkRoleHierarchyMiddleware({ user, foundUser });

    const updatedUser = {
      ...value,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await userRef.update(updatedUser);

    const updatedUserSnap = await userRef.get();
    const updatedUserData = updatedUserSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "user roles updated successfully",
        data: updatedUserData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
