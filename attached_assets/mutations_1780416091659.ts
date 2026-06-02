/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from './API';
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createOrganization =
  /* GraphQL */ `mutation CreateOrganization($input: CreateOrganizationInput!) {
  createOrganization(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateOrganizationMutationVariables,
    APITypes.CreateOrganizationMutation
  >;
export const updateOrganization =
  /* GraphQL */ `mutation UpdateOrganization($input: UpdateOrganizationInput!) {
  updateOrganization(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateOrganizationMutationVariables,
    APITypes.UpdateOrganizationMutation
  >;
export const deleteOrganization =
  /* GraphQL */ `mutation DeleteOrganization($orgID: ID!) {
  deleteOrganization(orgID: $orgID) {
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
` as GeneratedMutation<
    APITypes.DeleteOrganizationMutationVariables,
    APITypes.DeleteOrganizationMutation
  >;
export const createPlant =
  /* GraphQL */ `mutation CreatePlant($input: CreatePlantInput!) {
  createPlant(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreatePlantMutationVariables,
    APITypes.CreatePlantMutation
  >;
export const updatePlant =
  /* GraphQL */ `mutation UpdatePlant($input: UpdatePlantInput!) {
  updatePlant(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdatePlantMutationVariables,
    APITypes.UpdatePlantMutation
  >;
export const deletePlant =
  /* GraphQL */ `mutation DeletePlant($orgID: ID!, $plantID: ID!) {
  deletePlant(orgID: $orgID, plantID: $plantID) {
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
` as GeneratedMutation<
    APITypes.DeletePlantMutationVariables,
    APITypes.DeletePlantMutation
  >;
export const createUser =
  /* GraphQL */ `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateUserMutationVariables,
    APITypes.CreateUserMutation
  >;
export const updateUser =
  /* GraphQL */ `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateUserMutationVariables,
    APITypes.UpdateUserMutation
  >;
export const deleteUser = /* GraphQL */ `mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const savePushToken =
  /* GraphQL */ `mutation SavePushToken($userId: ID!, $pushToken: String) {
  savePushToken(userId: $userId, pushToken: $pushToken) {
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
` as GeneratedMutation<
    APITypes.SavePushTokenMutationVariables,
    APITypes.SavePushTokenMutation
  >;
export const sendPushNotification =
  /* GraphQL */ `mutation SendPushNotification($input: SendPushNotificationInput!) {
  sendPushNotification(input: $input) {
    success
    message
    sent
    __typename
  }
}
` as GeneratedMutation<
    APITypes.SendPushNotificationMutationVariables,
    APITypes.SendPushNotificationMutation
  >;
export const notifyPlantTechnicalSupervisor =
  /* GraphQL */ `mutation NotifyPlantTechnicalSupervisor(
  $input: NotifyPlantTechnicalSupervisorInput!
) {
  notifyPlantTechnicalSupervisor(input: $input) {
    success
    message
    notifiedSupervisors
    notificationSentAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.NotifyPlantTechnicalSupervisorMutationVariables,
    APITypes.NotifyPlantTechnicalSupervisorMutation
  >;
export const connectToUSBDevice =
  /* GraphQL */ `mutation ConnectToUSBDevice($deviceName: String!, $baudRate: Int) {
  connectToUSBDevice(deviceName: $deviceName, baudRate: $baudRate) {
    success
    message
    deviceName
    __typename
  }
}
` as GeneratedMutation<
    APITypes.ConnectToUSBDeviceMutationVariables,
    APITypes.ConnectToUSBDeviceMutation
  >;
export const disconnectFromUSBDevice =
  /* GraphQL */ `mutation DisconnectFromUSBDevice($deviceName: String!) {
  disconnectFromUSBDevice(deviceName: $deviceName) {
    success
    message
    deviceName
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DisconnectFromUSBDeviceMutationVariables,
    APITypes.DisconnectFromUSBDeviceMutation
  >;
export const writeToUSBDevice =
  /* GraphQL */ `mutation WriteToUSBDevice($deviceName: String!, $data: String!) {
  writeToUSBDevice(deviceName: $deviceName, data: $data) {
    success
    message
    deviceName
    __typename
  }
}
` as GeneratedMutation<
    APITypes.WriteToUSBDeviceMutationVariables,
    APITypes.WriteToUSBDeviceMutation
  >;
export const connectAllUSBDevices =
  /* GraphQL */ `mutation ConnectAllUSBDevices($baudRate: Int) {
  connectAllUSBDevices(baudRate: $baudRate) {
    success
    message
    deviceName
    __typename
  }
}
` as GeneratedMutation<
    APITypes.ConnectAllUSBDevicesMutationVariables,
    APITypes.ConnectAllUSBDevicesMutation
  >;
export const disconnectAllUSBDevices =
  /* GraphQL */ `mutation DisconnectAllUSBDevices {
  disconnectAllUSBDevices {
    success
    message
    deviceName
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DisconnectAllUSBDevicesMutationVariables,
    APITypes.DisconnectAllUSBDevicesMutation
  >;
export const createERPItem =
  /* GraphQL */ `mutation CreateERPItem($input: CreateERPItemInput!) {
  createERPItem(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateERPItemMutationVariables,
    APITypes.CreateERPItemMutation
  >;
export const updateERPItem =
  /* GraphQL */ `mutation UpdateERPItem($input: UpdateERPItemInput!) {
  updateERPItem(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateERPItemMutationVariables,
    APITypes.UpdateERPItemMutation
  >;
export const deleteERPItem =
  /* GraphQL */ `mutation DeleteERPItem($pk: ID!, $sk: String!) {
  deleteERPItem(pk: $pk, sk: $sk) {
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
` as GeneratedMutation<
    APITypes.DeleteERPItemMutationVariables,
    APITypes.DeleteERPItemMutation
  >;
export const generateMonthlyPlan =
  /* GraphQL */ `mutation GenerateMonthlyPlan($input: GenerateMonthlyPlanInput!) {
  generateMonthlyPlan(input: $input) {
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
` as GeneratedMutation<
    APITypes.GenerateMonthlyPlanMutationVariables,
    APITypes.GenerateMonthlyPlanMutation
  >;
export const updateWeeklyPaymentPlan =
  /* GraphQL */ `mutation UpdateWeeklyPaymentPlan($input: UpdateWeeklyPaymentPlanInput!) {
  updateWeeklyPaymentPlan(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateWeeklyPaymentPlanMutationVariables,
    APITypes.UpdateWeeklyPaymentPlanMutation
  >;
export const updateMonthlyProgression =
  /* GraphQL */ `mutation UpdateMonthlyProgression($input: UpdateMonthlyProgressionInput!) {
  updateMonthlyProgression(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateMonthlyProgressionMutationVariables,
    APITypes.UpdateMonthlyProgressionMutation
  >;
export const createCognitoUser =
  /* GraphQL */ `mutation CreateCognitoUser($input: CreateCognitoUserInput!) {
  createCognitoUser(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateCognitoUserMutationVariables,
    APITypes.CreateCognitoUserMutation
  >;
export const updateCognitoUser =
  /* GraphQL */ `mutation UpdateCognitoUser($input: UpdateCognitoUserInput!) {
  updateCognitoUser(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateCognitoUserMutationVariables,
    APITypes.UpdateCognitoUserMutation
  >;
export const deleteCognitoUser =
  /* GraphQL */ `mutation DeleteCognitoUser($username: String!) {
  deleteCognitoUser(username: $username) {
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
` as GeneratedMutation<
    APITypes.DeleteCognitoUserMutationVariables,
    APITypes.DeleteCognitoUserMutation
  >;
export const disableCognitoUser =
  /* GraphQL */ `mutation DisableCognitoUser($username: String!) {
  disableCognitoUser(username: $username) {
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
` as GeneratedMutation<
    APITypes.DisableCognitoUserMutationVariables,
    APITypes.DisableCognitoUserMutation
  >;
export const enableCognitoUser =
  /* GraphQL */ `mutation EnableCognitoUser($username: String!) {
  enableCognitoUser(username: $username) {
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
` as GeneratedMutation<
    APITypes.EnableCognitoUserMutationVariables,
    APITypes.EnableCognitoUserMutation
  >;
export const createCognitoGroup =
  /* GraphQL */ `mutation CreateCognitoGroup($groupName: String!, $description: String) {
  createCognitoGroup(groupName: $groupName, description: $description) {
    success
    message
    group {
      groupName
      description
      precedence
      roleArn
      userPoolId
      createdAt
      lastModifiedDate
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateCognitoGroupMutationVariables,
    APITypes.CreateCognitoGroupMutation
  >;
export const deleteCognitoGroup =
  /* GraphQL */ `mutation DeleteCognitoGroup($groupName: String!) {
  deleteCognitoGroup(groupName: $groupName) {
    success
    message
    group {
      groupName
      description
      precedence
      roleArn
      userPoolId
      createdAt
      lastModifiedDate
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DeleteCognitoGroupMutationVariables,
    APITypes.DeleteCognitoGroupMutation
  >;
export const updateCognitoGroup = /* GraphQL */ `mutation UpdateCognitoGroup(
  $groupName: String!
  $newGroupName: String
  $description: String
) {
  updateCognitoGroup(
    groupName: $groupName
    newGroupName: $newGroupName
    description: $description
  ) {
    success
    message
    group {
      groupName
      description
      precedence
      roleArn
      userPoolId
      createdAt
      lastModifiedDate
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCognitoGroupMutationVariables,
  APITypes.UpdateCognitoGroupMutation
>;
export const assignUserToCognitoGroup =
  /* GraphQL */ `mutation AssignUserToCognitoGroup($username: String!, $groupName: String!) {
  assignUserToCognitoGroup(username: $username, groupName: $groupName) {
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
` as GeneratedMutation<
    APITypes.AssignUserToCognitoGroupMutationVariables,
    APITypes.AssignUserToCognitoGroupMutation
  >;
export const removeUserFromCognitoGroup =
  /* GraphQL */ `mutation RemoveUserFromCognitoGroup($username: String!, $groupName: String!) {
  removeUserFromCognitoGroup(username: $username, groupName: $groupName) {
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
` as GeneratedMutation<
    APITypes.RemoveUserFromCognitoGroupMutationVariables,
    APITypes.RemoveUserFromCognitoGroupMutation
  >;
export const bulkAssignUsersToGroup =
  /* GraphQL */ `mutation BulkAssignUsersToGroup($usernames: [String!]!, $groupName: String!) {
  bulkAssignUsersToGroup(usernames: $usernames, groupName: $groupName) {
    success
    message
    successCount
    failureCount
    errors
    __typename
  }
}
` as GeneratedMutation<
    APITypes.BulkAssignUsersToGroupMutationVariables,
    APITypes.BulkAssignUsersToGroupMutation
  >;
export const bulkRemoveUsersFromGroup =
  /* GraphQL */ `mutation BulkRemoveUsersFromGroup($usernames: [String!]!, $groupName: String!) {
  bulkRemoveUsersFromGroup(usernames: $usernames, groupName: $groupName) {
    success
    message
    successCount
    failureCount
    errors
    __typename
  }
}
` as GeneratedMutation<
    APITypes.BulkRemoveUsersFromGroupMutationVariables,
    APITypes.BulkRemoveUsersFromGroupMutation
  >;
export const assignUserToOffice =
  /* GraphQL */ `mutation AssignUserToOffice($input: AssignUserToOfficeInput!) {
  assignUserToOffice(input: $input) {
    id
    userID
    name
    email
    phone
    userType
    role
    orgID
    plantID
    accessiblePlantIDs
    status
    pushToken
    cognitoGroups
    createdAt
    updatedAt
    assignedOfficeID
    officeAssignedBy
    officeAssignedAt
    officeAssignmentNotes
    success
    message
    __typename
  }
}
` as GeneratedMutation<
    APITypes.AssignUserToOfficeMutationVariables,
    APITypes.AssignUserToOfficeMutation
  >;
export const unassignUserFromOffice =
  /* GraphQL */ `mutation UnassignUserFromOffice($userID: ID!) {
  unassignUserFromOffice(userID: $userID) {
    id
    userID
    name
    email
    phone
    userType
    role
    orgID
    plantID
    accessiblePlantIDs
    status
    pushToken
    cognitoGroups
    createdAt
    updatedAt
    assignedOfficeID
    officeAssignedBy
    officeAssignedAt
    officeAssignmentNotes
    success
    message
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UnassignUserFromOfficeMutationVariables,
    APITypes.UnassignUserFromOfficeMutation
  >;
export const bulkAssignUsersToOffice =
  /* GraphQL */ `mutation BulkAssignUsersToOffice($input: BulkAssignUsersToOfficeInput!) {
  bulkAssignUsersToOffice(input: $input) {
    id
    userID
    name
    email
    phone
    userType
    role
    orgID
    plantID
    accessiblePlantIDs
    status
    pushToken
    cognitoGroups
    createdAt
    updatedAt
    assignedOfficeID
    officeAssignedBy
    officeAssignedAt
    officeAssignmentNotes
    success
    message
    __typename
  }
}
` as GeneratedMutation<
    APITypes.BulkAssignUsersToOfficeMutationVariables,
    APITypes.BulkAssignUsersToOfficeMutation
  >;
export const createTractor =
  /* GraphQL */ `mutation CreateTractor($input: CreateTractorInput!) {
  createTractor(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateTractorMutationVariables,
    APITypes.CreateTractorMutation
  >;
export const updateTractor =
  /* GraphQL */ `mutation UpdateTractor($input: UpdateTractorInput!) {
  updateTractor(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateTractorMutationVariables,
    APITypes.UpdateTractorMutation
  >;
export const deleteTractor =
  /* GraphQL */ `mutation DeleteTractor($input: DeleteTractorInput!) {
  deleteTractor(input: $input) {
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
` as GeneratedMutation<
    APITypes.DeleteTractorMutationVariables,
    APITypes.DeleteTractorMutation
  >;
export const createTractorDocument =
  /* GraphQL */ `mutation CreateTractorDocument($input: CreateTractorDocumentInput!) {
  createTractorDocument(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateTractorDocumentMutationVariables,
    APITypes.CreateTractorDocumentMutation
  >;
export const updateTractorDocument =
  /* GraphQL */ `mutation UpdateTractorDocument($input: UpdateTractorDocumentInput!) {
  updateTractorDocument(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateTractorDocumentMutationVariables,
    APITypes.UpdateTractorDocumentMutation
  >;
export const uploadUsageSegment =
  /* GraphQL */ `mutation UploadUsageSegment($input: UploadUsageSegmentInput!) {
  uploadUsageSegment(input: $input) {
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
` as GeneratedMutation<
    APITypes.UploadUsageSegmentMutationVariables,
    APITypes.UploadUsageSegmentMutation
  >;
export const deleteUsageSegment =
  /* GraphQL */ `mutation DeleteUsageSegment($input: DeleteUsageSegmentInput!) {
  deleteUsageSegment(input: $input) {
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
` as GeneratedMutation<
    APITypes.DeleteUsageSegmentMutationVariables,
    APITypes.DeleteUsageSegmentMutation
  >;
export const uploadAnalytics =
  /* GraphQL */ `mutation UploadAnalytics($input: UploadAnalyticsInput!) {
  uploadAnalytics(input: $input) {
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
` as GeneratedMutation<
    APITypes.UploadAnalyticsMutationVariables,
    APITypes.UploadAnalyticsMutation
  >;
export const deleteAnalytics =
  /* GraphQL */ `mutation DeleteAnalytics($input: DeleteAnalyticsInput!) {
  deleteAnalytics(input: $input) {
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
` as GeneratedMutation<
    APITypes.DeleteAnalyticsMutationVariables,
    APITypes.DeleteAnalyticsMutation
  >;
export const createLogger =
  /* GraphQL */ `mutation CreateLogger($input: CreateLoggerInput!) {
  createLogger(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateLoggerMutationVariables,
    APITypes.CreateLoggerMutation
  >;
export const updateLogger =
  /* GraphQL */ `mutation UpdateLogger($input: UpdateLoggerInput!) {
  updateLogger(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateLoggerMutationVariables,
    APITypes.UpdateLoggerMutation
  >;
export const createDriver =
  /* GraphQL */ `mutation CreateDriver($input: CreateDriverInput!) {
  createDriver(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateDriverMutationVariables,
    APITypes.CreateDriverMutation
  >;
export const updateDriver =
  /* GraphQL */ `mutation UpdateDriver($input: UpdateDriverInput!) {
  updateDriver(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateDriverMutationVariables,
    APITypes.UpdateDriverMutation
  >;
export const deleteDriver =
  /* GraphQL */ `mutation DeleteDriver($driverID: ID!) {
  deleteDriver(driverID: $driverID) {
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
` as GeneratedMutation<
    APITypes.DeleteDriverMutationVariables,
    APITypes.DeleteDriverMutation
  >;
export const markDriverAttendance =
  /* GraphQL */ `mutation MarkDriverAttendance($input: MarkAttendanceInput!) {
  markDriverAttendance(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.MarkDriverAttendanceMutationVariables,
    APITypes.MarkDriverAttendanceMutation
  >;
export const assignDriverToTractor =
  /* GraphQL */ `mutation AssignDriverToTractor($input: AssignDriverInput!) {
  assignDriverToTractor(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.AssignDriverToTractorMutationVariables,
    APITypes.AssignDriverToTractorMutation
  >;
export const cancelDriverAssignment =
  /* GraphQL */ `mutation CancelDriverAssignment($input: CancelDriverAssignmentInput!) {
  cancelDriverAssignment(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.CancelDriverAssignmentMutationVariables,
    APITypes.CancelDriverAssignmentMutation
  >;
export const endDriverAssignmentByKey =
  /* GraphQL */ `mutation EndDriverAssignmentByKey($input: EndDriverAssignmentInput!) {
  endDriverAssignmentByKey(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.EndDriverAssignmentByKeyMutationVariables,
    APITypes.EndDriverAssignmentByKeyMutation
  >;
export const createComplianceRecord =
  /* GraphQL */ `mutation CreateComplianceRecord($input: CreateComplianceInput!) {
  createComplianceRecord(input: $input) {
    driverID
    type
    dueDate
    status
    notes
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateComplianceRecordMutationVariables,
    APITypes.CreateComplianceRecordMutation
  >;
export const updateComplianceRecord =
  /* GraphQL */ `mutation UpdateComplianceRecord($input: UpdateComplianceInput!) {
  updateComplianceRecord(input: $input) {
    driverID
    type
    dueDate
    status
    notes
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateComplianceRecordMutationVariables,
    APITypes.UpdateComplianceRecordMutation
  >;
export const deleteComplianceRecord =
  /* GraphQL */ `mutation DeleteComplianceRecord($input: DeleteComplianceInput!) {
  deleteComplianceRecord(input: $input) {
    driverID
    type
    dueDate
    status
    notes
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DeleteComplianceRecordMutationVariables,
    APITypes.DeleteComplianceRecordMutation
  >;
export const logPerformance =
  /* GraphQL */ `mutation LogPerformance($input: LogPerformanceInput!) {
  logPerformance(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.LogPerformanceMutationVariables,
    APITypes.LogPerformanceMutation
  >;
export const createService =
  /* GraphQL */ `mutation CreateService($input: CreateServiceInput!) {
  createService(input: $input) {
    vin
    serviceID
    serviceDate
    issueType
    description
    reportedBy
    resolvedBy
    resolvedAt
    resolutionNotes
    componentSerialsInvolved
    status
    createdAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateServiceMutationVariables,
    APITypes.CreateServiceMutation
  >;
export const updateService =
  /* GraphQL */ `mutation UpdateService($input: UpdateServiceInput!) {
  updateService(input: $input) {
    vin
    serviceID
    serviceDate
    issueType
    description
    reportedBy
    resolvedBy
    resolvedAt
    resolutionNotes
    componentSerialsInvolved
    status
    createdAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateServiceMutationVariables,
    APITypes.UpdateServiceMutation
  >;
export const reworkService =
  /* GraphQL */ `mutation ReworkService($input: ReworkServiceInput!) {
  reworkService(input: $input) {
    vin
    serviceID
    serviceDate
    issueType
    description
    reportedBy
    resolvedBy
    resolvedAt
    resolutionNotes
    componentSerialsInvolved
    status
    createdAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.ReworkServiceMutationVariables,
    APITypes.ReworkServiceMutation
  >;
export const createComplaint =
  /* GraphQL */ `mutation CreateComplaint($input: CreateComplaintInput!) {
  createComplaint(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateComplaintMutationVariables,
    APITypes.CreateComplaintMutation
  >;
export const verifyComplaint =
  /* GraphQL */ `mutation VerifyComplaint($input: VerifyComplaintInput!) {
  verifyComplaint(input: $input) {
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
` as GeneratedMutation<
    APITypes.VerifyComplaintMutationVariables,
    APITypes.VerifyComplaintMutation
  >;
export const categorizeComplaint =
  /* GraphQL */ `mutation CategorizeComplaint($input: CategorizeComplaintInput!) {
  categorizeComplaint(input: $input) {
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
` as GeneratedMutation<
    APITypes.CategorizeComplaintMutationVariables,
    APITypes.CategorizeComplaintMutation
  >;
export const assignComplaint =
  /* GraphQL */ `mutation AssignComplaint($input: AssignComplaintInput!) {
  assignComplaint(input: $input) {
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
` as GeneratedMutation<
    APITypes.AssignComplaintMutationVariables,
    APITypes.AssignComplaintMutation
  >;
export const startResolution =
  /* GraphQL */ `mutation StartResolution($input: StartResolutionInput!) {
  startResolution(input: $input) {
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
` as GeneratedMutation<
    APITypes.StartResolutionMutationVariables,
    APITypes.StartResolutionMutation
  >;
export const addResolutionNote =
  /* GraphQL */ `mutation AddResolutionNote($input: AddResolutionNoteInput!) {
  addResolutionNote(input: $input) {
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
` as GeneratedMutation<
    APITypes.AddResolutionNoteMutationVariables,
    APITypes.AddResolutionNoteMutation
  >;
export const addComplaintAttachment =
  /* GraphQL */ `mutation AddComplaintAttachment($input: AddAttachmentInput!) {
  addComplaintAttachment(input: $input) {
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
` as GeneratedMutation<
    APITypes.AddComplaintAttachmentMutationVariables,
    APITypes.AddComplaintAttachmentMutation
  >;
export const resolveComplaint =
  /* GraphQL */ `mutation ResolveComplaint($input: ResolveComplaintInput!) {
  resolveComplaint(input: $input) {
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
` as GeneratedMutation<
    APITypes.ResolveComplaintMutationVariables,
    APITypes.ResolveComplaintMutation
  >;
export const closeComplaint =
  /* GraphQL */ `mutation CloseComplaint($input: CloseComplaintInput!) {
  closeComplaint(input: $input) {
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
` as GeneratedMutation<
    APITypes.CloseComplaintMutationVariables,
    APITypes.CloseComplaintMutation
  >;
export const cancelComplaint =
  /* GraphQL */ `mutation CancelComplaint($input: CancelComplaintInput!) {
  cancelComplaint(input: $input) {
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
` as GeneratedMutation<
    APITypes.CancelComplaintMutationVariables,
    APITypes.CancelComplaintMutation
  >;
export const updateComplaintDetails =
  /* GraphQL */ `mutation UpdateComplaintDetails($input: UpdateComplaintDetailsInput!) {
  updateComplaintDetails(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateComplaintDetailsMutationVariables,
    APITypes.UpdateComplaintDetailsMutation
  >;
export const rateComplaint =
  /* GraphQL */ `mutation RateComplaint($input: RateComplaintInput!) {
  rateComplaint(input: $input) {
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
` as GeneratedMutation<
    APITypes.RateComplaintMutationVariables,
    APITypes.RateComplaintMutation
  >;
export const deleteComplaint =
  /* GraphQL */ `mutation DeleteComplaint($complaintID: ID!) {
  deleteComplaint(complaintID: $complaintID) {
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
` as GeneratedMutation<
    APITypes.DeleteComplaintMutationVariables,
    APITypes.DeleteComplaintMutation
  >;
export const createJobCard =
  /* GraphQL */ `mutation CreateJobCard($input: CreateJobCardInput!) {
  createJobCard(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateJobCardMutationVariables,
    APITypes.CreateJobCardMutation
  >;
export const updateJobCard =
  /* GraphQL */ `mutation UpdateJobCard($input: UpdateJobCardInput!) {
  updateJobCard(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateJobCardMutationVariables,
    APITypes.UpdateJobCardMutation
  >;
export const recordDelay =
  /* GraphQL */ `mutation RecordDelay($input: RecordDelayInput!) {
  recordDelay(input: $input) {
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
` as GeneratedMutation<
    APITypes.RecordDelayMutationVariables,
    APITypes.RecordDelayMutation
  >;
export const closeJobCard =
  /* GraphQL */ `mutation CloseJobCard($input: CloseJobCardInput!) {
  closeJobCard(input: $input) {
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
` as GeneratedMutation<
    APITypes.CloseJobCardMutationVariables,
    APITypes.CloseJobCardMutation
  >;
export const createPMSSchedule =
  /* GraphQL */ `mutation CreatePMSSchedule($input: CreatePMSScheduleInput!) {
  createPMSSchedule(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreatePMSScheduleMutationVariables,
    APITypes.CreatePMSScheduleMutation
  >;
export const updatePMSSchedule =
  /* GraphQL */ `mutation UpdatePMSSchedule($input: UpdatePMSScheduleInput!) {
  updatePMSSchedule(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdatePMSScheduleMutationVariables,
    APITypes.UpdatePMSScheduleMutation
  >;
export const createPMSTracker =
  /* GraphQL */ `mutation CreatePMSTracker($input: CreatePMSTrackerInput!) {
  createPMSTracker(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreatePMSTrackerMutationVariables,
    APITypes.CreatePMSTrackerMutation
  >;
export const resetPMSTracker =
  /* GraphQL */ `mutation ResetPMSTracker($input: ResetPMSTrackerInput!) {
  resetPMSTracker(input: $input) {
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
` as GeneratedMutation<
    APITypes.ResetPMSTrackerMutationVariables,
    APITypes.ResetPMSTrackerMutation
  >;
export const linkPMSComplaint =
  /* GraphQL */ `mutation LinkPMSComplaint($input: LinkPMSComplaintInput!) {
  linkPMSComplaint(input: $input) {
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
` as GeneratedMutation<
    APITypes.LinkPMSComplaintMutationVariables,
    APITypes.LinkPMSComplaintMutation
  >;
export const createVORRequest =
  /* GraphQL */ `mutation CreateVORRequest($input: CreateVORRequestInput!) {
  createVORRequest(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateVORRequestMutationVariables,
    APITypes.CreateVORRequestMutation
  >;
export const approveVOR =
  /* GraphQL */ `mutation ApproveVOR($input: ApproveVORInput!) {
  approveVOR(input: $input) {
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
` as GeneratedMutation<
    APITypes.ApproveVORMutationVariables,
    APITypes.ApproveVORMutation
  >;
export const dispatchVOR =
  /* GraphQL */ `mutation DispatchVOR($input: DispatchVORInput!) {
  dispatchVOR(input: $input) {
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
` as GeneratedMutation<
    APITypes.DispatchVORMutationVariables,
    APITypes.DispatchVORMutation
  >;
export const deliverVOR =
  /* GraphQL */ `mutation DeliverVOR($input: DeliverVORInput!) {
  deliverVOR(input: $input) {
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
` as GeneratedMutation<
    APITypes.DeliverVORMutationVariables,
    APITypes.DeliverVORMutation
  >;
export const createVendorRequest =
  /* GraphQL */ `mutation CreateVendorRequest($input: CreateVendorRequestInput!) {
  createVendorRequest(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateVendorRequestMutationVariables,
    APITypes.CreateVendorRequestMutation
  >;
export const updateVendorRequest =
  /* GraphQL */ `mutation UpdateVendorRequest($input: UpdateVendorRequestInput!) {
  updateVendorRequest(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateVendorRequestMutationVariables,
    APITypes.UpdateVendorRequestMutation
  >;
export const closeVendorRequest =
  /* GraphQL */ `mutation CloseVendorRequest($input: CloseVendorRequestInput!) {
  closeVendorRequest(input: $input) {
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
` as GeneratedMutation<
    APITypes.CloseVendorRequestMutationVariables,
    APITypes.CloseVendorRequestMutation
  >;
export const createWeeklyCheckSchedule =
  /* GraphQL */ `mutation CreateWeeklyCheckSchedule($input: CreateWeeklyCheckScheduleInput!) {
  createWeeklyCheckSchedule(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateWeeklyCheckScheduleMutationVariables,
    APITypes.CreateWeeklyCheckScheduleMutation
  >;
export const submitWeeklyCheck =
  /* GraphQL */ `mutation SubmitWeeklyCheck($input: SubmitWeeklyCheckInput!) {
  submitWeeklyCheck(input: $input) {
    submissionID
    scheduleID
    tractorVIN
    technicianID
    checklistItems {
      itemID
      description
      status
      notes
      photoURLs
      __typename
    }
    abnormalitiesFound
    submittedAt
    convertedToJobCard
    complaintID
    __typename
  }
}
` as GeneratedMutation<
    APITypes.SubmitWeeklyCheckMutationVariables,
    APITypes.SubmitWeeklyCheckMutation
  >;
export const convertCheckToJobCard =
  /* GraphQL */ `mutation ConvertCheckToJobCard($submissionID: ID!) {
  convertCheckToJobCard(submissionID: $submissionID) {
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
` as GeneratedMutation<
    APITypes.ConvertCheckToJobCardMutationVariables,
    APITypes.ConvertCheckToJobCardMutation
  >;
export const checkPartsAvailability =
  /* GraphQL */ `mutation CheckPartsAvailability($input: CheckPartsAvailabilityInput!) {
  checkPartsAvailability(input: $input) {
    jobCardID
    plantID
    allAvailable
    availableParts {
      sku
      description
      requiredQty
      availableQty
      reservedQty
      isAvailable
      stockLocation
      __typename
    }
    unavailableParts {
      sku
      description
      requiredQty
      availableQty
      reservedQty
      isAvailable
      stockLocation
      __typename
    }
    recommendedAction
    canProceed
    vorRequired
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CheckPartsAvailabilityMutationVariables,
    APITypes.CheckPartsAvailabilityMutation
  >;
export const approveJobCardClosure =
  /* GraphQL */ `mutation ApproveJobCardClosure($input: ApproveJobCardClosureInput!) {
  approveJobCardClosure(input: $input) {
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
` as GeneratedMutation<
    APITypes.ApproveJobCardClosureMutationVariables,
    APITypes.ApproveJobCardClosureMutation
  >;
export const rejectJobCardClosure =
  /* GraphQL */ `mutation RejectJobCardClosure($input: RejectJobCardClosureInput!) {
  rejectJobCardClosure(input: $input) {
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
` as GeneratedMutation<
    APITypes.RejectJobCardClosureMutationVariables,
    APITypes.RejectJobCardClosureMutation
  >;
export const upsertSku =
  /* GraphQL */ `mutation UpsertSku($input: UpsertSkuInput!) {
  upsertSku(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpsertSkuMutationVariables,
    APITypes.UpsertSkuMutation
  >;
export const deleteSku = /* GraphQL */ `mutation DeleteSku($sku: ID!) {
  deleteSku(sku: $sku) {
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
` as GeneratedMutation<
  APITypes.DeleteSkuMutationVariables,
  APITypes.DeleteSkuMutation
>;
export const assignSkuToPlant =
  /* GraphQL */ `mutation AssignSkuToPlant($input: AssignSkuToPlantInput!) {
  assignSkuToPlant(input: $input) {
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
` as GeneratedMutation<
    APITypes.AssignSkuToPlantMutationVariables,
    APITypes.AssignSkuToPlantMutation
  >;
export const setMinStock =
  /* GraphQL */ `mutation SetMinStock($input: SetMinStockInput!) {
  setMinStock(input: $input) {
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
` as GeneratedMutation<
    APITypes.SetMinStockMutationVariables,
    APITypes.SetMinStockMutation
  >;
export const receiveStock =
  /* GraphQL */ `mutation ReceiveStock($input: ReceiveStockInput!) {
  receiveStock(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.ReceiveStockMutationVariables,
    APITypes.ReceiveStockMutation
  >;
export const reserveStock =
  /* GraphQL */ `mutation ReserveStock($input: ReserveStockInput!) {
  reserveStock(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.ReserveStockMutationVariables,
    APITypes.ReserveStockMutation
  >;
export const approveReservation =
  /* GraphQL */ `mutation ApproveReservation($input: ApproveReservationInput!) {
  approveReservation(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.ApproveReservationMutationVariables,
    APITypes.ApproveReservationMutation
  >;
export const pickReservation =
  /* GraphQL */ `mutation PickReservation($input: PickReservationInput!) {
  pickReservation(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.PickReservationMutationVariables,
    APITypes.PickReservationMutation
  >;
export const updateReservationStatus =
  /* GraphQL */ `mutation UpdateReservationStatus($input: UpdateReservationStatusInput!) {
  updateReservationStatus(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.UpdateReservationStatusMutationVariables,
    APITypes.UpdateReservationStatusMutation
  >;
export const dispatchReserved =
  /* GraphQL */ `mutation DispatchReserved($input: DispatchReservedInput!) {
  dispatchReserved(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.DispatchReservedMutationVariables,
    APITypes.DispatchReservedMutation
  >;
export const verifyDelivery =
  /* GraphQL */ `mutation VerifyDelivery($input: VerifyDeliveryInput!) {
  verifyDelivery(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.VerifyDeliveryMutationVariables,
    APITypes.VerifyDeliveryMutation
  >;
export const confirmDelivery =
  /* GraphQL */ `mutation ConfirmDelivery($input: ConfirmDeliveryInput!) {
  confirmDelivery(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.ConfirmDeliveryMutationVariables,
    APITypes.ConfirmDeliveryMutation
  >;
export const cancelReservation =
  /* GraphQL */ `mutation CancelReservation($input: CancelReservationInput!) {
  cancelReservation(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.CancelReservationMutationVariables,
    APITypes.CancelReservationMutation
  >;
export const installSerial =
  /* GraphQL */ `mutation InstallSerial($input: InstallSerialInput!) {
  installSerial(input: $input) {
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
` as GeneratedMutation<
    APITypes.InstallSerialMutationVariables,
    APITypes.InstallSerialMutation
  >;
export const removeSerial =
  /* GraphQL */ `mutation RemoveSerial($input: RemoveSerialInput!) {
  removeSerial(input: $input) {
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
` as GeneratedMutation<
    APITypes.RemoveSerialMutationVariables,
    APITypes.RemoveSerialMutation
  >;
export const createTransfer =
  /* GraphQL */ `mutation CreateTransfer($input: CreateTransferInput!) {
  createTransfer(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.CreateTransferMutationVariables,
    APITypes.CreateTransferMutation
  >;
export const dispatchTransfer =
  /* GraphQL */ `mutation DispatchTransfer($input: DispatchTransferInput!) {
  dispatchTransfer(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.DispatchTransferMutationVariables,
    APITypes.DispatchTransferMutation
  >;
export const receiveTransfer =
  /* GraphQL */ `mutation ReceiveTransfer($input: ReceiveTransferInput!) {
  receiveTransfer(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.ReceiveTransferMutationVariables,
    APITypes.ReceiveTransferMutation
  >;
export const adjustStock =
  /* GraphQL */ `mutation AdjustStock($input: AdjustStockInput!) {
  adjustStock(input: $input) {
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
` as GeneratedMutation<
    APITypes.AdjustStockMutationVariables,
    APITypes.AdjustStockMutation
  >;
export const createWarrantyClaim =
  /* GraphQL */ `mutation CreateWarrantyClaim($input: CreateWarrantyClaimInput!) {
  createWarrantyClaim(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateWarrantyClaimMutationVariables,
    APITypes.CreateWarrantyClaimMutation
  >;
export const updateWarrantyClaimStatus =
  /* GraphQL */ `mutation UpdateWarrantyClaimStatus($input: UpdateWarrantyClaimStatusInput!) {
  updateWarrantyClaimStatus(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateWarrantyClaimStatusMutationVariables,
    APITypes.UpdateWarrantyClaimStatusMutation
  >;
export const applyReceiptLine =
  /* GraphQL */ `mutation ApplyReceiptLine($input: ApplyReceiptLineInput!) {
  applyReceiptLine(input: $input) {
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
` as GeneratedMutation<
    APITypes.ApplyReceiptLineMutationVariables,
    APITypes.ApplyReceiptLineMutation
  >;
export const upsertSerial =
  /* GraphQL */ `mutation UpsertSerial($input: UpsertSerialInput!) {
  upsertSerial(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpsertSerialMutationVariables,
    APITypes.UpsertSerialMutation
  >;
export const appendInventoryLog =
  /* GraphQL */ `mutation AppendInventoryLog($input: AppendInventoryLogInput!) {
  appendInventoryLog(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.AppendInventoryLogMutationVariables,
    APITypes.AppendInventoryLogMutation
  >;
export const startMediaUpload =
  /* GraphQL */ `mutation StartMediaUpload($input: StartMediaUploadInput!) {
  startMediaUpload(input: $input) {
    key
    uploadType
    putUrl
    uploadId
    partSize
    partUrls
    __typename
  }
}
` as GeneratedMutation<
    APITypes.StartMediaUploadMutationVariables,
    APITypes.StartMediaUploadMutation
  >;
export const completeMediaUpload =
  /* GraphQL */ `mutation CompleteMediaUpload($input: CompleteMediaUploadInput!) {
  completeMediaUpload(input: $input)
}
` as GeneratedMutation<
    APITypes.CompleteMediaUploadMutationVariables,
    APITypes.CompleteMediaUploadMutation
  >;
export const getSignedViewUrl =
  /* GraphQL */ `mutation GetSignedViewUrl($key: String!, $ttlSec: Int = 300) {
  getSignedViewUrl(key: $key, ttlSec: $ttlSec)
}
` as GeneratedMutation<
    APITypes.GetSignedViewUrlMutationVariables,
    APITypes.GetSignedViewUrlMutation
  >;
export const getSignedViewUrls =
  /* GraphQL */ `mutation GetSignedViewUrls($keys: [String!]!, $ttlSec: Int = 300) {
  getSignedViewUrls(keys: $keys, ttlSec: $ttlSec)
}
` as GeneratedMutation<
    APITypes.GetSignedViewUrlsMutationVariables,
    APITypes.GetSignedViewUrlsMutation
  >;
export const createLogBookEntry =
  /* GraphQL */ `mutation CreateLogBookEntry($input: CreateLogBookEntryInput!) {
  createLogBookEntry(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateLogBookEntryMutationVariables,
    APITypes.CreateLogBookEntryMutation
  >;
export const updateLogBookEntry =
  /* GraphQL */ `mutation UpdateLogBookEntry($input: UpdateLogBookEntryInput!) {
  updateLogBookEntry(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateLogBookEntryMutationVariables,
    APITypes.UpdateLogBookEntryMutation
  >;
export const deleteLogBookEntry =
  /* GraphQL */ `mutation DeleteLogBookEntry($input: DeleteLogBookEntryInput!) {
  deleteLogBookEntry(input: $input) {
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
` as GeneratedMutation<
    APITypes.DeleteLogBookEntryMutationVariables,
    APITypes.DeleteLogBookEntryMutation
  >;
export const createEmployeePunch =
  /* GraphQL */ `mutation CreateEmployeePunch($input: CreateEmployeePunchInput!) {
  createEmployeePunch(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.CreateEmployeePunchMutationVariables,
    APITypes.CreateEmployeePunchMutation
  >;
export const upsertEmployeeAttendanceDay =
  /* GraphQL */ `mutation UpsertEmployeeAttendanceDay(
  $input: UpsertEmployeeAttendanceDayInput!
) {
  upsertEmployeeAttendanceDay(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpsertEmployeeAttendanceDayMutationVariables,
    APITypes.UpsertEmployeeAttendanceDayMutation
  >;
export const registerEmployeeFace =
  /* GraphQL */ `mutation RegisterEmployeeFace($input: RegisterEmployeeFaceInput!) {
  registerEmployeeFace(input: $input) {
    success
    message
    faceId
    userID
    __typename
  }
}
` as GeneratedMutation<
    APITypes.RegisterEmployeeFaceMutationVariables,
    APITypes.RegisterEmployeeFaceMutation
  >;
export const markAttendanceWithFace =
  /* GraphQL */ `mutation MarkAttendanceWithFace($input: MarkAttendanceWithFaceInput!) {
  markAttendanceWithFace(input: $input) {
    success
    message
    userID
    confidence
    punchType
    timestamp
    punchID
    __typename
  }
}
` as GeneratedMutation<
    APITypes.MarkAttendanceWithFaceMutationVariables,
    APITypes.MarkAttendanceWithFaceMutation
  >;
export const markManualAttendance =
  /* GraphQL */ `mutation MarkManualAttendance($input: MarkManualAttendanceInput!) {
  markManualAttendance(input: $input) {
    success
    message
    userID
    punchType
    timestamp
    punchID
    method
    location
    __typename
  }
}
` as GeneratedMutation<
    APITypes.MarkManualAttendanceMutationVariables,
    APITypes.MarkManualAttendanceMutation
  >;
export const createManualRuntimeEntry =
  /* GraphQL */ `mutation CreateManualRuntimeEntry($input: CreateManualRuntimeEntryInput!) {
  createManualRuntimeEntry(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateManualRuntimeEntryMutationVariables,
    APITypes.CreateManualRuntimeEntryMutation
  >;
export const updateManualRuntimeEntry =
  /* GraphQL */ `mutation UpdateManualRuntimeEntry($input: UpdateManualRuntimeEntryInput!) {
  updateManualRuntimeEntry(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateManualRuntimeEntryMutationVariables,
    APITypes.UpdateManualRuntimeEntryMutation
  >;
export const createAttendanceRegularizationRequest =
  /* GraphQL */ `mutation CreateAttendanceRegularizationRequest(
  $input: CreateAttendanceRegularizationInput!
) {
  createAttendanceRegularizationRequest(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateAttendanceRegularizationRequestMutationVariables,
    APITypes.CreateAttendanceRegularizationRequestMutation
  >;
export const approveAttendanceRegularization =
  /* GraphQL */ `mutation ApproveAttendanceRegularization(
  $input: ApproveAttendanceRegularizationInput!
) {
  approveAttendanceRegularization(input: $input) {
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
` as GeneratedMutation<
    APITypes.ApproveAttendanceRegularizationMutationVariables,
    APITypes.ApproveAttendanceRegularizationMutation
  >;
export const rejectAttendanceRegularization =
  /* GraphQL */ `mutation RejectAttendanceRegularization(
  $input: RejectAttendanceRegularizationInput!
) {
  rejectAttendanceRegularization(input: $input) {
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
` as GeneratedMutation<
    APITypes.RejectAttendanceRegularizationMutationVariables,
    APITypes.RejectAttendanceRegularizationMutation
  >;
export const cancelAttendanceRegularization =
  /* GraphQL */ `mutation CancelAttendanceRegularization(
  $input: CancelAttendanceRegularizationInput!
) {
  cancelAttendanceRegularization(input: $input) {
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
` as GeneratedMutation<
    APITypes.CancelAttendanceRegularizationMutationVariables,
    APITypes.CancelAttendanceRegularizationMutation
  >;
export const createPayslip =
  /* GraphQL */ `mutation CreatePayslip($input: CreatePayslipInput!) {
  createPayslip(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreatePayslipMutationVariables,
    APITypes.CreatePayslipMutation
  >;
export const uploadPayslip =
  /* GraphQL */ `mutation UploadPayslip($input: UploadPayslipInput!) {
  uploadPayslip(input: $input) {
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
` as GeneratedMutation<
    APITypes.UploadPayslipMutationVariables,
    APITypes.UploadPayslipMutation
  >;
export const deletePayslip =
  /* GraphQL */ `mutation DeletePayslip($userID: ID!, $year: Int!, $month: Int!) {
  deletePayslip(userID: $userID, year: $year, month: $month) {
    success
    message
    deletedPayslipID
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DeletePayslipMutationVariables,
    APITypes.DeletePayslipMutation
  >;
export const getPayslipDownloadUrl =
  /* GraphQL */ `mutation GetPayslipDownloadUrl($year: Int!, $month: Int!) {
  getPayslipDownloadUrl(year: $year, month: $month) {
    downloadUrl
    expiresIn
    __typename
  }
}
` as GeneratedMutation<
    APITypes.GetPayslipDownloadUrlMutationVariables,
    APITypes.GetPayslipDownloadUrlMutation
  >;
export const createReimbursementClaim =
  /* GraphQL */ `mutation CreateReimbursementClaim($input: CreateReimbursementClaimInput!) {
  createReimbursementClaim(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateReimbursementClaimMutationVariables,
    APITypes.CreateReimbursementClaimMutation
  >;
export const updateReimbursementClaim =
  /* GraphQL */ `mutation UpdateReimbursementClaim($input: UpdateReimbursementClaimInput!) {
  updateReimbursementClaim(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateReimbursementClaimMutationVariables,
    APITypes.UpdateReimbursementClaimMutation
  >;
export const approveReimbursementClaim =
  /* GraphQL */ `mutation ApproveReimbursementClaim($input: ApproveReimbursementClaimInput!) {
  approveReimbursementClaim(input: $input) {
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
` as GeneratedMutation<
    APITypes.ApproveReimbursementClaimMutationVariables,
    APITypes.ApproveReimbursementClaimMutation
  >;
export const rejectReimbursementClaim =
  /* GraphQL */ `mutation RejectReimbursementClaim($input: RejectReimbursementClaimInput!) {
  rejectReimbursementClaim(input: $input) {
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
` as GeneratedMutation<
    APITypes.RejectReimbursementClaimMutationVariables,
    APITypes.RejectReimbursementClaimMutation
  >;
export const processReimbursementPayment =
  /* GraphQL */ `mutation ProcessReimbursementPayment(
  $input: ProcessReimbursementPaymentInput!
) {
  processReimbursementPayment(input: $input) {
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
` as GeneratedMutation<
    APITypes.ProcessReimbursementPaymentMutationVariables,
    APITypes.ProcessReimbursementPaymentMutation
  >;
export const deleteReimbursementClaim =
  /* GraphQL */ `mutation DeleteReimbursementClaim($claimID: ID!) {
  deleteReimbursementClaim(claimID: $claimID) {
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
` as GeneratedMutation<
    APITypes.DeleteReimbursementClaimMutationVariables,
    APITypes.DeleteReimbursementClaimMutation
  >;
export const uploadReimbursementDocument =
  /* GraphQL */ `mutation UploadReimbursementDocument(
  $input: UploadReimbursementDocumentInput!
) {
  uploadReimbursementDocument(input: $input) {
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
}
` as GeneratedMutation<
    APITypes.UploadReimbursementDocumentMutationVariables,
    APITypes.UploadReimbursementDocumentMutation
  >;
export const uploadPayslipDocument =
  /* GraphQL */ `mutation UploadPayslipDocument($input: UploadPayslipDocumentInput!) {
  uploadPayslipDocument(input: $input) {
    documentID
    type
    fileName
    fileSize
    s3Key
    uploadedAt
    uploadedBy
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UploadPayslipDocumentMutationVariables,
    APITypes.UploadPayslipDocumentMutation
  >;
export const uploadGenericDocument =
  /* GraphQL */ `mutation UploadGenericDocument($input: UploadGenericDocumentInput!) {
  uploadGenericDocument(input: $input) {
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
` as GeneratedMutation<
    APITypes.UploadGenericDocumentMutationVariables,
    APITypes.UploadGenericDocumentMutation
  >;
export const getReimbursementUploadUrl =
  /* GraphQL */ `mutation GetReimbursementUploadUrl($input: GetReimbursementUploadUrlInput!) {
  getReimbursementUploadUrl(input: $input) {
    uploadUrl
    s3Key
    expiresIn
    maxFileSize
    __typename
  }
}
` as GeneratedMutation<
    APITypes.GetReimbursementUploadUrlMutationVariables,
    APITypes.GetReimbursementUploadUrlMutation
  >;
export const getPayslipUploadUrl =
  /* GraphQL */ `mutation GetPayslipUploadUrl($input: GetPayslipUploadUrlInput!) {
  getPayslipUploadUrl(input: $input) {
    uploadUrl
    s3Key
    expiresIn
    maxFileSize
    __typename
  }
}
` as GeneratedMutation<
    APITypes.GetPayslipUploadUrlMutationVariables,
    APITypes.GetPayslipUploadUrlMutation
  >;
export const getGenericDocumentUploadUrl =
  /* GraphQL */ `mutation GetGenericDocumentUploadUrl(
  $input: GetGenericDocumentUploadUrlInput!
) {
  getGenericDocumentUploadUrl(input: $input) {
    uploadUrl
    s3Key
    expiresIn
    maxFileSize
    __typename
  }
}
` as GeneratedMutation<
    APITypes.GetGenericDocumentUploadUrlMutationVariables,
    APITypes.GetGenericDocumentUploadUrlMutation
  >;
export const initiatePasswordReset =
  /* GraphQL */ `mutation InitiatePasswordReset($input: InitiatePasswordResetInput!) {
  initiatePasswordReset(input: $input) {
    success
    message
    expiresIn
    __typename
  }
}
` as GeneratedMutation<
    APITypes.InitiatePasswordResetMutationVariables,
    APITypes.InitiatePasswordResetMutation
  >;
export const verifyResetCode =
  /* GraphQL */ `mutation VerifyResetCode($input: VerifyResetCodeInput!) {
  verifyResetCode(input: $input) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
    APITypes.VerifyResetCodeMutationVariables,
    APITypes.VerifyResetCodeMutation
  >;
export const completePasswordReset =
  /* GraphQL */ `mutation CompletePasswordReset($input: CompletePasswordResetInput!) {
  completePasswordReset(input: $input) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CompletePasswordResetMutationVariables,
    APITypes.CompletePasswordResetMutation
  >;
export const createOfficeLocation =
  /* GraphQL */ `mutation CreateOfficeLocation($input: CreateOfficeLocationInput!) {
  createOfficeLocation(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateOfficeLocationMutationVariables,
    APITypes.CreateOfficeLocationMutation
  >;
export const updateOfficeLocation =
  /* GraphQL */ `mutation UpdateOfficeLocation($input: UpdateOfficeLocationInput!) {
  updateOfficeLocation(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateOfficeLocationMutationVariables,
    APITypes.UpdateOfficeLocationMutation
  >;
export const deleteOfficeLocation =
  /* GraphQL */ `mutation DeleteOfficeLocation($input: DeleteOfficeLocationInput!) {
  deleteOfficeLocation(input: $input) {
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
` as GeneratedMutation<
    APITypes.DeleteOfficeLocationMutationVariables,
    APITypes.DeleteOfficeLocationMutation
  >;
export const setMyOffice = /* GraphQL */ `mutation SetMyOffice($officeID: ID!) {
  setMyOffice(officeID: $officeID) {
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
` as GeneratedMutation<
  APITypes.SetMyOfficeMutationVariables,
  APITypes.SetMyOfficeMutation
>;
export const createLeavePolicy =
  /* GraphQL */ `mutation CreateLeavePolicy($input: CreateLeavePolicyInput!) {
  createLeavePolicy(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateLeavePolicyMutationVariables,
    APITypes.CreateLeavePolicyMutation
  >;
export const updateLeavePolicy =
  /* GraphQL */ `mutation UpdateLeavePolicy($input: UpdateLeavePolicyInput!) {
  updateLeavePolicy(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateLeavePolicyMutationVariables,
    APITypes.UpdateLeavePolicyMutation
  >;
export const deleteLeavePolicy =
  /* GraphQL */ `mutation DeleteLeavePolicy($orgID: ID!, $leaveType: LeaveType!) {
  deleteLeavePolicy(orgID: $orgID, leaveType: $leaveType) {
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
` as GeneratedMutation<
    APITypes.DeleteLeavePolicyMutationVariables,
    APITypes.DeleteLeavePolicyMutation
  >;
export const initializeUserLeaveBalances =
  /* GraphQL */ `mutation InitializeUserLeaveBalances(
  $input: InitializeUserLeaveBalancesInput!
) {
  initializeUserLeaveBalances(input: $input) {
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
` as GeneratedMutation<
    APITypes.InitializeUserLeaveBalancesMutationVariables,
    APITypes.InitializeUserLeaveBalancesMutation
  >;
export const adjustLeaveBalance =
  /* GraphQL */ `mutation AdjustLeaveBalance($input: AdjustLeaveBalanceInput!) {
  adjustLeaveBalance(input: $input) {
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
` as GeneratedMutation<
    APITypes.AdjustLeaveBalanceMutationVariables,
    APITypes.AdjustLeaveBalanceMutation
  >;
export const carryForwardLeaveBalances =
  /* GraphQL */ `mutation CarryForwardLeaveBalances($input: CarryForwardLeaveBalancesInput!) {
  carryForwardLeaveBalances(input: $input) {
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
` as GeneratedMutation<
    APITypes.CarryForwardLeaveBalancesMutationVariables,
    APITypes.CarryForwardLeaveBalancesMutation
  >;
export const applyForLeave =
  /* GraphQL */ `mutation ApplyForLeave($input: ApplyForLeaveInput!) {
  applyForLeave(input: $input) {
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
` as GeneratedMutation<
    APITypes.ApplyForLeaveMutationVariables,
    APITypes.ApplyForLeaveMutation
  >;
export const updateLeaveApplication =
  /* GraphQL */ `mutation UpdateLeaveApplication($input: UpdateLeaveApplicationInput!) {
  updateLeaveApplication(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateLeaveApplicationMutationVariables,
    APITypes.UpdateLeaveApplicationMutation
  >;
export const cancelLeaveApplication =
  /* GraphQL */ `mutation CancelLeaveApplication($input: CancelLeaveApplicationInput!) {
  cancelLeaveApplication(input: $input) {
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
` as GeneratedMutation<
    APITypes.CancelLeaveApplicationMutationVariables,
    APITypes.CancelLeaveApplicationMutation
  >;
export const approveLeaveApplication =
  /* GraphQL */ `mutation ApproveLeaveApplication($input: ApproveLeaveApplicationInput!) {
  approveLeaveApplication(input: $input) {
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
` as GeneratedMutation<
    APITypes.ApproveLeaveApplicationMutationVariables,
    APITypes.ApproveLeaveApplicationMutation
  >;
export const rejectLeaveApplication =
  /* GraphQL */ `mutation RejectLeaveApplication($input: RejectLeaveApplicationInput!) {
  rejectLeaveApplication(input: $input) {
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
` as GeneratedMutation<
    APITypes.RejectLeaveApplicationMutationVariables,
    APITypes.RejectLeaveApplicationMutation
  >;
export const bulkApproveLeaveApplications =
  /* GraphQL */ `mutation BulkApproveLeaveApplications(
  $input: BulkApproveLeaveApplicationsInput!
) {
  bulkApproveLeaveApplications(input: $input) {
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
` as GeneratedMutation<
    APITypes.BulkApproveLeaveApplicationsMutationVariables,
    APITypes.BulkApproveLeaveApplicationsMutation
  >;
export const bulkRejectLeaveApplications =
  /* GraphQL */ `mutation BulkRejectLeaveApplications(
  $input: BulkRejectLeaveApplicationsInput!
) {
  bulkRejectLeaveApplications(input: $input) {
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
` as GeneratedMutation<
    APITypes.BulkRejectLeaveApplicationsMutationVariables,
    APITypes.BulkRejectLeaveApplicationsMutation
  >;
export const createOfficeCalendar =
  /* GraphQL */ `mutation CreateOfficeCalendar($input: CreateOfficeCalendarInput!) {
  createOfficeCalendar(input: $input) {
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
` as GeneratedMutation<
    APITypes.CreateOfficeCalendarMutationVariables,
    APITypes.CreateOfficeCalendarMutation
  >;
export const updateOfficeCalendar =
  /* GraphQL */ `mutation UpdateOfficeCalendar($input: UpdateOfficeCalendarInput!) {
  updateOfficeCalendar(input: $input) {
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
` as GeneratedMutation<
    APITypes.UpdateOfficeCalendarMutationVariables,
    APITypes.UpdateOfficeCalendarMutation
  >;
export const deleteOfficeCalendar =
  /* GraphQL */ `mutation DeleteOfficeCalendar($officeID: ID!, $date: AWSDate!) {
  deleteOfficeCalendar(officeID: $officeID, date: $date) {
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
` as GeneratedMutation<
    APITypes.DeleteOfficeCalendarMutationVariables,
    APITypes.DeleteOfficeCalendarMutation
  >;
export const bulkCreateHolidays =
  /* GraphQL */ `mutation BulkCreateHolidays($input: BulkCreateHolidaysInput!) {
  bulkCreateHolidays(input: $input) {
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
` as GeneratedMutation<
    APITypes.BulkCreateHolidaysMutationVariables,
    APITypes.BulkCreateHolidaysMutation
  >;
export const bulkUpdateCalendarDays =
  /* GraphQL */ `mutation BulkUpdateCalendarDays($input: BulkUpdateCalendarDaysInput!) {
  bulkUpdateCalendarDays(input: $input) {
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
` as GeneratedMutation<
    APITypes.BulkUpdateCalendarDaysMutationVariables,
    APITypes.BulkUpdateCalendarDaysMutation
  >;
export const universalCreate =
  /* GraphQL */ `mutation UniversalCreate($tableName: String!, $data: AWSJSON!) {
  universalCreate(tableName: $tableName, data: $data) {
    success
    message
    data
    tableName
    operation
    timestamp
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UniversalCreateMutationVariables,
    APITypes.UniversalCreateMutation
  >;
export const universalUpdate =
  /* GraphQL */ `mutation UniversalUpdate($tableName: String!, $id: ID!, $data: AWSJSON!) {
  universalUpdate(tableName: $tableName, id: $id, data: $data) {
    success
    message
    data
    tableName
    operation
    timestamp
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UniversalUpdateMutationVariables,
    APITypes.UniversalUpdateMutation
  >;
export const universalDelete =
  /* GraphQL */ `mutation UniversalDelete($tableName: String!, $id: ID!) {
  universalDelete(tableName: $tableName, id: $id) {
    success
    message
    data
    tableName
    operation
    timestamp
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UniversalDeleteMutationVariables,
    APITypes.UniversalDeleteMutation
  >;
export const universalBatchOperation =
  /* GraphQL */ `mutation UniversalBatchOperation(
  $operations: [UniversalBatchOperationInput!]!
) {
  universalBatchOperation(operations: $operations) {
    success
    message
    results {
      success
      message
      data
      tableName
      operation
      timestamp
      __typename
    }
    successCount
    failureCount
    timestamp
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UniversalBatchOperationMutationVariables,
    APITypes.UniversalBatchOperationMutation
  >;
export const universalCreateGroup =
  /* GraphQL */ `mutation UniversalCreateGroup(
  $groupName: String!
  $description: String
  $userPoolId: String
) {
  universalCreateGroup(
    groupName: $groupName
    description: $description
    userPoolId: $userPoolId
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
` as GeneratedMutation<
    APITypes.UniversalCreateGroupMutationVariables,
    APITypes.UniversalCreateGroupMutation
  >;
export const universalUpdateGroup =
  /* GraphQL */ `mutation UniversalUpdateGroup(
  $groupName: String!
  $newGroupName: String
  $description: String
) {
  universalUpdateGroup(
    groupName: $groupName
    newGroupName: $newGroupName
    description: $description
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
` as GeneratedMutation<
    APITypes.UniversalUpdateGroupMutationVariables,
    APITypes.UniversalUpdateGroupMutation
  >;
export const universalDeleteGroup =
  /* GraphQL */ `mutation UniversalDeleteGroup($groupName: String!) {
  universalDeleteGroup(groupName: $groupName) {
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
` as GeneratedMutation<
    APITypes.UniversalDeleteGroupMutationVariables,
    APITypes.UniversalDeleteGroupMutation
  >;
export const universalManageGroupMembership =
  /* GraphQL */ `mutation UniversalManageGroupMembership(
  $groupName: String!
  $usernames: [String!]!
  $action: GroupMembershipAction!
) {
  universalManageGroupMembership(
    groupName: $groupName
    usernames: $usernames
    action: $action
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
` as GeneratedMutation<
    APITypes.UniversalManageGroupMembershipMutationVariables,
    APITypes.UniversalManageGroupMembershipMutation
  >;
