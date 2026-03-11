import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/middlewares/auth/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/middlewares/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/middlewares/auth/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/middlewares/validate.middleware";
// import { updateUserSchema, updateUserByAdminSchema } from "./users.validator";
import allowRolesMiddleware from "@/lib/middlewares/auth/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/middlewares/auth/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/middlewares/auth/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/middlewares/auth/isResourceOwner.middleware";

export async function GET(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { userData: me } = await loadUserMiddleware({ decoded });

    return NextResponse.json(
      {
        success: true,
        message: "user found successfully",
        data: me,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
