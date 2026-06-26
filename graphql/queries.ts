/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from './API';
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getOrganization =
  /* GraphQL */ `query GetOrganization($orgID: ID!) {
  getOrganization(orgID: $orgID) {
    orgID
    name
    industry
    location
    contactEmail
    contactPhone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetOrganizationQueryVariables,
  APITypes.GetOrganizationQuery
>;
export const listOrganizations = /* GraphQL */ `query ListOrganizations {
  listOrganizations {
    orgID
    name
    industry
    location
    contactEmail
    contactPhone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrganizationsQueryVariables,
  APITypes.ListOrganizationsQuery
>;
export const getPlant = /* GraphQL */ `query GetPlant($plantID: ID!) {
  getPlant(plantID: $plantID) {
    orgID
    plantID
    name
    location
    plantType
    parentHubID
    plantHeadID
    supervisorID
    driverIDs
    electricityCostPKWH
    dieselCostPL
    additionalSupport
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPlantQueryVariables, APITypes.GetPlantQuery>;
export const listPlantsByOrganization =
  /* GraphQL */ `query ListPlantsByOrganization($orgID: ID!, $nextToken: String) {
  listPlantsByOrganization(orgID: $orgID, nextToken: $nextToken) {
    orgID
    plantID
    name
    location
    plantType
    parentHubID
    plantHeadID
    supervisorID
    driverIDs
    electricityCostPKWH
    dieselCostPL
    additionalSupport
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPlantsByOrganizationQueryVariables,
  APITypes.ListPlantsByOrganizationQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    email
    phone
    userType
    role
    orgID
    accessiblePlantIDs
    assignedOfficeID
    status
    pushToken
    cognitoGroups
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsersByOrg = /* GraphQL */ `query ListUsersByOrg($orgID: ID!) {
  listUsersByOrg(orgID: $orgID) {
    id
    name
    email
    phone
    userType
    role
    orgID
    accessiblePlantIDs
    assignedOfficeID
    status
    pushToken
    cognitoGroups
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByOrgQueryVariables,
  APITypes.ListUsersByOrgQuery
>;
export const listUsersByType =
  /* GraphQL */ `query ListUsersByType($userType: UserType!) {
  listUsersByType(userType: $userType) {
    id
    name
    email
    phone
    userType
    role
    orgID
    accessiblePlantIDs
    assignedOfficeID
    status
    pushToken
    cognitoGroups
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByTypeQueryVariables,
  APITypes.ListUsersByTypeQuery
>;
export const listUsersByTypeAndGroup =
  /* GraphQL */ `query ListUsersByTypeAndGroup($userType: UserType!, $groupName: String!) {
  listUsersByTypeAndGroup(userType: $userType, groupName: $groupName) {
    id
    name
    email
    phone
    userType
    role
    orgID
    accessiblePlantIDs
    assignedOfficeID
    status
    pushToken
    cognitoGroups
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByTypeAndGroupQueryVariables,
  APITypes.ListUsersByTypeAndGroupQuery
>;
export const listAllUsers = /* GraphQL */ `query ListAllUsers {
  listAllUsers {
    id
    name
    email
    phone
    userType
    role
    orgID
    accessiblePlantIDs
    assignedOfficeID
    status
    pushToken
    cognitoGroups
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAllUsersQueryVariables,
  APITypes.ListAllUsersQuery
>;
export const getCognitoUser =
  /* GraphQL */ `query GetCognitoUser($username: String!) {
  getCognitoUser(username: $username) {
    success
    message
    user {
      username
      email
      name
      userType
      role
      status
      enabled
      userCreateDate
      userLastModifiedDate
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCognitoUserQueryVariables,
  APITypes.GetCognitoUserQuery
>;
export const listCognitoUsers =
  /* GraphQL */ `query ListCognitoUsers($limit: Int, $nextToken: String) {
  listCognitoUsers(limit: $limit, nextToken: $nextToken) {
    items {
      username
      email
      name
      userType
      role
      status
      enabled
      userCreateDate
      userLastModifiedDate
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCognitoUsersQueryVariables,
  APITypes.ListCognitoUsersQuery
>;
export const searchCognitoUsers =
  /* GraphQL */ `query SearchCognitoUsers($filter: String!, $limit: Int, $nextToken: String) {
  searchCognitoUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      username
      email
      name
      userType
      role
      status
      enabled
      userCreateDate
      userLastModifiedDate
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SearchCognitoUsersQueryVariables,
  APITypes.SearchCognitoUsersQuery
>;
export const listAvailableUsers =
  /* GraphQL */ `query ListAvailableUsers($limit: Int, $nextToken: String) {
  listAvailableUsers(limit: $limit, nextToken: $nextToken) {
    items {
      username
      email
      name
      userType
      role
      status
      enabled
      userCreateDate
      userLastModifiedDate
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAvailableUsersQueryVariables,
  APITypes.ListAvailableUsersQuery
>;
export const listUsersByStatus =
  /* GraphQL */ `query ListUsersByStatus($status: String!, $limit: Int, $nextToken: String) {
  listUsersByStatus(status: $status, limit: $limit, nextToken: $nextToken) {
    items {
      username
      email
      name
      userType
      role
      status
      enabled
      userCreateDate
      userLastModifiedDate
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByStatusQueryVariables,
  APITypes.ListUsersByStatusQuery
>;
export const getCognitoGroup =
  /* GraphQL */ `query GetCognitoGroup($groupName: String!) {
  getCognitoGroup(groupName: $groupName) {
    groupName
    description
    precedence
    roleArn
    userPoolId
    createdAt
    lastModifiedDate
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCognitoGroupQueryVariables,
  APITypes.GetCognitoGroupQuery
>;
export const listCognitoGroups = /* GraphQL */ `query ListCognitoGroups {
  listCognitoGroups {
    groupName
    description
    precedence
    roleArn
    userPoolId
    createdAt
    lastModifiedDate
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCognitoGroupsQueryVariables,
  APITypes.ListCognitoGroupsQuery
>;
export const listUsersInCognitoGroup =
  /* GraphQL */ `query ListUsersInCognitoGroup(
  $groupName: String!
  $limit: Int
  $nextToken: String
) {
  listUsersInCognitoGroup(
    groupName: $groupName
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      username
      email
      name
      userType
      role
      status
      enabled
      userCreateDate
      userLastModifiedDate
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersInCognitoGroupQueryVariables,
  APITypes.ListUsersInCognitoGroupQuery
>;
export const listGroupsForCognitoUser =
  /* GraphQL */ `query ListGroupsForCognitoUser($username: String!) {
  listGroupsForCognitoUser(username: $username) {
    groupName
    description
    precedence
    roleArn
    userPoolId
    createdAt
    lastModifiedDate
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGroupsForCognitoUserQueryVariables,
  APITypes.ListGroupsForCognitoUserQuery
>;
export const debugCognitoUser =
  /* GraphQL */ `query DebugCognitoUser($email: String!) {
  debugCognitoUser(email: $email) {
    username
    attempts {
      username
      success
      user {
        username
        email
        name
        userType
        role
        status
        enabled
        userCreateDate
        userLastModifiedDate
        __typename
      }
      error
      errorType
      __typename
    }
    groups
    groupsError
    summary {
      userFound
      groupsFound
      totalAttempts
      successfulAttempts
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DebugCognitoUserQueryVariables,
  APITypes.DebugCognitoUserQuery
>;
export const debugEnvironment = /* GraphQL */ `query DebugEnvironment {
  debugEnvironment {
    success
    environment {
      userPoolId
      region
      timestamp
      connectivity
      totalUsers
      error {
        name
        message
        code
        __typename
      }
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DebugEnvironmentQueryVariables,
  APITypes.DebugEnvironmentQuery
>;
export const listUsersByOffice =
  /* GraphQL */ `query ListUsersByOffice($officeID: ID!, $nextToken: String) {
  listUsersByOffice(officeID: $officeID, nextToken: $nextToken) {
    items {
      id
      name
      email
      phone
      userType
      role
      orgID
      accessiblePlantIDs
      assignedOfficeID
      status
      pushToken
      cognitoGroups
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByOfficeQueryVariables,
  APITypes.ListUsersByOfficeQuery
>;
export const listUsersWithoutOffice =
  /* GraphQL */ `query ListUsersWithoutOffice($orgID: ID, $nextToken: String) {
  listUsersWithoutOffice(orgID: $orgID, nextToken: $nextToken) {
    items {
      id
      name
      email
      phone
      userType
      role
      orgID
      accessiblePlantIDs
      assignedOfficeID
      status
      pushToken
      cognitoGroups
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersWithoutOfficeQueryVariables,
  APITypes.ListUsersWithoutOfficeQuery
>;
export const listUsersByCognitoGroup =
  /* GraphQL */ `query ListUsersByCognitoGroup($groupName: String!, $nextToken: String) {
  listUsersByCognitoGroup(groupName: $groupName, nextToken: $nextToken) {
    items {
      username
      email
      name
      userType
      role
      status
      enabled
      userCreateDate
      userLastModifiedDate
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByCognitoGroupQueryVariables,
  APITypes.ListUsersByCognitoGroupQuery
>;
export const listTractors = /* GraphQL */ `query ListTractors {
  listTractors {
    vin
    alias
    registerNumber
    plantID
    orgID
    model
    color
    loggerID
    currentImplement
    serviceStatus
    armLength
    dofChargeStatus
    armLength
    dofChargeStatus
    user
    minValue
    maxValue
    midValue
    tractorNextBatchValue
    components {
      vin
      componentType
      id
      battery33KWid
      battery12Vid
      motorId
      controllerID
      transmissionID
      transmissionMake
      displayID
      tempCardID
      canCardID
      footAccID
      handAccID
      fTyreSize
      rTyreSize
      fTyreBrand
      rTyreBrand
      couplerType
      oRingType
      clutchFingerSetting
      bmsVersion
      __typename
    }
    dispatchInfo {
      assemblyRolloutDate
      pdiDate
      handoverDate
      dispatchPlan
      dispatchLocation
      totalTestHours
      testType
      liveLocation
      saleType
      __typename
    }
    commissionDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTractorsQueryVariables,
  APITypes.ListTractorsQuery
>;
export const listTractorsByUser =
  /* GraphQL */ `query ListTractorsByUser($userID: ID!) {
  listTractorsByUser(userID: $userID) {
    vin
    alias
    registerNumber
    plantID
    orgID
    model
    color
    loggerID
    currentImplement
    serviceStatus
    armLength
    dofChargeStatus
    user
    minValue
    maxValue
    midValue
    tractorNextBatchValue
    components {
      vin
      componentType
      id
      battery33KWid
      battery12Vid
      motorId
      controllerID
      transmissionID
      transmissionMake
      displayID
      tempCardID
      canCardID
      footAccID
      handAccID
      fTyreSize
      rTyreSize
      fTyreBrand
      rTyreBrand
      couplerType
      oRingType
      clutchFingerSetting
      bmsVersion
      __typename
    }
    dispatchInfo {
      assemblyRolloutDate
      pdiDate
      handoverDate
      dispatchPlan
      dispatchLocation
      totalTestHours
      testType
      liveLocation
      saleType
      __typename
    }
    commissionDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTractorsByUserQueryVariables,
  APITypes.ListTractorsByUserQuery
>;
export const listTractorsByPlant =
  /* GraphQL */ `query ListTractorsByPlant($plantID: ID!) {
  listTractorsByPlant(plantID: $plantID) {
    vin
    alias
    registerNumber
    plantID
    orgID
    model
    color
    loggerID
    currentImplement
    serviceStatus
    armLength
    dofChargeStatus
    user
    minValue
    maxValue
    midValue
    tractorNextBatchValue
    components {
      vin
      componentType
      id
      battery33KWid
      battery12Vid
      motorId
      controllerID
      transmissionID
      transmissionMake
      displayID
      tempCardID
      canCardID
      footAccID
      handAccID
      fTyreSize
      rTyreSize
      fTyreBrand
      rTyreBrand
      couplerType
      oRingType
      clutchFingerSetting
      bmsVersion
      __typename
    }
    dispatchInfo {
      assemblyRolloutDate
      pdiDate
      handoverDate
      dispatchPlan
      dispatchLocation
      totalTestHours
      testType
      liveLocation
      saleType
      __typename
    }
    commissionDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTractorsByPlantQueryVariables,
  APITypes.ListTractorsByPlantQuery
>;
export const listTractorsByOrg =
  /* GraphQL */ `query ListTractorsByOrg($orgID: ID!) {
  listTractorsByOrg(orgID: $orgID) {
    vin
    alias
    registerNumber
    plantID
    orgID
    model
    color
    loggerID
    currentImplement
    serviceStatus
    armLength
    dofChargeStatus
    user
    minValue
    maxValue
    midValue
    tractorNextBatchValue
    components {
      vin
      componentType
      id
      battery33KWid
      battery12Vid
      motorId
      controllerID
      transmissionID
      transmissionMake
      displayID
      tempCardID
      canCardID
      footAccID
      handAccID
      fTyreSize
      rTyreSize
      fTyreBrand
      rTyreBrand
      couplerType
      oRingType
      clutchFingerSetting
      bmsVersion
      __typename
    }
    dispatchInfo {
      assemblyRolloutDate
      pdiDate
      handoverDate
      dispatchPlan
      dispatchLocation
      totalTestHours
      testType
      liveLocation
      saleType
      __typename
    }
    commissionDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTractorsByOrgQueryVariables,
  APITypes.ListTractorsByOrgQuery
>;
export const getTractor = /* GraphQL */ `query GetTractor($vin: String!) {
  getTractor(vin: $vin) {
    vin
    alias
    registerNumber
    plantID
    orgID
    model
    color
    loggerID
    currentImplement
    serviceStatus
    armLength
    dofChargeStatus
    user
    model
    color
    loggerID
    currentImplement
    serviceStatus
    armLength
    dofChargeStatus
    user
    minValue
    maxValue
    midValue
    tractorNextBatchValue
    components {
      vin
      componentType
      id
      battery33KWid
      battery12Vid
      motorId
      controllerID
      transmissionID
      transmissionMake
      displayID
      tempCardID
      canCardID
      footAccID
      handAccID
      fTyreSize
      rTyreSize
      fTyreBrand
      rTyreBrand
      couplerType
      oRingType
      clutchFingerSetting
      bmsVersion
      __typename
    }
    dispatchInfo {
      assemblyRolloutDate
      pdiDate
      handoverDate
      dispatchPlan
      dispatchLocation
      totalTestHours
      testType
      liveLocation
      saleType
      __typename
    }
    commissionDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTractorQueryVariables,
  APITypes.GetTractorQuery
>;
export const listTractorDocuments =
  /* GraphQL */ `query ListTractorDocuments($vin: String!, $limit: Int, $nextToken: String) {
  listTractorDocuments(vin: $vin, limit: $limit, nextToken: $nextToken) {
    items {
      key
      kind
      contentType
      sizeBytes
      createdAt
      variants
      uploaderID
      vin
      documentID
      title
      description
      docType
      files
      tags
      uploadedBy
      uploadedAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTractorDocumentsQueryVariables,
  APITypes.ListTractorDocumentsQuery
>;
export const getTelemetryByTractor =
  /* GraphQL */ `query GetTelemetryByTractor($loggerID: String!) {
  getTelemetryByTractor(loggerID: $loggerID) {
    tractorID
    timestamp
    timestamp_epoch
    TTL
    hex_ID
    hex_timestamp
    status
    Lat
    Long
    SOC
    SOH
    Charge
    LimpMode
    BatteryV
    BatteryI
    BatteryT
    MinCellV
    MaxCellV
    MaxRPM
    MotorT
    Roll
    Pitch
    Yaw
    Throttle
    WHM
    OutputPower
    TimeEla
    CumulativeRuntime
    MaxBatteryI
    Ecode
    FaultDiag
    ModuleTAtFault
    OutputFreqAtFault
    OutputIAtFault
    OutputVAtFault
    OutputDCBusVAtFault
    DiagInfoLastFault
    ModuleTLastFault
    OperatingFreqLastFault
    OutputILastFault
    OutputVLastFault
    BusVLastFault
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTelemetryByTractorQueryVariables,
  APITypes.GetTelemetryByTractorQuery
>;
export const getRuntimeHourByTractor =
  /* GraphQL */ `query GetRuntimeHourByTractor($loggerID: String!) {
  getRuntimeHourByTractor(loggerID: $loggerID) {
    tractorID
    timestamp
    timestamp_epoch
    TTL
    hex_ID
    hex_timestamp
    status
    Lat
    Long
    SOC
    SOH
    Charge
    LimpMode
    BatteryV
    BatteryI
    BatteryT
    MinCellV
    MaxCellV
    MaxRPM
    MotorT
    Roll
    Pitch
    Yaw
    Throttle
    WHM
    OutputPower
    TimeEla
    CumulativeRuntime
    MaxBatteryI
    Ecode
    FaultDiag
    ModuleTAtFault
    OutputFreqAtFault
    OutputIAtFault
    OutputVAtFault
    OutputDCBusVAtFault
    DiagInfoLastFault
    ModuleTLastFault
    OperatingFreqLastFault
    OutputILastFault
    OutputVLastFault
    BusVLastFault
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetRuntimeHourByTractorQueryVariables,
  APITypes.GetRuntimeHourByTractorQuery
>;
export const getEarliestRuntimeHourByTractorDate =
  /* GraphQL */ `query GetEarliestRuntimeHourByTractorDate(
  $loggerID: String!
  $timestamp: String!
) {
  getEarliestRuntimeHourByTractorDate(
    loggerID: $loggerID
    timestamp: $timestamp
  ) {
    tractorID
    timestamp
    timestamp_epoch
    TTL
    hex_ID
    hex_timestamp
    status
    Lat
    Long
    SOC
    SOH
    Charge
    LimpMode
    BatteryV
    BatteryI
    BatteryT
    MinCellV
    MaxCellV
    MaxRPM
    MotorT
    Roll
    Pitch
    Yaw
    Throttle
    WHM
    OutputPower
    TimeEla
    CumulativeRuntime
    MaxBatteryI
    Ecode
    FaultDiag
    ModuleTAtFault
    OutputFreqAtFault
    OutputIAtFault
    OutputVAtFault
    OutputDCBusVAtFault
    DiagInfoLastFault
    ModuleTLastFault
    OperatingFreqLastFault
    OutputILastFault
    OutputVLastFault
    BusVLastFault
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetEarliestRuntimeHourByTractorDateQueryVariables,
  APITypes.GetEarliestRuntimeHourByTractorDateQuery
>;
export const getLatestRuntimeHourByTractorDate =
  /* GraphQL */ `query GetLatestRuntimeHourByTractorDate(
  $loggerID: String!
  $timestamp: String!
) {
  getLatestRuntimeHourByTractorDate(
    loggerID: $loggerID
    timestamp: $timestamp
  ) {
    tractorID
    timestamp
    timestamp_epoch
    TTL
    hex_ID
    hex_timestamp
    status
    Lat
    Long
    SOC
    SOH
    Charge
    LimpMode
    BatteryV
    BatteryI
    BatteryT
    MinCellV
    MaxCellV
    MaxRPM
    MotorT
    Roll
    Pitch
    Yaw
    Throttle
    WHM
    OutputPower
    TimeEla
    CumulativeRuntime
    MaxBatteryI
    Ecode
    FaultDiag
    ModuleTAtFault
    OutputFreqAtFault
    OutputIAtFault
    OutputVAtFault
    OutputDCBusVAtFault
    DiagInfoLastFault
    ModuleTLastFault
    OperatingFreqLastFault
    OutputILastFault
    OutputVLastFault
    BusVLastFault
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLatestRuntimeHourByTractorDateQueryVariables,
  APITypes.GetLatestRuntimeHourByTractorDateQuery
>;
export const getFilteredTelemetryByTractor =
  /* GraphQL */ `query GetFilteredTelemetryByTractor(
  $loggerID: String!
  $start_time: String!
  $end_time: String!
  $nextToken: String
) {
  getFilteredTelemetryByTractor(
    loggerID: $loggerID
    start_time: $start_time
    end_time: $end_time
    nextToken: $nextToken
  ) {
    items {
      tractorID
      timestamp
      timestamp_epoch
      TTL
      hex_ID
      hex_timestamp
      status
      Lat
      Long
      SOC
      SOH
      Charge
      LimpMode
      BatteryV
      BatteryI
      BatteryT
      MinCellV
      MaxCellV
      MaxRPM
      MotorT
      Roll
      Pitch
      Yaw
      Throttle
      WHM
      OutputPower
      TimeEla
      CumulativeRuntime
      MaxBatteryI
      Ecode
      FaultDiag
      ModuleTAtFault
      OutputFreqAtFault
      OutputIAtFault
      OutputVAtFault
      OutputDCBusVAtFault
      DiagInfoLastFault
      ModuleTLastFault
      OperatingFreqLastFault
      OutputILastFault
      OutputVLastFault
      BusVLastFault
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetFilteredTelemetryByTractorQueryVariables,
  APITypes.GetFilteredTelemetryByTractorQuery
>;
export const getLatestTelemetryByBatteryIThreshold =
  /* GraphQL */ `query GetLatestTelemetryByBatteryIThreshold(
  $loggerID: String!
  $threshold: Float!
) {
  getLatestTelemetryByBatteryIThreshold(
    loggerID: $loggerID
    threshold: $threshold
  ) {
    tractorID
    timestamp
    timestamp_epoch
    TTL
    hex_ID
    hex_timestamp
    status
    Lat
    Long
    SOC
    SOH
    Charge
    LimpMode
    BatteryV
    BatteryI
    BatteryT
    MinCellV
    MaxCellV
    MaxRPM
    MotorT
    Roll
    Pitch
    Yaw
    Throttle
    WHM
    OutputPower
    TimeEla
    CumulativeRuntime
    MaxBatteryI
    Ecode
    FaultDiag
    ModuleTAtFault
    OutputFreqAtFault
    OutputIAtFault
    OutputVAtFault
    OutputDCBusVAtFault
    DiagInfoLastFault
    ModuleTLastFault
    OperatingFreqLastFault
    OutputILastFault
    OutputVLastFault
    BusVLastFault
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLatestTelemetryByBatteryIThresholdQueryVariables,
  APITypes.GetLatestTelemetryByBatteryIThresholdQuery
>;
export const getManualRuntimeEntry =
  /* GraphQL */ `query GetManualRuntimeEntry($loggerID: String!, $date: String!) {
  getManualRuntimeEntry(loggerID: $loggerID, date: $date) {
    loggerID
    date
    plantID
    orgID
    startCumulativeRuntime
    endCumulativeRuntime
    todaysRuntime
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetManualRuntimeEntryQueryVariables,
  APITypes.GetManualRuntimeEntryQuery
>;
export const getManualRuntimeByDate =
  /* GraphQL */ `query GetManualRuntimeByDate($loggerID: String!, $date: String!) {
  getManualRuntimeByDate(loggerID: $loggerID, date: $date) {
    loggerID
    date
    plantID
    orgID
    startCumulativeRuntime
    endCumulativeRuntime
    todaysRuntime
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetManualRuntimeByDateQueryVariables,
  APITypes.GetManualRuntimeByDateQuery
>;
export const listManualRuntimeEntries =
  /* GraphQL */ `query ListManualRuntimeEntries(
  $loggerID: String
  $plantID: String
  $orgID: String
  $date: String
  $limit: Int
  $nextToken: String
) {
  listManualRuntimeEntries(
    loggerID: $loggerID
    plantID: $plantID
    orgID: $orgID
    date: $date
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      loggerID
      date
      plantID
      orgID
      startCumulativeRuntime
      endCumulativeRuntime
      todaysRuntime
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListManualRuntimeEntriesQueryVariables,
  APITypes.ListManualRuntimeEntriesQuery
>;
export const getUsageSegment =
  /* GraphQL */ `query GetUsageSegment($tractorID: ID!, $startTime: String!) {
  getUsageSegment(tractorID: $tractorID, startTime: $startTime) {
    tractorID
    type
    startTime
    endTime
    durationSec
    durationFormatted
    durationSecLogged
    durationLogged
    initialSOC
    finalSOC
    kwhConsumed
    kwhCharged
    distanceTravelled
    costSavings
    treesSaved
    disconnects {
      totalCount
      totalDuration
      locations {
        startLoc {
          lat
          lng
          __typename
        }
        endLoc {
          lat
          lng
          __typename
        }
        __typename
      }
      __typename
    }
    parameterMetrics {
      SOC {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      SOH {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      BatteryV {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      BatteryI {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      BatteryT {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      MaxRPM {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      WHM {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      MotorT {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      MinCellV {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      MaxCellV {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      Throttle {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      CumulativeRuntime {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      __typename
    }
    faultMetrics {
      Ecode {
        metric
        value
        startTime
        endTime
        Ecode
        FaultDiag
        ModuleTAtFault
        OutputFreqAtFault
        OutputIAtFault
        OutputVAtFault
        OutputDCBusVAtFault
        DiagInfoLastFault
        ModuleTLastFault
        OperatingFreqLastFault
        OutputILastFault
        OutputVLastFault
        BusVLastFault
        __typename
      }
      FaultDiag {
        metric
        value
        startTime
        endTime
        Ecode
        FaultDiag
        ModuleTAtFault
        OutputFreqAtFault
        OutputIAtFault
        OutputVAtFault
        OutputDCBusVAtFault
        DiagInfoLastFault
        ModuleTLastFault
        OperatingFreqLastFault
        OutputILastFault
        OutputVLastFault
        BusVLastFault
        __typename
      }
      WarningDiag {
        metric
        value
        startTime
        endTime
        Ecode
        FaultDiag
        ModuleTAtFault
        OutputFreqAtFault
        OutputIAtFault
        OutputVAtFault
        OutputDCBusVAtFault
        DiagInfoLastFault
        ModuleTLastFault
        OperatingFreqLastFault
        OutputILastFault
        OutputVLastFault
        BusVLastFault
        __typename
      }
      __typename
    }
    createdAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUsageSegmentQueryVariables,
  APITypes.GetUsageSegmentQuery
>;
export const listUsageSegments = /* GraphQL */ `query ListUsageSegments(
  $tractorID: ID!
  $startTime: String
  $endTime: String
  $limit: Int
  $nextToken: String
  $sortOrder: SortOrder = DESC
) {
  listUsageSegments(
    tractorID: $tractorID
    startTime: $startTime
    endTime: $endTime
    limit: $limit
    nextToken: $nextToken
    sortOrder: $sortOrder
  ) {
    items {
      tractorID
      type
      startTime
      endTime
      durationSec
      durationFormatted
      durationSecLogged
      durationLogged
      initialSOC
      finalSOC
      kwhConsumed
      kwhCharged
      distanceTravelled
      costSavings
      treesSaved
      disconnects {
        totalCount
        totalDuration
        locations {
          __typename
        }
        __typename
      }
      parameterMetrics {
        SOC {
          avg
          __typename
        }
        SOH {
          avg
          __typename
        }
        BatteryV {
          avg
          __typename
        }
        BatteryI {
          avg
          __typename
        }
        BatteryT {
          avg
          __typename
        }
        MaxRPM {
          avg
          __typename
        }
        WHM {
          avg
          __typename
        }
        MotorT {
          avg
          __typename
        }
        MinCellV {
          avg
          __typename
        }
        MaxCellV {
          avg
          __typename
        }
        Throttle {
          avg
          __typename
        }
        CumulativeRuntime {
          avg
          __typename
        }
        __typename
      }
      faultMetrics {
        Ecode {
          metric
          value
          startTime
          endTime
          Ecode
          FaultDiag
          ModuleTAtFault
          OutputFreqAtFault
          OutputIAtFault
          OutputVAtFault
          OutputDCBusVAtFault
          DiagInfoLastFault
          ModuleTLastFault
          OperatingFreqLastFault
          OutputILastFault
          OutputVLastFault
          BusVLastFault
          __typename
        }
        FaultDiag {
          metric
          value
          startTime
          endTime
          Ecode
          FaultDiag
          ModuleTAtFault
          OutputFreqAtFault
          OutputIAtFault
          OutputVAtFault
          OutputDCBusVAtFault
          DiagInfoLastFault
          ModuleTLastFault
          OperatingFreqLastFault
          OutputILastFault
          OutputVLastFault
          BusVLastFault
          __typename
        }
        WarningDiag {
          metric
          value
          startTime
          endTime
          Ecode
          FaultDiag
          ModuleTAtFault
          OutputFreqAtFault
          OutputIAtFault
          OutputVAtFault
          OutputDCBusVAtFault
          DiagInfoLastFault
          ModuleTLastFault
          OperatingFreqLastFault
          OutputILastFault
          OutputVLastFault
          BusVLastFault
          __typename
        }
        __typename
      }
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsageSegmentsQueryVariables,
  APITypes.ListUsageSegmentsQuery
>;
export const listUsageSegmentsByType =
  /* GraphQL */ `query ListUsageSegmentsByType(
  $tractorID: ID!
  $type: SegmentType!
  $startTime: String
  $endTime: String
  $limit: Int
  $nextToken: String
  $sortOrder: SortOrder = DESC
) {
  listUsageSegmentsByType(
    tractorID: $tractorID
    type: $type
    startTime: $startTime
    endTime: $endTime
    limit: $limit
    nextToken: $nextToken
    sortOrder: $sortOrder
  ) {
    items {
      tractorID
      type
      startTime
      endTime
      durationSec
      durationFormatted
      durationSecLogged
      durationLogged
      initialSOC
      finalSOC
      kwhConsumed
      kwhCharged
      distanceTravelled
      costSavings
      treesSaved
      disconnects {
        totalCount
        totalDuration
        locations {
          __typename
        }
        __typename
      }
      parameterMetrics {
        SOC {
          avg
          __typename
        }
        SOH {
          avg
          __typename
        }
        BatteryV {
          avg
          __typename
        }
        BatteryI {
          avg
          __typename
        }
        BatteryT {
          avg
          __typename
        }
        MaxRPM {
          avg
          __typename
        }
        WHM {
          avg
          __typename
        }
        MotorT {
          avg
          __typename
        }
        MinCellV {
          avg
          __typename
        }
        MaxCellV {
          avg
          __typename
        }
        Throttle {
          avg
          __typename
        }
        CumulativeRuntime {
          avg
          __typename
        }
        __typename
      }
      faultMetrics {
        Ecode {
          metric
          value
          startTime
          endTime
          Ecode
          FaultDiag
          ModuleTAtFault
          OutputFreqAtFault
          OutputIAtFault
          OutputVAtFault
          OutputDCBusVAtFault
          DiagInfoLastFault
          ModuleTLastFault
          OperatingFreqLastFault
          OutputILastFault
          OutputVLastFault
          BusVLastFault
          __typename
        }
        FaultDiag {
          metric
          value
          startTime
          endTime
          Ecode
          FaultDiag
          ModuleTAtFault
          OutputFreqAtFault
          OutputIAtFault
          OutputVAtFault
          OutputDCBusVAtFault
          DiagInfoLastFault
          ModuleTLastFault
          OperatingFreqLastFault
          OutputILastFault
          OutputVLastFault
          BusVLastFault
          __typename
        }
        WarningDiag {
          metric
          value
          startTime
          endTime
          Ecode
          FaultDiag
          ModuleTAtFault
          OutputFreqAtFault
          OutputIAtFault
          OutputVAtFault
          OutputDCBusVAtFault
          DiagInfoLastFault
          ModuleTLastFault
          OperatingFreqLastFault
          OutputILastFault
          OutputVLastFault
          BusVLastFault
          __typename
        }
        __typename
      }
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsageSegmentsByTypeQueryVariables,
  APITypes.ListUsageSegmentsByTypeQuery
>;
export const getAnalytics = /* GraphQL */ `query GetAnalytics(
  $tractorID: ID!
  $PeriodType: PeriodType!
  $timeSegment: String!
) {
  getAnalytics(
    tractorID: $tractorID
    PeriodType: $PeriodType
    timeSegment: $timeSegment
  ) {
    tractorID
    PeriodType
    timeSegment
    startTime
    endTime
    cumulative {
      totalCount
      totalDuration
      totalLoggedDuration
      totalDistance
      totalKwhDelivered
      totalKwhCharged
      totalDisconnectCount
      totalDisconnectDuration
      totalCostSavings
      totalTreesSaved
      __typename
    }
    trips {
      totalCount
      totalDuration
      totalLoggedDuration
      totalDistance
      totalKwhDelivered
      totalKwhCharged
      totalDisconnectCount
      totalDisconnectDuration
      totalCostSavings
      totalTreesSaved
      __typename
    }
    charges {
      totalCount
      totalDuration
      totalLoggedDuration
      totalDistance
      totalKwhDelivered
      totalKwhCharged
      totalDisconnectCount
      totalDisconnectDuration
      totalCostSavings
      totalTreesSaved
      __typename
    }
    standby {
      totalCount
      totalDuration
      totalLoggedDuration
      totalDistance
      totalKwhDelivered
      totalKwhCharged
      totalDisconnectCount
      totalDisconnectDuration
      totalCostSavings
      totalTreesSaved
      __typename
    }
    disconnects {
      totalCount
      totalDuration
      locations {
        startLoc {
          lat
          lng
          __typename
        }
        endLoc {
          lat
          lng
          __typename
        }
        __typename
      }
      __typename
    }
    anomalies {
      totalCount
      __typename
    }
    parameterMetrics {
      SOC {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      SOH {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      BatteryV {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      BatteryI {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      BatteryT {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      MaxRPM {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      WHM {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      MotorT {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      MinCellV {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      MaxCellV {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      Throttle {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      CumulativeRuntime {
        avg
        min {
          value
          ts
          __typename
        }
        max {
          value
          ts
          __typename
        }
        __typename
      }
      __typename
    }
    faultMetrics {
      Ecode {
        metric
        value
        startTime
        endTime
        Ecode
        FaultDiag
        ModuleTAtFault
        OutputFreqAtFault
        OutputIAtFault
        OutputVAtFault
        OutputDCBusVAtFault
        DiagInfoLastFault
        ModuleTLastFault
        OperatingFreqLastFault
        OutputILastFault
        OutputVLastFault
        BusVLastFault
        __typename
      }
      FaultDiag {
        metric
        value
        startTime
        endTime
        Ecode
        FaultDiag
        ModuleTAtFault
        OutputFreqAtFault
        OutputIAtFault
        OutputVAtFault
        OutputDCBusVAtFault
        DiagInfoLastFault
        ModuleTLastFault
        OperatingFreqLastFault
        OutputILastFault
        OutputVLastFault
        BusVLastFault
        __typename
      }
      WarningDiag {
        metric
        value
        startTime
        endTime
        Ecode
        FaultDiag
        ModuleTAtFault
        OutputFreqAtFault
        OutputIAtFault
        OutputVAtFault
        OutputDCBusVAtFault
        DiagInfoLastFault
        ModuleTLastFault
        OperatingFreqLastFault
        OutputILastFault
        OutputVLastFault
        BusVLastFault
        __typename
      }
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAnalyticsQueryVariables,
  APITypes.GetAnalyticsQuery
>;
export const listAnalyticsByPeriodType =
  /* GraphQL */ `query ListAnalyticsByPeriodType(
  $tractorID: ID!
  $PeriodType: PeriodType!
  $startSegment: String
  $endSegment: String
  $limit: Int
  $nextToken: String
  $sortOrder: SortOrder = DESC
) {
  listAnalyticsByPeriodType(
    tractorID: $tractorID
    PeriodType: $PeriodType
    startSegment: $startSegment
    endSegment: $endSegment
    limit: $limit
    nextToken: $nextToken
    sortOrder: $sortOrder
  ) {
    items {
      tractorID
      PeriodType
      timeSegment
      startTime
      endTime
      cumulative {
        totalCount
        totalDuration
        totalLoggedDuration
        totalDistance
        totalKwhDelivered
        totalKwhCharged
        totalDisconnectCount
        totalDisconnectDuration
        totalCostSavings
        totalTreesSaved
        __typename
      }
      trips {
        totalCount
        totalDuration
        totalLoggedDuration
        totalDistance
        totalKwhDelivered
        totalKwhCharged
        totalDisconnectCount
        totalDisconnectDuration
        totalCostSavings
        totalTreesSaved
        __typename
      }
      charges {
        totalCount
        totalDuration
        totalLoggedDuration
        totalDistance
        totalKwhDelivered
        totalKwhCharged
        totalDisconnectCount
        totalDisconnectDuration
        totalCostSavings
        totalTreesSaved
        __typename
      }
      standby {
        totalCount
        totalDuration
        totalLoggedDuration
        totalDistance
        totalKwhDelivered
        totalKwhCharged
        totalDisconnectCount
        totalDisconnectDuration
        totalCostSavings
        totalTreesSaved
        __typename
      }
      disconnects {
        totalCount
        totalDuration
        locations {
          __typename
        }
        __typename
      }
      anomalies {
        totalCount
        __typename
      }
      parameterMetrics {
        SOC {
          avg
          __typename
        }
        SOH {
          avg
          __typename
        }
        BatteryV {
          avg
          __typename
        }
        BatteryI {
          avg
          __typename
        }
        BatteryT {
          avg
          __typename
        }
        MaxRPM {
          avg
          __typename
        }
        WHM {
          avg
          __typename
        }
        MotorT {
          avg
          __typename
        }
        MinCellV {
          avg
          __typename
        }
        MaxCellV {
          avg
          __typename
        }
        Throttle {
          avg
          __typename
        }
        CumulativeRuntime {
          avg
          __typename
        }
        __typename
      }
      faultMetrics {
        Ecode {
          metric
          value
          startTime
          endTime
          Ecode
          FaultDiag
          ModuleTAtFault
          OutputFreqAtFault
          OutputIAtFault
          OutputVAtFault
          OutputDCBusVAtFault
          DiagInfoLastFault
          ModuleTLastFault
          OperatingFreqLastFault
          OutputILastFault
          OutputVLastFault
          BusVLastFault
          __typename
        }
        FaultDiag {
          metric
          value
          startTime
          endTime
          Ecode
          FaultDiag
          ModuleTAtFault
          OutputFreqAtFault
          OutputIAtFault
          OutputVAtFault
          OutputDCBusVAtFault
          DiagInfoLastFault
          ModuleTLastFault
          OperatingFreqLastFault
          OutputILastFault
          OutputVLastFault
          BusVLastFault
          __typename
        }
        WarningDiag {
          metric
          value
          startTime
          endTime
          Ecode
          FaultDiag
          ModuleTAtFault
          OutputFreqAtFault
          OutputIAtFault
          OutputVAtFault
          OutputDCBusVAtFault
          DiagInfoLastFault
          ModuleTLastFault
          OperatingFreqLastFault
          OutputILastFault
          OutputVLastFault
          BusVLastFault
          __typename
        }
        __typename
      }
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnalyticsByPeriodTypeQueryVariables,
  APITypes.ListAnalyticsByPeriodTypeQuery
>;
export const getLogger = /* GraphQL */ `query GetLogger($loggerID: ID!) {
  getLogger(loggerID: $loggerID) {
    loggerID
    platform
    status
    attachedToVIN
    attachedAt
    detachedAt
    notes
    __typename
  }
}
` as GeneratedQuery<APITypes.GetLoggerQueryVariables, APITypes.GetLoggerQuery>;
export const listLoggers = /* GraphQL */ `query ListLoggers {
  listLoggers {
    loggerID
    platform
    status
    attachedToVIN
    attachedAt
    detachedAt
    notes
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoggersQueryVariables,
  APITypes.ListLoggersQuery
>;
export const getDriver = /* GraphQL */ `query GetDriver($driverID: ID!) {
  getDriver(driverID: $driverID) {
    driverID
    name
    phone
    aadhaarMasked
    licenseNumber
    licenseExpiry
    status
    orgID
    plantID
    notes
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetDriverQueryVariables, APITypes.GetDriverQuery>;
export const listDriversByPlant = /* GraphQL */ `query ListDriversByPlant(
  $plantID: ID!
  $status: DriverStatus
  $nextToken: String
) {
  listDriversByPlant(
    plantID: $plantID
    status: $status
    nextToken: $nextToken
  ) {
    items {
      driverID
      name
      phone
      aadhaarMasked
      licenseNumber
      licenseExpiry
      status
      orgID
      plantID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDriversByPlantQueryVariables,
  APITypes.ListDriversByPlantQuery
>;
export const listDriversByOrg =
  /* GraphQL */ `query ListDriversByOrg($orgID: ID!, $status: DriverStatus, $nextToken: String) {
  listDriversByOrg(orgID: $orgID, status: $status, nextToken: $nextToken) {
    items {
      driverID
      name
      phone
      aadhaarMasked
      licenseNumber
      licenseExpiry
      status
      orgID
      plantID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDriversByOrgQueryVariables,
  APITypes.ListDriversByOrgQuery
>;
export const listComplianceByDriver =
  /* GraphQL */ `query ListComplianceByDriver(
  $driverID: ID!
  $startDueDate: AWSDate
  $endDueDate: AWSDate
  $nextToken: String
) {
  listComplianceByDriver(
    driverID: $driverID
    startDueDate: $startDueDate
    endDueDate: $endDueDate
    nextToken: $nextToken
  ) {
    items {
      driverID
      type
      dueDate
      status
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComplianceByDriverQueryVariables,
  APITypes.ListComplianceByDriverQuery
>;
export const listAttendanceByDriver =
  /* GraphQL */ `query ListAttendanceByDriver(
  $driverID: ID!
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listAttendanceByDriver(
    driverID: $driverID
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      driverID
      date
      shift
      orgID
      plantID
      status
      checkInAt
      checkOutAt
      markedByUserID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendanceByDriverQueryVariables,
  APITypes.ListAttendanceByDriverQuery
>;
export const listAttendanceByPlantDate =
  /* GraphQL */ `query ListAttendanceByPlantDate(
  $plantID: ID!
  $date: AWSDate!
  $shift: Shift
  $nextToken: String
) {
  listAttendanceByPlantDate(
    plantID: $plantID
    date: $date
    shift: $shift
    nextToken: $nextToken
  ) {
    items {
      driverID
      date
      shift
      orgID
      plantID
      status
      checkInAt
      checkOutAt
      markedByUserID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendanceByPlantDateQueryVariables,
  APITypes.ListAttendanceByPlantDateQuery
>;
export const listAssignmentsByDriver =
  /* GraphQL */ `query ListAssignmentsByDriver(
  $driverID: ID!
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listAssignmentsByDriver(
    driverID: $driverID
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      driverID
      date
      shift
      orgID
      plantID
      tractorVIN
      loggerID
      startTime
      endTime
      status
      assignedByUserID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAssignmentsByDriverQueryVariables,
  APITypes.ListAssignmentsByDriverQuery
>;
export const listAssignmentsByTractorDate =
  /* GraphQL */ `query ListAssignmentsByTractorDate(
  $tractorVIN: String!
  $date: AWSDate!
  $nextToken: String
) {
  listAssignmentsByTractorDate(
    tractorVIN: $tractorVIN
    date: $date
    nextToken: $nextToken
  ) {
    items {
      driverID
      date
      shift
      orgID
      plantID
      tractorVIN
      loggerID
      startTime
      endTime
      status
      assignedByUserID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAssignmentsByTractorDateQueryVariables,
  APITypes.ListAssignmentsByTractorDateQuery
>;
export const listPerformanceByDriver =
  /* GraphQL */ `query ListPerformanceByDriver(
  $driverID: ID!
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listPerformanceByDriver(
    driverID: $driverID
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      driverID
      date
      orgID
      plantID
      hoursDriven
      tripsCompleted
      energyUsedKwh
      incidentsCount
      incidents
      notes
      enteredByUserID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPerformanceByDriverQueryVariables,
  APITypes.ListPerformanceByDriverQuery
>;
export const getComplaint =
  /* GraphQL */ `query GetComplaint($complaintID: ID!) {
  getComplaint(complaintID: $complaintID) {
    complaintID
    orgID
    plantID
    tractorVIN
    loggerID
    raisedByUserID
    source
    problemType
    problemSubType
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
    rating
    feedback
    ratedAt
    pmsBaselineRuntime
    pmsCurrentRuntime
    pmsHoursAccumulated
    pmsBaselineDate
    breakdownDate
    breakdownType
    driverName
    shift
    location
    motorRunningHoursAtBreakdown
    daysVehicleOffRoad
    daysVehicleRemainedOffRoad
    delayReason
    actionRequired
    serviceManagerName
    attachments {
      key
      label
      uploadedBy
      uploadedAt
      __typename
    }
    events {
      ts
      type
      by
      note
      meta
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetComplaintQueryVariables,
  APITypes.GetComplaintQuery
>;
export const listComplaintsByTractor =
  /* GraphQL */ `query ListComplaintsByTractor($tractorVIN: String!, $nextToken: String) {
  listComplaintsByTractor(tractorVIN: $tractorVIN, nextToken: $nextToken) {
    items {
      complaintID
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      source
      problemSubType
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
      rating
      feedback
      ratedAt
      pmsBaselineRuntime
      pmsCurrentRuntime
      pmsHoursAccumulated
      pmsBaselineDate
      breakdownDate
      breakdownType
      driverName
      shift
      location
      motorRunningHoursAtBreakdown
      daysVehicleOffRoad
      daysVehicleRemainedOffRoad
      delayReason
      actionRequired
      serviceManagerName
      attachments {
        key
        label
        uploadedBy
        uploadedAt
        __typename
      }
      events {
        ts
        type
        by
        note
        meta
        __typename
      }
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComplaintsByTractorQueryVariables,
  APITypes.ListComplaintsByTractorQuery
>;
export const listComplaintsByClient =
  /* GraphQL */ `query ListComplaintsByClient($userID: ID!, $nextToken: String) {
  listComplaintsByClient(userID: $userID, nextToken: $nextToken) {
    items {
      complaintID
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      source
      problemSubType
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
      rating
      feedback
      ratedAt
      pmsBaselineRuntime
      pmsCurrentRuntime
      pmsHoursAccumulated
      pmsBaselineDate
      breakdownDate
      breakdownType
      driverName
      shift
      location
      motorRunningHoursAtBreakdown
      daysVehicleOffRoad
      daysVehicleRemainedOffRoad
      delayReason
      actionRequired
      serviceManagerName
      attachments {
        key
        label
        uploadedBy
        uploadedAt
        __typename
      }
      events {
        ts
        type
        by
        note
        meta
        __typename
      }
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComplaintsByClientQueryVariables,
  APITypes.ListComplaintsByClientQuery
>;
export const listComplaintsByPlant =
  /* GraphQL */ `query ListComplaintsByPlant($plantID: ID!, $nextToken: String) {
  listComplaintsByPlant(plantID: $plantID, nextToken: $nextToken) {
    items {
      complaintID
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      source
      problemSubType
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
      rating
      feedback
      ratedAt
      pmsBaselineRuntime
      pmsCurrentRuntime
      pmsHoursAccumulated
      pmsBaselineDate
      breakdownDate
      breakdownType
      driverName
      shift
      location
      motorRunningHoursAtBreakdown
      daysVehicleOffRoad
      daysVehicleRemainedOffRoad
      delayReason
      actionRequired
      serviceManagerName
      attachments {
        key
        label
        uploadedBy
        uploadedAt
        __typename
      }
      events {
        ts
        type
        by
        note
        meta
        __typename
      }
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComplaintsByPlantQueryVariables,
  APITypes.ListComplaintsByPlantQuery
>;
export const listComplaintsByOrg =
  /* GraphQL */ `query ListComplaintsByOrg($orgID: ID!, $nextToken: String) {
  listComplaintsByOrg(orgID: $orgID, nextToken: $nextToken) {
    items {
      complaintID
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      source
      problemSubType
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
      rating
      feedback
      ratedAt
      pmsBaselineRuntime
      pmsCurrentRuntime
      pmsHoursAccumulated
      pmsBaselineDate
      breakdownDate
      breakdownType
      driverName
      shift
      location
      motorRunningHoursAtBreakdown
      daysVehicleOffRoad
      daysVehicleRemainedOffRoad
      delayReason
      actionRequired
      serviceManagerName
      attachments {
        key
        label
        uploadedBy
        uploadedAt
        __typename
      }
      events {
        ts
        type
        by
        note
        meta
        __typename
      }
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComplaintsByOrgQueryVariables,
  APITypes.ListComplaintsByOrgQuery
>;
export const listComplaintsByAssignee =
  /* GraphQL */ `query ListComplaintsByAssignee($userID: ID!, $nextToken: String) {
  listComplaintsByAssignee(userID: $userID, nextToken: $nextToken) {
    items {
      complaintID
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      source
      problemSubType
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
      rating
      feedback
      ratedAt
      pmsBaselineRuntime
      pmsCurrentRuntime
      pmsHoursAccumulated
      pmsBaselineDate
      breakdownDate
      breakdownType
      driverName
      shift
      location
      motorRunningHoursAtBreakdown
      daysVehicleOffRoad
      daysVehicleRemainedOffRoad
      delayReason
      actionRequired
      serviceManagerName
      attachments {
        key
        label
        uploadedBy
        uploadedAt
        __typename
      }
      events {
        ts
        type
        by
        note
        meta
        __typename
      }
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComplaintsByAssigneeQueryVariables,
  APITypes.ListComplaintsByAssigneeQuery
>;
export const listComplaintsByStatus =
  /* GraphQL */ `query ListComplaintsByStatus($state: ComplaintState!, $nextToken: String) {
  listComplaintsByStatus(state: $state, nextToken: $nextToken) {
    items {
      complaintID
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      source
      problemSubType
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
      rating
      feedback
      ratedAt
      pmsBaselineRuntime
      pmsCurrentRuntime
      pmsHoursAccumulated
      pmsBaselineDate
      breakdownDate
      breakdownType
      driverName
      shift
      location
      motorRunningHoursAtBreakdown
      daysVehicleOffRoad
      daysVehicleRemainedOffRoad
      delayReason
      actionRequired
      serviceManagerName
      attachments {
        key
        label
        uploadedBy
        uploadedAt
        __typename
      }
      events {
        ts
        type
        by
        note
        meta
        __typename
      }
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComplaintsByStatusQueryVariables,
  APITypes.ListComplaintsByStatusQuery
>;
export const listComplaintEvents =
  /* GraphQL */ `query ListComplaintEvents($complaintID: ID!, $nextToken: String) {
  listComplaintEvents(complaintID: $complaintID, nextToken: $nextToken) {
    ts
    type
    by
    note
    meta
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListComplaintEventsQueryVariables,
  APITypes.ListComplaintEventsQuery
>;
export const getJobCard = /* GraphQL */ `query GetJobCard($jobCardID: ID!) {
  getJobCard(jobCardID: $jobCardID) {
    jobCardID
    jobCardNumber
    orgID
    plantID
    tractorVIN
    loggerID
    raisedByUserID
    repairCategory
    problemType
    description
    priority
    isVOR
    status
    slaDeadline
    slaHours
    slaStatus
    slaPercentage
    estimatedHours
    actualHours
    assignedTechnicianID
    labourCost
    partsCost
    vendorCost
    totalCost
    downtimeHours
    delayReasons {
      reason
      notes
      recordedAt
      recordedBy
      __typename
    }
    customerFeedback
    createdAt
    updatedAt
    startedAt
    completedAt
    closedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetJobCardQueryVariables,
  APITypes.GetJobCardQuery
>;
export const listJobCardsByPlant = /* GraphQL */ `query ListJobCardsByPlant(
  $plantID: ID!
  $status: JobCardStatus
  $nextToken: String
) {
  listJobCardsByPlant(
    plantID: $plantID
    status: $status
    nextToken: $nextToken
  ) {
    items {
      jobCardID
      jobCardNumber
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      repairCategory
      problemType
      description
      priority
      isVOR
      status
      slaDeadline
      slaHours
      slaStatus
      slaPercentage
      estimatedHours
      actualHours
      assignedTechnicianID
      labourCost
      partsCost
      vendorCost
      totalCost
      downtimeHours
      delayReasons {
        reason
        notes
        recordedAt
        recordedBy
        __typename
      }
      customerFeedback
      createdAt
      updatedAt
      startedAt
      completedAt
      closedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListJobCardsByPlantQueryVariables,
  APITypes.ListJobCardsByPlantQuery
>;
export const listJobCardsByTractor =
  /* GraphQL */ `query ListJobCardsByTractor($tractorVIN: String!, $nextToken: String) {
  listJobCardsByTractor(tractorVIN: $tractorVIN, nextToken: $nextToken) {
    items {
      jobCardID
      jobCardNumber
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      repairCategory
      problemType
      description
      priority
      isVOR
      status
      slaDeadline
      slaHours
      slaStatus
      slaPercentage
      estimatedHours
      actualHours
      assignedTechnicianID
      labourCost
      partsCost
      vendorCost
      totalCost
      downtimeHours
      delayReasons {
        reason
        notes
        recordedAt
        recordedBy
        __typename
      }
      customerFeedback
      createdAt
      updatedAt
      startedAt
      completedAt
      closedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListJobCardsByTractorQueryVariables,
  APITypes.ListJobCardsByTractorQuery
>;
export const listJobCardsByOrg =
  /* GraphQL */ `query ListJobCardsByOrg($orgID: ID!, $nextToken: String) {
  listJobCardsByOrg(orgID: $orgID, nextToken: $nextToken) {
    items {
      jobCardID
      jobCardNumber
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      repairCategory
      problemType
      description
      priority
      isVOR
      status
      slaDeadline
      slaHours
      slaStatus
      slaPercentage
      estimatedHours
      actualHours
      assignedTechnicianID
      labourCost
      partsCost
      vendorCost
      totalCost
      downtimeHours
      delayReasons {
        reason
        notes
        recordedAt
        recordedBy
        __typename
      }
      customerFeedback
      createdAt
      updatedAt
      startedAt
      completedAt
      closedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListJobCardsByOrgQueryVariables,
  APITypes.ListJobCardsByOrgQuery
>;
export const listJobCardsBySLA = /* GraphQL */ `query ListJobCardsBySLA(
  $orgID: ID!
  $slaStatus: SLAStatus!
  $nextToken: String
) {
  listJobCardsBySLA(
    orgID: $orgID
    slaStatus: $slaStatus
    nextToken: $nextToken
  ) {
    items {
      jobCardID
      jobCardNumber
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      repairCategory
      problemType
      description
      priority
      isVOR
      status
      slaDeadline
      slaHours
      slaStatus
      slaPercentage
      estimatedHours
      actualHours
      assignedTechnicianID
      labourCost
      partsCost
      vendorCost
      totalCost
      downtimeHours
      delayReasons {
        reason
        notes
        recordedAt
        recordedBy
        __typename
      }
      customerFeedback
      createdAt
      updatedAt
      startedAt
      completedAt
      closedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListJobCardsBySLAQueryVariables,
  APITypes.ListJobCardsBySLAQuery
>;
export const listJobCardsByAssignee =
  /* GraphQL */ `query ListJobCardsByAssignee(
  $technicianID: ID!
  $status: JobCardStatus
  $nextToken: String
) {
  listJobCardsByAssignee(
    technicianID: $technicianID
    status: $status
    nextToken: $nextToken
  ) {
    items {
      jobCardID
      jobCardNumber
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      repairCategory
      problemType
      description
      priority
      isVOR
      status
      slaDeadline
      slaHours
      slaStatus
      slaPercentage
      estimatedHours
      actualHours
      assignedTechnicianID
      labourCost
      partsCost
      vendorCost
      totalCost
      downtimeHours
      delayReasons {
        reason
        notes
        recordedAt
        recordedBy
        __typename
      }
      customerFeedback
      createdAt
      updatedAt
      startedAt
      completedAt
      closedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListJobCardsByAssigneeQueryVariables,
  APITypes.ListJobCardsByAssigneeQuery
>;
export const listDelayedJobCards =
  /* GraphQL */ `query ListDelayedJobCards($orgID: ID!, $plantID: ID, $nextToken: String) {
  listDelayedJobCards(orgID: $orgID, plantID: $plantID, nextToken: $nextToken) {
    items {
      jobCardID
      jobCardNumber
      orgID
      plantID
      tractorVIN
      loggerID
      raisedByUserID
      repairCategory
      problemType
      description
      priority
      isVOR
      status
      slaDeadline
      slaHours
      slaStatus
      slaPercentage
      estimatedHours
      actualHours
      assignedTechnicianID
      labourCost
      partsCost
      vendorCost
      totalCost
      downtimeHours
      delayReasons {
        reason
        notes
        recordedAt
        recordedBy
        __typename
      }
      customerFeedback
      createdAt
      updatedAt
      startedAt
      completedAt
      closedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDelayedJobCardsQueryVariables,
  APITypes.ListDelayedJobCardsQuery
>;
export const getVORRequest = /* GraphQL */ `query GetVORRequest($vorID: ID!) {
  getVORRequest(vorID: $vorID) {
    vorID
    orgID
    plantID
    tractorVIN
    complaintID
    requiredParts {
      sku
      quantity
      description
      vendorSupportRequired
      vendorOption
      __typename
    }
    urgency
    reason
    status
    requestedBy
    approvedBy
    dispatchedBy
    createdAt
    updatedAt
    approvedAt
    dispatchedAt
    deliveredAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetVORRequestQueryVariables,
  APITypes.GetVORRequestQuery
>;
export const listVORRequests =
  /* GraphQL */ `query ListVORRequests($orgID: ID!, $status: VORStatus, $nextToken: String) {
  listVORRequests(orgID: $orgID, status: $status, nextToken: $nextToken) {
    items {
      vorID
      orgID
      plantID
      tractorVIN
      complaintID
      requiredParts {
        sku
        quantity
        description
        vendorSupportRequired
        vendorOption
        __typename
      }
      urgency
      reason
      status
      requestedBy
      approvedBy
      dispatchedBy
      createdAt
      updatedAt
      approvedAt
      dispatchedAt
      deliveredAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVORRequestsQueryVariables,
  APITypes.ListVORRequestsQuery
>;
export const getVendorRequest =
  /* GraphQL */ `query GetVendorRequest($complaintID: ID!, $vendorRequestID: ID!) {
  getVendorRequest(
    complaintID: $complaintID
    vendorRequestID: $vendorRequestID
  ) {
    vendorRequestID
    complaintID
    orgID
    plantID
    tractorVIN
    vendorRequired
    vendorType
    description
    status
    requestedBy
    resolvedBy
    resolutionNotes
    createdAt
    updatedAt
    resolvedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetVendorRequestQueryVariables,
  APITypes.GetVendorRequestQuery
>;
export const listVendorRequestsByComplaint =
  /* GraphQL */ `query ListVendorRequestsByComplaint($complaintID: ID!, $nextToken: String) {
  listVendorRequestsByComplaint(
    complaintID: $complaintID
    nextToken: $nextToken
  ) {
    items {
      vendorRequestID
      complaintID
      orgID
      plantID
      tractorVIN
      vendorRequired
      vendorType
      description
      status
      requestedBy
      resolvedBy
      resolutionNotes
      createdAt
      updatedAt
      resolvedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVendorRequestsByComplaintQueryVariables,
  APITypes.ListVendorRequestsByComplaintQuery
>;
export const listVendorRequestsByOrg =
  /* GraphQL */ `query ListVendorRequestsByOrg(
  $orgID: ID!
  $status: VendorRequestStatus
  $nextToken: String
) {
  listVendorRequestsByOrg(
    orgID: $orgID
    status: $status
    nextToken: $nextToken
  ) {
    items {
      vendorRequestID
      complaintID
      orgID
      plantID
      tractorVIN
      vendorRequired
      vendorType
      description
      status
      requestedBy
      resolvedBy
      resolutionNotes
      createdAt
      updatedAt
      resolvedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVendorRequestsByOrgQueryVariables,
  APITypes.ListVendorRequestsByOrgQuery
>;
export const getPMSSchedule =
  /* GraphQL */ `query GetPMSSchedule($tractorVIN: ID!) {
  getPMSSchedule(tractorVIN: $tractorVIN) {
    scheduleID
    tractorVIN
    orgID
    plantID
    intervalHours
    intervalMonths
    lastPMSDate
    lastPMSHourMeter
    nextPMSDueDate
    nextPMSDueHourMeter
    status
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPMSScheduleQueryVariables,
  APITypes.GetPMSScheduleQuery
>;
export const listOverduePMS =
  /* GraphQL */ `query ListOverduePMS($orgID: ID!, $plantID: ID, $nextToken: String) {
  listOverduePMS(orgID: $orgID, plantID: $plantID, nextToken: $nextToken) {
    items {
      scheduleID
      tractorVIN
      orgID
      plantID
      intervalHours
      intervalMonths
      lastPMSDate
      lastPMSHourMeter
      nextPMSDueDate
      nextPMSDueHourMeter
      status
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOverduePMSQueryVariables,
  APITypes.ListOverduePMSQuery
>;
export const getPMSAlerts =
  /* GraphQL */ `query GetPMSAlerts($orgID: ID!, $plantID: ID, $nextToken: String) {
  getPMSAlerts(orgID: $orgID, plantID: $plantID, nextToken: $nextToken) {
    items {
      tractorVIN
      orgID
      plantID
      currentHourMeter
      lastPMSDate
      lastPMSHourMeter
      hoursSinceLastPMS
      monthsSinceLastPMS
      alertType
      alertMessage
      needsImmediateAttention
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPMSAlertsQueryVariables,
  APITypes.GetPMSAlertsQuery
>;
export const getPMSTracker =
  /* GraphQL */ `query GetPMSTracker($tractorVIN: ID!) {
  getPMSTracker(tractorVIN: $tractorVIN) {
    trackerID
    tractorVIN
    orgID
    plantID
    intervalHours
    baselineRuntime
    currentRuntime
    hoursSinceLastPMS
    activeComplaintID
    status
    lastResetAt
    lastResetBy
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPMSTrackerQueryVariables,
  APITypes.GetPMSTrackerQuery
>;
export const listPMSTrackersByOrg =
  /* GraphQL */ `query ListPMSTrackersByOrg($orgID: ID!, $nextToken: String) {
  listPMSTrackersByOrg(orgID: $orgID, nextToken: $nextToken) {
    items {
      trackerID
      tractorVIN
      orgID
      plantID
      intervalHours
      baselineRuntime
      currentRuntime
      hoursSinceLastPMS
      activeComplaintID
      status
      lastResetAt
      lastResetBy
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPMSTrackersByOrgQueryVariables,
  APITypes.ListPMSTrackersByOrgQuery
>;
export const checkPMSAlert =
  /* GraphQL */ `query CheckPMSAlert($tractorVIN: ID!) {
  checkPMSAlert(tractorVIN: $tractorVIN) {
    tractorVIN
    trackerID
    baselineRuntime
    currentRuntime
    hoursSinceLastPMS
    intervalHours
    hoursRemaining
    alertRequired
    status
    activeComplaintID
    __typename
  }
}
` as GeneratedQuery<
  APITypes.CheckPMSAlertQueryVariables,
  APITypes.CheckPMSAlertQuery
>;
export const listPMSHistory =
  /* GraphQL */ `query ListPMSHistory($tractorVIN: ID!, $nextToken: String) {
  listPMSHistory(tractorVIN: $tractorVIN, nextToken: $nextToken) {
    items {
      historyID
      tractorVIN
      orgID
      complaintID
      baselineRuntime
      resetRuntime
      hoursAccumulated
      resetAt
      resetBy
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPMSHistoryQueryVariables,
  APITypes.ListPMSHistoryQuery
>;
export const listAllPMSStatus = /* GraphQL */ `query ListAllPMSStatus {
  listAllPMSStatus {
    tractorID
    totalRuntimeHours
    baselineRuntime
    hoursAccumulated
    hoursRemaining
    percentComplete
    intervalHours
    status
    alertRequired
    activeComplaintID
    lastResetAt
    trackerExists
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAllPMSStatusQueryVariables,
  APITypes.ListAllPMSStatusQuery
>;
export const getPMSStatus = /* GraphQL */ `query GetPMSStatus($tractorID: ID!) {
  getPMSStatus(tractorID: $tractorID) {
    tractorID
    totalRuntimeHours
    baselineRuntime
    hoursAccumulated
    hoursRemaining
    percentComplete
    intervalHours
    status
    alertRequired
    activeComplaintID
    lastResetAt
    trackerExists
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPMSStatusQueryVariables,
  APITypes.GetPMSStatusQuery
>;
export const getWeeklyCheckSchedule =
  /* GraphQL */ `query GetWeeklyCheckSchedule($scheduleID: ID!) {
  getWeeklyCheckSchedule(scheduleID: $scheduleID) {
    scheduleID
    orgID
    plantID
    weekStartDate
    assignedTractors
    assignedTechnicianID
    status
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetWeeklyCheckScheduleQueryVariables,
  APITypes.GetWeeklyCheckScheduleQuery
>;
export const listWeeklyChecksByTechnician =
  /* GraphQL */ `query ListWeeklyChecksByTechnician(
  $technicianID: ID!
  $status: WeeklyCheckStatus
  $nextToken: String
) {
  listWeeklyChecksByTechnician(
    technicianID: $technicianID
    status: $status
    nextToken: $nextToken
  ) {
    items {
      scheduleID
      orgID
      plantID
      weekStartDate
      assignedTractors
      assignedTechnicianID
      status
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWeeklyChecksByTechnicianQueryVariables,
  APITypes.ListWeeklyChecksByTechnicianQuery
>;
export const listWeeklyChecksByPlant =
  /* GraphQL */ `query ListWeeklyChecksByPlant(
  $plantID: ID!
  $weekStartDate: AWSDate
  $nextToken: String
) {
  listWeeklyChecksByPlant(
    plantID: $plantID
    weekStartDate: $weekStartDate
    nextToken: $nextToken
  ) {
    items {
      scheduleID
      orgID
      plantID
      weekStartDate
      assignedTractors
      assignedTechnicianID
      status
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWeeklyChecksByPlantQueryVariables,
  APITypes.ListWeeklyChecksByPlantQuery
>;
export const getDelayAnalyticsBySite =
  /* GraphQL */ `query GetDelayAnalyticsBySite(
  $orgID: ID!
  $plantID: ID!
  $startDate: AWSDate!
  $endDate: AWSDate!
) {
  getDelayAnalyticsBySite(
    orgID: $orgID
    plantID: $plantID
    startDate: $startDate
    endDate: $endDate
  ) {
    orgID
    plantID
    startDate
    endDate
    totalJobs
    delayedJobs
    delayPercentage
    reasonBreakdown {
      reason
      count
      percentage
      avgDelayHours
      __typename
    }
    repeatFailures {
      tractorVIN
      reason
      occurrences
      lastOccurrence
      firstOccurrence
      avgTimeBetweenOccurrences
      __typename
    }
    avgDelayHours
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDelayAnalyticsBySiteQueryVariables,
  APITypes.GetDelayAnalyticsBySiteQuery
>;
export const getDelayAnalyticsByRegion =
  /* GraphQL */ `query GetDelayAnalyticsByRegion(
  $orgID: ID!
  $startDate: AWSDate!
  $endDate: AWSDate!
) {
  getDelayAnalyticsByRegion(
    orgID: $orgID
    startDate: $startDate
    endDate: $endDate
  ) {
    orgID
    plantID
    startDate
    endDate
    totalJobs
    delayedJobs
    delayPercentage
    reasonBreakdown {
      reason
      count
      percentage
      avgDelayHours
      __typename
    }
    repeatFailures {
      tractorVIN
      reason
      occurrences
      lastOccurrence
      firstOccurrence
      avgTimeBetweenOccurrences
      __typename
    }
    avgDelayHours
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDelayAnalyticsByRegionQueryVariables,
  APITypes.GetDelayAnalyticsByRegionQuery
>;
export const getTopDelayReasons = /* GraphQL */ `query GetTopDelayReasons(
  $orgID: ID!
  $plantID: ID
  $startDate: AWSDate!
  $endDate: AWSDate!
  $limit: Int
) {
  getTopDelayReasons(
    orgID: $orgID
    plantID: $plantID
    startDate: $startDate
    endDate: $endDate
    limit: $limit
  ) {
    reason
    count
    percentage
    avgDelayHours
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTopDelayReasonsQueryVariables,
  APITypes.GetTopDelayReasonsQuery
>;
export const getRepeatFailurePatterns =
  /* GraphQL */ `query GetRepeatFailurePatterns(
  $orgID: ID!
  $tractorVIN: String
  $startDate: AWSDate!
  $endDate: AWSDate!
  $minOccurrences: Int
) {
  getRepeatFailurePatterns(
    orgID: $orgID
    tractorVIN: $tractorVIN
    startDate: $startDate
    endDate: $endDate
    minOccurrences: $minOccurrences
  ) {
    tractorVIN
    reason
    occurrences
    lastOccurrence
    firstOccurrence
    avgTimeBetweenOccurrences
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetRepeatFailurePatternsQueryVariables,
  APITypes.GetRepeatFailurePatternsQuery
>;
export const getSLAComplianceReport =
  /* GraphQL */ `query GetSLAComplianceReport(
  $orgID: ID!
  $plantID: ID
  $startDate: AWSDate!
  $endDate: AWSDate!
) {
  getSLAComplianceReport(
    orgID: $orgID
    plantID: $plantID
    startDate: $startDate
    endDate: $endDate
  ) {
    orgID
    plantID
    startDate
    endDate
    totalJobs
    onTimeJobs
    delayedJobs
    compliancePercentage
    avgCompletionTime
    byCategory {
      category
      totalJobs
      onTimeJobs
      compliancePercentage
      __typename
    }
    byPriority {
      priority
      totalJobs
      onTimeJobs
      compliancePercentage
      __typename
    }
    trend {
      date
      totalJobs
      onTimeJobs
      compliancePercentage
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSLAComplianceReportQueryVariables,
  APITypes.GetSLAComplianceReportQuery
>;
export const getTechnicianProductivityReport =
  /* GraphQL */ `query GetTechnicianProductivityReport(
  $technicianID: ID!
  $startDate: AWSDate!
  $endDate: AWSDate!
) {
  getTechnicianProductivityReport(
    technicianID: $technicianID
    startDate: $startDate
    endDate: $endDate
  ) {
    technicianID
    startDate
    endDate
    totalJobsAssigned
    totalJobsCompleted
    completionRate
    avgCompletionTime
    onTimeJobs
    delayedJobs
    slaComplianceRate
    totalLabourHours
    avgLabourHoursPerJob
    jobsByCategory {
      category
      count
      __typename
    }
    jobsByPriority {
      priority
      count
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTechnicianProductivityReportQueryVariables,
  APITypes.GetTechnicianProductivityReportQuery
>;
export const getPlantPerformanceReport =
  /* GraphQL */ `query GetPlantPerformanceReport(
  $plantID: ID!
  $startDate: AWSDate!
  $endDate: AWSDate!
) {
  getPlantPerformanceReport(
    plantID: $plantID
    startDate: $startDate
    endDate: $endDate
  ) {
    plantID
    startDate
    endDate
    totalJobs
    completedJobs
    delayedJobs
    avgCompletionTime
    slaComplianceRate
    totalCost
    avgCostPerJob
    totalDowntimeHours
    topDelayReasons {
      reason
      count
      percentage
      avgDelayHours
      __typename
    }
    technicianPerformance {
      technicianID
      jobsCompleted
      avgCompletionTime
      slaComplianceRate
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPlantPerformanceReportQueryVariables,
  APITypes.GetPlantPerformanceReportQuery
>;
export const getCostPerTractor = /* GraphQL */ `query GetCostPerTractor(
  $tractorVIN: String!
  $startDate: AWSDate!
  $endDate: AWSDate!
) {
  getCostPerTractor(
    tractorVIN: $tractorVIN
    startDate: $startDate
    endDate: $endDate
  ) {
    tractorVIN
    startDate
    endDate
    totalJobs
    totalCost
    labourCost
    partsCost
    vendorCost
    avgCostPerJob
    totalDowntimeHours
    costByCategory {
      category
      jobCount
      totalCost
      avgCost
      __typename
    }
    costTrend {
      month
      totalCost
      jobCount
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCostPerTractorQueryVariables,
  APITypes.GetCostPerTractorQuery
>;
export const getCostPerSite =
  /* GraphQL */ `query GetCostPerSite($plantID: ID!, $startDate: AWSDate!, $endDate: AWSDate!) {
  getCostPerSite(plantID: $plantID, startDate: $startDate, endDate: $endDate) {
    plantID
    startDate
    endDate
    totalJobs
    totalCost
    labourCost
    partsCost
    vendorCost
    avgCostPerJob
    costByTractor {
      tractorVIN
      jobCount
      totalCost
      avgCost
      __typename
    }
    costByCategory {
      category
      jobCount
      totalCost
      avgCost
      __typename
    }
    monthlyTrend {
      month
      totalCost
      jobCount
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCostPerSiteQueryVariables,
  APITypes.GetCostPerSiteQuery
>;
export const getInventoryAgingReport =
  /* GraphQL */ `query GetInventoryAgingReport($plantID: ID!, $thresholdDays: Int) {
  getInventoryAgingReport(plantID: $plantID, thresholdDays: $thresholdDays) {
    plantID
    generatedAt
    totalItems
    totalValue
    agingBuckets {
      daysRange
      itemCount
      totalValue
      percentage
      __typename
    }
    slowMovingItems {
      sku
      description
      currentStock
      lastMovementDate
      daysSinceLastMovement
      estimatedValue
      recommendedAction
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetInventoryAgingReportQueryVariables,
  APITypes.GetInventoryAgingReportQuery
>;
export const getSlowMovingPartsReport =
  /* GraphQL */ `query GetSlowMovingPartsReport(
  $plantID: ID!
  $thresholdDays: Int!
  $limit: Int
) {
  getSlowMovingPartsReport(
    plantID: $plantID
    thresholdDays: $thresholdDays
    limit: $limit
  ) {
    sku
    description
    currentStock
    lastMovementDate
    daysSinceLastMovement
    estimatedValue
    recommendedAction
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSlowMovingPartsReportQueryVariables,
  APITypes.GetSlowMovingPartsReportQuery
>;
export const getSku = /* GraphQL */ `query GetSku($sku: ID!) {
  getSku(sku: $sku) {
    sku
    orgID
    name
    description
    category
    unit
    qtyPerUnit
    qtyForNxtBatch
    totalQtyForNxtBatch
    avlblQtyHapur
    partsRequired
    minQty
    midQty
    maxQty
    stockAvailability
    modelApplicability {
      x45h2
      x45c2
      x45c2L
      x45c4
      h55c2
      h55c2L
      h55c4
      x60c2
      x60c2L
      x60c4
      x75c4
      __typename
    }
    modelPartsRequired {
      x45h2
      x45c2
      x45c2L
      x45c4
      h55c2
      h55c2L
      h55c4
      x60c2
      x60c2L
      x60c4
      x75c4
      __typename
    }
    typicalPricePaise
    specs
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetSkuQueryVariables, APITypes.GetSkuQuery>;
export const listSkus =
  /* GraphQL */ `query ListSkus($category: InventoryCategory, $limit: Int, $nextToken: String) {
  listSkus(category: $category, limit: $limit, nextToken: $nextToken) {
    items {
      sku
      orgID
      name
      description
      category
      unit
      qtyPerUnit
      qtyForNxtBatch
      totalQtyForNxtBatch
      avlblQtyHapur
      partsRequired
      minQty
      midQty
      maxQty
      stockAvailability
      modelApplicability {
        x45h2
        x45c2
        x45c2L
        x45c4
        h55c2
        h55c2L
        h55c4
        x60c2
        x60c2L
        x60c4
        x75c4
        __typename
      }
      modelPartsRequired {
        x45h2
        x45c2
        x45c2L
        x45c4
        h55c2
        h55c2L
        h55c4
        x60c2
        x60c2L
        x60c4
        x75c4
        __typename
      }
      typicalPricePaise
      specs
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListSkusQueryVariables, APITypes.ListSkusQuery>;
export const listSkusByOrg = /* GraphQL */ `query ListSkusByOrg(
  $orgID: ID!
  $category: InventoryCategory
  $limit: Int
  $nextToken: String
) {
  listSkusByOrg(
    orgID: $orgID
    category: $category
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      sku
      orgID
      name
      description
      category
      unit
      qtyPerUnit
      qtyForNxtBatch
      totalQtyForNxtBatch
      avlblQtyHapur
      partsRequired
      minQty
      midQty
      maxQty
      stockAvailability
      modelApplicability {
        x45h2
        x45c2
        x45c2L
        x45c4
        h55c2
        h55c2L
        h55c4
        x60c2
        x60c2L
        x60c4
        x75c4
        __typename
      }
      modelPartsRequired {
        x45h2
        x45c2
        x45c2L
        x45c4
        h55c2
        h55c2L
        h55c4
        x60c2
        x60c2L
        x60c4
        x75c4
        __typename
      }
      typicalPricePaise
      specs
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSkusByOrgQueryVariables,
  APITypes.ListSkusByOrgQuery
>;
export const getPlantStock =
  /* GraphQL */ `query GetPlantStock($plantID: ID!, $sku: ID!, $category: InventoryCategory!) {
  getPlantStock(plantID: $plantID, sku: $sku, category: $category) {
    orgID
    plantID
    sku
    category
    stock
    reservedQty
    minStock
    maxStock
    reorderLevel
    safetyNormPercentage
    locationBin
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPlantStockQueryVariables,
  APITypes.GetPlantStockQuery
>;
export const listStockByPlant = /* GraphQL */ `query ListStockByPlant(
  $plantID: ID!
  $category: InventoryCategory!
  $limit: Int
  $nextToken: String
) {
  listStockByPlant(
    plantID: $plantID
    category: $category
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      orgID
      plantID
      sku
      category
      stock
      reservedQty
      minStock
      maxStock
      reorderLevel
      safetyNormPercentage
      locationBin
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListStockByPlantQueryVariables,
  APITypes.ListStockByPlantQuery
>;
export const getOrgStockSummary = /* GraphQL */ `query GetOrgStockSummary(
  $orgID: ID!
  $sku: ID!
  $category: InventoryCategory!
) {
  getOrgStockSummary(orgID: $orgID, sku: $sku, category: $category) {
    orgID
    sku
    category
    orgTotalStock
    orgTotalReserved
    orgTotalAvailable
    plants {
      plantID
      sku
      category
      totalReceived
      stock
      reservedQty
      available
      minStock
      locationBin
      updatedAt
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetOrgStockSummaryQueryVariables,
  APITypes.GetOrgStockSummaryQuery
>;
export const listOrgStockSummaries = /* GraphQL */ `query ListOrgStockSummaries(
  $orgID: ID!
  $category: InventoryCategory
  $limit: Int
  $nextToken: String
) {
  listOrgStockSummaries(
    orgID: $orgID
    category: $category
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      orgID
      sku
      category
      orgTotalStock
      orgTotalReserved
      orgTotalAvailable
      plants {
        plantID
        sku
        category
        totalReceived
        stock
        reservedQty
        available
        minStock
        locationBin
        updatedAt
        __typename
      }
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrgStockSummariesQueryVariables,
  APITypes.ListOrgStockSummariesQuery
>;
export const listInventoryLogs = /* GraphQL */ `query ListInventoryLogs(
  $plantID: ID!
  $from: AWSDateTime
  $to: AWSDateTime
  $limit: Int
  $nextToken: String
) {
  listInventoryLogs(
    plantID: $plantID
    from: $from
    to: $to
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      orgID
      plantID
      sku
      ts
      delta
      reason
      ticketID
      before
      after
      meta
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListInventoryLogsQueryVariables,
  APITypes.ListInventoryLogsQuery
>;
export const getSerial = /* GraphQL */ `query GetSerial($serial: ID!) {
  getSerial(serial: $serial) {
    serial
    orgID
    sku
    state
    plantID
    loggerID
    tractorVIN
    lastTicketID
    costPaise
    warrantyTill
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetSerialQueryVariables, APITypes.GetSerialQuery>;
export const listSerialEvents =
  /* GraphQL */ `query ListSerialEvents($serial: ID!, $limit: Int, $nextToken: String) {
  listSerialEvents(serial: $serial, limit: $limit, nextToken: $nextToken) {
    items {
      serial
      ts
      type
      meta
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSerialEventsQueryVariables,
  APITypes.ListSerialEventsQuery
>;
export const listSerialsByState = /* GraphQL */ `query ListSerialsByState(
  $state: SerialState!
  $sku: ID
  $limit: Int
  $nextToken: String
) {
  listSerialsByState(
    state: $state
    sku: $sku
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      serial
      orgID
      sku
      state
      plantID
      loggerID
      tractorVIN
      lastTicketID
      costPaise
      warrantyTill
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSerialsByStateQueryVariables,
  APITypes.ListSerialsByStateQuery
>;
export const listSerialsByPlant = /* GraphQL */ `query ListSerialsByPlant(
  $plantID: ID!
  $state: SerialState
  $limit: Int
  $nextToken: String
) {
  listSerialsByPlant(
    plantID: $plantID
    state: $state
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      serial
      orgID
      sku
      state
      plantID
      loggerID
      tractorVIN
      lastTicketID
      costPaise
      warrantyTill
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSerialsByPlantQueryVariables,
  APITypes.ListSerialsByPlantQuery
>;
export const listSerialsByTractor = /* GraphQL */ `query ListSerialsByTractor(
  $loggerID: ID!
  $state: SerialState
  $limit: Int
  $nextToken: String
) {
  listSerialsByTractor(
    loggerID: $loggerID
    state: $state
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      serial
      orgID
      sku
      state
      plantID
      loggerID
      tractorVIN
      lastTicketID
      costPaise
      warrantyTill
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSerialsByTractorQueryVariables,
  APITypes.ListSerialsByTractorQuery
>;
export const listGoodsReceipts = /* GraphQL */ `query ListGoodsReceipts(
  $plantID: ID!
  $from: AWSDateTime
  $to: AWSDateTime
  $limit: Int
  $nextToken: String
) {
  listGoodsReceipts(
    plantID: $plantID
    from: $from
    to: $to
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      receiptID
      orgID
      plantID
      supplier
      billURL
      items {
        sku
        qty
        serials
        landedCostPaise
        __typename
      }
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGoodsReceiptsQueryVariables,
  APITypes.ListGoodsReceiptsQuery
>;
export const listReservationsByPlant =
  /* GraphQL */ `query ListReservationsByPlant(
  $plantID: ID!
  $status: ReservationStatus
  $limit: Int
  $nextToken: String
) {
  listReservationsByPlant(
    plantID: $plantID
    status: $status
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      resID
      orgID
      ticketID
      plantID
      sku
      qty
      serials
      status
      expiresAt
      createdAt
      updatedAt
      approvedBy
      approvedAt
      pickedBy
      pickedAt
      verifiedBy
      verifiedAt
      deliveredBy
      deliveredAt
      cancelledBy
      cancelledAt
      notes
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReservationsByPlantQueryVariables,
  APITypes.ListReservationsByPlantQuery
>;
export const listReservationsByTicket =
  /* GraphQL */ `query ListReservationsByTicket(
  $ticketID: ID!
  $limit: Int
  $nextToken: String
) {
  listReservationsByTicket(
    ticketID: $ticketID
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      resID
      orgID
      ticketID
      plantID
      sku
      qty
      serials
      status
      expiresAt
      createdAt
      updatedAt
      approvedBy
      approvedAt
      pickedBy
      pickedAt
      verifiedBy
      verifiedAt
      deliveredBy
      deliveredAt
      cancelledBy
      cancelledAt
      notes
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReservationsByTicketQueryVariables,
  APITypes.ListReservationsByTicketQuery
>;
export const listGoodsIssuesByTicket =
  /* GraphQL */ `query ListGoodsIssuesByTicket($ticketID: ID!, $limit: Int, $nextToken: String) {
  listGoodsIssuesByTicket(
    ticketID: $ticketID
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      issueID
      orgID
      ticketID
      plantID
      items {
        sku
        qty
        serials
        __typename
      }
      transportDocURL
      createdAt
      verifiedAt
      verifiedBy
      deliveredAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGoodsIssuesByTicketQueryVariables,
  APITypes.ListGoodsIssuesByTicketQuery
>;
export const listTransfersBySource = /* GraphQL */ `query ListTransfersBySource(
  $srcPlantID: ID!
  $from: AWSDateTime
  $to: AWSDateTime
  $limit: Int
  $nextToken: String
) {
  listTransfersBySource(
    srcPlantID: $srcPlantID
    from: $from
    to: $to
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      transferID
      orgID
      srcPlantID
      dstPlantID
      status
      items {
        sku
        qty
        serials
        __typename
      }
      createdAt
      dispatchedAt
      receivedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTransfersBySourceQueryVariables,
  APITypes.ListTransfersBySourceQuery
>;
export const listTransfersByDest = /* GraphQL */ `query ListTransfersByDest(
  $dstPlantID: ID!
  $from: AWSDateTime
  $to: AWSDateTime
  $limit: Int
  $nextToken: String
) {
  listTransfersByDest(
    dstPlantID: $dstPlantID
    from: $from
    to: $to
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      transferID
      orgID
      srcPlantID
      dstPlantID
      status
      items {
        sku
        qty
        serials
        __typename
      }
      createdAt
      dispatchedAt
      receivedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTransfersByDestQueryVariables,
  APITypes.ListTransfersByDestQuery
>;
export const getWarrantyClaim =
  /* GraphQL */ `query GetWarrantyClaim($claimID: ID!) {
  getWarrantyClaim(claimID: $claimID) {
    claimID
    orgID
    partID
    serial
    ticketID
    reason
    status
    vendorRMA
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetWarrantyClaimQueryVariables,
  APITypes.GetWarrantyClaimQuery
>;
export const listWarrantyByPart =
  /* GraphQL */ `query ListWarrantyByPart($partID: ID!, $limit: Int, $nextToken: String) {
  listWarrantyByPart(partID: $partID, limit: $limit, nextToken: $nextToken) {
    items {
      claimID
      orgID
      partID
      serial
      ticketID
      reason
      status
      vendorRMA
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWarrantyByPartQueryVariables,
  APITypes.ListWarrantyByPartQuery
>;
export const getInventoryAnalyticsByPlant =
  /* GraphQL */ `query GetInventoryAnalyticsByPlant(
  $plantID: ID!
  $period: InventoryPeriodType!
  $key: String!
) {
  getInventoryAnalyticsByPlant(plantID: $plantID, period: $period, key: $key) {
    orgID
    plantID
    period
    key
    receiptsQty
    issuesQty
    transfersIn
    transfersOut
    stockoutHours
    fillRate
    leadTimeApproveToDispatchSec
    leadTimeDispatchToDeliverSec
    shrinkageQty
    warrantyReturnRate
    partsCostPaise
    transportCostPaise
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetInventoryAnalyticsByPlantQueryVariables,
  APITypes.GetInventoryAnalyticsByPlantQuery
>;
export const listInventoryAnalyticsByPlant =
  /* GraphQL */ `query ListInventoryAnalyticsByPlant(
  $plantID: ID!
  $period: InventoryPeriodType!
  $fromKey: String
  $toKey: String
  $limit: Int
  $nextToken: String
) {
  listInventoryAnalyticsByPlant(
    plantID: $plantID
    period: $period
    fromKey: $fromKey
    toKey: $toKey
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      orgID
      plantID
      period
      key
      receiptsQty
      issuesQty
      transfersIn
      transfersOut
      stockoutHours
      fillRate
      leadTimeApproveToDispatchSec
      leadTimeDispatchToDeliverSec
      shrinkageQty
      warrantyReturnRate
      partsCostPaise
      transportCostPaise
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListInventoryAnalyticsByPlantQueryVariables,
  APITypes.ListInventoryAnalyticsByPlantQuery
>;
export const listEntityMedia =
  /* GraphQL */ `query ListEntityMedia($input: ListEntityMediaInput!) {
  listEntityMedia(input: $input) {
    key
    kind
    contentType
    sizeBytes
    createdAt
    variants
    uploaderID
    vin
    documentID
    title
    description
    docType
    files
    tags
    uploadedBy
    uploadedAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEntityMediaQueryVariables,
  APITypes.ListEntityMediaQuery
>;
export const getLogBookEntry =
  /* GraphQL */ `query GetLogBookEntry($orgID: ID!, $plantID: ID!, $logDate: AWSDate!) {
  getLogBookEntry(orgID: $orgID, plantID: $plantID, logDate: $logDate) {
    orgID
    plantID
    logDate
    files {
      key
      fileName
      contentType
      sizeBytes
      __typename
    }
    notes
    createdAt
    createdBy
    updatedAt
    updatedBy
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLogBookEntryQueryVariables,
  APITypes.GetLogBookEntryQuery
>;
export const listLogBookEntriesByPlant =
  /* GraphQL */ `query ListLogBookEntriesByPlant(
  $orgID: ID!
  $plantID: ID!
  $fromDate: AWSDate
  $toDate: AWSDate
  $limit: Int
  $nextToken: String
  $sortOrder: SortOrder = DESC
) {
  listLogBookEntriesByPlant(
    orgID: $orgID
    plantID: $plantID
    fromDate: $fromDate
    toDate: $toDate
    limit: $limit
    nextToken: $nextToken
    sortOrder: $sortOrder
  ) {
    items {
      orgID
      plantID
      logDate
      files {
        key
        fileName
        contentType
        sizeBytes
        __typename
      }
      notes
      createdAt
      createdBy
      updatedAt
      updatedBy
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLogBookEntriesByPlantQueryVariables,
  APITypes.ListLogBookEntriesByPlantQuery
>;
export const listLogBookEntriesByOrg =
  /* GraphQL */ `query ListLogBookEntriesByOrg(
  $orgID: ID!
  $fromDate: AWSDate
  $toDate: AWSDate
  $limit: Int
  $nextToken: String
  $sortOrder: SortOrder = DESC
) {
  listLogBookEntriesByOrg(
    orgID: $orgID
    fromDate: $fromDate
    toDate: $toDate
    limit: $limit
    nextToken: $nextToken
    sortOrder: $sortOrder
  ) {
    items {
      orgID
      plantID
      logDate
      files {
        key
        fileName
        contentType
        sizeBytes
        __typename
      }
      notes
      createdAt
      createdBy
      updatedAt
      updatedBy
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLogBookEntriesByOrgQueryVariables,
  APITypes.ListLogBookEntriesByOrgQuery
>;
export const getEmployeeAttendanceDay =
  /* GraphQL */ `query GetEmployeeAttendanceDay($userID: ID!, $date: AWSDate!) {
  getEmployeeAttendanceDay(userID: $userID, date: $date) {
    userID
    orgID
    plantID
    officeID
    date
    status
    checkInAt
    checkOutAt
    punchCount
    lastPunchType
    lastPunchAt
    notes
    markedByUserID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetEmployeeAttendanceDayQueryVariables,
  APITypes.GetEmployeeAttendanceDayQuery
>;
export const listEmployeeAttendanceByUser =
  /* GraphQL */ `query ListEmployeeAttendanceByUser(
  $userID: ID!
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listEmployeeAttendanceByUser(
    userID: $userID
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      userID
      orgID
      plantID
      officeID
      date
      status
      checkInAt
      checkOutAt
      punchCount
      lastPunchType
      lastPunchAt
      notes
      markedByUserID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEmployeeAttendanceByUserQueryVariables,
  APITypes.ListEmployeeAttendanceByUserQuery
>;
export const listEmployeeAttendanceByDate =
  /* GraphQL */ `query ListEmployeeAttendanceByDate($date: AWSDate!, $nextToken: String) {
  listEmployeeAttendanceByDate(date: $date, nextToken: $nextToken) {
    items {
      userID
      orgID
      plantID
      officeID
      date
      status
      checkInAt
      checkOutAt
      punchCount
      lastPunchType
      lastPunchAt
      notes
      markedByUserID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEmployeeAttendanceByDateQueryVariables,
  APITypes.ListEmployeeAttendanceByDateQuery
>;
export const listEmployeePunchesByUserDay =
  /* GraphQL */ `query ListEmployeePunchesByUserDay(
  $userID: ID!
  $date: AWSDate!
  $nextToken: String
) {
  listEmployeePunchesByUserDay(
    userID: $userID
    date: $date
    nextToken: $nextToken
  ) {
    items {
      userID
      orgID
      plantID
      officeID
      date
      type
      ts
      source
      method
      location
      markedByUserID
      notes
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEmployeePunchesByUserDayQueryVariables,
  APITypes.ListEmployeePunchesByUserDayQuery
>;
export const listEmployeePunchesByDate =
  /* GraphQL */ `query ListEmployeePunchesByDate($date: AWSDate!, $nextToken: String) {
  listEmployeePunchesByDate(date: $date, nextToken: $nextToken) {
    items {
      userID
      orgID
      plantID
      officeID
      date
      type
      ts
      source
      method
      location
      markedByUserID
      notes
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEmployeePunchesByDateQueryVariables,
  APITypes.ListEmployeePunchesByDateQuery
>;
export const getFaceRegistration =
  /* GraphQL */ `query GetFaceRegistration($userID: ID!) {
  getFaceRegistration(userID: $userID) {
    userID
    faceId
    s3Key
    officeID
    orgID
    registeredAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetFaceRegistrationQueryVariables,
  APITypes.GetFaceRegistrationQuery
>;
export const getAttendanceRegularizationRequest =
  /* GraphQL */ `query GetAttendanceRegularizationRequest($requestID: ID!) {
  getAttendanceRegularizationRequest(requestID: $requestID) {
    requestID
    userID
    userEmail
    orgID
    plantID
    date
    currentStatus
    requestedStatus
    reason
    description
    attachments
    status
    submittedAt
    submittedBy
    reviewedBy
    reviewedAt
    reviewComments
    approvedBy
    approvedAt
    rejectedBy
    rejectedAt
    rejectionReason
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAttendanceRegularizationRequestQueryVariables,
  APITypes.GetAttendanceRegularizationRequestQuery
>;
export const listAttendanceRegularizationsByUser =
  /* GraphQL */ `query ListAttendanceRegularizationsByUser(
  $userID: ID!
  $status: AttendanceRegularizationStatus
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listAttendanceRegularizationsByUser(
    userID: $userID
    status: $status
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      requestID
      userID
      userEmail
      orgID
      plantID
      date
      currentStatus
      requestedStatus
      reason
      description
      attachments
      status
      submittedAt
      submittedBy
      reviewedBy
      reviewedAt
      reviewComments
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendanceRegularizationsByUserQueryVariables,
  APITypes.ListAttendanceRegularizationsByUserQuery
>;
export const listAttendanceRegularizations =
  /* GraphQL */ `query ListAttendanceRegularizations(
  $status: AttendanceRegularizationStatus
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listAttendanceRegularizations(
    status: $status
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      requestID
      userID
      userEmail
      orgID
      plantID
      date
      currentStatus
      requestedStatus
      reason
      description
      attachments
      status
      submittedAt
      submittedBy
      reviewedBy
      reviewedAt
      reviewComments
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendanceRegularizationsQueryVariables,
  APITypes.ListAttendanceRegularizationsQuery
>;
export const listAttendanceRegularizationsByApprover =
  /* GraphQL */ `query ListAttendanceRegularizationsByApprover(
  $approverID: ID!
  $status: AttendanceRegularizationStatus
  $nextToken: String
) {
  listAttendanceRegularizationsByApprover(
    approverID: $approverID
    status: $status
    nextToken: $nextToken
  ) {
    items {
      requestID
      userID
      userEmail
      orgID
      plantID
      date
      currentStatus
      requestedStatus
      reason
      description
      attachments
      status
      submittedAt
      submittedBy
      reviewedBy
      reviewedAt
      reviewComments
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendanceRegularizationsByApproverQueryVariables,
  APITypes.ListAttendanceRegularizationsByApproverQuery
>;
export const listAttendanceRegularizationsByStatus =
  /* GraphQL */ `query ListAttendanceRegularizationsByStatus(
  $status: AttendanceRegularizationStatus!
  $plantID: ID
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listAttendanceRegularizationsByStatus(
    status: $status
    plantID: $plantID
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      requestID
      userID
      userEmail
      orgID
      plantID
      date
      currentStatus
      requestedStatus
      reason
      description
      attachments
      status
      submittedAt
      submittedBy
      reviewedBy
      reviewedAt
      reviewComments
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendanceRegularizationsByStatusQueryVariables,
  APITypes.ListAttendanceRegularizationsByStatusQuery
>;
export const getOfficeLocation =
  /* GraphQL */ `query GetOfficeLocation($officeID: ID!) {
  getOfficeLocation(officeID: $officeID) {
    officeID
    orgID
    plantID
    name
    officeType
    address {
      street
      city
      state
      country
      postalCode
      coordinates {
        latitude
        longitude
        __typename
      }
      __typename
    }
    contactInfo {
      phone
      email
      managerName
      managerPhone
      __typename
    }
    geofenceRadius
    isActive
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetOfficeLocationQueryVariables,
  APITypes.GetOfficeLocationQuery
>;
export const listOfficeLocationsByOrg =
  /* GraphQL */ `query ListOfficeLocationsByOrg($orgID: ID!, $nextToken: String) {
  listOfficeLocationsByOrg(orgID: $orgID, nextToken: $nextToken) {
    items {
      officeID
      orgID
      plantID
      name
      officeType
      address {
        street
        city
        state
        country
        postalCode
        coordinates {
          latitude
          longitude
          __typename
        }
        __typename
      }
      contactInfo {
        phone
        email
        managerName
        managerPhone
        __typename
      }
      geofenceRadius
      isActive
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOfficeLocationsByOrgQueryVariables,
  APITypes.ListOfficeLocationsByOrgQuery
>;
export const listOfficeLocationsByPlant =
  /* GraphQL */ `query ListOfficeLocationsByPlant($plantID: ID!, $nextToken: String) {
  listOfficeLocationsByPlant(plantID: $plantID, nextToken: $nextToken) {
    items {
      officeID
      orgID
      plantID
      name
      officeType
      address {
        street
        city
        state
        country
        postalCode
        coordinates {
          latitude
          longitude
          __typename
        }
        __typename
      }
      contactInfo {
        phone
        email
        managerName
        managerPhone
        __typename
      }
      geofenceRadius
      isActive
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOfficeLocationsByPlantQueryVariables,
  APITypes.ListOfficeLocationsByPlantQuery
>;
export const listOfficeLocationsByType =
  /* GraphQL */ `query ListOfficeLocationsByType($officeType: OfficeType!, $nextToken: String) {
  listOfficeLocationsByType(officeType: $officeType, nextToken: $nextToken) {
    items {
      officeID
      orgID
      plantID
      name
      officeType
      address {
        street
        city
        state
        country
        postalCode
        coordinates {
          latitude
          longitude
          __typename
        }
        __typename
      }
      contactInfo {
        phone
        email
        managerName
        managerPhone
        __typename
      }
      geofenceRadius
      isActive
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOfficeLocationsByTypeQueryVariables,
  APITypes.ListOfficeLocationsByTypeQuery
>;
export const listActiveOfficesByOrg =
  /* GraphQL */ `query ListActiveOfficesByOrg($orgID: ID!, $nextToken: String) {
  listActiveOfficesByOrg(orgID: $orgID, nextToken: $nextToken) {
    items {
      officeID
      orgID
      plantID
      name
      officeType
      address {
        street
        city
        state
        country
        postalCode
        coordinates {
          latitude
          longitude
          __typename
        }
        __typename
      }
      contactInfo {
        phone
        email
        managerName
        managerPhone
        __typename
      }
      geofenceRadius
      isActive
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListActiveOfficesByOrgQueryVariables,
  APITypes.ListActiveOfficesByOrgQuery
>;
export const listActiveOfficesByPlant =
  /* GraphQL */ `query ListActiveOfficesByPlant($plantID: ID!, $nextToken: String) {
  listActiveOfficesByPlant(plantID: $plantID, nextToken: $nextToken) {
    items {
      officeID
      orgID
      plantID
      name
      officeType
      address {
        street
        city
        state
        country
        postalCode
        coordinates {
          latitude
          longitude
          __typename
        }
        __typename
      }
      contactInfo {
        phone
        email
        managerName
        managerPhone
        __typename
      }
      geofenceRadius
      isActive
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListActiveOfficesByPlantQueryVariables,
  APITypes.ListActiveOfficesByPlantQuery
>;
export const getMyPayslip =
  /* GraphQL */ `query GetMyPayslip($year: Int!, $month: Int!) {
  getMyPayslip(year: $year, month: $month) {
    payslipID
    userID
    year
    month
    officeID
    orgID
    status
    basicSalary
    allowances {
      hra
      transport
      medical
      bonus
      overtime
      other
      total
      __typename
    }
    deductions {
      pf
      esi
      tax
      loan
      advance
      other
      total
      __typename
    }
    grossSalary
    netSalary
    payPeriodStart
    payPeriodEnd
    generatedDate
    approvedBy
    approvedAt
    paidAt
    documents {
      documentID
      type
      fileName
      fileSize
      s3Key
      uploadedAt
      uploadedBy
      __typename
    }
    notes
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMyPayslipQueryVariables,
  APITypes.GetMyPayslipQuery
>;
export const listMyPayslips =
  /* GraphQL */ `query ListMyPayslips($year: Int, $nextToken: String) {
  listMyPayslips(year: $year, nextToken: $nextToken) {
    items {
      payslipID
      userID
      year
      month
      officeID
      orgID
      status
      basicSalary
      allowances {
        hra
        transport
        medical
        bonus
        overtime
        other
        total
        __typename
      }
      deductions {
        pf
        esi
        tax
        loan
        advance
        other
        total
        __typename
      }
      grossSalary
      netSalary
      payPeriodStart
      payPeriodEnd
      generatedDate
      approvedBy
      approvedAt
      paidAt
      documents {
        documentID
        type
        fileName
        fileSize
        s3Key
        uploadedAt
        uploadedBy
        __typename
      }
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMyPayslipsQueryVariables,
  APITypes.ListMyPayslipsQuery
>;
export const listPayslipsByOffice = /* GraphQL */ `query ListPayslipsByOffice(
  $officeID: ID!
  $year: Int
  $month: Int
  $nextToken: String
) {
  listPayslipsByOffice(
    officeID: $officeID
    year: $year
    month: $month
    nextToken: $nextToken
  ) {
    items {
      payslipID
      userID
      year
      month
      officeID
      orgID
      status
      basicSalary
      allowances {
        hra
        transport
        medical
        bonus
        overtime
        other
        total
        __typename
      }
      deductions {
        pf
        esi
        tax
        loan
        advance
        other
        total
        __typename
      }
      grossSalary
      netSalary
      payPeriodStart
      payPeriodEnd
      generatedDate
      approvedBy
      approvedAt
      paidAt
      documents {
        documentID
        type
        fileName
        fileSize
        s3Key
        uploadedAt
        uploadedBy
        __typename
      }
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayslipsByOfficeQueryVariables,
  APITypes.ListPayslipsByOfficeQuery
>;
export const listPayslipsByOrg = /* GraphQL */ `query ListPayslipsByOrg(
  $orgID: ID!
  $year: Int
  $month: Int
  $nextToken: String
) {
  listPayslipsByOrg(
    orgID: $orgID
    year: $year
    month: $month
    nextToken: $nextToken
  ) {
    items {
      payslipID
      userID
      year
      month
      officeID
      orgID
      status
      basicSalary
      allowances {
        hra
        transport
        medical
        bonus
        overtime
        other
        total
        __typename
      }
      deductions {
        pf
        esi
        tax
        loan
        advance
        other
        total
        __typename
      }
      grossSalary
      netSalary
      payPeriodStart
      payPeriodEnd
      generatedDate
      approvedBy
      approvedAt
      paidAt
      documents {
        documentID
        type
        fileName
        fileSize
        s3Key
        uploadedAt
        uploadedBy
        __typename
      }
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayslipsByOrgQueryVariables,
  APITypes.ListPayslipsByOrgQuery
>;
export const listPayslipsByStatus = /* GraphQL */ `query ListPayslipsByStatus(
  $status: PayslipStatus!
  $year: Int
  $month: Int
  $nextToken: String
) {
  listPayslipsByStatus(
    status: $status
    year: $year
    month: $month
    nextToken: $nextToken
  ) {
    items {
      payslipID
      userID
      year
      month
      officeID
      orgID
      status
      basicSalary
      allowances {
        hra
        transport
        medical
        bonus
        overtime
        other
        total
        __typename
      }
      deductions {
        pf
        esi
        tax
        loan
        advance
        other
        total
        __typename
      }
      grossSalary
      netSalary
      payPeriodStart
      payPeriodEnd
      generatedDate
      approvedBy
      approvedAt
      paidAt
      documents {
        documentID
        type
        fileName
        fileSize
        s3Key
        uploadedAt
        uploadedBy
        __typename
      }
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayslipsByStatusQueryVariables,
  APITypes.ListPayslipsByStatusQuery
>;
export const getUserPayslip =
  /* GraphQL */ `query GetUserPayslip($userID: ID!, $year: Int!, $month: Int!) {
  getUserPayslip(userID: $userID, year: $year, month: $month) {
    payslipID
    userID
    year
    month
    officeID
    orgID
    status
    basicSalary
    allowances {
      hra
      transport
      medical
      bonus
      overtime
      other
      total
      __typename
    }
    deductions {
      pf
      esi
      tax
      loan
      advance
      other
      total
      __typename
    }
    grossSalary
    netSalary
    payPeriodStart
    payPeriodEnd
    generatedDate
    approvedBy
    approvedAt
    paidAt
    documents {
      documentID
      type
      fileName
      fileSize
      s3Key
      uploadedAt
      uploadedBy
      __typename
    }
    notes
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserPayslipQueryVariables,
  APITypes.GetUserPayslipQuery
>;
export const getOfficeCalendar =
  /* GraphQL */ `query GetOfficeCalendar($officeID: ID!, $date: AWSDate!) {
  getOfficeCalendar(officeID: $officeID, date: $date) {
    officeID
    date
    dayType
    isWorkingDay
    holidayName
    description
    workingHours {
      startTime
      endTime
      breakStartTime
      breakEndTime
      totalHours
      __typename
    }
    createdAt
    updatedAt
    createdBy
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetOfficeCalendarQueryVariables,
  APITypes.GetOfficeCalendarQuery
>;
export const listOfficeCalendarByMonth =
  /* GraphQL */ `query ListOfficeCalendarByMonth(
  $officeID: ID!
  $year: Int!
  $month: Int!
  $nextToken: String
) {
  listOfficeCalendarByMonth(
    officeID: $officeID
    year: $year
    month: $month
    nextToken: $nextToken
  ) {
    items {
      officeID
      date
      dayType
      isWorkingDay
      holidayName
      description
      workingHours {
        startTime
        endTime
        breakStartTime
        breakEndTime
        totalHours
        __typename
      }
      createdAt
      updatedAt
      createdBy
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOfficeCalendarByMonthQueryVariables,
  APITypes.ListOfficeCalendarByMonthQuery
>;
export const listOfficeCalendarByDateRange =
  /* GraphQL */ `query ListOfficeCalendarByDateRange(
  $officeID: ID!
  $startDate: AWSDate!
  $endDate: AWSDate!
  $nextToken: String
) {
  listOfficeCalendarByDateRange(
    officeID: $officeID
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      officeID
      date
      dayType
      isWorkingDay
      holidayName
      description
      workingHours {
        startTime
        endTime
        breakStartTime
        breakEndTime
        totalHours
        __typename
      }
      createdAt
      updatedAt
      createdBy
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOfficeCalendarByDateRangeQueryVariables,
  APITypes.ListOfficeCalendarByDateRangeQuery
>;
export const listHolidaysByOffice =
  /* GraphQL */ `query ListHolidaysByOffice($officeID: ID!, $year: Int!, $nextToken: String) {
  listHolidaysByOffice(
    officeID: $officeID
    year: $year
    nextToken: $nextToken
  ) {
    items {
      officeID
      date
      dayType
      isWorkingDay
      holidayName
      description
      workingHours {
        startTime
        endTime
        breakStartTime
        breakEndTime
        totalHours
        __typename
      }
      createdAt
      updatedAt
      createdBy
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListHolidaysByOfficeQueryVariables,
  APITypes.ListHolidaysByOfficeQuery
>;
export const getReimbursementClaim =
  /* GraphQL */ `query GetReimbursementClaim($claimID: ID!) {
  getReimbursementClaim(claimID: $claimID) {
    claimID
    userID
    plantID
    orgID
    claimType
    amount
    currency
    description
    category
    expenseDate
    status
    paymentMethod
    bankDetails {
      accountHolderName
      accountNumber
      ifscCode
      bankName
      branchName
      __typename
    }
    upiDetails {
      upiID
      upiName
      __typename
    }
    proofDocuments {
      documentID
      fileName
      fileSize
      mimeType
      documentType
      uploadedAt
      s3Key
      s3Bucket
      __typename
    }
    submittedAt
    submittedBy
    approvedBy
    approvedAt
    rejectedBy
    rejectedAt
    rejectionReason
    processedBy
    processedAt
    paidAt
    transactionID
    notes
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetReimbursementClaimQueryVariables,
  APITypes.GetReimbursementClaimQuery
>;
export const listReimbursementClaimsByUser =
  /* GraphQL */ `query ListReimbursementClaimsByUser(
  $userID: ID!
  $status: ReimbursementStatus
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listReimbursementClaimsByUser(
    userID: $userID
    status: $status
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      claimID
      userID
      plantID
      orgID
      claimType
      amount
      currency
      description
      category
      expenseDate
      status
      paymentMethod
      bankDetails {
        accountHolderName
        accountNumber
        ifscCode
        bankName
        branchName
        __typename
      }
      upiDetails {
        upiID
        upiName
        __typename
      }
      proofDocuments {
        documentID
        fileName
        fileSize
        mimeType
        documentType
        uploadedAt
        s3Key
        s3Bucket
        __typename
      }
      submittedAt
      submittedBy
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      processedBy
      processedAt
      paidAt
      transactionID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReimbursementClaimsByUserQueryVariables,
  APITypes.ListReimbursementClaimsByUserQuery
>;
export const listReimbursementClaims =
  /* GraphQL */ `query ListReimbursementClaims(
  $status: ReimbursementStatus
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listReimbursementClaims(
    status: $status
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      claimID
      userID
      plantID
      orgID
      claimType
      amount
      currency
      description
      category
      expenseDate
      status
      paymentMethod
      bankDetails {
        accountHolderName
        accountNumber
        ifscCode
        bankName
        branchName
        __typename
      }
      upiDetails {
        upiID
        upiName
        __typename
      }
      proofDocuments {
        documentID
        fileName
        fileSize
        mimeType
        documentType
        uploadedAt
        s3Key
        s3Bucket
        __typename
      }
      submittedAt
      submittedBy
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      processedBy
      processedAt
      paidAt
      transactionID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReimbursementClaimsQueryVariables,
  APITypes.ListReimbursementClaimsQuery
>;
export const listReimbursementClaimsByApprover =
  /* GraphQL */ `query ListReimbursementClaimsByApprover(
  $approverID: ID!
  $status: ReimbursementStatus
  $nextToken: String
) {
  listReimbursementClaimsByApprover(
    approverID: $approverID
    status: $status
    nextToken: $nextToken
  ) {
    items {
      claimID
      userID
      plantID
      orgID
      claimType
      amount
      currency
      description
      category
      expenseDate
      status
      paymentMethod
      bankDetails {
        accountHolderName
        accountNumber
        ifscCode
        bankName
        branchName
        __typename
      }
      upiDetails {
        upiID
        upiName
        __typename
      }
      proofDocuments {
        documentID
        fileName
        fileSize
        mimeType
        documentType
        uploadedAt
        s3Key
        s3Bucket
        __typename
      }
      submittedAt
      submittedBy
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      processedBy
      processedAt
      paidAt
      transactionID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReimbursementClaimsByApproverQueryVariables,
  APITypes.ListReimbursementClaimsByApproverQuery
>;
export const listReimbursementClaimsByStatus =
  /* GraphQL */ `query ListReimbursementClaimsByStatus(
  $status: ReimbursementStatus!
  $plantID: ID
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listReimbursementClaimsByStatus(
    status: $status
    plantID: $plantID
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      claimID
      userID
      plantID
      orgID
      claimType
      amount
      currency
      description
      category
      expenseDate
      status
      paymentMethod
      bankDetails {
        accountHolderName
        accountNumber
        ifscCode
        bankName
        branchName
        __typename
      }
      upiDetails {
        upiID
        upiName
        __typename
      }
      proofDocuments {
        documentID
        fileName
        fileSize
        mimeType
        documentType
        uploadedAt
        s3Key
        s3Bucket
        __typename
      }
      submittedAt
      submittedBy
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      processedBy
      processedAt
      paidAt
      transactionID
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReimbursementClaimsByStatusQueryVariables,
  APITypes.ListReimbursementClaimsByStatusQuery
>;
export const getLeavePolicy =
  /* GraphQL */ `query GetLeavePolicy($orgID: ID!, $leaveType: LeaveType!) {
  getLeavePolicy(orgID: $orgID, leaveType: $leaveType) {
    policyID
    orgID
    plantID
    leaveType
    totalDaysPerYear
    eligibleGenders
    eligibleRoles
    carryForwardAllowed
    maxCarryForwardDays
    minServiceMonths
    maxConsecutiveDays
    requiresApproval
    approvalLevels
    isActive
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLeavePolicyQueryVariables,
  APITypes.GetLeavePolicyQuery
>;
export const listLeavePoliciesByOrg =
  /* GraphQL */ `query ListLeavePoliciesByOrg($orgID: ID!, $nextToken: String) {
  listLeavePoliciesByOrg(orgID: $orgID, nextToken: $nextToken) {
    items {
      policyID
      orgID
      plantID
      leaveType
      totalDaysPerYear
      eligibleGenders
      eligibleRoles
      carryForwardAllowed
      maxCarryForwardDays
      minServiceMonths
      maxConsecutiveDays
      requiresApproval
      approvalLevels
      isActive
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeavePoliciesByOrgQueryVariables,
  APITypes.ListLeavePoliciesByOrgQuery
>;
export const getUserLeaveBalance =
  /* GraphQL */ `query GetUserLeaveBalance($userID: ID!, $year: Int!, $leaveType: LeaveType!) {
  getUserLeaveBalance(userID: $userID, year: $year, leaveType: $leaveType) {
    balanceID
    userID
    year
    leaveType
    totalAllocated
    used
    pending
    available
    carryForward
    lastUpdated
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserLeaveBalanceQueryVariables,
  APITypes.GetUserLeaveBalanceQuery
>;
export const listUserLeaveBalances =
  /* GraphQL */ `query ListUserLeaveBalances($userID: ID!, $year: Int!, $nextToken: String) {
  listUserLeaveBalances(userID: $userID, year: $year, nextToken: $nextToken) {
    items {
      balanceID
      userID
      year
      leaveType
      totalAllocated
      used
      pending
      available
      carryForward
      lastUpdated
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserLeaveBalancesQueryVariables,
  APITypes.ListUserLeaveBalancesQuery
>;
export const listLeaveBalances = /* GraphQL */ `query ListLeaveBalances(
  $year: Int!
  $leaveType: LeaveType
  $nextToken: String
) {
  listLeaveBalances(year: $year, leaveType: $leaveType, nextToken: $nextToken) {
    items {
      balanceID
      userID
      year
      leaveType
      totalAllocated
      used
      pending
      available
      carryForward
      lastUpdated
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeaveBalancesQueryVariables,
  APITypes.ListLeaveBalancesQuery
>;
export const getLeaveApplication =
  /* GraphQL */ `query GetLeaveApplication($applicationID: ID!) {
  getLeaveApplication(applicationID: $applicationID) {
    applicationID
    userID
    orgID
    plantID
    officeID
    leaveType
    startDate
    endDate
    totalDays
    reason
    status
    appliedAt
    approvedBy
    approvedAt
    rejectedBy
    rejectedAt
    rejectionReason
    cancelledAt
    cancelledBy
    cancellationReason
    attachments {
      attachmentID
      fileName
      fileSize
      mimeType
      s3Key
      uploadedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLeaveApplicationQueryVariables,
  APITypes.GetLeaveApplicationQuery
>;
export const listLeaveApplicationsByUser =
  /* GraphQL */ `query ListLeaveApplicationsByUser(
  $userID: ID!
  $status: LeaveStatus
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listLeaveApplicationsByUser(
    userID: $userID
    status: $status
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      applicationID
      userID
      orgID
      plantID
      officeID
      leaveType
      startDate
      endDate
      totalDays
      reason
      status
      appliedAt
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      cancelledAt
      cancelledBy
      cancellationReason
      attachments {
        attachmentID
        fileName
        fileSize
        mimeType
        s3Key
        uploadedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeaveApplicationsByUserQueryVariables,
  APITypes.ListLeaveApplicationsByUserQuery
>;
export const listLeaveApplicationsByApprover =
  /* GraphQL */ `query ListLeaveApplicationsByApprover(
  $approverID: ID!
  $status: LeaveStatus
  $nextToken: String
) {
  listLeaveApplicationsByApprover(
    approverID: $approverID
    status: $status
    nextToken: $nextToken
  ) {
    items {
      applicationID
      userID
      orgID
      plantID
      officeID
      leaveType
      startDate
      endDate
      totalDays
      reason
      status
      appliedAt
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      cancelledAt
      cancelledBy
      cancellationReason
      attachments {
        attachmentID
        fileName
        fileSize
        mimeType
        s3Key
        uploadedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeaveApplicationsByApproverQueryVariables,
  APITypes.ListLeaveApplicationsByApproverQuery
>;
export const listLeaveApplications = /* GraphQL */ `query ListLeaveApplications(
  $status: LeaveStatus
  $month: String
  $nextToken: String
) {
  listLeaveApplications(status: $status, month: $month, nextToken: $nextToken) {
    items {
      applicationID
      userID
      orgID
      plantID
      officeID
      leaveType
      startDate
      endDate
      totalDays
      reason
      status
      appliedAt
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      cancelledAt
      cancelledBy
      cancellationReason
      attachments {
        attachmentID
        fileName
        fileSize
        mimeType
        s3Key
        uploadedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeaveApplicationsQueryVariables,
  APITypes.ListLeaveApplicationsQuery
>;
export const listLeaveApplicationsByStatus =
  /* GraphQL */ `query ListLeaveApplicationsByStatus(
  $status: LeaveStatus!
  $startDate: AWSDate
  $endDate: AWSDate
  $nextToken: String
) {
  listLeaveApplicationsByStatus(
    status: $status
    startDate: $startDate
    endDate: $endDate
    nextToken: $nextToken
  ) {
    items {
      applicationID
      userID
      orgID
      plantID
      officeID
      leaveType
      startDate
      endDate
      totalDays
      reason
      status
      appliedAt
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      cancelledAt
      cancelledBy
      cancellationReason
      attachments {
        attachmentID
        fileName
        fileSize
        mimeType
        s3Key
        uploadedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeaveApplicationsByStatusQueryVariables,
  APITypes.ListLeaveApplicationsByStatusQuery
>;
export const getPlantLeaveCalendar = /* GraphQL */ `query GetPlantLeaveCalendar(
  $plantID: ID!
  $startDate: AWSDate!
  $endDate: AWSDate!
) {
  getPlantLeaveCalendar(
    plantID: $plantID
    startDate: $startDate
    endDate: $endDate
  ) {
    date
    userID
    userName
    leaveType
    applicationID
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPlantLeaveCalendarQueryVariables,
  APITypes.GetPlantLeaveCalendarQuery
>;
export const getUserLeaveCalendar = /* GraphQL */ `query GetUserLeaveCalendar(
  $userID: ID!
  $startDate: AWSDate!
  $endDate: AWSDate!
) {
  getUserLeaveCalendar(
    userID: $userID
    startDate: $startDate
    endDate: $endDate
  ) {
    date
    userID
    userName
    leaveType
    applicationID
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserLeaveCalendarQueryVariables,
  APITypes.GetUserLeaveCalendarQuery
>;
export const getUnifiedAttendanceData =
  /* GraphQL */ `query GetUnifiedAttendanceData(
  $userID: ID!
  $startDate: AWSDate!
  $endDate: AWSDate!
  $officeID: ID
) {
  getUnifiedAttendanceData(
    userID: $userID
    startDate: $startDate
    endDate: $endDate
    officeID: $officeID
  ) {
    attendanceRecords {
      userID
      orgID
      plantID
      officeID
      date
      status
      checkInAt
      checkOutAt
      punchCount
      lastPunchType
      lastPunchAt
      notes
      markedByUserID
      createdAt
      updatedAt
      __typename
    }
    punchRecords {
      userID
      orgID
      plantID
      officeID
      date
      type
      ts
      source
      method
      location
      markedByUserID
      notes
      createdAt
      __typename
    }
    leaveApplications {
      applicationID
      userID
      orgID
      plantID
      officeID
      leaveType
      startDate
      endDate
      totalDays
      reason
      status
      appliedAt
      approvedBy
      approvedAt
      rejectedBy
      rejectedAt
      rejectionReason
      cancelledAt
      cancelledBy
      cancellationReason
      attachments {
        attachmentID
        fileName
        fileSize
        mimeType
        s3Key
        uploadedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    officeCalendarDays {
      officeID
      date
      dayType
      isWorkingDay
      holidayName
      description
      __typename
    }
    statistics {
      totalDays
      presentDays
      absentDays
      leaveDays
      halfDays
      holidayDays
      lateDays
      avgHoursPerDay
      totalHours
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUnifiedAttendanceDataQueryVariables,
  APITypes.GetUnifiedAttendanceDataQuery
>;
export const universalQuery = /* GraphQL */ `query UniversalQuery(
  $tableName: String!
  $filters: [UniversalFilterInput!]
  $limit: Int
  $nextToken: String
  $sortOrder: SortOrder = DESC
) {
  universalQuery(
    tableName: $tableName
    filters: $filters
    limit: $limit
    nextToken: $nextToken
    sortOrder: $sortOrder
  ) {
    success
    message
    data
    tableName
    count
    nextToken
    timestamp
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UniversalQueryQueryVariables,
  APITypes.UniversalQueryQuery
>;
export const universalGroupQuery = /* GraphQL */ `query UniversalGroupQuery(
  $groupName: String
  $includeUsers: Boolean = true
  $includeGroupDetails: Boolean = true
  $limit: Int
  $nextToken: String
) {
  universalGroupQuery(
    groupName: $groupName
    includeUsers: $includeUsers
    includeGroupDetails: $includeGroupDetails
    limit: $limit
    nextToken: $nextToken
  ) {
    success
    message
    groups {
      groupName
      description
      precedence
      roleArn
      userPoolId
      createdAt
      lastModifiedDate
      __typename
    }
    users {
      username
      email
      name
      userType
      role
      status
      enabled
      userCreateDate
      userLastModifiedDate
      __typename
    }
    groupDetails
    timestamp
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UniversalGroupQueryQueryVariables,
  APITypes.UniversalGroupQueryQuery
>;
export const getGenericDocument =
  /* GraphQL */ `query GetGenericDocument($documentID: ID!) {
  getGenericDocument(documentID: $documentID) {
    documentID
    fileName
    fileSize
    mimeType
    documentType
    s3Key
    s3Bucket
    uploadedAt
    uploadedBy
    orgID
    tags
    description
    isPublic
    downloadCount
    expiresAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGenericDocumentQueryVariables,
  APITypes.GetGenericDocumentQuery
>;
export const listGenericDocuments = /* GraphQL */ `query ListGenericDocuments(
  $orgID: ID!
  $documentType: DocumentType
  $tags: [String!]
  $isPublic: Boolean
  $uploadedBy: ID
  $limit: Int = 20
  $nextToken: String
) {
  listGenericDocuments(
    orgID: $orgID
    documentType: $documentType
    tags: $tags
    isPublic: $isPublic
    uploadedBy: $uploadedBy
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      documentID
      fileName
      fileSize
      mimeType
      documentType
      s3Key
      s3Bucket
      uploadedAt
      uploadedBy
      orgID
      tags
      description
      isPublic
      downloadCount
      expiresAt
      __typename
    }
    nextToken
    totalCount
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGenericDocumentsQueryVariables,
  APITypes.ListGenericDocumentsQuery
>;
export const listMyDocuments = /* GraphQL */ `query ListMyDocuments(
  $documentType: DocumentType
  $tags: [String!]
  $limit: Int = 20
  $nextToken: String
) {
  listMyDocuments(
    documentType: $documentType
    tags: $tags
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      documentID
      fileName
      fileSize
      mimeType
      documentType
      s3Key
      s3Bucket
      uploadedAt
      uploadedBy
      orgID
      tags
      description
      isPublic
      downloadCount
      expiresAt
      __typename
    }
    nextToken
    totalCount
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMyDocumentsQueryVariables,
  APITypes.ListMyDocumentsQuery
>;
export const searchDocuments = /* GraphQL */ `query SearchDocuments(
  $orgID: ID!
  $searchText: String!
  $documentType: DocumentType
  $limit: Int = 20
  $nextToken: String
) {
  searchDocuments(
    orgID: $orgID
    searchText: $searchText
    documentType: $documentType
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      documentID
      fileName
      fileSize
      mimeType
      documentType
      s3Key
      s3Bucket
      uploadedAt
      uploadedBy
      orgID
      tags
      description
      isPublic
      downloadCount
      expiresAt
      __typename
    }
    nextToken
    totalCount
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SearchDocumentsQueryVariables,
  APITypes.SearchDocumentsQuery
>;
export const getGenericDocumentDownloadUrl =
  /* GraphQL */ `query GetGenericDocumentDownloadUrl($documentID: ID!) {
  getGenericDocumentDownloadUrl(documentID: $documentID) {
    downloadUrl
    expiresIn
    fileName
    fileSize
    mimeType
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGenericDocumentDownloadUrlQueryVariables,
  APITypes.GetGenericDocumentDownloadUrlQuery
>;
export const deleteGenericDocument =
  /* GraphQL */ `query DeleteGenericDocument($documentID: ID!) {
  deleteGenericDocument(documentID: $documentID)
}
` as GeneratedQuery<
  APITypes.DeleteGenericDocumentQueryVariables,
  APITypes.DeleteGenericDocumentQuery
>;
export const getERPItem =
  /* GraphQL */ `query GetERPItem($pk: ID!, $sk: String!) {
  getERPItem(pk: $pk, sk: $sk) {
    PK
    SK
    entity_type
    data
    createdAt
    updatedAt
    partCode
    partName
    category
    uom
    perUnitTractor
    batchQty
    availableQtyHapur
    partsRequired
    machine {
      X45H2
      X60C2L
      X45C4
      X60C2
      X60C4
      __typename
    }
    availableForTractor
    location
    availableQtyAmount
    suppliers {
      name
      priority
      __typename
    }
    perTractorCost
    price
    priceWithGST
    gstRate
    amountRequired
    advanceAvailable
    leadTimeWeeks
    creditTerms
    orderedQty
    balanceQty
    daysForFirstPayment
    moq
    leadTimeDays
    paymentAtPOPercent
    balancePaymentPercent
    creditDays
    poData {
      poDate
      firstPayment
      deliveryDate
      balancePaymentDays
      secondPaymentDays
      secondPaymentAmount
      __typename
    }
    orderingPlan {
      week
      month
      quantity
      year
      weekNumber
      poDate
      firstPaymentDate
      deliveryDate
      balancePaymentDays
      secondPaymentDays
      firstPaymentAmount
      secondPaymentAmount
      paymentStatus
      __typename
    }
    leadTimePlan {
      week
      month
      quantity
      year
      weekNumber
      poDate
      firstPaymentDate
      deliveryDate
      balancePaymentDays
      secondPaymentDays
      firstPaymentAmount
      secondPaymentAmount
      paymentStatus
      __typename
    }
    paymentPlan {
      week
      month
      quantity
      year
      weekNumber
      poDate
      firstPaymentDate
      deliveryDate
      balancePaymentDays
      secondPaymentDays
      firstPaymentAmount
      secondPaymentAmount
      paymentStatus
      __typename
    }
    paymentPlanWithTaxes {
      week
      month
      quantity
      year
      weekNumber
      poDate
      firstPaymentDate
      deliveryDate
      balancePaymentDays
      secondPaymentDays
      firstPaymentAmount
      secondPaymentAmount
      paymentStatus
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetERPItemQueryVariables,
  APITypes.GetERPItemQuery
>;
export const listERPItemsByPK = /* GraphQL */ `query ListERPItemsByPK(
  $pk: ID!
  $skBeginsWith: String
  $limit: Int
  $nextToken: String
) {
  listERPItemsByPK(
    pk: $pk
    skBeginsWith: $skBeginsWith
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      PK
      SK
      entity_type
      data
      createdAt
      updatedAt
      partCode
      partName
      category
      uom
      perUnitTractor
      batchQty
      availableQtyHapur
      partsRequired
      machine {
        X45H2
        X60C2L
        X45C4
        X60C2
        X60C4
        __typename
      }
      availableForTractor
      location
      availableQtyAmount
      suppliers {
        name
        priority
        __typename
      }
      perTractorCost
      price
      priceWithGST
      gstRate
      amountRequired
      advanceAvailable
      leadTimeWeeks
      creditTerms
      orderedQty
      balanceQty
      daysForFirstPayment
      moq
      leadTimeDays
      paymentAtPOPercent
      balancePaymentPercent
      creditDays
      poData {
        poDate
        firstPayment
        deliveryDate
        balancePaymentDays
        secondPaymentDays
        secondPaymentAmount
        __typename
      }
      orderingPlan {
        week
        month
        quantity
        year
        weekNumber
        poDate
        firstPaymentDate
        deliveryDate
        balancePaymentDays
        secondPaymentDays
        firstPaymentAmount
        secondPaymentAmount
        paymentStatus
        __typename
      }
      leadTimePlan {
        week
        month
        quantity
        year
        weekNumber
        poDate
        firstPaymentDate
        deliveryDate
        balancePaymentDays
        secondPaymentDays
        firstPaymentAmount
        secondPaymentAmount
        paymentStatus
        __typename
      }
      paymentPlan {
        week
        month
        quantity
        year
        weekNumber
        poDate
        firstPaymentDate
        deliveryDate
        balancePaymentDays
        secondPaymentDays
        firstPaymentAmount
        secondPaymentAmount
        paymentStatus
        __typename
      }
      paymentPlanWithTaxes {
        week
        month
        quantity
        year
        weekNumber
        poDate
        firstPaymentDate
        deliveryDate
        balancePaymentDays
        secondPaymentDays
        firstPaymentAmount
        secondPaymentAmount
        paymentStatus
        __typename
      }
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListERPItemsByPKQueryVariables,
  APITypes.ListERPItemsByPKQuery
>;
export const getBooking = /* GraphQL */ `query GetBooking($bookingID: ID!) {
  getBooking(bookingID: $bookingID) {
    bookingID
    firstName
    lastName
    email
    phoneNumber
    city
    country
    state
    subject
    message
    visitType
    preferredDate
    preferredTime
    status
    createdAt
    updatedAt
    assignedTo
    notes
    orgID
    plantID
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetBookingQueryVariables,
  APITypes.GetBookingQuery
>;
export const listBookings =
  /* GraphQL */ `query ListBookings($input: ListBookingsInput!) {
  listBookings(input: $input) {
    items {
      bookingID
      firstName
      lastName
      email
      phoneNumber
      city
      country
      state
      subject
      message
      visitType
      preferredDate
      preferredTime
      status
      createdAt
      updatedAt
      assignedTo
      notes
      orgID
      plantID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBookingsQueryVariables,
  APITypes.ListBookingsQuery
>;
export const listBookingsByOrg = /* GraphQL */ `query ListBookingsByOrg(
  $orgID: ID!
  $status: BookingStatus
  $limit: Int
  $nextToken: String
) {
  listBookingsByOrg(
    orgID: $orgID
    status: $status
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      bookingID
      firstName
      lastName
      email
      phoneNumber
      city
      country
      state
      subject
      message
      visitType
      preferredDate
      preferredTime
      status
      createdAt
      updatedAt
      assignedTo
      notes
      orgID
      plantID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBookingsByOrgQueryVariables,
  APITypes.ListBookingsByOrgQuery
>;
export const listBookingsByPlant = /* GraphQL */ `query ListBookingsByPlant(
  $plantID: ID!
  $status: BookingStatus
  $limit: Int
  $nextToken: String
) {
  listBookingsByPlant(
    plantID: $plantID
    status: $status
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      bookingID
      firstName
      lastName
      email
      phoneNumber
      city
      country
      state
      subject
      message
      visitType
      preferredDate
      preferredTime
      status
      createdAt
      updatedAt
      assignedTo
      notes
      orgID
      plantID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBookingsByPlantQueryVariables,
  APITypes.ListBookingsByPlantQuery
>;
export const listBookingsByStatus = /* GraphQL */ `query ListBookingsByStatus(
  $status: BookingStatus!
  $limit: Int
  $nextToken: String
) {
  listBookingsByStatus(status: $status, limit: $limit, nextToken: $nextToken) {
    items {
      bookingID
      firstName
      lastName
      email
      phoneNumber
      city
      country
      state
      subject
      message
      visitType
      preferredDate
      preferredTime
      status
      createdAt
      updatedAt
      assignedTo
      notes
      orgID
      plantID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBookingsByStatusQueryVariables,
  APITypes.ListBookingsByStatusQuery
>;
export const listBookingsByAssignee =
  /* GraphQL */ `query ListBookingsByAssignee(
  $assignedTo: ID!
  $limit: Int
  $nextToken: String
) {
  listBookingsByAssignee(
    assignedTo: $assignedTo
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      bookingID
      firstName
      lastName
      email
      phoneNumber
      city
      country
      state
      subject
      message
      visitType
      preferredDate
      preferredTime
      status
      createdAt
      updatedAt
      assignedTo
      notes
      orgID
      plantID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBookingsByAssigneeQueryVariables,
  APITypes.ListBookingsByAssigneeQuery
>;
export const listBookingsByDateRange =
  /* GraphQL */ `query ListBookingsByDateRange(
  $startDate: AWSDate!
  $endDate: AWSDate!
  $limit: Int
  $nextToken: String
) {
  listBookingsByDateRange(
    startDate: $startDate
    endDate: $endDate
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      bookingID
      firstName
      lastName
      email
      phoneNumber
      city
      country
      state
      subject
      message
      visitType
      preferredDate
      preferredTime
      status
      createdAt
      updatedAt
      assignedTo
      notes
      orgID
      plantID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBookingsByDateRangeQueryVariables,
  APITypes.ListBookingsByDateRangeQuery
>;
