/**
 * Trimmed complaint queries that omit `problemType`.
 * Invalid enum values in that field break AppSync serialization.
 */

export const getComplaintSafe = /* GraphQL */ `
  query GetComplaint($complaintID: ID!) {
    getComplaint(complaintID: $complaintID) {
      complaintID
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      problemSubType
      breakdownType
      maintenanceType
      description
      priority
      state
      assigneeUserID
      slaDeadline
      resolutionTimeline
      createdAt
      updatedAt
      closedAt
      breakdownDate
      driverName
      shift
      location
      motorRunningHoursAtBreakdown
      daysVehicleOffRoad
      daysVehicleRemainedOffRoad
      delayReason
      actionRequired
      serviceManagerName
      events {
        ts
        type
        by
        note
        meta
      }
    }
  }
`;

export const listComplaintsByOrgSafe = /* GraphQL */ `
  query ListComplaintsByOrg($orgID: ID!, $nextToken: String) {
    listComplaintsByOrg(orgID: $orgID, nextToken: $nextToken) {
      items {
        complaintID
        orgID
        plantID
        tractorVIN
        problemSubType
        breakdownType
        description
        priority
        state
        createdAt
        closedAt
        driverName
        raisedByUserID
      }
      nextToken
    }
  }
`;
