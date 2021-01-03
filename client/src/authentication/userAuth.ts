export enum UserRoles {
  superAdmin = "superAdmin",
  admin = "admin",
  resident = "resident",
  attendee = "attendee",
  nurse = "nurse",
}

export const userRoles = {
  admins: [String(UserRoles.superAdmin), String(UserRoles.admin)],
  users: [
    String(UserRoles.resident),
    String(UserRoles.attendee),
    String(UserRoles.nurse),
  ],
  all: [
    String(UserRoles.admin),
    String(UserRoles.resident),
    String(UserRoles.attendee),
    String(UserRoles.nurse),
  ],
};

export enum AuthRoutes {
  residentDashboard = "/resident_dashboard",
  residentAccount = "/resident_account",
  residentStatistics = "/resident_statistics",
  attendeeDashboard = "/attendee_dashboard",
  attendeeAccount = "/attendee_account",
  attendeeStatistics = "/attendee_statistics",
  nurseDashboard = "/nurse_dashboard",
  nurseAccount = "/nurse_account",
  nurseStatistics = "/nurse_statistics",
  adminPanel = "/admin",
}

export enum NonAuthRoutes {
  login = "/",
  register = "/register",
  unauthorized = "/unauthorized",
  support = "/support",
}
