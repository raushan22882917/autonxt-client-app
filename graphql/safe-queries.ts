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

export const listComplaintsByPlantSafe = /* GraphQL */ `
  query ListComplaintsByPlant($plantID: ID!, $nextToken: String) {
    listComplaintsByPlant(plantID: $plantID, nextToken: $nextToken) {
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

/** Full tractor row from AppSync (SoftwareBackendStack) — no slim/mock fields. */
export const listTractorsByPlantFleet = /* GraphQL */ `
  query ListTractorsByPlantFleet($plantID: ID!) {
    listTractorsByPlant(plantID: $plantID) {
      vin
      alias
      registerNumber
      plantID
      orgID
      model
      color
      currentImplement
      loggerID
      serviceStatus
      user
      minValue
      maxValue
      midValue
      commissionDate
      createdAt
      updatedAt
      dispatchInfo {
        liveLocation
        dispatchLocation
        dispatchPlan
        handoverDate
        totalTestHours
        saleType
      }
      components {
        motorId
        controllerID
        battery33KWid
        transmissionMake
        bmsVersion
      }
    }
  }
`;

/** @deprecated Use listTractorsByPlantFleet */
export const listTractorsByPlantSlim = listTractorsByPlantFleet;
