import createError from "@/lib/utils/createError";

const hierarchy = {
  user: 1,
  moderator: 2,
  admin: 3,
  superAdmin: 4,
};

const getHighestRoleLevel = (roles = [], roleHierarchy = {}) => {
  return roles.reduce((max, role) => Math.max(max, roleHierarchy[role] || 0), 0);
};

const checkRoleHierarchy = ({
  user = "",
  foundUser = "",
  allowOwner = false,
  roleHierarchy = hierarchy,
  ignoreNotFound = false,
}: any = {}) => {
  const actingUser = user;
  const targetUser = foundUser;

  if (!targetUser && ignoreNotFound && getHighestRoleLevel(actingUser.roles, roleHierarchy) > 1) return true;

  if (!actingUser || !targetUser) throw createError("User(s) not found", 404);

  const actingLevel = getHighestRoleLevel(actingUser.roles, roleHierarchy);
  const targetLevel = getHighestRoleLevel(targetUser.roles, roleHierarchy);

  if (allowOwner && actingUser.uid.toString() === targetUser.uid.toString()) return true;

  if (actingLevel > targetLevel) return true;

  throw createError("Action forbidden: insufficient role level.", 403);
};

export default checkRoleHierarchy;
