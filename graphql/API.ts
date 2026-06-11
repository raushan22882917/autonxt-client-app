/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateOrganizationInput = {
  name: string;
  industry?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

export type Organization = {
  __typename: 'Organization';
  orgID: string;
  name: string;
  industry?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateOrganizationInput = {
  orgID: string;
  name?: string | null;
  industry?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  updatedAt?: string | null;
};

export type CreatePlantInput = {
  orgID: string;
  name: string;
  location?: string | null;
  plantType?: PlantType | null;
  parentHubID?: string | null;
  plantHeadID?: string | null;
  supervisorID?: string | null;
  driverIDs?: Array<string | null> | null;
  electricityCostPKWH?: string | null;
  dieselCostPL?: string | null;
  additionalSupport?: boolean | null;
};

export enum PlantType {
  HUB_WAREHOUSE = 'HUB_WAREHOUSE',
  SATELLITE_SITE = 'SATELLITE_SITE',
}

export type Plant = {
  __typename: 'Plant';
  orgID: string;
  plantID: string;
  name: string;
  location?: string | null;
  plantType?: PlantType | null;
  parentHubID?: string | null;
  plantHeadID?: string | null;
  supervisorID?: string | null;
  driverIDs?: Array<string | null> | null;
  electricityCostPKWH?: string | null;
  dieselCostPL?: string | null;
  additionalSupport?: boolean | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdatePlantInput = {
  plantID: string;
  name?: string | null;
  location?: string | null;
  plantType?: PlantType | null;
  parentHubID?: string | null;
  plantHeadID?: string | null;
  supervisorID?: string | null;
  driverIDs?: Array<string | null> | null;
  electricityCostPKWH?: string | null;
  dieselCostPL?: string | null;
  additionalSupport?: boolean | null;
  updatedAt?: string | null;
};

export type CreateUserInput = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  userType: UserType;
  role: string;
  orgID?: string | null;
  accessiblePlantIDs?: Array<string | null> | null;
  assignedOfficeID?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export enum UserType {
  CUSTOMER = 'CUSTOMER',
  AUTONXT = 'AUTONXT',
}

export type User = {
  __typename: 'User';
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  userType: UserType;
  role: string;
  orgID?: string | null;
  accessiblePlantIDs?: Array<string | null> | null;
  assignedOfficeID?: string | null;
  status?: string | null;
  pushToken?: string | null;
  cognitoGroups?: Array<string> | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserInput = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  orgID?: string | null;
  accessiblePlantIDs?: Array<string | null> | null;
  assignedOfficeID?: string | null;
  status?: string | null;
  pushToken?: string | null;
  updatedAt?: string | null;
};

export type SendPushNotificationInput = {
  userIds: Array<string>;
  title: string;
  body: string;
  data?: string | null;
};

export type SendPushNotificationResult = {
  __typename: 'SendPushNotificationResult';
  success: boolean;
  message?: string | null;
  sent?: number | null;
};

export type NotifyPlantTechnicalSupervisorInput = {
  plantID: string;
  message: string;
  criticality: Criticality;
  requiresVendorSupport: boolean;
  vendorOption?: Vendor | null;
};

export enum Criticality {
  MOVING = 'MOVING',
  OFF_ROAD = 'OFF_ROAD',
}

export enum Vendor {
  AMEX = 'AMEX',
  NEO = 'NEO',
  KOMPEJ = 'KOMPEJ',
  SCHAFFLER = 'SCHAFFLER',
  CARRARO = 'CARRARO',
  PRATYASHA = 'PRATYASHA',
}

export type NotificationResult = {
  __typename: 'NotificationResult';
  success: boolean;
  message?: string | null;
  notifiedSupervisors?: Array<string> | null;
  notificationSentAt?: string | null;
};

export type CreateERPItemInput = {
  PK: string;
  SK: string;
  entity_type?: string | null;
  data?: string | null;
  partCode?: string | null;
  partName?: string | null;
  category?: string | null;
  uom?: string | null;
  perUnitTractor?: number | null;
  batchQty?: number | null;
  availableQtyHapur?: number | null;
  partsRequired?: number | null;
  machine?: ERPPartMachineQuantitiesInput | null;
  availableForTractor?: number | null;
  location?: string | null;
  availableQtyAmount?: number | null;
  suppliers?: Array<ERPSupplierEntryInput> | null;
  perTractorCost?: number | null;
  price?: number | null;
  priceWithGST?: number | null;
  gstRate?: number | null;
  amountRequired?: number | null;
  advanceAvailable?: number | null;
  leadTimeWeeks?: number | null;
  creditTerms?: string | null;
  orderedQty?: number | null;
  balanceQty?: number | null;
  daysForFirstPayment?: number | null;
  moq?: number | null;
  leadTimeDays?: number | null;
  paymentAtPOPercent?: number | null;
  balancePaymentPercent?: number | null;
  creditDays?: number | null;
  poData?: Array<ERPPODataEntryInput> | null;
  orderingPlan?: Array<ERPWeekPlanEntryInput> | null;
  leadTimePlan?: Array<ERPWeekPlanEntryInput> | null;
  paymentPlan?: Array<ERPWeekPlanEntryInput> | null;
  paymentPlanWithTaxes?: Array<ERPWeekPlanEntryInput> | null;
};

export type ERPPartMachineQuantitiesInput = {
  X45H2?: number | null;
  X60C2L?: number | null;
  X45C4?: number | null;
  X60C2?: number | null;
  X60C4?: number | null;
};

export type ERPSupplierEntryInput = {
  name: string;
  priority: number;
};

export type ERPPODataEntryInput = {
  poDate?: string | null;
  firstPayment?: number | null;
  deliveryDate?: string | null;
  balancePaymentDays?: number | null;
  secondPaymentDays?: string | null;
  secondPaymentAmount?: number | null;
};

export type ERPWeekPlanEntryInput = {
  week: string;
  month: string;
  quantity: number;
  year: number;
  weekNumber: number;
  poDate?: string | null;
  firstPaymentDate?: string | null;
  deliveryDate?: string | null;
  balancePaymentDays?: number | null;
  secondPaymentDays?: number | null;
  firstPaymentAmount?: number | null;
  secondPaymentAmount?: number | null;
  paymentStatus?: string | null;
};

export type ERPItem = {
  __typename: 'ERPItem';
  PK: string;
  SK: string;
  entity_type?: string | null;
  data?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  partCode?: string | null;
  partName?: string | null;
  category?: string | null;
  uom?: string | null;
  perUnitTractor?: number | null;
  batchQty?: number | null;
  availableQtyHapur?: number | null;
  partsRequired?: number | null;
  machine?: ERPPartMachineQuantities | null;
  availableForTractor?: number | null;
  location?: string | null;
  availableQtyAmount?: number | null;
  suppliers?: Array<ERPSupplierEntry> | null;
  perTractorCost?: number | null;
  price?: number | null;
  priceWithGST?: number | null;
  gstRate?: number | null;
  amountRequired?: number | null;
  advanceAvailable?: number | null;
  leadTimeWeeks?: number | null;
  creditTerms?: string | null;
  orderedQty?: number | null;
  balanceQty?: number | null;
  daysForFirstPayment?: number | null;
  moq?: number | null;
  leadTimeDays?: number | null;
  paymentAtPOPercent?: number | null;
  balancePaymentPercent?: number | null;
  creditDays?: number | null;
  poData?: Array<ERPPODataEntry> | null;
  orderingPlan?: Array<ERPWeekPlanEntry> | null;
  leadTimePlan?: Array<ERPWeekPlanEntry> | null;
  paymentPlan?: Array<ERPWeekPlanEntry> | null;
  paymentPlanWithTaxes?: Array<ERPWeekPlanEntry> | null;
};

export type ERPPartMachineQuantities = {
  __typename: 'ERPPartMachineQuantities';
  X45H2?: number | null;
  X60C2L?: number | null;
  X45C4?: number | null;
  X60C2?: number | null;
  X60C4?: number | null;
};

export type ERPSupplierEntry = {
  __typename: 'ERPSupplierEntry';
  name: string;
  priority: number;
};

export type ERPPODataEntry = {
  __typename: 'ERPPODataEntry';
  poDate?: string | null;
  firstPayment?: number | null;
  deliveryDate?: string | null;
  balancePaymentDays?: number | null;
  secondPaymentDays?: string | null;
  secondPaymentAmount?: number | null;
};

export type ERPWeekPlanEntry = {
  __typename: 'ERPWeekPlanEntry';
  week: string;
  month: string;
  quantity: number;
  year: number;
  weekNumber: number;
  poDate?: string | null;
  firstPaymentDate?: string | null;
  deliveryDate?: string | null;
  balancePaymentDays?: number | null;
  secondPaymentDays?: number | null;
  firstPaymentAmount?: number | null;
  secondPaymentAmount?: number | null;
  paymentStatus?: string | null;
};

export type UpdateERPItemInput = {
  PK: string;
  SK: string;
  entity_type?: string | null;
  data?: string | null;
  partCode?: string | null;
  partName?: string | null;
  category?: string | null;
  uom?: string | null;
  perUnitTractor?: number | null;
  batchQty?: number | null;
  availableQtyHapur?: number | null;
  partsRequired?: number | null;
  machine?: ERPPartMachineQuantitiesInput | null;
  availableForTractor?: number | null;
  location?: string | null;
  availableQtyAmount?: number | null;
  suppliers?: Array<ERPSupplierEntryInput> | null;
  perTractorCost?: number | null;
  price?: number | null;
  priceWithGST?: number | null;
  gstRate?: number | null;
  amountRequired?: number | null;
  advanceAvailable?: number | null;
  leadTimeWeeks?: number | null;
  creditTerms?: string | null;
  orderedQty?: number | null;
  balanceQty?: number | null;
  daysForFirstPayment?: number | null;
  moq?: number | null;
  leadTimeDays?: number | null;
  paymentAtPOPercent?: number | null;
  balancePaymentPercent?: number | null;
  creditDays?: number | null;
  poData?: Array<ERPPODataEntryInput> | null;
  orderingPlan?: Array<ERPWeekPlanEntryInput> | null;
  leadTimePlan?: Array<ERPWeekPlanEntryInput> | null;
  paymentPlan?: Array<ERPWeekPlanEntryInput> | null;
  paymentPlanWithTaxes?: Array<ERPWeekPlanEntryInput> | null;
};

export type GenerateMonthlyPlanInput = {
  partCode: string;
  startMonth: string;
  startYear: number;
  totalQuantity: number;
};

export type UpdateWeeklyPaymentPlanInput = {
  partCode: string;
  weekPlan: ERPWeekPlanEntryInput;
};

export type UpdateMonthlyProgressionInput = {
  partCode: string;
};

export type CreateCognitoUserInput = {
  username: string;
  email: string;
  phone?: string | null;
  name: string;
  temporaryPassword?: string | null;
  userType?: string | null;
  role?: string | null;
  messageAction?: string | null;
  clientMetadata?: string | null;
};

export type CognitoUserResponse = {
  __typename: 'CognitoUserResponse';
  success: boolean;
  message: string;
  user?: CognitoUser | null;
};

export type CognitoUser = {
  __typename: 'CognitoUser';
  username: string;
  email?: string | null;
  name?: string | null;
  userType?: string | null;
  role?: string | null;
  status?: string | null;
  enabled: boolean;
  userCreateDate?: string | null;
  userLastModifiedDate?: string | null;
};

export type UpdateCognitoUserInput = {
  username: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  userType?: string | null;
  role?: string | null;
  enabled?: boolean | null;
  clientMetadata?: string | null;
};

export type CognitoGroupResponse = {
  __typename: 'CognitoGroupResponse';
  success: boolean;
  message: string;
  group?: CognitoGroup | null;
};

export type CognitoGroup = {
  __typename: 'CognitoGroup';
  groupName: string;
  description?: string | null;
  precedence?: number | null;
  roleArn?: string | null;
  userPoolId?: string | null;
  createdAt?: string | null;
  lastModifiedDate?: string | null;
};

export type BulkCognitoResponse = {
  __typename: 'BulkCognitoResponse';
  success: boolean;
  message: string;
  successCount: number;
  failureCount: number;
  errors?: Array<string> | null;
};

export type AssignUserToOfficeInput = {
  userID: string;
  officeID: string;
  assignedBy: string;
  notes?: string | null;
};

export type OfficeAssignmentResult = {
  __typename: 'OfficeAssignmentResult';
  id?: string | null;
  userID: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  userType?: UserType | null;
  role?: string | null;
  orgID?: string | null;
  plantID?: string | null;
  accessiblePlantIDs?: Array<string> | null;
  status?: string | null;
  pushToken?: string | null;
  cognitoGroups?: Array<string> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  assignedOfficeID?: string | null;
  officeAssignedBy?: string | null;
  officeAssignedAt?: string | null;
  officeAssignmentNotes?: string | null;
  success: boolean;
  message?: string | null;
};

export type BulkAssignUsersToOfficeInput = {
  userIDs: Array<string>;
  officeID: string;
  assignedBy: string;
  notes?: string | null;
};

export type CreateTractorInput = {
  vin?: string | null;
  model?: TractorModelEnum | null;
  color?: TractorColorEnum | null;
  alias?: string | null;
  registerNumber?: string | null;
  loggerID?: string | null;
  user?: string | null;
  plantID?: string | null;
  orgID?: string | null;
  currentImplement?: string | null;
  serviceStatus?: string | null;
  armLength?: string | null;
  dofChargeStatus?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  midValue?: number | null;
  tractorNextBatchValue?: number | null;
  commissionDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export enum TractorModelEnum {
  X45H2 = 'X45H2',
  X60H2 = 'X60H2',
  X45C2 = 'X45C2',
  X45C4 = 'X45C4',
}

export enum TractorColorEnum {
  RED = 'RED',
  BLUE = 'BLUE',
  BLAZING_RED = 'BLAZING_RED',
  BLUE_CANOPY = 'BLUE_CANOPY',
  BLAZING_RED_CANOPY = 'BLAZING_RED_CANOPY',
}

export type Tractor = {
  __typename: 'Tractor';
  vin: string;
  alias?: string | null;
  registerNumber?: string | null;
  plantID?: string | null;
  orgID?: string | null;
  model?: string | null;
  color?: string | null;
  loggerID?: string | null;
  currentImplement?: string | null;
  serviceStatus?: string | null;
  armLength?: string | null;
  dofChargeStatus?: string | null;
  user?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  midValue?: number | null;
  tractorNextBatchValue?: number | null;
  components?: TractorComponents | null;
  dispatchInfo?: DispatchInfo | null;
  commissionDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type TractorComponents = {
  __typename: 'TractorComponents';
  vin: string;
  componentType?: TractorComponentTypeEnum | null;
  id?: string | null;
  battery33KWid?: string | null;
  battery12Vid?: string | null;
  motorId?: string | null;
  controllerID?: string | null;
  transmissionID?: string | null;
  transmissionMake?: TransmissionMakeEnum | null;
  displayID?: string | null;
  tempCardID?: string | null;
  canCardID?: string | null;
  footAccID?: string | null;
  handAccID?: string | null;
  fTyreSize?: string | null;
  rTyreSize?: string | null;
  fTyreBrand?: TyreBrandEnum | null;
  rTyreBrand?: TyreBrandEnum | null;
  couplerType?: CouplerTypeEnum | null;
  oRingType?: O_RingEnum | null;
  clutchFingerSetting?: string | null;
  bmsVersion?: number | null;
};

export enum TractorComponentTypeEnum {
  BATTERY_33KW = 'BATTERY_33KW',
  BATTERY_12V = 'BATTERY_12V',
  MOTOR = 'MOTOR',
  CONTROLLER = 'CONTROLLER',
  TRANSMISSION = 'TRANSMISSION',
  DISPLAY = 'DISPLAY',
  TEMP_CARD = 'TEMP_CARD',
  CAN_CARD = 'CAN_CARD',
  FOOT_ACC = 'FOOT_ACC',
  HAND_ACC = 'HAND_ACC',
  F_TYRE = 'F_TYRE',
  R_TYRE = 'R_TYRE',
  TYRE_BRAND = 'TYRE_BRAND',
  COUPLER_TYPE = 'COUPLER_TYPE',
  O_RING_TYPE = 'O_RING_TYPE',
  FLANGE_TYPE = 'FLANGE_TYPE',
  CLUTCH_FINGER_SETTING = 'CLUTCH_FINGER_SETTING',
  BMS_VERSION = 'BMS_VERSION',
}

export enum TransmissionMakeEnum {
  VISHWASH = 'VISHWASH',
  PRATYAKSHA = 'PRATYAKSHA',
  AGROTRACK = 'AGROTRACK',
  SUNRISE = 'SUNRISE',
  KN_TRACTORS = 'KN_TRACTORS',
  CARRARO = 'CARRARO',
}

export enum TyreBrandEnum {
  JK_SHRESTH = 'JK_SHRESTH',
  MRF = 'MRF',
  APOLLO = 'APOLLO',
  CEAT = 'CEAT',
}

export enum CouplerTypeEnum {
  COUPLER_65MM_2_PIECE = 'COUPLER_65MM_2_PIECE',
  COUPLER_75MM_2_PIECE = 'COUPLER_75MM_2_PIECE',
  COUPLER_77MM_2_PIECE = 'COUPLER_77MM_2_PIECE',
}

export enum O_RingEnum {
  VITON_20_3_BROWN = 'VITON_20_3_BROWN',
  VITON_22_2_50 = 'VITON_22_2_50',
}

export type DispatchInfo = {
  __typename: 'DispatchInfo';
  assemblyRolloutDate?: string | null;
  pdiDate?: string | null;
  handoverDate?: string | null;
  dispatchPlan?: DispatchPlanEnum | null;
  dispatchLocation?: string | null;
  totalTestHours?: number | null;
  testType?: Array<TractorTestTypeEnum | null> | null;
  liveLocation?: string | null;
  saleType?: SaleTypeEnum | null;
};

export enum DispatchPlanEnum {
  DISPATCHED = 'DISPATCHED',
  DEV_TESTING = 'DEV_TESTING',
  NOT_DISPATCHED = 'NOT_DISPATCHED',
  PENDING = 'PENDING',
}

export enum TractorTestTypeEnum {
  RV = 'RV',
  HT = 'HT',
  NL = 'NL',
  R = 'R',
  H = 'H',
}

export enum SaleTypeEnum {
  RETAIL = 'RETAIL',
  RENTAL = 'RENTAL',
  DEMO = 'DEMO',
}

export type UpdateTractorInput = {
  vin: string;
  model?: TractorModelEnum | null;
  color?: TractorColorEnum | null;
  plantID?: string | null;
  orgID?: string | null;
  alias?: string | null;
  registerNumber?: string | null;
  loggerID?: string | null;
  user?: string | null;
  currentImplement?: string | null;
  serviceStatus?: string | null;
  armLength?: string | null;
  dofChargeStatus?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  midValue?: number | null;
  tractorNextBatchValue?: number | null;
  commissionDate?: string | null;
  updatedAt?: string | null;
};

export type DeleteTractorInput = {
  vin: string;
};

export type CreateTractorDocumentInput = {
  vin: string;
  key: string;
  fileName?: string | null;
  uploadId?: string | null;
  etags?: Array<string> | null;
  meta?: MediaMetaInput | null;
  orgID: string;
  plantID?: string | null;
  contentType: string;
  sizeBytes: number;
  documentID?: string | null;
  title?: string | null;
  description?: string | null;
  docType?: string | null;
  tags?: Array<string> | null;
};

export type MediaMetaInput = {
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
  codec?: string | null;
};

export type Media = {
  __typename: 'Media';
  key: string;
  kind: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
  variants: Array<string>;
  uploaderID?: string | null;
  vin?: string | null;
  documentID?: string | null;
  title?: string | null;
  description?: string | null;
  docType?: string | null;
  files?: Array<string> | null;
  tags?: Array<string> | null;
  uploadedBy?: string | null;
  uploadedAt?: string | null;
  updatedAt?: string | null;
};

export type UpdateTractorDocumentInput = {
  vin: string;
  documentID: string;
  fileName?: string | null;
  title?: string | null;
  description?: string | null;
  docType?: string | null;
  tags?: Array<string> | null;
  meta?: MediaMetaInput | null;
};

export type UploadUsageSegmentInput = {
  tractorID: string;
  type: SegmentType;
  startTime: string;
  endTime?: string | null;
  durationSec?: number | null;
  durationFormatted?: string | null;
  durationSecLogged?: number | null;
  durationLogged?: string | null;
  initialSOC?: number | null;
  finalSOC?: number | null;
  kwhConsumed?: number | null;
  kwhCharged?: number | null;
  distanceTravelled?: number | null;
  costSavings?: number | null;
  treesSaved?: number | null;
  disconnects?: DisconnectsMInput | null;
  parameterMetrics?: ParameterMetricsInput | null;
  faultMetrics?: FaultMetricsInput | null;
};

export enum SegmentType {
  TRIP = 'TRIP',
  CHARGE = 'CHARGE',
  STANDBY = 'STANDBY',
  DISCONNECT = 'DISCONNECT',
  ANOMALY = 'ANOMALY',
  ERROR = 'ERROR',
}

export type DisconnectsMInput = {
  totalCount?: number | null;
  totalDuration?: number | null;
  locations?: Array<StartEndLocInput> | null;
};

export type StartEndLocInput = {
  startLoc?: GPSCoordInput | null;
  endLoc?: GPSCoordInput | null;
};

export type GPSCoordInput = {
  lat?: string | null;
  lng?: string | null;
};

export type ParameterMetricsInput = {
  SOC?: MinMaxMInput | null;
  SOH?: MinMaxMInput | null;
  BatteryV?: MinMaxMInput | null;
  BatteryI?: MinMaxMInput | null;
  BatteryT?: MinMaxMInput | null;
  MaxRPM?: MinMaxMInput | null;
  WHM?: MinMaxMInput | null;
  MotorT?: MinMaxMInput | null;
  MinCellV?: MinMaxMInput | null;
  MaxCellV?: MinMaxMInput | null;
  Throttle?: MinMaxMInput | null;
  CumulativeRuntime?: MinMaxMInput | null;
};

export type MinMaxMInput = {
  avg?: number | null;
  min?: MinMaxEntryInput | null;
  max?: MinMaxEntryInput | null;
};

export type MinMaxEntryInput = {
  value?: number | null;
  ts?: string | null;
};

export type FaultMetricsInput = {
  Ecode?: Array<FaultValuesInput> | null;
  FaultDiag?: Array<FaultValuesInput> | null;
  WarningDiag?: Array<FaultValuesInput> | null;
};

export type FaultValuesInput = {
  metric?: FaultTypeEnum | null;
  value?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  Ecode?: number | null;
  FaultDiag?: number | null;
  ModuleTAtFault?: number | null;
  OutputFreqAtFault?: number | null;
  OutputIAtFault?: number | null;
  OutputVAtFault?: number | null;
  OutputDCBusVAtFault?: number | null;
  DiagInfoLastFault?: number | null;
  ModuleTLastFault?: number | null;
  OperatingFreqLastFault?: number | null;
  OutputILastFault?: number | null;
  OutputVLastFault?: number | null;
  BusVLastFault?: number | null;
};

export enum FaultTypeEnum {
  Ecode = 'Ecode',
  FaultDiag = 'FaultDiag',
  WarningDiag = 'WarningDiag',
  None = 'None',
}

export type UsageSegment = {
  __typename: 'UsageSegment';
  tractorID: string;
  type: SegmentType;
  startTime: string;
  endTime?: string | null;
  durationSec?: number | null;
  durationFormatted?: string | null;
  durationSecLogged?: number | null;
  durationLogged?: string | null;
  initialSOC?: number | null;
  finalSOC?: number | null;
  kwhConsumed?: number | null;
  kwhCharged?: number | null;
  distanceTravelled?: number | null;
  costSavings?: number | null;
  treesSaved?: number | null;
  disconnects?: DisconnectsM | null;
  parameterMetrics?: ParameterMetrics | null;
  faultMetrics?: FaultMetrics | null;
  createdAt?: string | null;
};

export type DisconnectsM = {
  __typename: 'DisconnectsM';
  totalCount?: number | null;
  totalDuration?: number | null;
  locations?: Array<StartEndLoc> | null;
};

export type StartEndLoc = {
  __typename: 'StartEndLoc';
  startLoc?: GPSCoord | null;
  endLoc?: GPSCoord | null;
};

export type GPSCoord = {
  __typename: 'GPSCoord';
  lat?: string | null;
  lng?: string | null;
};

export type ParameterMetrics = {
  __typename: 'ParameterMetrics';
  SOC?: MinMaxM | null;
  SOH?: MinMaxM | null;
  BatteryV?: MinMaxM | null;
  BatteryI?: MinMaxM | null;
  BatteryT?: MinMaxM | null;
  MaxRPM?: MinMaxM | null;
  WHM?: MinMaxM | null;
  MotorT?: MinMaxM | null;
  MinCellV?: MinMaxM | null;
  MaxCellV?: MinMaxM | null;
  Throttle?: MinMaxM | null;
  CumulativeRuntime?: MinMaxM | null;
};

export type MinMaxM = {
  __typename: 'MinMaxM';
  avg?: number | null;
  min?: MinMaxEntry | null;
  max?: MinMaxEntry | null;
};

export type MinMaxEntry = {
  __typename: 'MinMaxEntry';
  value?: number | null;
  ts?: string | null;
};

export type FaultMetrics = {
  __typename: 'FaultMetrics';
  Ecode?: Array<FaultValues> | null;
  FaultDiag?: Array<FaultValues> | null;
  WarningDiag?: Array<FaultValues> | null;
};

export type FaultValues = {
  __typename: 'FaultValues';
  metric?: FaultTypeEnum | null;
  value?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  Ecode?: number | null;
  FaultDiag?: number | null;
  ModuleTAtFault?: number | null;
  OutputFreqAtFault?: number | null;
  OutputIAtFault?: number | null;
  OutputVAtFault?: number | null;
  OutputDCBusVAtFault?: number | null;
  DiagInfoLastFault?: number | null;
  ModuleTLastFault?: number | null;
  OperatingFreqLastFault?: number | null;
  OutputILastFault?: number | null;
  OutputVLastFault?: number | null;
  BusVLastFault?: number | null;
};

export type DeleteUsageSegmentInput = {
  tractorID: string;
  startTime: string;
  type: SegmentType;
};

export type UploadAnalyticsInput = {
  tractorID: string;
  PeriodType: PeriodType;
  timeSegment: string;
  startTime?: string | null;
  endTime?: string | null;
  cumulative?: CumulativeMInput | null;
  trips?: CumulativeMInput | null;
  charges?: CumulativeMInput | null;
  standby?: CumulativeMInput | null;
  disconnects?: DisconnectsMInput | null;
  anomalies?: AnomaliesMInput | null;
  parameterMetrics?: ParameterMetricsInput | null;
  faultMetrics?: FaultMetricsInput | null;
};

export enum PeriodType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  GLOBAL = 'GLOBAL',
}

export type CumulativeMInput = {
  totalCount?: number | null;
  totalDuration?: number | null;
  totalLoggedDuration?: number | null;
  totalDistance?: number | null;
  totalKwhDelivered?: number | null;
  totalKwhCharged?: number | null;
  totalDisconnectCount?: number | null;
  totalDisconnectDuration?: number | null;
  totalCostSavings?: number | null;
  totalTreesSaved?: number | null;
};

export type AnomaliesMInput = {
  totalCount?: number | null;
};

export type Analytics = {
  __typename: 'Analytics';
  tractorID: string;
  PeriodType: PeriodType;
  timeSegment: string;
  startTime?: string | null;
  endTime?: string | null;
  cumulative?: CumulativeM | null;
  trips?: CumulativeM | null;
  charges?: CumulativeM | null;
  standby?: CumulativeM | null;
  disconnects?: DisconnectsM | null;
  anomalies?: AnomaliesM | null;
  parameterMetrics?: ParameterMetrics | null;
  faultMetrics?: FaultMetrics | null;
};

export type CumulativeM = {
  __typename: 'CumulativeM';
  totalCount?: number | null;
  totalDuration?: number | null;
  totalLoggedDuration?: number | null;
  totalDistance?: number | null;
  totalKwhDelivered?: number | null;
  totalKwhCharged?: number | null;
  totalDisconnectCount?: number | null;
  totalDisconnectDuration?: number | null;
  totalCostSavings?: number | null;
  totalTreesSaved?: number | null;
};

export type AnomaliesM = {
  __typename: 'AnomaliesM';
  totalCount?: number | null;
};

export type DeleteAnalyticsInput = {
  tractorID: string;
  PeriodType: PeriodType;
  timeSegment: string;
};

export type CreateLoggerInput = {
  loggerID: string;
  platform: LoggerPlatform;
  notes?: string | null;
};

export enum LoggerPlatform {
  AWS = 'AWS',
  FIREBASE = 'FIREBASE',
}

export type Logger = {
  __typename: 'Logger';
  loggerID: string;
  platform: LoggerPlatform;
  status: string;
  attachedToVIN?: string | null;
  attachedAt?: string | null;
  detachedAt?: string | null;
  notes?: string | null;
};

export type UpdateLoggerInput = {
  loggerID: string;
  platform?: LoggerPlatform | null;
  status?: string | null;
  attachedToVIN?: string | null;
  attachedAt?: string | null;
  detachedAt?: string | null;
  notes?: string | null;
};

export type CreateDriverInput = {
  name: string;
  phone?: string | null;
  aadhaarMasked?: string | null;
  licenseNumber?: string | null;
  licenseExpiry?: string | null;
  orgID: string;
  plantID?: string | null;
  status?: DriverStatus | null;
  notes?: string | null;
};

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
}

export type Driver = {
  __typename: 'Driver';
  driverID: string;
  name: string;
  phone?: string | null;
  aadhaarMasked?: string | null;
  licenseNumber?: string | null;
  licenseExpiry?: string | null;
  status: DriverStatus;
  orgID: string;
  plantID?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateDriverInput = {
  driverID: string;
  name?: string | null;
  phone?: string | null;
  aadhaarMasked?: string | null;
  licenseNumber?: string | null;
  licenseExpiry?: string | null;
  plantID?: string | null;
  status?: DriverStatus | null;
  notes?: string | null;
};

export type MarkAttendanceInput = {
  driverID: string;
  date: string;
  shift?: Shift | null;
  plantID: string;
  orgID: string;
  status: AttendanceStatus;
  checkInAt?: string | null;
  checkOutAt?: string | null;
  notes?: string | null;
};

export enum Shift {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
  GENERAL = 'GENERAL',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LEAVE = 'LEAVE',
  HALF_DAY = 'HALF_DAY',
  HOLIDAY = 'HOLIDAY',
}

export type Attendance = {
  __typename: 'Attendance';
  driverID: string;
  date: string;
  shift?: Shift | null;
  orgID: string;
  plantID: string;
  status: AttendanceStatus;
  checkInAt?: string | null;
  checkOutAt?: string | null;
  markedByUserID?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssignDriverInput = {
  driverID: string;
  date: string;
  shift: Shift;
  plantID: string;
  orgID: string;
  tractorVIN: string;
  loggerID?: string | null;
  startTime: string;
  notes?: string | null;
};

export type Assignment = {
  __typename: 'Assignment';
  driverID: string;
  date: string;
  shift: Shift;
  orgID: string;
  plantID: string;
  tractorVIN: string;
  loggerID?: string | null;
  startTime: string;
  endTime?: string | null;
  status: AssignmentStatus;
  assignedByUserID?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export enum AssignmentStatus {
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export type CancelDriverAssignmentInput = {
  driverID: string;
  date: string;
  shift: Shift;
  tractorVIN: string;
  notes?: string | null;
  assignmentSK?: string | null;
  assignId?: string | null;
};

export type EndDriverAssignmentInput = {
  driverID: string;
  date: string;
  shift: Shift;
  tractorVIN: string;
  endTime: string;
  notes?: string | null;
  assignmentSK?: string | null;
  assignId?: string | null;
};

export type CreateComplianceInput = {
  driverID: string;
  type: string;
  dueDate: string;
  status?: string | null;
  notes?: string | null;
};

export type ComplianceRecord = {
  __typename: 'ComplianceRecord';
  driverID: string;
  type: string;
  dueDate: string;
  status?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateComplianceInput = {
  driverID: string;
  type: string;
  dueDate: string;
  status?: string | null;
  notes?: string | null;
};

export type DeleteComplianceInput = {
  driverID: string;
  type: string;
  dueDate: string;
};

export type LogPerformanceInput = {
  driverID: string;
  date: string;
  orgID: string;
  plantID: string;
  hoursDriven?: number | null;
  tripsCompleted?: number | null;
  energyUsedKwh?: number | null;
  incidentsCount?: number | null;
  incidents?: Array<string> | null;
  notes?: string | null;
};

export type PerformanceLog = {
  __typename: 'PerformanceLog';
  driverID: string;
  date: string;
  orgID: string;
  plantID: string;
  hoursDriven?: number | null;
  tripsCompleted?: number | null;
  energyUsedKwh?: number | null;
  incidentsCount?: number | null;
  incidents?: Array<string> | null;
  notes?: string | null;
  enteredByUserID?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceInput = {
  vin: string;
  serviceID: string;
  serviceDate: string;
  issueType: ServiceIssueType;
  description?: string | null;
  reportedBy?: string | null;
  componentSerialsInvolved?: Array<string | null> | null;
};

export enum ServiceIssueType {
  BREAKDOWN = 'BREAKDOWN',
  FAULT = 'FAULT',
  PREVENTIVE = 'PREVENTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export type TractorService = {
  __typename: 'TractorService';
  vin: string;
  serviceID: string;
  serviceDate: string;
  issueType: ServiceIssueType;
  description?: string | null;
  reportedBy?: string | null;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  componentSerialsInvolved?: Array<string | null> | null;
  status: ServiceStatus;
  createdAt: string;
};

export enum ServiceStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export type UpdateServiceInput = {
  vin: string;
  serviceID: string;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  status?: ServiceStatus | null;
};

export type ReworkServiceInput = {
  vin: string;
  serviceID: string;
  reworkReason?: string | null;
};

export type CreateComplaintInput = {
  orgID: string;
  plantID?: string | null;
  tractorVIN?: string | null;
  loggerID?: string | null;
  raisedByUserID?: string | null;
  source: ComplaintSource;
  problemType: ComplaintProblemType;
  problemSubType?: string | null;
  maintenanceType?: MaintenanceType | null;
  resolutionTimeline?: string | null;
  description: string;
  priority?: ComplaintPriority | null;
  attachments?: Array<AttachmentInput> | null;
  pmsBaselineRuntime?: number | null;
  pmsCurrentRuntime?: number | null;
  pmsHoursAccumulated?: number | null;
  pmsBaselineDate?: string | null;
  breakdownDate?: string | null;
  breakdownType?: string | null;
  driverName?: string | null;
  shift?: string | null;
  location?: string | null;
  motorRunningHoursAtBreakdown?: number | null;
  daysVehicleOffRoad?: number | null;
  daysVehicleRemainedOffRoad?: number | null;
  delayReason?: string | null;
  actionRequired?: string | null;
  serviceManagerName?: string | null;
};

export enum ComplaintSource {
  CLIENT = 'CLIENT',
  DRIVER = 'DRIVER',
  INTERNAL = 'INTERNAL',
}

export enum ComplaintProblemType {
  MECHANICAL = 'MECHANICAL',
  ELECTRICAL = 'ELECTRICAL',
  SOFTWARE = 'SOFTWARE',
  ACCIDENT = 'ACCIDENT',
  MAJOR_BREAKDOWN = 'MAJOR_BREAKDOWN',
  PMS = 'PMS',
  WEEKLY_PREVENTIVE_CHECK = 'WEEKLY_PREVENTIVE_CHECK',
  BREAKDOWN = 'BREAKDOWN',
  RECALL_RETRO = 'RECALL_RETRO',
  OTHER = 'OTHER',
}

export enum MaintenanceType {
  PMS = 'PMS',
  WEEKLY_PREVENTIVE_CHECK = 'WEEKLY_PREVENTIVE_CHECK',
  BREAKDOWN = 'BREAKDOWN',
}

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export type AttachmentInput = {
  key: string;
  label?: string | null;
};

export type Complaint = {
  __typename: 'Complaint';
  complaintID: string;
  orgID: string;
  plantID?: string | null;
  tractorVIN?: string | null;
  loggerID?: string | null;
  raisedByUserID?: string | null;
  source: ComplaintSource;
  problemType: ComplaintProblemType;
  problemSubType?: string | null;
  maintenanceType?: MaintenanceType | null;
  description: string;
  priority?: ComplaintPriority | null;
  state: ComplaintState;
  assigneeUserID?: string | null;
  slaDeadline?: string | null;
  resolutionTimeline?: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  rating?: number | null;
  feedback?: string | null;
  ratedAt?: string | null;
  pmsBaselineRuntime?: number | null;
  pmsCurrentRuntime?: number | null;
  pmsHoursAccumulated?: number | null;
  pmsBaselineDate?: string | null;
  breakdownDate?: string | null;
  breakdownType?: string | null;
  driverName?: string | null;
  shift?: string | null;
  location?: string | null;
  motorRunningHoursAtBreakdown?: number | null;
  daysVehicleOffRoad?: number | null;
  daysVehicleRemainedOffRoad?: number | null;
  delayReason?: string | null;
  actionRequired?: string | null;
  serviceManagerName?: string | null;
  attachments?: Array<Attachment> | null;
  events?: Array<ComplaintEvent> | null;
};

export enum ComplaintState {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  RESOLVING = 'RESOLVING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export type Attachment = {
  __typename: 'Attachment';
  key: string;
  label?: string | null;
  uploadedBy?: string | null;
  uploadedAt: string;
};

export type ComplaintEvent = {
  __typename: 'ComplaintEvent';
  ts: string;
  type: TicketEventType;
  by?: string | null;
  note?: string | null;
  meta?: string | null;
};

export enum TicketEventType {
  CREATED = 'CREATED',
  VERIFIED = 'VERIFIED',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  PRIORITIZED = 'PRIORITIZED',
  ASSIGNED = 'ASSIGNED',
  STARTED = 'STARTED',
  NOTE = 'NOTE',
  ADDED_ATTACHMENT = 'ADDED_ATTACHMENT',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

export type VerifyComplaintInput = {
  complaintID: string;
  accepted: boolean;
  cancellationReason?: string | null;
};

export type CategorizeComplaintInput = {
  complaintID: string;
  priority: ComplaintPriority;
  resolutionTimeline?: string | null;
};

export type AssignComplaintInput = {
  complaintID: string;
  assigneeUserID: string;
};

export type StartResolutionInput = {
  complaintID: string;
};

export type AddResolutionNoteInput = {
  complaintID: string;
  note: string;
};

export type AddAttachmentInput = {
  complaintID: string;
  attachment: AttachmentInput;
};

export type ResolveComplaintInput = {
  complaintID: string;
  resolutionNote: string;
};

export type CloseComplaintInput = {
  complaintID: string;
  clientFeedback?: string | null;
};

export type CancelComplaintInput = {
  complaintID: string;
  reason: string;
};

export type UpdateComplaintDetailsInput = {
  complaintID: string;
  problemType?: ComplaintProblemType | null;
  problemSubType?: string | null;
  resolutionTimeline?: string | null;
  description?: string | null;
};

export type RateComplaintInput = {
  complaintID: string;
  rating: number;
  feedback?: string | null;
};

export type CreateJobCardInput = {
  orgID: string;
  plantID: string;
  tractorVIN: string;
  loggerID?: string | null;
  raisedByUserID?: string | null;
  repairCategory: RepairCategory;
  problemType: string;
  description: string;
  priority?: string | null;
  isVOR?: boolean | null;
  estimatedHours?: number | null;
};

export enum RepairCategory {
  NON_AGGREGATE = 'NON_AGGREGATE',
  AGGREGATE = 'AGGREGATE',
}

export type JobCard = {
  __typename: 'JobCard';
  jobCardID: string;
  jobCardNumber: string;
  orgID: string;
  plantID: string;
  tractorVIN: string;
  loggerID?: string | null;
  raisedByUserID?: string | null;
  repairCategory: RepairCategory;
  problemType: string;
  description: string;
  priority: string;
  isVOR: boolean;
  status: JobCardStatus;
  slaDeadline: string;
  slaHours: number;
  slaStatus: SLAStatus;
  slaPercentage: number;
  estimatedHours?: number | null;
  actualHours?: number | null;
  assignedTechnicianID?: string | null;
  labourCost: number;
  partsCost: number;
  vendorCost: number;
  totalCost: number;
  downtimeHours: number;
  delayReasons?: Array<DelayRecord> | null;
  customerFeedback?: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  closedAt?: string | null;
};

export enum JobCardStatus {
  DRAFT = 'DRAFT',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum SLAStatus {
  ON_TRACK = 'ON_TRACK',
  WARNING = 'WARNING',
  BREACHED = 'BREACHED',
}

export type DelayRecord = {
  __typename: 'DelayRecord';
  reason: DelayReason;
  notes?: string | null;
  recordedAt: string;
  recordedBy?: string | null;
};

export enum DelayReason {
  PARTS_UNAVAILABLE = 'PARTS_UNAVAILABLE',
  TECHNICIAN_UNAVAILABLE = 'TECHNICIAN_UNAVAILABLE',
  CUSTOMER_DELAY = 'CUSTOMER_DELAY',
  EQUIPMENT_FAILURE = 'EQUIPMENT_FAILURE',
  WEATHER = 'WEATHER',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  COMPLEX_REPAIR = 'COMPLEX_REPAIR',
  VENDOR_DELAY = 'VENDOR_DELAY',
  DOCUMENTATION_PENDING = 'DOCUMENTATION_PENDING',
  OTHER = 'OTHER',
}

export type UpdateJobCardInput = {
  jobCardID: string;
  status?: JobCardStatus | null;
  assignedTechnicianID?: string | null;
  actualHours?: number | null;
  labourCost?: number | null;
  partsCost?: number | null;
  vendorCost?: number | null;
  downtimeHours?: number | null;
  description?: string | null;
  priority?: string | null;
};

export type RecordDelayInput = {
  jobCardID: string;
  reason: DelayReason;
  notes?: string | null;
};

export type CloseJobCardInput = {
  jobCardID: string;
  customerFeedback?: string | null;
};

export type CreatePMSScheduleInput = {
  tractorVIN: string;
  orgID: string;
  plantID: string;
  intervalHours: number;
  intervalMonths: number;
  lastPMSDate?: string | null;
  lastPMSHourMeter?: number | null;
};

export type PMSSchedule = {
  __typename: 'PMSSchedule';
  scheduleID: string;
  tractorVIN: string;
  orgID: string;
  plantID: string;
  intervalHours: number;
  intervalMonths: number;
  lastPMSDate?: string | null;
  lastPMSHourMeter?: number | null;
  nextPMSDueDate: string;
  nextPMSDueHourMeter: number;
  status: PMSStatus;
  createdAt: string;
  updatedAt: string;
};

export enum PMSStatus {
  CURRENT = 'CURRENT',
  DUE_SOON = 'DUE_SOON',
  OVERDUE = 'OVERDUE',
}

export type UpdatePMSScheduleInput = {
  tractorVIN: string;
  lastPMSDate?: string | null;
  lastPMSHourMeter?: number | null;
  currentHourMeter?: number | null;
};

export type CreatePMSTrackerInput = {
  tractorVIN: string;
  orgID: string;
  plantID: string;
  intervalHours?: number | null;
  baselineRuntime: number;
  createdBy: string;
};

export type PMSTracker = {
  __typename: 'PMSTracker';
  trackerID: string;
  tractorVIN: string;
  orgID: string;
  plantID: string;
  intervalHours: number;
  baselineRuntime: number;
  currentRuntime?: number | null;
  hoursSinceLastPMS?: number | null;
  activeComplaintID?: string | null;
  status: PMSTrackerStatus;
  lastResetAt?: string | null;
  lastResetBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export enum PMSTrackerStatus {
  ACTIVE = 'ACTIVE',
  ALERT = 'ALERT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export type ResetPMSTrackerInput = {
  tractorVIN: string;
  currentRuntime: number;
  resetBy: string;
  complaintID?: string | null;
};

export type LinkPMSComplaintInput = {
  tractorVIN: string;
  complaintID: string;
};

export type CreateVORRequestInput = {
  orgID: string;
  plantID: string;
  tractorVIN: string;
  complaintID?: string | null;
  requiredParts: Array<RequiredPartInput>;
  urgency: VORUrgency;
  reason: string;
};

export type RequiredPartInput = {
  sku: string;
  quantity: number;
  description?: string | null;
  vendorSupportRequired: boolean;
  vendorOption?: Vendor | null;
};

export enum VORUrgency {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
}

export type VORRequest = {
  __typename: 'VORRequest';
  vorID: string;
  orgID: string;
  plantID: string;
  tractorVIN: string;
  complaintID?: string | null;
  requiredParts: Array<RequiredPart>;
  urgency: VORUrgency;
  reason: string;
  status: VORStatus;
  requestedBy: string;
  approvedBy?: string | null;
  dispatchedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string | null;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
};

export type RequiredPart = {
  __typename: 'RequiredPart';
  sku: string;
  quantity: number;
  description?: string | null;
  vendorSupportRequired: boolean;
  vendorOption?: Vendor | null;
};

export enum VORStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export type ApproveVORInput = {
  vorID: string;
  approvedBy: string;
  notes?: string | null;
};

export type DispatchVORInput = {
  vorID: string;
  dispatchedBy: string;
  trackingNumber?: string | null;
  notes?: string | null;
};

export type DeliverVORInput = {
  vorID: string;
  receivedBy: string;
  notes?: string | null;
};

export type CreateVendorRequestInput = {
  complaintID: string;
  orgID: string;
  plantID: string;
  tractorVIN?: string | null;
  vendorRequired: boolean;
  vendorType?: Vendor | null;
  description: string;
  requestedBy: string;
};

export type VendorRequest = {
  __typename: 'VendorRequest';
  vendorRequestID: string;
  complaintID: string;
  orgID: string;
  plantID: string;
  tractorVIN?: string | null;
  vendorRequired: boolean;
  vendorType?: Vendor | null;
  description: string;
  status: VendorRequestStatus;
  requestedBy: string;
  resolvedBy?: string | null;
  resolutionNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
};

export enum VendorRequestStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export type UpdateVendorRequestInput = {
  vendorRequestID: string;
  complaintID: string;
  vendorRequired?: boolean | null;
  vendorType?: Vendor | null;
  description?: string | null;
  status?: VendorRequestStatus | null;
};

export type CloseVendorRequestInput = {
  vendorRequestID: string;
  complaintID: string;
  resolvedBy: string;
  resolutionNotes?: string | null;
};

export type CreateWeeklyCheckScheduleInput = {
  orgID: string;
  plantID: string;
  weekStartDate: string;
  assignedTractors: Array<string>;
  assignedTechnicianID: string;
};

export type WeeklyCheckSchedule = {
  __typename: 'WeeklyCheckSchedule';
  scheduleID: string;
  orgID: string;
  plantID: string;
  weekStartDate: string;
  assignedTractors: Array<string>;
  assignedTechnicianID: string;
  status: WeeklyCheckStatus;
  createdAt: string;
  updatedAt: string;
};

export enum WeeklyCheckStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export type SubmitWeeklyCheckInput = {
  scheduleID: string;
  tractorVIN: string;
  technicianID: string;
  checklistItems: Array<ChecklistItemInput>;
  abnormalitiesFound: boolean;
};

export type ChecklistItemInput = {
  itemID: string;
  description: string;
  status: CheckStatus;
  notes?: string | null;
  photoURLs?: Array<string> | null;
};

export enum CheckStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export type WeeklyCheckSubmission = {
  __typename: 'WeeklyCheckSubmission';
  submissionID: string;
  scheduleID: string;
  tractorVIN: string;
  technicianID: string;
  checklistItems: Array<ChecklistItemResult>;
  abnormalitiesFound: boolean;
  submittedAt: string;
  convertedToJobCard: boolean;
  complaintID?: string | null;
};

export type ChecklistItemResult = {
  __typename: 'ChecklistItemResult';
  itemID: string;
  description: string;
  status: CheckStatus;
  notes?: string | null;
  photoURLs?: Array<string> | null;
};

export type CheckPartsAvailabilityInput = {
  jobCardID?: string | null;
  plantID: string;
  requiredParts: Array<RequiredPartInput>;
};

export type PartsAvailabilityResult = {
  __typename: 'PartsAvailabilityResult';
  jobCardID?: string | null;
  plantID: string;
  allAvailable: boolean;
  availableParts: Array<PartAvailability>;
  unavailableParts: Array<PartAvailability>;
  recommendedAction: string;
  canProceed: boolean;
  vorRequired: boolean;
};

export type PartAvailability = {
  __typename: 'PartAvailability';
  sku: string;
  description?: string | null;
  requiredQty: number;
  availableQty: number;
  reservedQty: number;
  isAvailable: boolean;
  stockLocation?: string | null;
};

export type ApproveJobCardClosureInput = {
  jobCardID: string;
  approvedBy: string;
  approvalNotes?: string | null;
};

export type RejectJobCardClosureInput = {
  jobCardID: string;
  rejectedBy: string;
  rejectionReason: string;
};

export type UpsertSkuInput = {
  sku: string;
  orgID?: string | null;
  name: string;
  description?: string | null;
  category: InventoryCategory;
  unit?: string | null;
  qtyPerUnit?: number | null;
  qtyForNxtBatch?: number | null;
  avlblQtyHapur?: number | null;
  minQty?: number | null;
  midQty?: number | null;
  maxQty?: number | null;
  modelApplicability?: SkuModelApplicabilityInput | null;
  modelPartsRequired?: SkuModelPartsRequiredInput | null;
  typicalPricePaise?: number | null;
  specs?: string | null;
};

export enum InventoryCategory {
  SPARES = 'SPARES',
  TOOLS = 'TOOLS',
  DEFECTIVE = 'DEFECTIVE',
}

export type SkuModelApplicabilityInput = {
  x45h2?: number | null;
  x45c2?: number | null;
  x45c2L?: number | null;
  x45c4?: number | null;
  h55c2?: number | null;
  h55c2L?: number | null;
  h55c4?: number | null;
  x60c2?: number | null;
  x60c2L?: number | null;
  x60c4?: number | null;
  x75c4?: number | null;
};

export type SkuModelPartsRequiredInput = {
  x45h2?: number | null;
  x45c2?: number | null;
  x45c2L?: number | null;
  x45c4?: number | null;
  h55c2?: number | null;
  h55c2L?: number | null;
  h55c4?: number | null;
  x60c2?: number | null;
  x60c2L?: number | null;
  x60c4?: number | null;
  x75c4?: number | null;
};

export type SkuMaster = {
  __typename: 'SkuMaster';
  sku: string;
  orgID?: string | null;
  name: string;
  description?: string | null;
  category: InventoryCategory;
  unit?: string | null;
  qtyPerUnit?: number | null;
  qtyForNxtBatch?: number | null;
  totalQtyForNxtBatch?: number | null;
  avlblQtyHapur?: number | null;
  partsRequired?: number | null;
  minQty?: number | null;
  midQty?: number | null;
  maxQty?: number | null;
  stockAvailability?: StockAvailability | null;
  modelApplicability?: SkuModelApplicability | null;
  modelPartsRequired?: SkuModelPartsRequired | null;
  typicalPricePaise?: number | null;
  specs?: string | null;
  createdAt: string;
  updatedAt: string;
};

export enum StockAvailability {
  AVAILABLE = 'AVAILABLE',
  LOW = 'LOW',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  OVERSTOCK = 'OVERSTOCK',
}

export type SkuModelApplicability = {
  __typename: 'SkuModelApplicability';
  x45h2: number;
  x45c2: number;
  x45c2L: number;
  x45c4: number;
  h55c2: number;
  h55c2L: number;
  h55c4: number;
  x60c2: number;
  x60c2L: number;
  x60c4: number;
  x75c4: number;
};

export type SkuModelPartsRequired = {
  __typename: 'SkuModelPartsRequired';
  x45h2: number;
  x45c2: number;
  x45c2L: number;
  x45c4: number;
  h55c2: number;
  h55c2L: number;
  h55c4: number;
  x60c2: number;
  x60c2L: number;
  x60c4: number;
  x75c4: number;
};

export type AssignSkuToPlantInput = {
  orgID: string;
  plantID: string;
  sku: string;
  category: InventoryCategory;
  openingQty?: number | null;
  minStock?: number | null;
  maxStock?: number | null;
  reorderLevel?: number | null;
  safetyNormPercentage?: number | null;
  locationBin?: string | null;
};

export type PlantStock = {
  __typename: 'PlantStock';
  orgID: string;
  plantID: string;
  sku: string;
  category: InventoryCategory;
  stock: number;
  reservedQty: number;
  minStock?: number | null;
  maxStock?: number | null;
  reorderLevel?: number | null;
  safetyNormPercentage?: number | null;
  locationBin?: string | null;
  updatedAt: string;
};

export type SetMinStockInput = {
  orgID: string;
  plantID: string;
  sku: string;
  category: InventoryCategory;
  minStock: number;
  maxStock?: number | null;
  reorderLevel?: number | null;
  safetyNormPercentage?: number | null;
  locationBin?: string | null;
};

export type ReceiveStockInput = {
  orgID: string;
  plantID: string;
  supplier?: string | null;
  billURL?: string | null;
  items: Array<ReceiveLineInput>;
};

export type ReceiveLineInput = {
  sku: string;
  qty: number;
  serials?: Array<string> | null;
  landedCostPaise?: number | null;
};

export type GoodsReceipt = {
  __typename: 'GoodsReceipt';
  receiptID: string;
  orgID: string;
  plantID: string;
  supplier?: string | null;
  billURL?: string | null;
  items: Array<ReceiptLine>;
  createdAt: string;
};

export type ReceiptLine = {
  __typename: 'ReceiptLine';
  sku: string;
  qty: number;
  serials?: Array<string> | null;
  landedCostPaise?: number | null;
};

export type ReserveStockInput = {
  orgID: string;
  ticketID: string;
  plantID: string;
  sku: string;
  qty: number;
  serials?: Array<string> | null;
  expireAfterHours?: number | null;
};

export type Reservation = {
  __typename: 'Reservation';
  resID: string;
  orgID: string;
  ticketID: string;
  plantID: string;
  sku: string;
  qty: number;
  serials?: Array<string> | null;
  status: ReservationStatus;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  pickedBy?: string | null;
  pickedAt?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  deliveredBy?: string | null;
  deliveredAt?: string | null;
  cancelledBy?: string | null;
  cancelledAt?: string | null;
  notes?: string | null;
};

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PICKED = 'PICKED',
  DISPATCHED = 'DISPATCHED',
  VERIFIED = 'VERIFIED',
  DELIVERED = 'DELIVERED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export type ApproveReservationInput = {
  orgID: string;
  resID: string;
  approvedBy: string;
  notes?: string | null;
};

export type PickReservationInput = {
  orgID: string;
  resID: string;
  pickedBy: string;
  notes?: string | null;
};

export type UpdateReservationStatusInput = {
  ticketID: string;
  resID: string;
  status: ReservationStatus;
  updatedBy: string;
  notes?: string | null;
};

export type DispatchReservedInput = {
  orgID: string;
  ticketID: string;
  resID: string;
  plantID: string;
  transportDocURL?: string | null;
};

export type GoodsIssue = {
  __typename: 'GoodsIssue';
  issueID: string;
  orgID: string;
  ticketID: string;
  plantID: string;
  items: Array<IssueLine>;
  transportDocURL?: string | null;
  createdAt: string;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  deliveredAt?: string | null;
};

export type IssueLine = {
  __typename: 'IssueLine';
  sku: string;
  qty: number;
  serials?: Array<string> | null;
};

export type VerifyDeliveryInput = {
  orgID: string;
  ticketID: string;
  issueID: string;
  verifiedBy: string;
  notes?: string | null;
};

export type ConfirmDeliveryInput = {
  orgID: string;
  ticketID: string;
  issueID: string;
  deliveredAt?: string | null;
};

export type CancelReservationInput = {
  orgID: string;
  resID: string;
  cancelledBy: string;
  reason?: string | null;
};

export type InstallSerialInput = {
  orgID: string;
  serial: string;
  loggerID: string;
  tractorVIN?: string | null;
  componentType: ComponentType;
  ticketID?: string | null;
};

export enum ComponentType {
  MOTOR = 'MOTOR',
  CONTROLLER = 'CONTROLLER',
  BMS = 'BMS',
  BATTERY = 'BATTERY',
  CHARGER = 'CHARGER',
  INVERTER = 'INVERTER',
  DISPLAY = 'DISPLAY',
  SENSOR = 'SENSOR',
  HARNESS = 'HARNESS',
  OTHER = 'OTHER',
}

export type SerialMaster = {
  __typename: 'SerialMaster';
  serial: string;
  orgID: string;
  sku: string;
  state: SerialState;
  plantID?: string | null;
  loggerID?: string | null;
  tractorVIN?: string | null;
  lastTicketID?: string | null;
  costPaise?: number | null;
  warrantyTill?: string | null;
  createdAt: string;
  updatedAt: string;
};

export enum SerialState {
  IN_STOCK = 'IN_STOCK',
  RESERVED = 'RESERVED',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
  INSTALLED = 'INSTALLED',
  DEFECTIVE = 'DEFECTIVE',
  RMA_SENT = 'RMA_SENT',
  RMA_RCVD = 'RMA_RCVD',
  SCRAPPED = 'SCRAPPED',
}

export type RemoveSerialInput = {
  orgID: string;
  serial: string;
  loggerID: string;
  reason?: string | null;
  ticketID?: string | null;
};

export type CreateTransferInput = {
  orgID: string;
  srcPlantID: string;
  dstPlantID: string;
  items: Array<TransferLineInput>;
};

export type TransferLineInput = {
  sku: string;
  qty: number;
  serials?: Array<string> | null;
};

export type TransferOrder = {
  __typename: 'TransferOrder';
  transferID: string;
  orgID: string;
  srcPlantID: string;
  dstPlantID: string;
  status: TransferStatus;
  items: Array<TransferLine>;
  createdAt: string;
  dispatchedAt?: string | null;
  receivedAt?: string | null;
};

export enum TransferStatus {
  CREATED = 'CREATED',
  DISPATCHED = 'DISPATCHED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export type TransferLine = {
  __typename: 'TransferLine';
  sku: string;
  qty: number;
  serials?: Array<string> | null;
};

export type DispatchTransferInput = {
  orgID: string;
  transferID: string;
};

export type ReceiveTransferInput = {
  orgID: string;
  transferID: string;
};

export type AdjustStockInput = {
  orgID: string;
  plantID: string;
  sku: string;
  category: InventoryCategory;
  delta: number;
  reason?: InventoryLogReason | null;
  meta?: string | null;
};

export enum InventoryLogReason {
  RECEIPT = 'RECEIPT',
  DISPATCHED = 'DISPATCHED',
  RETURN_OLD = 'RETURN_OLD',
  TRANSFER_OUT = 'TRANSFER_OUT',
  TRANSFER_IN = 'TRANSFER_IN',
  ADJUSTMENT = 'ADJUSTMENT',
  AUDIT_DIFF = 'AUDIT_DIFF',
  SCRAP = 'SCRAP',
}

export type CreateWarrantyClaimInput = {
  orgID: string;
  partID: string;
  serial?: string | null;
  ticketID: string;
  reason?: string | null;
};

export type WarrantyClaim = {
  __typename: 'WarrantyClaim';
  claimID: string;
  orgID: string;
  partID: string;
  serial?: string | null;
  ticketID: string;
  reason?: string | null;
  status: WarrantyStatus;
  vendorRMA?: string | null;
  createdAt: string;
  updatedAt: string;
};

export enum WarrantyStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REPLACEMENT_DISPATCHED = 'REPLACEMENT_DISPATCHED',
  CLOSED = 'CLOSED',
}

export type UpdateWarrantyClaimStatusInput = {
  orgID: string;
  claimID: string;
  status: WarrantyStatus;
  vendorRMA?: string | null;
};

export type ApplyReceiptLineInput = {
  orgID: string;
  plantID: string;
  sku: string;
  category: InventoryCategory;
  qty: number;
  minStock?: number | null;
  locationBin?: string | null;
};

export type UpsertSerialInput = {
  orgID: string;
  plantID: string;
  sku: string;
  serial: string;
  warrantyTill?: string | null;
  costPaise?: number | null;
  receiptID?: string | null;
};

export type AppendInventoryLogInput = {
  orgID: string;
  plantID: string;
  sku: string;
  delta: number;
  reason: InventoryLogReason;
  ticketID?: string | null;
  before?: number | null;
  after?: number | null;
  meta?: string | null;
  dedupeKey?: string | null;
};

export type InventoryLog = {
  __typename: 'InventoryLog';
  orgID: string;
  plantID: string;
  sku: string;
  ts: string;
  delta: number;
  reason: InventoryLogReason;
  ticketID?: string | null;
  before?: number | null;
  after?: number | null;
  meta?: string | null;
};

export type StartMediaUploadInput = {
  entity: string;
  entityID: string;
  orgID: string;
  plantID: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
};

export type StartMediaUploadOutput = {
  __typename: 'StartMediaUploadOutput';
  key: string;
  uploadType: string;
  putUrl?: string | null;
  uploadId?: string | null;
  partSize?: number | null;
  partUrls?: Array<string> | null;
};

export type CompleteMediaUploadInput = {
  key: string;
  uploadId?: string | null;
  etags?: Array<string> | null;
  meta?: MediaMetaInput | null;
  entity: string;
  entityID: string;
  orgID: string;
  plantID: string;
  contentType: string;
  sizeBytes: number;
};

export type CreateLogBookEntryInput = {
  orgID: string;
  plantID: string;
  logDate: string;
  files: Array<LogBookFileInput>;
  notes?: string | null;
  createdBy: string;
};

export type LogBookFileInput = {
  key: string;
  fileName?: string | null;
  contentType?: string | null;
  sizeBytes?: number | null;
};

export type LogBookEntry = {
  __typename: 'LogBookEntry';
  orgID: string;
  plantID: string;
  logDate: string;
  files: Array<LogBookFile>;
  notes?: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type LogBookFile = {
  __typename: 'LogBookFile';
  key: string;
  fileName?: string | null;
  contentType?: string | null;
  sizeBytes?: number | null;
};

export type UpdateLogBookEntryInput = {
  orgID: string;
  plantID: string;
  logDate: string;
  files?: Array<LogBookFileInput> | null;
  notes?: string | null;
  updatedBy: string;
};

export type DeleteLogBookEntryInput = {
  orgID: string;
  plantID: string;
  logDate: string;
};

export type CreateEmployeePunchInput = {
  userID: string;
  orgID: string;
  plantID: string;
  officeID?: string | null;
  date: string;
  type: PunchType;
  ts?: string | null;
  source?: PunchSource | null;
  notes?: string | null;
};

export enum PunchType {
  IN = 'IN',
  OUT = 'OUT',
  BREAK_START = 'BREAK_START',
  BREAK_END = 'BREAK_END',
}

export enum PunchSource {
  SELF = 'SELF',
  SUPERVISOR = 'SUPERVISOR',
  KIOSK = 'KIOSK',
  SYSTEM = 'SYSTEM',
}

export type EmployeePunch = {
  __typename: 'EmployeePunch';
  userID: string;
  orgID: string;
  plantID: string;
  officeID?: string | null;
  date: string;
  type: PunchType;
  ts: string;
  source: PunchSource;
  method?: string | null;
  location?: string | null;
  markedByUserID?: string | null;
  notes?: string | null;
  createdAt: string;
};

export type UpsertEmployeeAttendanceDayInput = {
  userID: string;
  orgID: string;
  plantID: string;
  officeID?: string | null;
  date: string;
  status: EmployeeAttendanceStatus;
  checkInAt?: string | null;
  checkOutAt?: string | null;
  punchCount?: number | null;
  lastPunchType?: PunchType | null;
  lastPunchAt?: string | null;
  notes?: string | null;
  markedByUserID?: string | null;
};

export enum EmployeeAttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LEAVE = 'LEAVE',
  HALF_DAY = 'HALF_DAY',
  HOLIDAY = 'HOLIDAY',
}

export type EmployeeAttendanceDay = {
  __typename: 'EmployeeAttendanceDay';
  userID: string;
  orgID: string;
  plantID: string;
  officeID?: string | null;
  date: string;
  status: EmployeeAttendanceStatus;
  checkInAt?: string | null;
  checkOutAt?: string | null;
  punchCount: number;
  lastPunchType?: PunchType | null;
  lastPunchAt?: string | null;
  notes?: string | null;
  markedByUserID?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RegisterEmployeeFaceInput = {
  userID: string;
  s3Key: string;
  officeID: string;
  orgID: string;
};

export type FaceRegistrationResult = {
  __typename: 'FaceRegistrationResult';
  success: boolean;
  message: string;
  faceId?: string | null;
  userID: string;
};

export type MarkAttendanceWithFaceInput = {
  s3Key: string;
  punchType?: PunchType | null;
  officeID: string;
  orgID: string;
  location?: string | null;
  notes?: string | null;
};

export type FaceAttendanceResult = {
  __typename: 'FaceAttendanceResult';
  success: boolean;
  message: string;
  userID: string;
  confidence: number;
  punchType: PunchType;
  timestamp: string;
  punchID: string;
};

export type MarkManualAttendanceInput = {
  userID: string;
  orgID: string;
  plantID: string;
  officeID?: string | null;
  date?: string | null;
  punchType: PunchType;
  location?: string | null;
  notes?: string | null;
};

export type ManualAttendanceResult = {
  __typename: 'ManualAttendanceResult';
  success: boolean;
  message: string;
  userID: string;
  punchType: PunchType;
  timestamp: string;
  punchID: string;
  method: string;
  location?: string | null;
};

export type CreateManualRuntimeEntryInput = {
  loggerID: string;
  plantID: string;
  orgID: string;
  date?: string | null;
  startCumulativeRuntime: number;
  endCumulativeRuntime: number;
};

export type ManualRuntimeEntry = {
  __typename: 'ManualRuntimeEntry';
  loggerID: string;
  date: string;
  plantID?: string | null;
  orgID?: string | null;
  startCumulativeRuntime: number;
  endCumulativeRuntime: number;
  todaysRuntime: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UpdateManualRuntimeEntryInput = {
  loggerID: string;
  date: string;
  startCumulativeRuntime?: number | null;
  endCumulativeRuntime?: number | null;
};

export type CreateAttendanceRegularizationInput = {
  userID: string;
  // User's email address (must match attendance record PK format EMP#<email>).
  userEmail?: string | null;
  // Logged-in user submitting the request (from client session).
  submittedByUserID: string;
  orgID: string;
  plantID: string;
  date: string;
  requestedStatus: EmployeeAttendanceStatus;
  reason: AttendanceRegularizationReason;
  description: string;
  attachments?: Array<string> | null;
};

export enum AttendanceRegularizationReason {
  FORGOT_CHECK_IN = 'FORGOT_CHECK_IN',
  FORGOT_CHECK_OUT = 'FORGOT_CHECK_OUT',
  BIOMETRIC_FAILED = 'BIOMETRIC_FAILED',
  LATE_DUE_TO_VALID_REASON = 'LATE_DUE_TO_VALID_REASON',
  OFFICIAL_WORK = 'OFFICIAL_WORK',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  WORK_FROM_HOME = 'WORK_FROM_HOME',
  MEETING = 'MEETING',
  TRAVEL = 'TRAVEL',
  OTHER = 'OTHER',
}

export type AttendanceRegularizationRequest = {
  __typename: 'AttendanceRegularizationRequest';
  requestID: string;
  userID: string;
  userEmail?: string | null;
  orgID: string;
  plantID: string;
  date: string;
  currentStatus: EmployeeAttendanceStatus;
  requestedStatus: EmployeeAttendanceStatus;
  reason: AttendanceRegularizationReason;
  description: string;
  attachments?: Array<string> | null;
  status: AttendanceRegularizationStatus;
  submittedAt: string;
  submittedBy: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewComments?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
};

export enum AttendanceRegularizationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export type ApproveAttendanceRegularizationInput = {
  requestID: string;
  // Must match the attendance date on the request (SK REQ#<date>).
  date: string;
  approverID: string;
  reviewComments?: string | null;
};

export type RejectAttendanceRegularizationInput = {
  requestID: string;
  // Must match the attendance date on the request (SK REQ#<date>).
  date: string;
  reviewerID: string;
  rejectionReason: string;
  reviewComments?: string | null;
};

export type CancelAttendanceRegularizationInput = {
  requestID: string;
  // Must match the attendance date on the request (SK REQ#<date>).
  date: string;
  // Logged-in user cancelling (from client session).
  cancelledByUserID: string;
  cancellationReason?: string | null;
};

export type CreatePayslipInput = {
  userID: string;
  year: number;
  month: number;
  officeID: string;
  orgID: string;
  status: PayslipStatus;
  basicSalary: number;
  allowances?: PayslipAllowancesInput | null;
  deductions?: PayslipDeductionsInput | null;
  payPeriodStart: string;
  payPeriodEnd: string;
  documents?: Array<PayslipDocumentInput> | null;
  notes?: string | null;
};

export enum PayslipStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

export type PayslipAllowancesInput = {
  hra?: number | null;
  transport?: number | null;
  medical?: number | null;
  bonus?: number | null;
  overtime?: number | null;
  other?: number | null;
};

export type PayslipDeductionsInput = {
  pf?: number | null;
  esi?: number | null;
  tax?: number | null;
  loan?: number | null;
  advance?: number | null;
  other?: number | null;
};

export type PayslipDocumentInput = {
  type: PayslipDocumentType;
  fileName: string;
  fileSize: number;
  s3Key: string;
};

export enum PayslipDocumentType {
  SALARY_SLIP = 'SALARY_SLIP',
  BANK_STATEMENT = 'BANK_STATEMENT',
  BONUS_CERTIFICATE = 'BONUS_CERTIFICATE',
  OTHER = 'OTHER',
}

export type Payslip = {
  __typename: 'Payslip';
  payslipID: string;
  userID: string;
  year: number;
  month: number;
  officeID: string;
  orgID: string;
  status: PayslipStatus;
  basicSalary: number;
  allowances?: PayslipAllowances | null;
  deductions?: PayslipDeductions | null;
  grossSalary: number;
  netSalary: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  generatedDate: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  documents?: Array<PayslipDocument> | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PayslipAllowances = {
  __typename: 'PayslipAllowances';
  hra?: number | null;
  transport?: number | null;
  medical?: number | null;
  bonus?: number | null;
  overtime?: number | null;
  other?: number | null;
  total: number;
};

export type PayslipDeductions = {
  __typename: 'PayslipDeductions';
  pf?: number | null;
  esi?: number | null;
  tax?: number | null;
  loan?: number | null;
  advance?: number | null;
  other?: number | null;
  total: number;
};

export type PayslipDocument = {
  __typename: 'PayslipDocument';
  documentID: string;
  type: PayslipDocumentType;
  fileName: string;
  fileSize: number;
  s3Key?: string | null;
  uploadedAt: string;
  uploadedBy: string;
};

export type UploadPayslipInput = {
  userID: string;
  year: number;
  month: number;
  s3Key: string;
  fileName: string;
  fileSize: number;
};

export type DeletePayslipResult = {
  __typename: 'DeletePayslipResult';
  success: boolean;
  message: string;
  deletedPayslipID?: string | null;
};

export type PayslipDownloadUrl = {
  __typename: 'PayslipDownloadUrl';
  downloadUrl: string;
  expiresIn: number;
};

export type CreateReimbursementClaimInput = {
  orgID: string;
  plantID: string;
  claimType: ReimbursementClaimType;
  amount: number;
  currency?: string | null;
  description: string;
  category: ReimbursementCategory;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  bankDetails?: BankDetailsInput | null;
  upiDetails?: UPIDetailsInput | null;
  proofDocuments?: Array<ReimbursementDocumentInput> | null;
  notes?: string | null;
  submittedBy?: string | null;
  userID?: string | null;
};

export enum ReimbursementClaimType {
  SALARY_ADVANCE = 'SALARY_ADVANCE',
  MEDICAL_REIMBURSEMENT = 'MEDICAL_REIMBURSEMENT',
  TRAVEL_REIMBURSEMENT = 'TRAVEL_REIMBURSEMENT',
  FUEL_REIMBURSEMENT = 'FUEL_REIMBURSEMENT',
  MEAL_ALLOWANCE = 'MEAL_ALLOWANCE',
  OVERTIME_PAYMENT = 'OVERTIME_PAYMENT',
  BONUS_CLAIM = 'BONUS_CLAIM',
  OTHER = 'OTHER',
}

export enum ReimbursementCategory {
  MEDICAL = 'MEDICAL',
  TRAVEL = 'TRAVEL',
  FUEL = 'FUEL',
  FOOD = 'FOOD',
  ACCOMMODATION = 'ACCOMMODATION',
  EQUIPMENT = 'EQUIPMENT',
  TRAINING = 'TRAINING',
  OTHER = 'OTHER',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  UPI = 'UPI',
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
}

export type BankDetailsInput = {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string | null;
};

export type UPIDetailsInput = {
  upiID: string;
  upiName: string;
};

export type ReimbursementDocumentInput = {
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  s3Key: string;
};

export enum DocumentType {
  RECEIPT = 'RECEIPT',
  INVOICE = 'INVOICE',
  MEDICAL_BILL = 'MEDICAL_BILL',
  FUEL_BILL = 'FUEL_BILL',
  TRAVEL_TICKET = 'TRAVEL_TICKET',
  HOTEL_BILL = 'HOTEL_BILL',
  SALARY_SLIP = 'SALARY_SLIP',
  BANK_STATEMENT = 'BANK_STATEMENT',
  PRESCRIPTION = 'PRESCRIPTION',
  LAB_REPORT = 'LAB_REPORT',
  INSURANCE_CLAIM = 'INSURANCE_CLAIM',
  TAX_INVOICE = 'TAX_INVOICE',
  EXPENSE_REPORT = 'EXPENSE_REPORT',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  CONTRACT = 'CONTRACT',
  AGREEMENT = 'AGREEMENT',
  CERTIFICATE = 'CERTIFICATE',
  LICENSE = 'LICENSE',
  PERMIT = 'PERMIT',
  ID_PROOF = 'ID_PROOF',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
  PHOTOGRAPH = 'PHOTOGRAPH',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  SPREADSHEET = 'SPREADSHEET',
  PRESENTATION = 'PRESENTATION',
  TEXT_DOCUMENT = 'TEXT_DOCUMENT',
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  OTHER = 'OTHER',
}

export type RaiseReimbursement = {
  __typename: 'RaiseReimbursement';
  claimID: string;
  userID: string;
  plantID: string;
  orgID: string;
  claimType: ReimbursementClaimType;
  amount: number;
  currency: string;
  description: string;
  category: ReimbursementCategory;
  expenseDate: string;
  status: ReimbursementStatus;
  paymentMethod: PaymentMethod;
  bankDetails?: BankDetails | null;
  upiDetails?: UPIDetails | null;
  proofDocuments: Array<ReimbursementDocument>;
  submittedAt: string;
  submittedBy: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  processedBy?: string | null;
  processedAt?: string | null;
  paidAt?: string | null;
  transactionID?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export enum ReimbursementStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export type BankDetails = {
  __typename: 'BankDetails';
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string | null;
};

export type UPIDetails = {
  __typename: 'UPIDetails';
  upiID: string;
  upiName: string;
};

export type ReimbursementDocument = {
  __typename: 'ReimbursementDocument';
  documentID: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  uploadedAt: string;
  s3Key: string;
  s3Bucket: string;
};

export type UpdateReimbursementClaimInput = {
  claimID: string;
  amount?: number | null;
  description?: string | null;
  category?: ReimbursementCategory | null;
  expenseDate?: string | null;
  paymentMethod?: PaymentMethod | null;
  bankDetails?: BankDetailsInput | null;
  upiDetails?: UPIDetailsInput | null;
  notes?: string | null;
};

export type ApproveReimbursementClaimInput = {
  claimID: string;
  approverID: string;
  notes?: string | null;
};

export type RejectReimbursementClaimInput = {
  claimID: string;
  approverID: string;
  rejectionReason: string;
};

export type ProcessReimbursementPaymentInput = {
  claimID: string;
  processorID: string;
  transactionID?: string | null;
  notes?: string | null;
};

export type UploadReimbursementDocumentInput = {
  claimID: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
};

export type UploadPayslipDocumentInput = {
  payslipID: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType: PayslipDocumentType;
  s3Key: string;
};

export type UploadGenericDocumentInput = {
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  s3Key: string;
  orgID: string;
  tags?: Array<string> | null;
  description?: string | null;
  isPublic?: boolean | null;
  expiresAt?: string | null;
};

export type GenericDocument = {
  __typename: 'GenericDocument';
  documentID: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  s3Key: string;
  s3Bucket: string;
  uploadedAt: string;
  uploadedBy: string;
  orgID: string;
  tags?: Array<string> | null;
  description?: string | null;
  isPublic: boolean;
  downloadCount: number;
  expiresAt?: string | null;
};

export type GetReimbursementUploadUrlInput = {
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  claimID?: string | null;
};

export type PresignedUploadUrl = {
  __typename: 'PresignedUploadUrl';
  uploadUrl: string;
  s3Key: string;
  expiresIn: number;
  maxFileSize: number;
};

export type GetPayslipUploadUrlInput = {
  fileName: string;
  fileSize: number;
  mimeType: string;
  payslipID?: string | null;
  documentType: PayslipDocumentType;
  s3Key?: string | null;
  userID?: string | null;
  year?: number | null;
  month?: number | null;
};

export type GetGenericDocumentUploadUrlInput = {
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  orgID: string;
  tags?: Array<string> | null;
  description?: string | null;
  isPublic?: boolean | null;
  expiresAt?: string | null;
};

export type InitiatePasswordResetInput = {
  email: string;
  customMessage?: string | null;
};

export type PasswordResetInitiationResult = {
  __typename: 'PasswordResetInitiationResult';
  success: boolean;
  message: string;
  expiresIn?: string | null;
};

export type VerifyResetCodeInput = {
  email: string;
  code: string;
};

export type PasswordResetVerificationResult = {
  __typename: 'PasswordResetVerificationResult';
  success: boolean;
  message: string;
};

export type CompletePasswordResetInput = {
  email: string;
  code: string;
  newPassword: string;
};

export type PasswordResetCompletionResult = {
  __typename: 'PasswordResetCompletionResult';
  success: boolean;
  message: string;
};

export type CreateOfficeLocationInput = {
  orgID: string;
  plantID?: string | null;
  name: string;
  officeType: OfficeType;
  address: OfficeAddressInput;
  contactInfo?: OfficeContactInfoInput | null;
  geofenceRadius?: number | null;
};

export enum OfficeType {
  HEAD_OFFICE = 'HEAD_OFFICE',
  BRANCH_OFFICE = 'BRANCH_OFFICE',
  REGIONAL_OFFICE = 'REGIONAL_OFFICE',
  WAREHOUSE = 'WAREHOUSE',
  SERVICE_CENTER = 'SERVICE_CENTER',
  SALES_OFFICE = 'SALES_OFFICE',
  FIELD_OFFICE = 'FIELD_OFFICE',
}

export type OfficeAddressInput = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: GPSCoordinatesInput | null;
};

export type GPSCoordinatesInput = {
  latitude: number;
  longitude: number;
};

export type OfficeContactInfoInput = {
  phone?: string | null;
  email?: string | null;
  managerName?: string | null;
  managerPhone?: string | null;
};

export type OfficeLocation = {
  __typename: 'OfficeLocation';
  officeID: string;
  orgID: string;
  plantID?: string | null;
  name: string;
  officeType: OfficeType;
  address: OfficeAddress;
  contactInfo?: OfficeContactInfo | null;
  geofenceRadius?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OfficeAddress = {
  __typename: 'OfficeAddress';
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: GPSCoordinates | null;
};

export type GPSCoordinates = {
  __typename: 'GPSCoordinates';
  latitude: number;
  longitude: number;
};

export type OfficeContactInfo = {
  __typename: 'OfficeContactInfo';
  phone?: string | null;
  email?: string | null;
  managerName?: string | null;
  managerPhone?: string | null;
};

export type UpdateOfficeLocationInput = {
  officeID: string;
  name?: string | null;
  officeType?: OfficeType | null;
  address?: OfficeAddressInput | null;
  contactInfo?: OfficeContactInfoInput | null;
  geofenceRadius?: number | null;
  isActive?: boolean | null;
};

export type DeleteOfficeLocationInput = {
  officeID: string;
};

export type CreateLeavePolicyInput = {
  orgID: string;
  plantID?: string | null;
  leaveType: LeaveType;
  totalDaysPerYear: number;
  eligibleGenders: Array<Gender>;
  eligibleRoles: Array<string>;
  carryForwardAllowed: boolean;
  maxCarryForwardDays?: number | null;
  minServiceMonths?: number | null;
  maxConsecutiveDays?: number | null;
  requiresApproval: boolean;
  approvalLevels: number;
};

export enum LeaveType {
  ANNUAL_LEAVE = 'ANNUAL_LEAVE',
  CASUAL_LEAVE = 'CASUAL_LEAVE',
  SICK_LEAVE = 'SICK_LEAVE',
  MATERNITY_LEAVE = 'MATERNITY_LEAVE',
  PATERNITY_LEAVE = 'PATERNITY_LEAVE',
  COMP_OFF = 'COMP_OFF',
  LWP = 'LWP',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export type LeavePolicy = {
  __typename: 'LeavePolicy';
  policyID: string;
  orgID: string;
  plantID?: string | null;
  leaveType: LeaveType;
  totalDaysPerYear: number;
  eligibleGenders: Array<Gender>;
  eligibleRoles: Array<string>;
  carryForwardAllowed: boolean;
  maxCarryForwardDays?: number | null;
  minServiceMonths?: number | null;
  maxConsecutiveDays?: number | null;
  requiresApproval: boolean;
  approvalLevels: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateLeavePolicyInput = {
  orgID: string;
  leaveType: LeaveType;
  totalDaysPerYear?: number | null;
  eligibleGenders?: Array<Gender> | null;
  eligibleRoles?: Array<string> | null;
  carryForwardAllowed?: boolean | null;
  maxCarryForwardDays?: number | null;
  minServiceMonths?: number | null;
  maxConsecutiveDays?: number | null;
  requiresApproval?: boolean | null;
  approvalLevels?: number | null;
  isActive?: boolean | null;
};

export type InitializeUserLeaveBalancesInput = {
  userID: string;
  orgID: string;
  year: number;
  overrideExisting?: boolean | null;
};

export type LeaveBalance = {
  __typename: 'LeaveBalance';
  balanceID: string;
  userID: string;
  year: number;
  leaveType: LeaveType;
  totalAllocated: number;
  used: number;
  pending: number;
  available: number;
  carryForward: number;
  lastUpdated: string;
};

export type AdjustLeaveBalanceInput = {
  userID: string;
  year: number;
  leaveType: LeaveType;
  adjustmentDays: number;
  reason: string;
  adjustedBy: string;
};

export type CarryForwardLeaveBalancesInput = {
  orgID: string;
  fromYear: number;
  toYear: number;
  userIDs?: Array<string> | null;
};

export type ApplyForLeaveInput = {
  userID: string;
  orgID: string;
  plantID: string;
  officeID?: string | null;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  attachments?: Array<LeaveAttachmentInput> | null;
  // If set, indexes this application under GSI4 for listLeaveApplicationsByApprover.
  assignedApproverID?: string | null;
};

export type LeaveAttachmentInput = {
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
};

export type LeaveApplication = {
  __typename: 'LeaveApplication';
  applicationID: string;
  userID: string;
  orgID: string;
  plantID: string;
  officeID?: string | null;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  cancellationReason?: string | null;
  attachments?: Array<LeaveAttachment> | null;
  createdAt: string;
  updatedAt: string;
};

export enum LeaveStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export type LeaveAttachment = {
  __typename: 'LeaveAttachment';
  attachmentID: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  uploadedAt: string;
};

export type UpdateLeaveApplicationInput = {
  applicationID: string;
  startDate?: string | null;
  endDate?: string | null;
  reason?: string | null;
  attachments?: Array<LeaveAttachmentInput> | null;
};

export type CancelLeaveApplicationInput = {
  applicationID: string;
  cancellationReason: string;
};

export type ApproveLeaveApplicationInput = {
  applicationID: string;
  approverID: string;
  notes?: string | null;
};

export type RejectLeaveApplicationInput = {
  applicationID: string;
  approverID: string;
  rejectionReason: string;
};

export type BulkApproveLeaveApplicationsInput = {
  applicationIDs: Array<string>;
  approverID: string;
  notes?: string | null;
};

export type BulkRejectLeaveApplicationsInput = {
  applicationIDs: Array<string>;
  approverID: string;
  rejectionReason: string;
};

export type CreateOfficeCalendarInput = {
  officeID: string;
  date: string;
  dayType: DayType;
  holidayName?: string | null;
  description?: string | null;
  workingHours?: DayWorkingHoursInput | null;
};

export enum DayType {
  WORKING_DAY = 'WORKING_DAY',
  WEEKEND = 'WEEKEND',
  PUBLIC_HOLIDAY = 'PUBLIC_HOLIDAY',
  COMPANY_HOLIDAY = 'COMPANY_HOLIDAY',
  HALF_DAY = 'HALF_DAY',
  EARLY_CLOSURE = 'EARLY_CLOSURE',
}

export type DayWorkingHoursInput = {
  startTime: string;
  endTime: string;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
};

export type OfficeCalendar = {
  __typename: 'OfficeCalendar';
  officeID: string;
  date: string;
  dayType: DayType;
  isWorkingDay: boolean;
  holidayName?: string | null;
  description?: string | null;
  workingHours?: DayWorkingHours | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type DayWorkingHours = {
  __typename: 'DayWorkingHours';
  startTime: string;
  endTime: string;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
  totalHours: number;
};

export type UpdateOfficeCalendarInput = {
  officeID: string;
  date: string;
  dayType?: DayType | null;
  holidayName?: string | null;
  description?: string | null;
  workingHours?: DayWorkingHoursInput | null;
};

export type BulkCreateHolidaysInput = {
  officeID: string;
  holidays: Array<HolidayInput>;
};

export type HolidayInput = {
  date: string;
  holidayName: string;
  description?: string | null;
  dayType: DayType;
};

export type BulkUpdateCalendarDaysInput = {
  officeID: string;
  calendarDays: Array<CalendarDayUpdateInput>;
};

export type CalendarDayUpdateInput = {
  date: string;
  dayType: DayType;
  holidayName?: string | null;
  description?: string | null;
  workingHours?: DayWorkingHoursInput | null;
};

export type UniversalResponse = {
  __typename: 'UniversalResponse';
  success: boolean;
  message: string;
  data?: string | null;
  tableName: string;
  operation: string;
  timestamp: string;
};

export type UniversalBatchOperationInput = {
  operation: BatchOperationType;
  tableName: string;
  id?: string | null;
  data?: string | null;
};

export enum BatchOperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export type UniversalBatchResponse = {
  __typename: 'UniversalBatchResponse';
  success: boolean;
  message: string;
  results: Array<UniversalResponse>;
  successCount: number;
  failureCount: number;
  timestamp: string;
};

export type UniversalGroupResponse = {
  __typename: 'UniversalGroupResponse';
  success: boolean;
  message: string;
  groups: Array<CognitoGroup>;
  users: Array<CognitoUser>;
  groupDetails?: string | null;
  timestamp: string;
};

export enum GroupMembershipAction {
  ADD_USERS = 'ADD_USERS',
  REMOVE_USERS = 'REMOVE_USERS',
  REPLACE_USERS = 'REPLACE_USERS',
}

export type CreateBookingInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  state: string;
  subject: string;
  message: string;
  visitType: VisitType;
  preferredDate?: string | null;
  preferredTime?: string | null;
  orgID?: string | null;
  plantID?: string | null;
};

export enum VisitType {
  SITE_VISIT = 'SITE_VISIT',
  PRODUCT_DEMO = 'PRODUCT_DEMO',
  CONSULTATION = 'CONSULTATION',
  MAINTENANCE = 'MAINTENANCE',
  INSPECTION = 'INSPECTION',
  OTHER = 'OTHER',
}

export type Booking = {
  __typename: 'Booking';
  bookingID: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  state: string;
  subject: string;
  message: string;
  visitType: VisitType;
  preferredDate?: string | null;
  preferredTime?: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string | null;
  notes?: string | null;
  orgID?: string | null;
  plantID?: string | null;
};

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export type UpdateBookingInput = {
  bookingID: string;
  status?: BookingStatus | null;
  assignedTo?: string | null;
  notes?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  city?: string | null;
  country?: string | null;
  state?: string | null;
  subject?: string | null;
  message?: string | null;
  visitType?: VisitType | null;
};

export type CognitoUserConnection = {
  __typename: 'CognitoUserConnection';
  items: Array<CognitoUser>;
  nextToken?: string | null;
};

export type DebugUserResult = {
  __typename: 'DebugUserResult';
  username: string;
  attempts: Array<DebugUserAttempt>;
  groups?: Array<string> | null;
  groupsError?: string | null;
  summary: DebugUserSummary;
};

export type DebugUserAttempt = {
  __typename: 'DebugUserAttempt';
  username: string;
  success: boolean;
  user?: CognitoUser | null;
  error?: string | null;
  errorType?: string | null;
};

export type DebugUserSummary = {
  __typename: 'DebugUserSummary';
  userFound: boolean;
  groupsFound: boolean;
  totalAttempts: number;
  successfulAttempts: number;
};

export type DebugEnvironmentResult = {
  __typename: 'DebugEnvironmentResult';
  success: boolean;
  environment: DebugEnvironment;
};

export type DebugEnvironment = {
  __typename: 'DebugEnvironment';
  userPoolId: string;
  region: string;
  timestamp: string;
  connectivity?: string | null;
  totalUsers?: number | null;
  error?: DebugError | null;
};

export type DebugError = {
  __typename: 'DebugError';
  name?: string | null;
  message?: string | null;
  code?: string | null;
};

export type UserConnection = {
  __typename: 'UserConnection';
  items: Array<User>;
  nextToken?: string | null;
};

export type MediaConnection = {
  __typename: 'MediaConnection';
  items: Array<Media>;
  nextToken?: string | null;
};

export type Telemetry = {
  __typename: 'Telemetry';
  tractorID: string;
  timestamp: string;
  timestamp_epoch?: number | null;
  TTL?: number | null;
  hex_ID?: string | null;
  hex_timestamp?: string | null;
  status?: string | null;
  Lat?: string | null;
  Long?: string | null;
  SOC?: number | null;
  SOH?: number | null;
  Charge?: number | null;
  LimpMode?: number | null;
  BatteryV?: number | null;
  BatteryI?: number | null;
  BatteryT?: number | null;
  MinCellV?: number | null;
  MaxCellV?: number | null;
  MaxRPM?: number | null;
  MotorT?: number | null;
  Roll?: number | null;
  Pitch?: number | null;
  Yaw?: number | null;
  Throttle?: number | null;
  WHM?: number | null;
  OutputPower?: number | null;
  TimeEla?: number | null;
  CumulativeRuntime?: number | null;
  MaxBatteryI?: number | null;
  Ecode?: number | null;
  FaultDiag?: number | null;
  ModuleTAtFault?: number | null;
  OutputFreqAtFault?: number | null;
  OutputIAtFault?: number | null;
  OutputVAtFault?: number | null;
  OutputDCBusVAtFault?: number | null;
  DiagInfoLastFault?: number | null;
  ModuleTLastFault?: number | null;
  OperatingFreqLastFault?: number | null;
  OutputILastFault?: number | null;
  OutputVLastFault?: number | null;
  BusVLastFault?: number | null;
};

export type PaginatedTelemetry = {
  __typename: 'PaginatedTelemetry';
  items?: Array<Telemetry | null> | null;
  nextToken?: string | null;
};

export type ManualRuntimeEntryConnection = {
  __typename: 'ManualRuntimeEntryConnection';
  items: Array<ManualRuntimeEntry>;
  nextToken?: string | null;
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type PaginatedUsageSegment = {
  __typename: 'PaginatedUsageSegment';
  items?: Array<UsageSegment | null> | null;
  nextToken?: string | null;
};

export type PaginatedAnalytics = {
  __typename: 'PaginatedAnalytics';
  items?: Array<Analytics | null> | null;
  nextToken?: string | null;
};

export type DriverConnection = {
  __typename: 'DriverConnection';
  items: Array<Driver>;
  nextToken?: string | null;
};

export type ComplianceConnection = {
  __typename: 'ComplianceConnection';
  items: Array<ComplianceRecord>;
  nextToken?: string | null;
};

export type AttendanceConnection = {
  __typename: 'AttendanceConnection';
  items: Array<Attendance>;
  nextToken?: string | null;
};

export type AssignmentConnection = {
  __typename: 'AssignmentConnection';
  items: Array<Assignment>;
  nextToken?: string | null;
};

export type PerformanceConnection = {
  __typename: 'PerformanceConnection';
  items: Array<PerformanceLog>;
  nextToken?: string | null;
};

export type ComplaintConnection = {
  __typename: 'ComplaintConnection';
  items: Array<Complaint>;
  nextToken?: string | null;
};

export type JobCardConnection = {
  __typename: 'JobCardConnection';
  items: Array<JobCard>;
  nextToken?: string | null;
};

export type VORRequestConnection = {
  __typename: 'VORRequestConnection';
  items: Array<VORRequest>;
  nextToken?: string | null;
};

export type VendorRequestConnection = {
  __typename: 'VendorRequestConnection';
  items: Array<VendorRequest>;
  nextToken?: string | null;
};

export type PMSScheduleConnection = {
  __typename: 'PMSScheduleConnection';
  items: Array<PMSSchedule>;
  nextToken?: string | null;
};

export type PMSAlertConnection = {
  __typename: 'PMSAlertConnection';
  items: Array<PMSAlert>;
  nextToken?: string | null;
};

export type PMSAlert = {
  __typename: 'PMSAlert';
  tractorVIN: string;
  orgID: string;
  plantID: string;
  currentHourMeter: number;
  lastPMSDate?: string | null;
  lastPMSHourMeter?: number | null;
  hoursSinceLastPMS: number;
  monthsSinceLastPMS: number;
  alertType: PMSAlertType;
  alertMessage: string;
  needsImmediateAttention: boolean;
  createdAt: string;
};

export enum PMSAlertType {
  HOURS_THRESHOLD_EXCEEDED = 'HOURS_THRESHOLD_EXCEEDED',
  MONTHS_THRESHOLD_EXCEEDED = 'MONTHS_THRESHOLD_EXCEEDED',
  BOTH_THRESHOLDS_EXCEEDED = 'BOTH_THRESHOLDS_EXCEEDED',
}

export type PMSTrackerConnection = {
  __typename: 'PMSTrackerConnection';
  items: Array<PMSTracker>;
  nextToken?: string | null;
};

export type PMSTrackerAlert = {
  __typename: 'PMSTrackerAlert';
  tractorVIN: string;
  trackerID: string;
  baselineRuntime: number;
  currentRuntime: number;
  hoursSinceLastPMS: number;
  intervalHours: number;
  hoursRemaining: number;
  alertRequired: boolean;
  status: PMSTrackerStatus;
  activeComplaintID?: string | null;
};

export type PMSHistoryConnection = {
  __typename: 'PMSHistoryConnection';
  items: Array<PMSHistory>;
  nextToken?: string | null;
};

export type PMSHistory = {
  __typename: 'PMSHistory';
  historyID: string;
  tractorVIN: string;
  orgID: string;
  complaintID?: string | null;
  baselineRuntime: number;
  resetRuntime: number;
  hoursAccumulated: number;
  resetAt: string;
  resetBy: string;
};

export type PMSLiveStatus = {
  __typename: 'PMSLiveStatus';
  tractorID: string;
  totalRuntimeHours: number;
  baselineRuntime: number;
  hoursAccumulated: number;
  hoursRemaining: number;
  percentComplete: number;
  intervalHours: number;
  status: PMSTrackerStatus;
  alertRequired: boolean;
  activeComplaintID?: string | null;
  lastResetAt?: string | null;
  trackerExists: boolean;
};

export type WeeklyCheckConnection = {
  __typename: 'WeeklyCheckConnection';
  items: Array<WeeklyCheckSchedule>;
  nextToken?: string | null;
};

export type DelayAnalytics = {
  __typename: 'DelayAnalytics';
  orgID: string;
  plantID?: string | null;
  startDate: string;
  endDate: string;
  totalJobs: number;
  delayedJobs: number;
  delayPercentage: number;
  reasonBreakdown: Array<ReasonCount>;
  repeatFailures: Array<RepeatFailurePattern>;
  avgDelayHours?: number | null;
};

export type ReasonCount = {
  __typename: 'ReasonCount';
  reason: string;
  count: number;
  percentage: number;
  avgDelayHours?: number | null;
};

export type RepeatFailurePattern = {
  __typename: 'RepeatFailurePattern';
  tractorVIN: string;
  reason: string;
  occurrences: number;
  lastOccurrence: string;
  firstOccurrence: string;
  avgTimeBetweenOccurrences?: number | null;
};

export type SLAComplianceReport = {
  __typename: 'SLAComplianceReport';
  orgID: string;
  plantID?: string | null;
  startDate: string;
  endDate: string;
  totalJobs: number;
  onTimeJobs: number;
  delayedJobs: number;
  compliancePercentage: number;
  avgCompletionTime?: number | null;
  byCategory: Array<CategoryCompliance>;
  byPriority: Array<PriorityCompliance>;
  trend: Array<DailyCompliance>;
};

export type CategoryCompliance = {
  __typename: 'CategoryCompliance';
  category: string;
  totalJobs: number;
  onTimeJobs: number;
  compliancePercentage: number;
};

export type PriorityCompliance = {
  __typename: 'PriorityCompliance';
  priority: string;
  totalJobs: number;
  onTimeJobs: number;
  compliancePercentage: number;
};

export type DailyCompliance = {
  __typename: 'DailyCompliance';
  date: string;
  totalJobs: number;
  onTimeJobs: number;
  compliancePercentage: number;
};

export type TechnicianProductivityReport = {
  __typename: 'TechnicianProductivityReport';
  technicianID: string;
  startDate: string;
  endDate: string;
  totalJobsAssigned: number;
  totalJobsCompleted: number;
  completionRate: number;
  avgCompletionTime?: number | null;
  onTimeJobs: number;
  delayedJobs: number;
  slaComplianceRate: number;
  totalLabourHours?: number | null;
  avgLabourHoursPerJob?: number | null;
  jobsByCategory: Array<CategoryCount>;
  jobsByPriority: Array<PriorityCount>;
};

export type CategoryCount = {
  __typename: 'CategoryCount';
  category: string;
  count: number;
};

export type PriorityCount = {
  __typename: 'PriorityCount';
  priority: string;
  count: number;
};

export type PlantPerformanceReport = {
  __typename: 'PlantPerformanceReport';
  plantID: string;
  startDate: string;
  endDate: string;
  totalJobs: number;
  completedJobs: number;
  delayedJobs: number;
  avgCompletionTime?: number | null;
  slaComplianceRate: number;
  totalCost: number;
  avgCostPerJob?: number | null;
  totalDowntimeHours?: number | null;
  topDelayReasons: Array<ReasonCount>;
  technicianPerformance: Array<TechnicianSummary>;
};

export type TechnicianSummary = {
  __typename: 'TechnicianSummary';
  technicianID: string;
  jobsCompleted: number;
  avgCompletionTime?: number | null;
  slaComplianceRate: number;
};

export type TractorCostReport = {
  __typename: 'TractorCostReport';
  tractorVIN: string;
  startDate: string;
  endDate: string;
  totalJobs: number;
  totalCost: number;
  labourCost: number;
  partsCost: number;
  vendorCost: number;
  avgCostPerJob?: number | null;
  totalDowntimeHours?: number | null;
  costByCategory: Array<CategoryCost>;
  costTrend: Array<MonthlyCost>;
};

export type CategoryCost = {
  __typename: 'CategoryCost';
  category: string;
  jobCount: number;
  totalCost: number;
  avgCost?: number | null;
};

export type MonthlyCost = {
  __typename: 'MonthlyCost';
  month: string;
  totalCost: number;
  jobCount: number;
};

export type SiteCostReport = {
  __typename: 'SiteCostReport';
  plantID: string;
  startDate: string;
  endDate: string;
  totalJobs: number;
  totalCost: number;
  labourCost: number;
  partsCost: number;
  vendorCost: number;
  avgCostPerJob?: number | null;
  costByTractor: Array<TractorCostSummary>;
  costByCategory: Array<CategoryCost>;
  monthlyTrend: Array<MonthlyCost>;
};

export type TractorCostSummary = {
  __typename: 'TractorCostSummary';
  tractorVIN: string;
  jobCount: number;
  totalCost: number;
  avgCost?: number | null;
};

export type InventoryAgingReport = {
  __typename: 'InventoryAgingReport';
  plantID: string;
  generatedAt: string;
  totalItems: number;
  totalValue?: number | null;
  agingBuckets: Array<AgingBucket>;
  slowMovingItems: Array<SlowMovingPart>;
};

export type AgingBucket = {
  __typename: 'AgingBucket';
  daysRange: string;
  itemCount: number;
  totalValue?: number | null;
  percentage: number;
};

export type SlowMovingPart = {
  __typename: 'SlowMovingPart';
  sku: string;
  description?: string | null;
  currentStock: number;
  lastMovementDate?: string | null;
  daysSinceLastMovement: number;
  estimatedValue?: number | null;
  recommendedAction?: string | null;
};

export type SkuMasterConnection = {
  __typename: 'SkuMasterConnection';
  items: Array<SkuMaster>;
  nextToken?: string | null;
};

export type PlantStockConnection = {
  __typename: 'PlantStockConnection';
  items: Array<PlantStock>;
  nextToken?: string | null;
};

export type OrgStockSummary = {
  __typename: 'OrgStockSummary';
  orgID: string;
  sku: string;
  category: InventoryCategory;
  orgTotalStock: number;
  orgTotalReserved: number;
  orgTotalAvailable: number;
  plants: Array<PlantStockBreakdown>;
};

export type PlantStockBreakdown = {
  __typename: 'PlantStockBreakdown';
  plantID: string;
  sku: string;
  category: InventoryCategory;
  totalReceived: number;
  stock: number;
  reservedQty: number;
  available: number;
  minStock?: number | null;
  locationBin?: string | null;
  updatedAt: string;
};

export type OrgStockSummaryConnection = {
  __typename: 'OrgStockSummaryConnection';
  items: Array<OrgStockSummary>;
  nextToken?: string | null;
};

export type InventoryLogConnection = {
  __typename: 'InventoryLogConnection';
  items: Array<InventoryLog>;
  nextToken?: string | null;
};

export type SerialEventConnection = {
  __typename: 'SerialEventConnection';
  items: Array<SerialEvent>;
  nextToken?: string | null;
};

export type SerialEvent = {
  __typename: 'SerialEvent';
  serial: string;
  ts: string;
  type: string;
  meta?: string | null;
};

export type SerialMasterConnection = {
  __typename: 'SerialMasterConnection';
  items: Array<SerialMaster>;
  nextToken?: string | null;
};

export type GoodsReceiptConnection = {
  __typename: 'GoodsReceiptConnection';
  items: Array<GoodsReceipt>;
  nextToken?: string | null;
};

export type ReservationConnection = {
  __typename: 'ReservationConnection';
  items: Array<Reservation>;
  nextToken?: string | null;
};

export type GoodsIssueConnection = {
  __typename: 'GoodsIssueConnection';
  items: Array<GoodsIssue>;
  nextToken?: string | null;
};

export type TransferOrderConnection = {
  __typename: 'TransferOrderConnection';
  items: Array<TransferOrder>;
  nextToken?: string | null;
};

export type WarrantyClaimConnection = {
  __typename: 'WarrantyClaimConnection';
  items: Array<WarrantyClaim>;
  nextToken?: string | null;
};

export enum InventoryPeriodType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  GLOBAL = 'GLOBAL',
}

export type InventoryAnalytics = {
  __typename: 'InventoryAnalytics';
  orgID: string;
  plantID?: string | null;
  period: InventoryPeriodType;
  key: string;
  receiptsQty: number;
  issuesQty: number;
  transfersIn: number;
  transfersOut: number;
  stockoutHours?: number | null;
  fillRate?: number | null;
  leadTimeApproveToDispatchSec?: number | null;
  leadTimeDispatchToDeliverSec?: number | null;
  shrinkageQty?: number | null;
  warrantyReturnRate?: number | null;
  partsCostPaise?: number | null;
  transportCostPaise?: number | null;
  updatedAt: string;
};

export type InventoryAnalyticsConnection = {
  __typename: 'InventoryAnalyticsConnection';
  items: Array<InventoryAnalytics>;
  nextToken?: string | null;
};

export type ListEntityMediaInput = {
  entity: string;
  entityID: string;
};

export type LogBookEntryConnection = {
  __typename: 'LogBookEntryConnection';
  items: Array<LogBookEntry>;
  nextToken?: string | null;
};

export type EmployeeAttendanceDayConnection = {
  __typename: 'EmployeeAttendanceDayConnection';
  items: Array<EmployeeAttendanceDay>;
  nextToken?: string | null;
};

export type EmployeePunchConnection = {
  __typename: 'EmployeePunchConnection';
  items: Array<EmployeePunch>;
  nextToken?: string | null;
};

export type FaceRegistration = {
  __typename: 'FaceRegistration';
  userID: string;
  faceId: string;
  s3Key: string;
  officeID: string;
  orgID: string;
  registeredAt: string;
  updatedAt: string;
};

export type AttendanceRegularizationConnection = {
  __typename: 'AttendanceRegularizationConnection';
  items: Array<AttendanceRegularizationRequest>;
  nextToken?: string | null;
};

export type OfficeLocationConnection = {
  __typename: 'OfficeLocationConnection';
  items: Array<OfficeLocation>;
  nextToken?: string | null;
};

export type PayslipConnection = {
  __typename: 'PayslipConnection';
  items: Array<Payslip>;
  nextToken?: string | null;
};

export type OfficeCalendarConnection = {
  __typename: 'OfficeCalendarConnection';
  items: Array<OfficeCalendar>;
  nextToken?: string | null;
};

export type ReimbursementConnection = {
  __typename: 'ReimbursementConnection';
  items: Array<RaiseReimbursement>;
  nextToken?: string | null;
};

export type LeavePolicyConnection = {
  __typename: 'LeavePolicyConnection';
  items: Array<LeavePolicy>;
  nextToken?: string | null;
};

export type LeaveBalanceConnection = {
  __typename: 'LeaveBalanceConnection';
  items: Array<LeaveBalance>;
  nextToken?: string | null;
};

export type LeaveApplicationConnection = {
  __typename: 'LeaveApplicationConnection';
  items: Array<LeaveApplication>;
  nextToken?: string | null;
};

export type LeaveCalendarEntry = {
  __typename: 'LeaveCalendarEntry';
  date: string;
  userID: string;
  userName: string;
  leaveType: LeaveType;
  applicationID: string;
  status: LeaveStatus;
};

export type UnifiedAttendanceResponse = {
  __typename: 'UnifiedAttendanceResponse';
  attendanceRecords: Array<EmployeeAttendanceDay>;
  punchRecords: Array<EmployeePunch>;
  leaveApplications: Array<LeaveApplication>;
  officeCalendarDays: Array<UnifiedOfficeCalendarDay>;
  statistics: AttendanceStatistics;
};

export type UnifiedOfficeCalendarDay = {
  __typename: 'UnifiedOfficeCalendarDay';
  officeID: string;
  date: string;
  dayType: string;
  isWorkingDay: boolean;
  holidayName?: string | null;
  description?: string | null;
};

export type AttendanceStatistics = {
  __typename: 'AttendanceStatistics';
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  halfDays: number;
  holidayDays: number;
  lateDays: number;
  avgHoursPerDay?: number | null;
  totalHours?: number | null;
};

export type UniversalFilterInput = {
  field: string;
  operator: FilterOperator;
  value: string;
  dataType?: FilterDataType | null;
};

export enum FilterOperator {
  EQ = 'EQ',
  NE = 'NE',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  BETWEEN = 'BETWEEN',
  IS_NULL = 'IS_NULL',
  IS_NOT_NULL = 'IS_NOT_NULL',
}

export enum FilterDataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  JSON = 'JSON',
}

export type UniversalQueryResponse = {
  __typename: 'UniversalQueryResponse';
  success: boolean;
  message: string;
  data: Array<string>;
  tableName: string;
  count: number;
  nextToken?: string | null;
  timestamp: string;
};

export type GenericDocumentConnection = {
  __typename: 'GenericDocumentConnection';
  items: Array<GenericDocument>;
  nextToken?: string | null;
  totalCount: number;
};

export type DocumentDownloadUrl = {
  __typename: 'DocumentDownloadUrl';
  downloadUrl: string;
  expiresIn: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

export type ERPItemConnection = {
  __typename: 'ERPItemConnection';
  items: Array<ERPItem>;
  nextToken?: string | null;
};

export type ListBookingsInput = {
  status?: BookingStatus | null;
  visitType?: VisitType | null;
  orgID?: string | null;
  plantID?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type BookingConnection = {
  __typename: 'BookingConnection';
  items: Array<Booking>;
  nextToken?: string | null;
};

export type CreateOrganizationMutationVariables = {
  input: CreateOrganizationInput;
};

export type CreateOrganizationMutation = {
  createOrganization: {
    __typename: 'Organization';
    orgID: string;
    name: string;
    industry?: string | null;
    location?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateOrganizationMutationVariables = {
  input: UpdateOrganizationInput;
};

export type UpdateOrganizationMutation = {
  updateOrganization?: {
    __typename: 'Organization';
    orgID: string;
    name: string;
    industry?: string | null;
    location?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteOrganizationMutationVariables = {
  orgID: string;
};

export type DeleteOrganizationMutation = {
  deleteOrganization?: {
    __typename: 'Organization';
    orgID: string;
    name: string;
    industry?: string | null;
    location?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreatePlantMutationVariables = {
  input: CreatePlantInput;
};

export type CreatePlantMutation = {
  createPlant: {
    __typename: 'Plant';
    orgID: string;
    plantID: string;
    name: string;
    location?: string | null;
    plantType?: PlantType | null;
    parentHubID?: string | null;
    plantHeadID?: string | null;
    supervisorID?: string | null;
    driverIDs?: Array<string | null> | null;
    electricityCostPKWH?: string | null;
    dieselCostPL?: string | null;
    additionalSupport?: boolean | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdatePlantMutationVariables = {
  input: UpdatePlantInput;
};

export type UpdatePlantMutation = {
  updatePlant: {
    __typename: 'Plant';
    orgID: string;
    plantID: string;
    name: string;
    location?: string | null;
    plantType?: PlantType | null;
    parentHubID?: string | null;
    plantHeadID?: string | null;
    supervisorID?: string | null;
    driverIDs?: Array<string | null> | null;
    electricityCostPKWH?: string | null;
    dieselCostPL?: string | null;
    additionalSupport?: boolean | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type DeletePlantMutationVariables = {
  orgID: string;
  plantID: string;
};

export type DeletePlantMutation = {
  deletePlant: {
    __typename: 'Plant';
    orgID: string;
    plantID: string;
    name: string;
    location?: string | null;
    plantType?: PlantType | null;
    parentHubID?: string | null;
    plantHeadID?: string | null;
    supervisorID?: string | null;
    driverIDs?: Array<string | null> | null;
    electricityCostPKWH?: string | null;
    dieselCostPL?: string | null;
    additionalSupport?: boolean | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateUserMutationVariables = {
  input: CreateUserInput;
};

export type CreateUserMutation = {
  createUser: {
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput;
};

export type UpdateUserMutation = {
  updateUser: {
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type DeleteUserMutationVariables = {
  id: string;
};

export type DeleteUserMutation = {
  deleteUser?: {
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type SavePushTokenMutationVariables = {
  userId: string;
  pushToken?: string | null;
};

export type SavePushTokenMutation = {
  savePushToken: {
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type SendPushNotificationMutationVariables = {
  input: SendPushNotificationInput;
};

export type SendPushNotificationMutation = {
  sendPushNotification: {
    __typename: 'SendPushNotificationResult';
    success: boolean;
    message?: string | null;
    sent?: number | null;
  };
};

export type NotifyPlantTechnicalSupervisorMutationVariables = {
  input: NotifyPlantTechnicalSupervisorInput;
};

export type NotifyPlantTechnicalSupervisorMutation = {
  notifyPlantTechnicalSupervisor: {
    __typename: 'NotificationResult';
    success: boolean;
    message?: string | null;
    notifiedSupervisors?: Array<string> | null;
    notificationSentAt?: string | null;
  };
};

export type CreateERPItemMutationVariables = {
  input: CreateERPItemInput;
};

export type CreateERPItemMutation = {
  createERPItem: {
    __typename: 'ERPItem';
    PK: string;
    SK: string;
    entity_type?: string | null;
    data?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    partCode?: string | null;
    partName?: string | null;
    category?: string | null;
    uom?: string | null;
    perUnitTractor?: number | null;
    batchQty?: number | null;
    availableQtyHapur?: number | null;
    partsRequired?: number | null;
    machine?: {
      __typename: 'ERPPartMachineQuantities';
      X45H2?: number | null;
      X60C2L?: number | null;
      X45C4?: number | null;
      X60C2?: number | null;
      X60C4?: number | null;
    } | null;
    availableForTractor?: number | null;
    location?: string | null;
    availableQtyAmount?: number | null;
    suppliers?: Array<{
      __typename: 'ERPSupplierEntry';
      name: string;
      priority: number;
    }> | null;
    perTractorCost?: number | null;
    price?: number | null;
    priceWithGST?: number | null;
    gstRate?: number | null;
    amountRequired?: number | null;
    advanceAvailable?: number | null;
    leadTimeWeeks?: number | null;
    creditTerms?: string | null;
    orderedQty?: number | null;
    balanceQty?: number | null;
    daysForFirstPayment?: number | null;
    moq?: number | null;
    leadTimeDays?: number | null;
    paymentAtPOPercent?: number | null;
    balancePaymentPercent?: number | null;
    creditDays?: number | null;
    poData?: Array<{
      __typename: 'ERPPODataEntry';
      poDate?: string | null;
      firstPayment?: number | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: string | null;
      secondPaymentAmount?: number | null;
    }> | null;
    orderingPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    leadTimePlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlanWithTaxes?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
  };
};

export type UpdateERPItemMutationVariables = {
  input: UpdateERPItemInput;
};

export type UpdateERPItemMutation = {
  updateERPItem: {
    __typename: 'ERPItem';
    PK: string;
    SK: string;
    entity_type?: string | null;
    data?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    partCode?: string | null;
    partName?: string | null;
    category?: string | null;
    uom?: string | null;
    perUnitTractor?: number | null;
    batchQty?: number | null;
    availableQtyHapur?: number | null;
    partsRequired?: number | null;
    machine?: {
      __typename: 'ERPPartMachineQuantities';
      X45H2?: number | null;
      X60C2L?: number | null;
      X45C4?: number | null;
      X60C2?: number | null;
      X60C4?: number | null;
    } | null;
    availableForTractor?: number | null;
    location?: string | null;
    availableQtyAmount?: number | null;
    suppliers?: Array<{
      __typename: 'ERPSupplierEntry';
      name: string;
      priority: number;
    }> | null;
    perTractorCost?: number | null;
    price?: number | null;
    priceWithGST?: number | null;
    gstRate?: number | null;
    amountRequired?: number | null;
    advanceAvailable?: number | null;
    leadTimeWeeks?: number | null;
    creditTerms?: string | null;
    orderedQty?: number | null;
    balanceQty?: number | null;
    daysForFirstPayment?: number | null;
    moq?: number | null;
    leadTimeDays?: number | null;
    paymentAtPOPercent?: number | null;
    balancePaymentPercent?: number | null;
    creditDays?: number | null;
    poData?: Array<{
      __typename: 'ERPPODataEntry';
      poDate?: string | null;
      firstPayment?: number | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: string | null;
      secondPaymentAmount?: number | null;
    }> | null;
    orderingPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    leadTimePlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlanWithTaxes?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
  };
};

export type DeleteERPItemMutationVariables = {
  pk: string;
  sk: string;
};

export type DeleteERPItemMutation = {
  deleteERPItem?: {
    __typename: 'ERPItem';
    PK: string;
    SK: string;
    entity_type?: string | null;
    data?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    partCode?: string | null;
    partName?: string | null;
    category?: string | null;
    uom?: string | null;
    perUnitTractor?: number | null;
    batchQty?: number | null;
    availableQtyHapur?: number | null;
    partsRequired?: number | null;
    machine?: {
      __typename: 'ERPPartMachineQuantities';
      X45H2?: number | null;
      X60C2L?: number | null;
      X45C4?: number | null;
      X60C2?: number | null;
      X60C4?: number | null;
    } | null;
    availableForTractor?: number | null;
    location?: string | null;
    availableQtyAmount?: number | null;
    suppliers?: Array<{
      __typename: 'ERPSupplierEntry';
      name: string;
      priority: number;
    }> | null;
    perTractorCost?: number | null;
    price?: number | null;
    priceWithGST?: number | null;
    gstRate?: number | null;
    amountRequired?: number | null;
    advanceAvailable?: number | null;
    leadTimeWeeks?: number | null;
    creditTerms?: string | null;
    orderedQty?: number | null;
    balanceQty?: number | null;
    daysForFirstPayment?: number | null;
    moq?: number | null;
    leadTimeDays?: number | null;
    paymentAtPOPercent?: number | null;
    balancePaymentPercent?: number | null;
    creditDays?: number | null;
    poData?: Array<{
      __typename: 'ERPPODataEntry';
      poDate?: string | null;
      firstPayment?: number | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: string | null;
      secondPaymentAmount?: number | null;
    }> | null;
    orderingPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    leadTimePlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlanWithTaxes?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
  } | null;
};

export type GenerateMonthlyPlanMutationVariables = {
  input: GenerateMonthlyPlanInput;
};

export type GenerateMonthlyPlanMutation = {
  generateMonthlyPlan: {
    __typename: 'ERPItem';
    PK: string;
    SK: string;
    entity_type?: string | null;
    data?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    partCode?: string | null;
    partName?: string | null;
    category?: string | null;
    uom?: string | null;
    perUnitTractor?: number | null;
    batchQty?: number | null;
    availableQtyHapur?: number | null;
    partsRequired?: number | null;
    machine?: {
      __typename: 'ERPPartMachineQuantities';
      X45H2?: number | null;
      X60C2L?: number | null;
      X45C4?: number | null;
      X60C2?: number | null;
      X60C4?: number | null;
    } | null;
    availableForTractor?: number | null;
    location?: string | null;
    availableQtyAmount?: number | null;
    suppliers?: Array<{
      __typename: 'ERPSupplierEntry';
      name: string;
      priority: number;
    }> | null;
    perTractorCost?: number | null;
    price?: number | null;
    priceWithGST?: number | null;
    gstRate?: number | null;
    amountRequired?: number | null;
    advanceAvailable?: number | null;
    leadTimeWeeks?: number | null;
    creditTerms?: string | null;
    orderedQty?: number | null;
    balanceQty?: number | null;
    daysForFirstPayment?: number | null;
    moq?: number | null;
    leadTimeDays?: number | null;
    paymentAtPOPercent?: number | null;
    balancePaymentPercent?: number | null;
    creditDays?: number | null;
    poData?: Array<{
      __typename: 'ERPPODataEntry';
      poDate?: string | null;
      firstPayment?: number | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: string | null;
      secondPaymentAmount?: number | null;
    }> | null;
    orderingPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    leadTimePlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlanWithTaxes?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
  };
};

export type UpdateWeeklyPaymentPlanMutationVariables = {
  input: UpdateWeeklyPaymentPlanInput;
};

export type UpdateWeeklyPaymentPlanMutation = {
  updateWeeklyPaymentPlan: {
    __typename: 'ERPItem';
    PK: string;
    SK: string;
    entity_type?: string | null;
    data?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    partCode?: string | null;
    partName?: string | null;
    category?: string | null;
    uom?: string | null;
    perUnitTractor?: number | null;
    batchQty?: number | null;
    availableQtyHapur?: number | null;
    partsRequired?: number | null;
    machine?: {
      __typename: 'ERPPartMachineQuantities';
      X45H2?: number | null;
      X60C2L?: number | null;
      X45C4?: number | null;
      X60C2?: number | null;
      X60C4?: number | null;
    } | null;
    availableForTractor?: number | null;
    location?: string | null;
    availableQtyAmount?: number | null;
    suppliers?: Array<{
      __typename: 'ERPSupplierEntry';
      name: string;
      priority: number;
    }> | null;
    perTractorCost?: number | null;
    price?: number | null;
    priceWithGST?: number | null;
    gstRate?: number | null;
    amountRequired?: number | null;
    advanceAvailable?: number | null;
    leadTimeWeeks?: number | null;
    creditTerms?: string | null;
    orderedQty?: number | null;
    balanceQty?: number | null;
    daysForFirstPayment?: number | null;
    moq?: number | null;
    leadTimeDays?: number | null;
    paymentAtPOPercent?: number | null;
    balancePaymentPercent?: number | null;
    creditDays?: number | null;
    poData?: Array<{
      __typename: 'ERPPODataEntry';
      poDate?: string | null;
      firstPayment?: number | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: string | null;
      secondPaymentAmount?: number | null;
    }> | null;
    orderingPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    leadTimePlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlanWithTaxes?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
  };
};

export type UpdateMonthlyProgressionMutationVariables = {
  input: UpdateMonthlyProgressionInput;
};

export type UpdateMonthlyProgressionMutation = {
  updateMonthlyProgression: {
    __typename: 'ERPItem';
    PK: string;
    SK: string;
    entity_type?: string | null;
    data?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    partCode?: string | null;
    partName?: string | null;
    category?: string | null;
    uom?: string | null;
    perUnitTractor?: number | null;
    batchQty?: number | null;
    availableQtyHapur?: number | null;
    partsRequired?: number | null;
    machine?: {
      __typename: 'ERPPartMachineQuantities';
      X45H2?: number | null;
      X60C2L?: number | null;
      X45C4?: number | null;
      X60C2?: number | null;
      X60C4?: number | null;
    } | null;
    availableForTractor?: number | null;
    location?: string | null;
    availableQtyAmount?: number | null;
    suppliers?: Array<{
      __typename: 'ERPSupplierEntry';
      name: string;
      priority: number;
    }> | null;
    perTractorCost?: number | null;
    price?: number | null;
    priceWithGST?: number | null;
    gstRate?: number | null;
    amountRequired?: number | null;
    advanceAvailable?: number | null;
    leadTimeWeeks?: number | null;
    creditTerms?: string | null;
    orderedQty?: number | null;
    balanceQty?: number | null;
    daysForFirstPayment?: number | null;
    moq?: number | null;
    leadTimeDays?: number | null;
    paymentAtPOPercent?: number | null;
    balancePaymentPercent?: number | null;
    creditDays?: number | null;
    poData?: Array<{
      __typename: 'ERPPODataEntry';
      poDate?: string | null;
      firstPayment?: number | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: string | null;
      secondPaymentAmount?: number | null;
    }> | null;
    orderingPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    leadTimePlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlanWithTaxes?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
  };
};

export type CreateCognitoUserMutationVariables = {
  input: CreateCognitoUserInput;
};

export type CreateCognitoUserMutation = {
  createCognitoUser: {
    __typename: 'CognitoUserResponse';
    success: boolean;
    message: string;
    user?: {
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    } | null;
  };
};

export type UpdateCognitoUserMutationVariables = {
  input: UpdateCognitoUserInput;
};

export type UpdateCognitoUserMutation = {
  updateCognitoUser: {
    __typename: 'CognitoUserResponse';
    success: boolean;
    message: string;
    user?: {
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    } | null;
  };
};

export type DeleteCognitoUserMutationVariables = {
  username: string;
};

export type DeleteCognitoUserMutation = {
  deleteCognitoUser: {
    __typename: 'CognitoUserResponse';
    success: boolean;
    message: string;
    user?: {
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    } | null;
  };
};

export type DisableCognitoUserMutationVariables = {
  username: string;
};

export type DisableCognitoUserMutation = {
  disableCognitoUser: {
    __typename: 'CognitoUserResponse';
    success: boolean;
    message: string;
    user?: {
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    } | null;
  };
};

export type EnableCognitoUserMutationVariables = {
  username: string;
};

export type EnableCognitoUserMutation = {
  enableCognitoUser: {
    __typename: 'CognitoUserResponse';
    success: boolean;
    message: string;
    user?: {
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    } | null;
  };
};

export type CreateCognitoGroupMutationVariables = {
  groupName: string;
  description?: string | null;
};

export type CreateCognitoGroupMutation = {
  createCognitoGroup: {
    __typename: 'CognitoGroupResponse';
    success: boolean;
    message: string;
    group?: {
      __typename: 'CognitoGroup';
      groupName: string;
      description?: string | null;
      precedence?: number | null;
      roleArn?: string | null;
      userPoolId?: string | null;
      createdAt?: string | null;
      lastModifiedDate?: string | null;
    } | null;
  };
};

export type DeleteCognitoGroupMutationVariables = {
  groupName: string;
};

export type DeleteCognitoGroupMutation = {
  deleteCognitoGroup: {
    __typename: 'CognitoGroupResponse';
    success: boolean;
    message: string;
    group?: {
      __typename: 'CognitoGroup';
      groupName: string;
      description?: string | null;
      precedence?: number | null;
      roleArn?: string | null;
      userPoolId?: string | null;
      createdAt?: string | null;
      lastModifiedDate?: string | null;
    } | null;
  };
};

export type UpdateCognitoGroupMutationVariables = {
  groupName: string;
  newGroupName?: string | null;
  description?: string | null;
};

export type UpdateCognitoGroupMutation = {
  updateCognitoGroup: {
    __typename: 'CognitoGroupResponse';
    success: boolean;
    message: string;
    group?: {
      __typename: 'CognitoGroup';
      groupName: string;
      description?: string | null;
      precedence?: number | null;
      roleArn?: string | null;
      userPoolId?: string | null;
      createdAt?: string | null;
      lastModifiedDate?: string | null;
    } | null;
  };
};

export type AssignUserToCognitoGroupMutationVariables = {
  username: string;
  groupName: string;
};

export type AssignUserToCognitoGroupMutation = {
  assignUserToCognitoGroup: {
    __typename: 'CognitoUserResponse';
    success: boolean;
    message: string;
    user?: {
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    } | null;
  };
};

export type RemoveUserFromCognitoGroupMutationVariables = {
  username: string;
  groupName: string;
};

export type RemoveUserFromCognitoGroupMutation = {
  removeUserFromCognitoGroup: {
    __typename: 'CognitoUserResponse';
    success: boolean;
    message: string;
    user?: {
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    } | null;
  };
};

export type BulkAssignUsersToGroupMutationVariables = {
  usernames: Array<string>;
  groupName: string;
};

export type BulkAssignUsersToGroupMutation = {
  bulkAssignUsersToGroup: {
    __typename: 'BulkCognitoResponse';
    success: boolean;
    message: string;
    successCount: number;
    failureCount: number;
    errors?: Array<string> | null;
  };
};

export type BulkRemoveUsersFromGroupMutationVariables = {
  usernames: Array<string>;
  groupName: string;
};

export type BulkRemoveUsersFromGroupMutation = {
  bulkRemoveUsersFromGroup: {
    __typename: 'BulkCognitoResponse';
    success: boolean;
    message: string;
    successCount: number;
    failureCount: number;
    errors?: Array<string> | null;
  };
};

export type AssignUserToOfficeMutationVariables = {
  input: AssignUserToOfficeInput;
};

export type AssignUserToOfficeMutation = {
  assignUserToOffice: {
    __typename: 'OfficeAssignmentResult';
    id?: string | null;
    userID: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    userType?: UserType | null;
    role?: string | null;
    orgID?: string | null;
    plantID?: string | null;
    accessiblePlantIDs?: Array<string> | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    assignedOfficeID?: string | null;
    officeAssignedBy?: string | null;
    officeAssignedAt?: string | null;
    officeAssignmentNotes?: string | null;
    success: boolean;
    message?: string | null;
  };
};

export type UnassignUserFromOfficeMutationVariables = {
  userID: string;
};

export type UnassignUserFromOfficeMutation = {
  unassignUserFromOffice: {
    __typename: 'OfficeAssignmentResult';
    id?: string | null;
    userID: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    userType?: UserType | null;
    role?: string | null;
    orgID?: string | null;
    plantID?: string | null;
    accessiblePlantIDs?: Array<string> | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    assignedOfficeID?: string | null;
    officeAssignedBy?: string | null;
    officeAssignedAt?: string | null;
    officeAssignmentNotes?: string | null;
    success: boolean;
    message?: string | null;
  };
};

export type BulkAssignUsersToOfficeMutationVariables = {
  input: BulkAssignUsersToOfficeInput;
};

export type BulkAssignUsersToOfficeMutation = {
  bulkAssignUsersToOffice: Array<{
    __typename: 'OfficeAssignmentResult';
    id?: string | null;
    userID: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    userType?: UserType | null;
    role?: string | null;
    orgID?: string | null;
    plantID?: string | null;
    accessiblePlantIDs?: Array<string> | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    assignedOfficeID?: string | null;
    officeAssignedBy?: string | null;
    officeAssignedAt?: string | null;
    officeAssignmentNotes?: string | null;
    success: boolean;
    message?: string | null;
  }>;
};

export type CreateTractorMutationVariables = {
  input: CreateTractorInput;
};

export type CreateTractorMutation = {
  createTractor: {
    __typename: 'Tractor';
    vin: string;
    alias?: string | null;
    registerNumber?: string | null;
    plantID?: string | null;
    orgID?: string | null;
    model?: string | null;
    color?: string | null;
    loggerID?: string | null;
    currentImplement?: string | null;
    serviceStatus?: string | null;
    armLength?: string | null;
    dofChargeStatus?: string | null;
    user?: string | null;
    minValue?: number | null;
    maxValue?: number | null;
    midValue?: number | null;
    tractorNextBatchValue?: number | null;
    components?: {
      __typename: 'TractorComponents';
      vin: string;
      componentType?: TractorComponentTypeEnum | null;
      id?: string | null;
      battery33KWid?: string | null;
      battery12Vid?: string | null;
      motorId?: string | null;
      controllerID?: string | null;
      transmissionID?: string | null;
      transmissionMake?: TransmissionMakeEnum | null;
      displayID?: string | null;
      tempCardID?: string | null;
      canCardID?: string | null;
      footAccID?: string | null;
      handAccID?: string | null;
      fTyreSize?: string | null;
      rTyreSize?: string | null;
      fTyreBrand?: TyreBrandEnum | null;
      rTyreBrand?: TyreBrandEnum | null;
      couplerType?: CouplerTypeEnum | null;
      oRingType?: O_RingEnum | null;
      clutchFingerSetting?: string | null;
      bmsVersion?: number | null;
    } | null;
    dispatchInfo?: {
      __typename: 'DispatchInfo';
      assemblyRolloutDate?: string | null;
      pdiDate?: string | null;
      handoverDate?: string | null;
      dispatchPlan?: DispatchPlanEnum | null;
      dispatchLocation?: string | null;
      totalTestHours?: number | null;
      testType?: Array<TractorTestTypeEnum | null> | null;
      liveLocation?: string | null;
      saleType?: SaleTypeEnum | null;
    } | null;
    commissionDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
};

export type UpdateTractorMutationVariables = {
  input: UpdateTractorInput;
};

export type UpdateTractorMutation = {
  updateTractor: {
    __typename: 'Tractor';
    vin: string;
    alias?: string | null;
    registerNumber?: string | null;
    plantID?: string | null;
    orgID?: string | null;
    model?: string | null;
    color?: string | null;
    loggerID?: string | null;
    currentImplement?: string | null;
    serviceStatus?: string | null;
    armLength?: string | null;
    dofChargeStatus?: string | null;
    user?: string | null;
    minValue?: number | null;
    maxValue?: number | null;
    midValue?: number | null;
    tractorNextBatchValue?: number | null;
    components?: {
      __typename: 'TractorComponents';
      vin: string;
      componentType?: TractorComponentTypeEnum | null;
      id?: string | null;
      battery33KWid?: string | null;
      battery12Vid?: string | null;
      motorId?: string | null;
      controllerID?: string | null;
      transmissionID?: string | null;
      transmissionMake?: TransmissionMakeEnum | null;
      displayID?: string | null;
      tempCardID?: string | null;
      canCardID?: string | null;
      footAccID?: string | null;
      handAccID?: string | null;
      fTyreSize?: string | null;
      rTyreSize?: string | null;
      fTyreBrand?: TyreBrandEnum | null;
      rTyreBrand?: TyreBrandEnum | null;
      couplerType?: CouplerTypeEnum | null;
      oRingType?: O_RingEnum | null;
      clutchFingerSetting?: string | null;
      bmsVersion?: number | null;
    } | null;
    dispatchInfo?: {
      __typename: 'DispatchInfo';
      assemblyRolloutDate?: string | null;
      pdiDate?: string | null;
      handoverDate?: string | null;
      dispatchPlan?: DispatchPlanEnum | null;
      dispatchLocation?: string | null;
      totalTestHours?: number | null;
      testType?: Array<TractorTestTypeEnum | null> | null;
      liveLocation?: string | null;
      saleType?: SaleTypeEnum | null;
    } | null;
    commissionDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
};

export type DeleteTractorMutationVariables = {
  input: DeleteTractorInput;
};

export type DeleteTractorMutation = {
  deleteTractor: {
    __typename: 'Tractor';
    vin: string;
    alias?: string | null;
    registerNumber?: string | null;
    plantID?: string | null;
    orgID?: string | null;
    model?: string | null;
    color?: string | null;
    loggerID?: string | null;
    currentImplement?: string | null;
    serviceStatus?: string | null;
    armLength?: string | null;
    dofChargeStatus?: string | null;
    user?: string | null;
    minValue?: number | null;
    maxValue?: number | null;
    midValue?: number | null;
    tractorNextBatchValue?: number | null;
    components?: {
      __typename: 'TractorComponents';
      vin: string;
      componentType?: TractorComponentTypeEnum | null;
      id?: string | null;
      battery33KWid?: string | null;
      battery12Vid?: string | null;
      motorId?: string | null;
      controllerID?: string | null;
      transmissionID?: string | null;
      transmissionMake?: TransmissionMakeEnum | null;
      displayID?: string | null;
      tempCardID?: string | null;
      canCardID?: string | null;
      footAccID?: string | null;
      handAccID?: string | null;
      fTyreSize?: string | null;
      rTyreSize?: string | null;
      fTyreBrand?: TyreBrandEnum | null;
      rTyreBrand?: TyreBrandEnum | null;
      couplerType?: CouplerTypeEnum | null;
      oRingType?: O_RingEnum | null;
      clutchFingerSetting?: string | null;
      bmsVersion?: number | null;
    } | null;
    dispatchInfo?: {
      __typename: 'DispatchInfo';
      assemblyRolloutDate?: string | null;
      pdiDate?: string | null;
      handoverDate?: string | null;
      dispatchPlan?: DispatchPlanEnum | null;
      dispatchLocation?: string | null;
      totalTestHours?: number | null;
      testType?: Array<TractorTestTypeEnum | null> | null;
      liveLocation?: string | null;
      saleType?: SaleTypeEnum | null;
    } | null;
    commissionDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
};

export type CreateTractorDocumentMutationVariables = {
  input: CreateTractorDocumentInput;
};

export type CreateTractorDocumentMutation = {
  createTractorDocument: {
    __typename: 'Media';
    key: string;
    kind: string;
    contentType: string;
    sizeBytes: number;
    createdAt: string;
    variants: Array<string>;
    uploaderID?: string | null;
    vin?: string | null;
    documentID?: string | null;
    title?: string | null;
    description?: string | null;
    docType?: string | null;
    files?: Array<string> | null;
    tags?: Array<string> | null;
    uploadedBy?: string | null;
    uploadedAt?: string | null;
    updatedAt?: string | null;
  };
};

export type UpdateTractorDocumentMutationVariables = {
  input: UpdateTractorDocumentInput;
};

export type UpdateTractorDocumentMutation = {
  updateTractorDocument: {
    __typename: 'Media';
    key: string;
    kind: string;
    contentType: string;
    sizeBytes: number;
    createdAt: string;
    variants: Array<string>;
    uploaderID?: string | null;
    vin?: string | null;
    documentID?: string | null;
    title?: string | null;
    description?: string | null;
    docType?: string | null;
    files?: Array<string> | null;
    tags?: Array<string> | null;
    uploadedBy?: string | null;
    uploadedAt?: string | null;
    updatedAt?: string | null;
  };
};

export type UploadUsageSegmentMutationVariables = {
  input: UploadUsageSegmentInput;
};

export type UploadUsageSegmentMutation = {
  uploadUsageSegment: {
    __typename: 'UsageSegment';
    tractorID: string;
    type: SegmentType;
    startTime: string;
    endTime?: string | null;
    durationSec?: number | null;
    durationFormatted?: string | null;
    durationSecLogged?: number | null;
    durationLogged?: string | null;
    initialSOC?: number | null;
    finalSOC?: number | null;
    kwhConsumed?: number | null;
    kwhCharged?: number | null;
    distanceTravelled?: number | null;
    costSavings?: number | null;
    treesSaved?: number | null;
    disconnects?: {
      __typename: 'DisconnectsM';
      totalCount?: number | null;
      totalDuration?: number | null;
      locations?: Array<{
        __typename: 'StartEndLoc';
        startLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
        endLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
      }> | null;
    } | null;
    parameterMetrics?: {
      __typename: 'ParameterMetrics';
      SOC?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      SOH?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryI?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxRPM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      WHM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MotorT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MinCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      Throttle?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      CumulativeRuntime?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
    } | null;
    faultMetrics?: {
      __typename: 'FaultMetrics';
      Ecode?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      FaultDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      WarningDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
    } | null;
    createdAt?: string | null;
  };
};

export type DeleteUsageSegmentMutationVariables = {
  input: DeleteUsageSegmentInput;
};

export type DeleteUsageSegmentMutation = {
  deleteUsageSegment: {
    __typename: 'UsageSegment';
    tractorID: string;
    type: SegmentType;
    startTime: string;
    endTime?: string | null;
    durationSec?: number | null;
    durationFormatted?: string | null;
    durationSecLogged?: number | null;
    durationLogged?: string | null;
    initialSOC?: number | null;
    finalSOC?: number | null;
    kwhConsumed?: number | null;
    kwhCharged?: number | null;
    distanceTravelled?: number | null;
    costSavings?: number | null;
    treesSaved?: number | null;
    disconnects?: {
      __typename: 'DisconnectsM';
      totalCount?: number | null;
      totalDuration?: number | null;
      locations?: Array<{
        __typename: 'StartEndLoc';
        startLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
        endLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
      }> | null;
    } | null;
    parameterMetrics?: {
      __typename: 'ParameterMetrics';
      SOC?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      SOH?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryI?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxRPM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      WHM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MotorT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MinCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      Throttle?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      CumulativeRuntime?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
    } | null;
    faultMetrics?: {
      __typename: 'FaultMetrics';
      Ecode?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      FaultDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      WarningDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
    } | null;
    createdAt?: string | null;
  };
};

export type UploadAnalyticsMutationVariables = {
  input: UploadAnalyticsInput;
};

export type UploadAnalyticsMutation = {
  uploadAnalytics?: {
    __typename: 'Analytics';
    tractorID: string;
    PeriodType: PeriodType;
    timeSegment: string;
    startTime?: string | null;
    endTime?: string | null;
    cumulative?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    trips?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    charges?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    standby?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    disconnects?: {
      __typename: 'DisconnectsM';
      totalCount?: number | null;
      totalDuration?: number | null;
      locations?: Array<{
        __typename: 'StartEndLoc';
        startLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
        endLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
      }> | null;
    } | null;
    anomalies?: {
      __typename: 'AnomaliesM';
      totalCount?: number | null;
    } | null;
    parameterMetrics?: {
      __typename: 'ParameterMetrics';
      SOC?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      SOH?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryI?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxRPM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      WHM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MotorT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MinCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      Throttle?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      CumulativeRuntime?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
    } | null;
    faultMetrics?: {
      __typename: 'FaultMetrics';
      Ecode?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      FaultDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      WarningDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
    } | null;
  } | null;
};

export type DeleteAnalyticsMutationVariables = {
  input: DeleteAnalyticsInput;
};

export type DeleteAnalyticsMutation = {
  deleteAnalytics?: {
    __typename: 'Analytics';
    tractorID: string;
    PeriodType: PeriodType;
    timeSegment: string;
    startTime?: string | null;
    endTime?: string | null;
    cumulative?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    trips?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    charges?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    standby?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    disconnects?: {
      __typename: 'DisconnectsM';
      totalCount?: number | null;
      totalDuration?: number | null;
      locations?: Array<{
        __typename: 'StartEndLoc';
        startLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
        endLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
      }> | null;
    } | null;
    anomalies?: {
      __typename: 'AnomaliesM';
      totalCount?: number | null;
    } | null;
    parameterMetrics?: {
      __typename: 'ParameterMetrics';
      SOC?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      SOH?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryI?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxRPM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      WHM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MotorT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MinCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      Throttle?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      CumulativeRuntime?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
    } | null;
    faultMetrics?: {
      __typename: 'FaultMetrics';
      Ecode?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      FaultDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      WarningDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
    } | null;
  } | null;
};

export type CreateLoggerMutationVariables = {
  input: CreateLoggerInput;
};

export type CreateLoggerMutation = {
  createLogger: {
    __typename: 'Logger';
    loggerID: string;
    platform: LoggerPlatform;
    status: string;
    attachedToVIN?: string | null;
    attachedAt?: string | null;
    detachedAt?: string | null;
    notes?: string | null;
  };
};

export type UpdateLoggerMutationVariables = {
  input: UpdateLoggerInput;
};

export type UpdateLoggerMutation = {
  updateLogger: {
    __typename: 'Logger';
    loggerID: string;
    platform: LoggerPlatform;
    status: string;
    attachedToVIN?: string | null;
    attachedAt?: string | null;
    detachedAt?: string | null;
    notes?: string | null;
  };
};

export type CreateDriverMutationVariables = {
  input: CreateDriverInput;
};

export type CreateDriverMutation = {
  createDriver: {
    __typename: 'Driver';
    driverID: string;
    name: string;
    phone?: string | null;
    aadhaarMasked?: string | null;
    licenseNumber?: string | null;
    licenseExpiry?: string | null;
    status: DriverStatus;
    orgID: string;
    plantID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateDriverMutationVariables = {
  input: UpdateDriverInput;
};

export type UpdateDriverMutation = {
  updateDriver: {
    __typename: 'Driver';
    driverID: string;
    name: string;
    phone?: string | null;
    aadhaarMasked?: string | null;
    licenseNumber?: string | null;
    licenseExpiry?: string | null;
    status: DriverStatus;
    orgID: string;
    plantID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type DeleteDriverMutationVariables = {
  driverID: string;
};

export type DeleteDriverMutation = {
  deleteDriver?: {
    __typename: 'Driver';
    driverID: string;
    name: string;
    phone?: string | null;
    aadhaarMasked?: string | null;
    licenseNumber?: string | null;
    licenseExpiry?: string | null;
    status: DriverStatus;
    orgID: string;
    plantID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type MarkDriverAttendanceMutationVariables = {
  input: MarkAttendanceInput;
};

export type MarkDriverAttendanceMutation = {
  markDriverAttendance: {
    __typename: 'Attendance';
    driverID: string;
    date: string;
    shift?: Shift | null;
    orgID: string;
    plantID: string;
    status: AttendanceStatus;
    checkInAt?: string | null;
    checkOutAt?: string | null;
    markedByUserID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type AssignDriverToTractorMutationVariables = {
  input: AssignDriverInput;
};

export type AssignDriverToTractorMutation = {
  assignDriverToTractor: {
    __typename: 'Assignment';
    driverID: string;
    date: string;
    shift: Shift;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    startTime: string;
    endTime?: string | null;
    status: AssignmentStatus;
    assignedByUserID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CancelDriverAssignmentMutationVariables = {
  input: CancelDriverAssignmentInput;
};

export type CancelDriverAssignmentMutation = {
  cancelDriverAssignment: {
    __typename: 'Assignment';
    driverID: string;
    date: string;
    shift: Shift;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    startTime: string;
    endTime?: string | null;
    status: AssignmentStatus;
    assignedByUserID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type EndDriverAssignmentByKeyMutationVariables = {
  input: EndDriverAssignmentInput;
};

export type EndDriverAssignmentByKeyMutation = {
  endDriverAssignmentByKey: {
    __typename: 'Assignment';
    driverID: string;
    date: string;
    shift: Shift;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    startTime: string;
    endTime?: string | null;
    status: AssignmentStatus;
    assignedByUserID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateComplianceRecordMutationVariables = {
  input: CreateComplianceInput;
};

export type CreateComplianceRecordMutation = {
  createComplianceRecord: {
    __typename: 'ComplianceRecord';
    driverID: string;
    type: string;
    dueDate: string;
    status?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateComplianceRecordMutationVariables = {
  input: UpdateComplianceInput;
};

export type UpdateComplianceRecordMutation = {
  updateComplianceRecord: {
    __typename: 'ComplianceRecord';
    driverID: string;
    type: string;
    dueDate: string;
    status?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type DeleteComplianceRecordMutationVariables = {
  input: DeleteComplianceInput;
};

export type DeleteComplianceRecordMutation = {
  deleteComplianceRecord: {
    __typename: 'ComplianceRecord';
    driverID: string;
    type: string;
    dueDate: string;
    status?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type LogPerformanceMutationVariables = {
  input: LogPerformanceInput;
};

export type LogPerformanceMutation = {
  logPerformance: {
    __typename: 'PerformanceLog';
    driverID: string;
    date: string;
    orgID: string;
    plantID: string;
    hoursDriven?: number | null;
    tripsCompleted?: number | null;
    energyUsedKwh?: number | null;
    incidentsCount?: number | null;
    incidents?: Array<string> | null;
    notes?: string | null;
    enteredByUserID?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateServiceMutationVariables = {
  input: CreateServiceInput;
};

export type CreateServiceMutation = {
  createService: {
    __typename: 'TractorService';
    vin: string;
    serviceID: string;
    serviceDate: string;
    issueType: ServiceIssueType;
    description?: string | null;
    reportedBy?: string | null;
    resolvedBy?: string | null;
    resolvedAt?: string | null;
    resolutionNotes?: string | null;
    componentSerialsInvolved?: Array<string | null> | null;
    status: ServiceStatus;
    createdAt: string;
  };
};

export type UpdateServiceMutationVariables = {
  input: UpdateServiceInput;
};

export type UpdateServiceMutation = {
  updateService: {
    __typename: 'TractorService';
    vin: string;
    serviceID: string;
    serviceDate: string;
    issueType: ServiceIssueType;
    description?: string | null;
    reportedBy?: string | null;
    resolvedBy?: string | null;
    resolvedAt?: string | null;
    resolutionNotes?: string | null;
    componentSerialsInvolved?: Array<string | null> | null;
    status: ServiceStatus;
    createdAt: string;
  };
};

export type ReworkServiceMutationVariables = {
  input: ReworkServiceInput;
};

export type ReworkServiceMutation = {
  reworkService: {
    __typename: 'TractorService';
    vin: string;
    serviceID: string;
    serviceDate: string;
    issueType: ServiceIssueType;
    description?: string | null;
    reportedBy?: string | null;
    resolvedBy?: string | null;
    resolvedAt?: string | null;
    resolutionNotes?: string | null;
    componentSerialsInvolved?: Array<string | null> | null;
    status: ServiceStatus;
    createdAt: string;
  };
};

export type CreateComplaintMutationVariables = {
  input: CreateComplaintInput;
};

export type CreateComplaintMutation = {
  createComplaint: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type VerifyComplaintMutationVariables = {
  input: VerifyComplaintInput;
};

export type VerifyComplaintMutation = {
  verifyComplaint: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type CategorizeComplaintMutationVariables = {
  input: CategorizeComplaintInput;
};

export type CategorizeComplaintMutation = {
  categorizeComplaint: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type AssignComplaintMutationVariables = {
  input: AssignComplaintInput;
};

export type AssignComplaintMutation = {
  assignComplaint: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type StartResolutionMutationVariables = {
  input: StartResolutionInput;
};

export type StartResolutionMutation = {
  startResolution: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type AddResolutionNoteMutationVariables = {
  input: AddResolutionNoteInput;
};

export type AddResolutionNoteMutation = {
  addResolutionNote: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type AddComplaintAttachmentMutationVariables = {
  input: AddAttachmentInput;
};

export type AddComplaintAttachmentMutation = {
  addComplaintAttachment: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type ResolveComplaintMutationVariables = {
  input: ResolveComplaintInput;
};

export type ResolveComplaintMutation = {
  resolveComplaint: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type CloseComplaintMutationVariables = {
  input: CloseComplaintInput;
};

export type CloseComplaintMutation = {
  closeComplaint: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type CancelComplaintMutationVariables = {
  input: CancelComplaintInput;
};

export type CancelComplaintMutation = {
  cancelComplaint: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type UpdateComplaintDetailsMutationVariables = {
  input: UpdateComplaintDetailsInput;
};

export type UpdateComplaintDetailsMutation = {
  updateComplaintDetails: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type RateComplaintMutationVariables = {
  input: RateComplaintInput;
};

export type RateComplaintMutation = {
  rateComplaint: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  };
};

export type DeleteComplaintMutationVariables = {
  complaintID: string;
};

export type DeleteComplaintMutation = {
  deleteComplaint?: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  } | null;
};

export type CreateJobCardMutationVariables = {
  input: CreateJobCardInput;
};

export type CreateJobCardMutation = {
  createJobCard: {
    __typename: 'JobCard';
    jobCardID: string;
    jobCardNumber: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    repairCategory: RepairCategory;
    problemType: string;
    description: string;
    priority: string;
    isVOR: boolean;
    status: JobCardStatus;
    slaDeadline: string;
    slaHours: number;
    slaStatus: SLAStatus;
    slaPercentage: number;
    estimatedHours?: number | null;
    actualHours?: number | null;
    assignedTechnicianID?: string | null;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    totalCost: number;
    downtimeHours: number;
    delayReasons?: Array<{
      __typename: 'DelayRecord';
      reason: DelayReason;
      notes?: string | null;
      recordedAt: string;
      recordedBy?: string | null;
    }> | null;
    customerFeedback?: string | null;
    createdAt: string;
    updatedAt: string;
    startedAt?: string | null;
    completedAt?: string | null;
    closedAt?: string | null;
  };
};

export type UpdateJobCardMutationVariables = {
  input: UpdateJobCardInput;
};

export type UpdateJobCardMutation = {
  updateJobCard: {
    __typename: 'JobCard';
    jobCardID: string;
    jobCardNumber: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    repairCategory: RepairCategory;
    problemType: string;
    description: string;
    priority: string;
    isVOR: boolean;
    status: JobCardStatus;
    slaDeadline: string;
    slaHours: number;
    slaStatus: SLAStatus;
    slaPercentage: number;
    estimatedHours?: number | null;
    actualHours?: number | null;
    assignedTechnicianID?: string | null;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    totalCost: number;
    downtimeHours: number;
    delayReasons?: Array<{
      __typename: 'DelayRecord';
      reason: DelayReason;
      notes?: string | null;
      recordedAt: string;
      recordedBy?: string | null;
    }> | null;
    customerFeedback?: string | null;
    createdAt: string;
    updatedAt: string;
    startedAt?: string | null;
    completedAt?: string | null;
    closedAt?: string | null;
  };
};

export type RecordDelayMutationVariables = {
  input: RecordDelayInput;
};

export type RecordDelayMutation = {
  recordDelay: {
    __typename: 'JobCard';
    jobCardID: string;
    jobCardNumber: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    repairCategory: RepairCategory;
    problemType: string;
    description: string;
    priority: string;
    isVOR: boolean;
    status: JobCardStatus;
    slaDeadline: string;
    slaHours: number;
    slaStatus: SLAStatus;
    slaPercentage: number;
    estimatedHours?: number | null;
    actualHours?: number | null;
    assignedTechnicianID?: string | null;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    totalCost: number;
    downtimeHours: number;
    delayReasons?: Array<{
      __typename: 'DelayRecord';
      reason: DelayReason;
      notes?: string | null;
      recordedAt: string;
      recordedBy?: string | null;
    }> | null;
    customerFeedback?: string | null;
    createdAt: string;
    updatedAt: string;
    startedAt?: string | null;
    completedAt?: string | null;
    closedAt?: string | null;
  };
};

export type CloseJobCardMutationVariables = {
  input: CloseJobCardInput;
};

export type CloseJobCardMutation = {
  closeJobCard: {
    __typename: 'JobCard';
    jobCardID: string;
    jobCardNumber: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    repairCategory: RepairCategory;
    problemType: string;
    description: string;
    priority: string;
    isVOR: boolean;
    status: JobCardStatus;
    slaDeadline: string;
    slaHours: number;
    slaStatus: SLAStatus;
    slaPercentage: number;
    estimatedHours?: number | null;
    actualHours?: number | null;
    assignedTechnicianID?: string | null;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    totalCost: number;
    downtimeHours: number;
    delayReasons?: Array<{
      __typename: 'DelayRecord';
      reason: DelayReason;
      notes?: string | null;
      recordedAt: string;
      recordedBy?: string | null;
    }> | null;
    customerFeedback?: string | null;
    createdAt: string;
    updatedAt: string;
    startedAt?: string | null;
    completedAt?: string | null;
    closedAt?: string | null;
  };
};

export type CreatePMSScheduleMutationVariables = {
  input: CreatePMSScheduleInput;
};

export type CreatePMSScheduleMutation = {
  createPMSSchedule: {
    __typename: 'PMSSchedule';
    scheduleID: string;
    tractorVIN: string;
    orgID: string;
    plantID: string;
    intervalHours: number;
    intervalMonths: number;
    lastPMSDate?: string | null;
    lastPMSHourMeter?: number | null;
    nextPMSDueDate: string;
    nextPMSDueHourMeter: number;
    status: PMSStatus;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdatePMSScheduleMutationVariables = {
  input: UpdatePMSScheduleInput;
};

export type UpdatePMSScheduleMutation = {
  updatePMSSchedule: {
    __typename: 'PMSSchedule';
    scheduleID: string;
    tractorVIN: string;
    orgID: string;
    plantID: string;
    intervalHours: number;
    intervalMonths: number;
    lastPMSDate?: string | null;
    lastPMSHourMeter?: number | null;
    nextPMSDueDate: string;
    nextPMSDueHourMeter: number;
    status: PMSStatus;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreatePMSTrackerMutationVariables = {
  input: CreatePMSTrackerInput;
};

export type CreatePMSTrackerMutation = {
  createPMSTracker: {
    __typename: 'PMSTracker';
    trackerID: string;
    tractorVIN: string;
    orgID: string;
    plantID: string;
    intervalHours: number;
    baselineRuntime: number;
    currentRuntime?: number | null;
    hoursSinceLastPMS?: number | null;
    activeComplaintID?: string | null;
    status: PMSTrackerStatus;
    lastResetAt?: string | null;
    lastResetBy?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type ResetPMSTrackerMutationVariables = {
  input: ResetPMSTrackerInput;
};

export type ResetPMSTrackerMutation = {
  resetPMSTracker: {
    __typename: 'PMSTracker';
    trackerID: string;
    tractorVIN: string;
    orgID: string;
    plantID: string;
    intervalHours: number;
    baselineRuntime: number;
    currentRuntime?: number | null;
    hoursSinceLastPMS?: number | null;
    activeComplaintID?: string | null;
    status: PMSTrackerStatus;
    lastResetAt?: string | null;
    lastResetBy?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type LinkPMSComplaintMutationVariables = {
  input: LinkPMSComplaintInput;
};

export type LinkPMSComplaintMutation = {
  linkPMSComplaint: {
    __typename: 'PMSTracker';
    trackerID: string;
    tractorVIN: string;
    orgID: string;
    plantID: string;
    intervalHours: number;
    baselineRuntime: number;
    currentRuntime?: number | null;
    hoursSinceLastPMS?: number | null;
    activeComplaintID?: string | null;
    status: PMSTrackerStatus;
    lastResetAt?: string | null;
    lastResetBy?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateVORRequestMutationVariables = {
  input: CreateVORRequestInput;
};

export type CreateVORRequestMutation = {
  createVORRequest: {
    __typename: 'VORRequest';
    vorID: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    complaintID?: string | null;
    requiredParts: Array<{
      __typename: 'RequiredPart';
      sku: string;
      quantity: number;
      description?: string | null;
      vendorSupportRequired: boolean;
      vendorOption?: Vendor | null;
    }>;
    urgency: VORUrgency;
    reason: string;
    status: VORStatus;
    requestedBy: string;
    approvedBy?: string | null;
    dispatchedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string | null;
    dispatchedAt?: string | null;
    deliveredAt?: string | null;
  };
};

export type ApproveVORMutationVariables = {
  input: ApproveVORInput;
};

export type ApproveVORMutation = {
  approveVOR: {
    __typename: 'VORRequest';
    vorID: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    complaintID?: string | null;
    requiredParts: Array<{
      __typename: 'RequiredPart';
      sku: string;
      quantity: number;
      description?: string | null;
      vendorSupportRequired: boolean;
      vendorOption?: Vendor | null;
    }>;
    urgency: VORUrgency;
    reason: string;
    status: VORStatus;
    requestedBy: string;
    approvedBy?: string | null;
    dispatchedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string | null;
    dispatchedAt?: string | null;
    deliveredAt?: string | null;
  };
};

export type DispatchVORMutationVariables = {
  input: DispatchVORInput;
};

export type DispatchVORMutation = {
  dispatchVOR: {
    __typename: 'VORRequest';
    vorID: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    complaintID?: string | null;
    requiredParts: Array<{
      __typename: 'RequiredPart';
      sku: string;
      quantity: number;
      description?: string | null;
      vendorSupportRequired: boolean;
      vendorOption?: Vendor | null;
    }>;
    urgency: VORUrgency;
    reason: string;
    status: VORStatus;
    requestedBy: string;
    approvedBy?: string | null;
    dispatchedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string | null;
    dispatchedAt?: string | null;
    deliveredAt?: string | null;
  };
};

export type DeliverVORMutationVariables = {
  input: DeliverVORInput;
};

export type DeliverVORMutation = {
  deliverVOR: {
    __typename: 'VORRequest';
    vorID: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    complaintID?: string | null;
    requiredParts: Array<{
      __typename: 'RequiredPart';
      sku: string;
      quantity: number;
      description?: string | null;
      vendorSupportRequired: boolean;
      vendorOption?: Vendor | null;
    }>;
    urgency: VORUrgency;
    reason: string;
    status: VORStatus;
    requestedBy: string;
    approvedBy?: string | null;
    dispatchedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string | null;
    dispatchedAt?: string | null;
    deliveredAt?: string | null;
  };
};

export type CreateVendorRequestMutationVariables = {
  input: CreateVendorRequestInput;
};

export type CreateVendorRequestMutation = {
  createVendorRequest: {
    __typename: 'VendorRequest';
    vendorRequestID: string;
    complaintID: string;
    orgID: string;
    plantID: string;
    tractorVIN?: string | null;
    vendorRequired: boolean;
    vendorType?: Vendor | null;
    description: string;
    status: VendorRequestStatus;
    requestedBy: string;
    resolvedBy?: string | null;
    resolutionNotes?: string | null;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
  };
};

export type UpdateVendorRequestMutationVariables = {
  input: UpdateVendorRequestInput;
};

export type UpdateVendorRequestMutation = {
  updateVendorRequest: {
    __typename: 'VendorRequest';
    vendorRequestID: string;
    complaintID: string;
    orgID: string;
    plantID: string;
    tractorVIN?: string | null;
    vendorRequired: boolean;
    vendorType?: Vendor | null;
    description: string;
    status: VendorRequestStatus;
    requestedBy: string;
    resolvedBy?: string | null;
    resolutionNotes?: string | null;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
  };
};

export type CloseVendorRequestMutationVariables = {
  input: CloseVendorRequestInput;
};

export type CloseVendorRequestMutation = {
  closeVendorRequest: {
    __typename: 'VendorRequest';
    vendorRequestID: string;
    complaintID: string;
    orgID: string;
    plantID: string;
    tractorVIN?: string | null;
    vendorRequired: boolean;
    vendorType?: Vendor | null;
    description: string;
    status: VendorRequestStatus;
    requestedBy: string;
    resolvedBy?: string | null;
    resolutionNotes?: string | null;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
  };
};

export type CreateWeeklyCheckScheduleMutationVariables = {
  input: CreateWeeklyCheckScheduleInput;
};

export type CreateWeeklyCheckScheduleMutation = {
  createWeeklyCheckSchedule: {
    __typename: 'WeeklyCheckSchedule';
    scheduleID: string;
    orgID: string;
    plantID: string;
    weekStartDate: string;
    assignedTractors: Array<string>;
    assignedTechnicianID: string;
    status: WeeklyCheckStatus;
    createdAt: string;
    updatedAt: string;
  };
};

export type SubmitWeeklyCheckMutationVariables = {
  input: SubmitWeeklyCheckInput;
};

export type SubmitWeeklyCheckMutation = {
  submitWeeklyCheck: {
    __typename: 'WeeklyCheckSubmission';
    submissionID: string;
    scheduleID: string;
    tractorVIN: string;
    technicianID: string;
    checklistItems: Array<{
      __typename: 'ChecklistItemResult';
      itemID: string;
      description: string;
      status: CheckStatus;
      notes?: string | null;
      photoURLs?: Array<string> | null;
    }>;
    abnormalitiesFound: boolean;
    submittedAt: string;
    convertedToJobCard: boolean;
    complaintID?: string | null;
  };
};

export type ConvertCheckToJobCardMutationVariables = {
  submissionID: string;
};

export type ConvertCheckToJobCardMutation = {
  convertCheckToJobCard: {
    __typename: 'JobCard';
    jobCardID: string;
    jobCardNumber: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    repairCategory: RepairCategory;
    problemType: string;
    description: string;
    priority: string;
    isVOR: boolean;
    status: JobCardStatus;
    slaDeadline: string;
    slaHours: number;
    slaStatus: SLAStatus;
    slaPercentage: number;
    estimatedHours?: number | null;
    actualHours?: number | null;
    assignedTechnicianID?: string | null;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    totalCost: number;
    downtimeHours: number;
    delayReasons?: Array<{
      __typename: 'DelayRecord';
      reason: DelayReason;
      notes?: string | null;
      recordedAt: string;
      recordedBy?: string | null;
    }> | null;
    customerFeedback?: string | null;
    createdAt: string;
    updatedAt: string;
    startedAt?: string | null;
    completedAt?: string | null;
    closedAt?: string | null;
  };
};

export type CheckPartsAvailabilityMutationVariables = {
  input: CheckPartsAvailabilityInput;
};

export type CheckPartsAvailabilityMutation = {
  checkPartsAvailability: {
    __typename: 'PartsAvailabilityResult';
    jobCardID?: string | null;
    plantID: string;
    allAvailable: boolean;
    availableParts: Array<{
      __typename: 'PartAvailability';
      sku: string;
      description?: string | null;
      requiredQty: number;
      availableQty: number;
      reservedQty: number;
      isAvailable: boolean;
      stockLocation?: string | null;
    }>;
    unavailableParts: Array<{
      __typename: 'PartAvailability';
      sku: string;
      description?: string | null;
      requiredQty: number;
      availableQty: number;
      reservedQty: number;
      isAvailable: boolean;
      stockLocation?: string | null;
    }>;
    recommendedAction: string;
    canProceed: boolean;
    vorRequired: boolean;
  };
};

export type ApproveJobCardClosureMutationVariables = {
  input: ApproveJobCardClosureInput;
};

export type ApproveJobCardClosureMutation = {
  approveJobCardClosure: {
    __typename: 'JobCard';
    jobCardID: string;
    jobCardNumber: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    repairCategory: RepairCategory;
    problemType: string;
    description: string;
    priority: string;
    isVOR: boolean;
    status: JobCardStatus;
    slaDeadline: string;
    slaHours: number;
    slaStatus: SLAStatus;
    slaPercentage: number;
    estimatedHours?: number | null;
    actualHours?: number | null;
    assignedTechnicianID?: string | null;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    totalCost: number;
    downtimeHours: number;
    delayReasons?: Array<{
      __typename: 'DelayRecord';
      reason: DelayReason;
      notes?: string | null;
      recordedAt: string;
      recordedBy?: string | null;
    }> | null;
    customerFeedback?: string | null;
    createdAt: string;
    updatedAt: string;
    startedAt?: string | null;
    completedAt?: string | null;
    closedAt?: string | null;
  };
};

export type RejectJobCardClosureMutationVariables = {
  input: RejectJobCardClosureInput;
};

export type RejectJobCardClosureMutation = {
  rejectJobCardClosure: {
    __typename: 'JobCard';
    jobCardID: string;
    jobCardNumber: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    repairCategory: RepairCategory;
    problemType: string;
    description: string;
    priority: string;
    isVOR: boolean;
    status: JobCardStatus;
    slaDeadline: string;
    slaHours: number;
    slaStatus: SLAStatus;
    slaPercentage: number;
    estimatedHours?: number | null;
    actualHours?: number | null;
    assignedTechnicianID?: string | null;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    totalCost: number;
    downtimeHours: number;
    delayReasons?: Array<{
      __typename: 'DelayRecord';
      reason: DelayReason;
      notes?: string | null;
      recordedAt: string;
      recordedBy?: string | null;
    }> | null;
    customerFeedback?: string | null;
    createdAt: string;
    updatedAt: string;
    startedAt?: string | null;
    completedAt?: string | null;
    closedAt?: string | null;
  };
};

export type UpsertSkuMutationVariables = {
  input: UpsertSkuInput;
};

export type UpsertSkuMutation = {
  upsertSku: {
    __typename: 'SkuMaster';
    sku: string;
    orgID?: string | null;
    name: string;
    description?: string | null;
    category: InventoryCategory;
    unit?: string | null;
    qtyPerUnit?: number | null;
    qtyForNxtBatch?: number | null;
    totalQtyForNxtBatch?: number | null;
    avlblQtyHapur?: number | null;
    partsRequired?: number | null;
    minQty?: number | null;
    midQty?: number | null;
    maxQty?: number | null;
    stockAvailability?: StockAvailability | null;
    modelApplicability?: {
      __typename: 'SkuModelApplicability';
      x45h2: number;
      x45c2: number;
      x45c2L: number;
      x45c4: number;
      h55c2: number;
      h55c2L: number;
      h55c4: number;
      x60c2: number;
      x60c2L: number;
      x60c4: number;
      x75c4: number;
    } | null;
    modelPartsRequired?: {
      __typename: 'SkuModelPartsRequired';
      x45h2: number;
      x45c2: number;
      x45c2L: number;
      x45c4: number;
      h55c2: number;
      h55c2L: number;
      h55c4: number;
      x60c2: number;
      x60c2L: number;
      x60c4: number;
      x75c4: number;
    } | null;
    typicalPricePaise?: number | null;
    specs?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type DeleteSkuMutationVariables = {
  sku: string;
};

export type DeleteSkuMutation = {
  deleteSku?: {
    __typename: 'SkuMaster';
    sku: string;
    orgID?: string | null;
    name: string;
    description?: string | null;
    category: InventoryCategory;
    unit?: string | null;
    qtyPerUnit?: number | null;
    qtyForNxtBatch?: number | null;
    totalQtyForNxtBatch?: number | null;
    avlblQtyHapur?: number | null;
    partsRequired?: number | null;
    minQty?: number | null;
    midQty?: number | null;
    maxQty?: number | null;
    stockAvailability?: StockAvailability | null;
    modelApplicability?: {
      __typename: 'SkuModelApplicability';
      x45h2: number;
      x45c2: number;
      x45c2L: number;
      x45c4: number;
      h55c2: number;
      h55c2L: number;
      h55c4: number;
      x60c2: number;
      x60c2L: number;
      x60c4: number;
      x75c4: number;
    } | null;
    modelPartsRequired?: {
      __typename: 'SkuModelPartsRequired';
      x45h2: number;
      x45c2: number;
      x45c2L: number;
      x45c4: number;
      h55c2: number;
      h55c2L: number;
      h55c4: number;
      x60c2: number;
      x60c2L: number;
      x60c4: number;
      x75c4: number;
    } | null;
    typicalPricePaise?: number | null;
    specs?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type AssignSkuToPlantMutationVariables = {
  input: AssignSkuToPlantInput;
};

export type AssignSkuToPlantMutation = {
  assignSkuToPlant: {
    __typename: 'PlantStock';
    orgID: string;
    plantID: string;
    sku: string;
    category: InventoryCategory;
    stock: number;
    reservedQty: number;
    minStock?: number | null;
    maxStock?: number | null;
    reorderLevel?: number | null;
    safetyNormPercentage?: number | null;
    locationBin?: string | null;
    updatedAt: string;
  };
};

export type SetMinStockMutationVariables = {
  input: SetMinStockInput;
};

export type SetMinStockMutation = {
  setMinStock: {
    __typename: 'PlantStock';
    orgID: string;
    plantID: string;
    sku: string;
    category: InventoryCategory;
    stock: number;
    reservedQty: number;
    minStock?: number | null;
    maxStock?: number | null;
    reorderLevel?: number | null;
    safetyNormPercentage?: number | null;
    locationBin?: string | null;
    updatedAt: string;
  };
};

export type ReceiveStockMutationVariables = {
  input: ReceiveStockInput;
};

export type ReceiveStockMutation = {
  receiveStock: {
    __typename: 'GoodsReceipt';
    receiptID: string;
    orgID: string;
    plantID: string;
    supplier?: string | null;
    billURL?: string | null;
    items: Array<{
      __typename: 'ReceiptLine';
      sku: string;
      qty: number;
      serials?: Array<string> | null;
      landedCostPaise?: number | null;
    }>;
    createdAt: string;
  };
};

export type ReserveStockMutationVariables = {
  input: ReserveStockInput;
};

export type ReserveStockMutation = {
  reserveStock: {
    __typename: 'Reservation';
    resID: string;
    orgID: string;
    ticketID: string;
    plantID: string;
    sku: string;
    qty: number;
    serials?: Array<string> | null;
    status: ReservationStatus;
    expiresAt?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    pickedBy?: string | null;
    pickedAt?: string | null;
    verifiedBy?: string | null;
    verifiedAt?: string | null;
    deliveredBy?: string | null;
    deliveredAt?: string | null;
    cancelledBy?: string | null;
    cancelledAt?: string | null;
    notes?: string | null;
  };
};

export type ApproveReservationMutationVariables = {
  input: ApproveReservationInput;
};

export type ApproveReservationMutation = {
  approveReservation: {
    __typename: 'Reservation';
    resID: string;
    orgID: string;
    ticketID: string;
    plantID: string;
    sku: string;
    qty: number;
    serials?: Array<string> | null;
    status: ReservationStatus;
    expiresAt?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    pickedBy?: string | null;
    pickedAt?: string | null;
    verifiedBy?: string | null;
    verifiedAt?: string | null;
    deliveredBy?: string | null;
    deliveredAt?: string | null;
    cancelledBy?: string | null;
    cancelledAt?: string | null;
    notes?: string | null;
  };
};

export type PickReservationMutationVariables = {
  input: PickReservationInput;
};

export type PickReservationMutation = {
  pickReservation: {
    __typename: 'Reservation';
    resID: string;
    orgID: string;
    ticketID: string;
    plantID: string;
    sku: string;
    qty: number;
    serials?: Array<string> | null;
    status: ReservationStatus;
    expiresAt?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    pickedBy?: string | null;
    pickedAt?: string | null;
    verifiedBy?: string | null;
    verifiedAt?: string | null;
    deliveredBy?: string | null;
    deliveredAt?: string | null;
    cancelledBy?: string | null;
    cancelledAt?: string | null;
    notes?: string | null;
  };
};

export type UpdateReservationStatusMutationVariables = {
  input: UpdateReservationStatusInput;
};

export type UpdateReservationStatusMutation = {
  updateReservationStatus: {
    __typename: 'Reservation';
    resID: string;
    orgID: string;
    ticketID: string;
    plantID: string;
    sku: string;
    qty: number;
    serials?: Array<string> | null;
    status: ReservationStatus;
    expiresAt?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    pickedBy?: string | null;
    pickedAt?: string | null;
    verifiedBy?: string | null;
    verifiedAt?: string | null;
    deliveredBy?: string | null;
    deliveredAt?: string | null;
    cancelledBy?: string | null;
    cancelledAt?: string | null;
    notes?: string | null;
  };
};

export type DispatchReservedMutationVariables = {
  input: DispatchReservedInput;
};

export type DispatchReservedMutation = {
  dispatchReserved: {
    __typename: 'GoodsIssue';
    issueID: string;
    orgID: string;
    ticketID: string;
    plantID: string;
    items: Array<{
      __typename: 'IssueLine';
      sku: string;
      qty: number;
      serials?: Array<string> | null;
    }>;
    transportDocURL?: string | null;
    createdAt: string;
    verifiedAt?: string | null;
    verifiedBy?: string | null;
    deliveredAt?: string | null;
  };
};

export type VerifyDeliveryMutationVariables = {
  input: VerifyDeliveryInput;
};

export type VerifyDeliveryMutation = {
  verifyDelivery: {
    __typename: 'GoodsIssue';
    issueID: string;
    orgID: string;
    ticketID: string;
    plantID: string;
    items: Array<{
      __typename: 'IssueLine';
      sku: string;
      qty: number;
      serials?: Array<string> | null;
    }>;
    transportDocURL?: string | null;
    createdAt: string;
    verifiedAt?: string | null;
    verifiedBy?: string | null;
    deliveredAt?: string | null;
  };
};

export type ConfirmDeliveryMutationVariables = {
  input: ConfirmDeliveryInput;
};

export type ConfirmDeliveryMutation = {
  confirmDelivery: {
    __typename: 'GoodsIssue';
    issueID: string;
    orgID: string;
    ticketID: string;
    plantID: string;
    items: Array<{
      __typename: 'IssueLine';
      sku: string;
      qty: number;
      serials?: Array<string> | null;
    }>;
    transportDocURL?: string | null;
    createdAt: string;
    verifiedAt?: string | null;
    verifiedBy?: string | null;
    deliveredAt?: string | null;
  };
};

export type CancelReservationMutationVariables = {
  input: CancelReservationInput;
};

export type CancelReservationMutation = {
  cancelReservation: {
    __typename: 'Reservation';
    resID: string;
    orgID: string;
    ticketID: string;
    plantID: string;
    sku: string;
    qty: number;
    serials?: Array<string> | null;
    status: ReservationStatus;
    expiresAt?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    pickedBy?: string | null;
    pickedAt?: string | null;
    verifiedBy?: string | null;
    verifiedAt?: string | null;
    deliveredBy?: string | null;
    deliveredAt?: string | null;
    cancelledBy?: string | null;
    cancelledAt?: string | null;
    notes?: string | null;
  };
};

export type InstallSerialMutationVariables = {
  input: InstallSerialInput;
};

export type InstallSerialMutation = {
  installSerial: {
    __typename: 'SerialMaster';
    serial: string;
    orgID: string;
    sku: string;
    state: SerialState;
    plantID?: string | null;
    loggerID?: string | null;
    tractorVIN?: string | null;
    lastTicketID?: string | null;
    costPaise?: number | null;
    warrantyTill?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type RemoveSerialMutationVariables = {
  input: RemoveSerialInput;
};

export type RemoveSerialMutation = {
  removeSerial: {
    __typename: 'SerialMaster';
    serial: string;
    orgID: string;
    sku: string;
    state: SerialState;
    plantID?: string | null;
    loggerID?: string | null;
    tractorVIN?: string | null;
    lastTicketID?: string | null;
    costPaise?: number | null;
    warrantyTill?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateTransferMutationVariables = {
  input: CreateTransferInput;
};

export type CreateTransferMutation = {
  createTransfer: {
    __typename: 'TransferOrder';
    transferID: string;
    orgID: string;
    srcPlantID: string;
    dstPlantID: string;
    status: TransferStatus;
    items: Array<{
      __typename: 'TransferLine';
      sku: string;
      qty: number;
      serials?: Array<string> | null;
    }>;
    createdAt: string;
    dispatchedAt?: string | null;
    receivedAt?: string | null;
  };
};

export type DispatchTransferMutationVariables = {
  input: DispatchTransferInput;
};

export type DispatchTransferMutation = {
  dispatchTransfer: {
    __typename: 'TransferOrder';
    transferID: string;
    orgID: string;
    srcPlantID: string;
    dstPlantID: string;
    status: TransferStatus;
    items: Array<{
      __typename: 'TransferLine';
      sku: string;
      qty: number;
      serials?: Array<string> | null;
    }>;
    createdAt: string;
    dispatchedAt?: string | null;
    receivedAt?: string | null;
  };
};

export type ReceiveTransferMutationVariables = {
  input: ReceiveTransferInput;
};

export type ReceiveTransferMutation = {
  receiveTransfer: {
    __typename: 'TransferOrder';
    transferID: string;
    orgID: string;
    srcPlantID: string;
    dstPlantID: string;
    status: TransferStatus;
    items: Array<{
      __typename: 'TransferLine';
      sku: string;
      qty: number;
      serials?: Array<string> | null;
    }>;
    createdAt: string;
    dispatchedAt?: string | null;
    receivedAt?: string | null;
  };
};

export type AdjustStockMutationVariables = {
  input: AdjustStockInput;
};

export type AdjustStockMutation = {
  adjustStock: {
    __typename: 'PlantStock';
    orgID: string;
    plantID: string;
    sku: string;
    category: InventoryCategory;
    stock: number;
    reservedQty: number;
    minStock?: number | null;
    maxStock?: number | null;
    reorderLevel?: number | null;
    safetyNormPercentage?: number | null;
    locationBin?: string | null;
    updatedAt: string;
  };
};

export type CreateWarrantyClaimMutationVariables = {
  input: CreateWarrantyClaimInput;
};

export type CreateWarrantyClaimMutation = {
  createWarrantyClaim: {
    __typename: 'WarrantyClaim';
    claimID: string;
    orgID: string;
    partID: string;
    serial?: string | null;
    ticketID: string;
    reason?: string | null;
    status: WarrantyStatus;
    vendorRMA?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateWarrantyClaimStatusMutationVariables = {
  input: UpdateWarrantyClaimStatusInput;
};

export type UpdateWarrantyClaimStatusMutation = {
  updateWarrantyClaimStatus: {
    __typename: 'WarrantyClaim';
    claimID: string;
    orgID: string;
    partID: string;
    serial?: string | null;
    ticketID: string;
    reason?: string | null;
    status: WarrantyStatus;
    vendorRMA?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type ApplyReceiptLineMutationVariables = {
  input: ApplyReceiptLineInput;
};

export type ApplyReceiptLineMutation = {
  applyReceiptLine: {
    __typename: 'PlantStock';
    orgID: string;
    plantID: string;
    sku: string;
    category: InventoryCategory;
    stock: number;
    reservedQty: number;
    minStock?: number | null;
    maxStock?: number | null;
    reorderLevel?: number | null;
    safetyNormPercentage?: number | null;
    locationBin?: string | null;
    updatedAt: string;
  };
};

export type UpsertSerialMutationVariables = {
  input: UpsertSerialInput;
};

export type UpsertSerialMutation = {
  upsertSerial: {
    __typename: 'SerialMaster';
    serial: string;
    orgID: string;
    sku: string;
    state: SerialState;
    plantID?: string | null;
    loggerID?: string | null;
    tractorVIN?: string | null;
    lastTicketID?: string | null;
    costPaise?: number | null;
    warrantyTill?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type AppendInventoryLogMutationVariables = {
  input: AppendInventoryLogInput;
};

export type AppendInventoryLogMutation = {
  appendInventoryLog: {
    __typename: 'InventoryLog';
    orgID: string;
    plantID: string;
    sku: string;
    ts: string;
    delta: number;
    reason: InventoryLogReason;
    ticketID?: string | null;
    before?: number | null;
    after?: number | null;
    meta?: string | null;
  };
};

export type StartMediaUploadMutationVariables = {
  input: StartMediaUploadInput;
};

export type StartMediaUploadMutation = {
  startMediaUpload: {
    __typename: 'StartMediaUploadOutput';
    key: string;
    uploadType: string;
    putUrl?: string | null;
    uploadId?: string | null;
    partSize?: number | null;
    partUrls?: Array<string> | null;
  };
};

export type CompleteMediaUploadMutationVariables = {
  input: CompleteMediaUploadInput;
};

export type CompleteMediaUploadMutation = {
  completeMediaUpload: boolean;
};

export type GetSignedViewUrlMutationVariables = {
  key: string;
  ttlSec?: number | null;
};

export type GetSignedViewUrlMutation = {
  getSignedViewUrl?: string | null;
};

export type GetSignedViewUrlsMutationVariables = {
  keys: Array<string>;
  ttlSec?: number | null;
};

export type GetSignedViewUrlsMutation = {
  getSignedViewUrls: Array<string>;
};

export type CreateLogBookEntryMutationVariables = {
  input: CreateLogBookEntryInput;
};

export type CreateLogBookEntryMutation = {
  createLogBookEntry: {
    __typename: 'LogBookEntry';
    orgID: string;
    plantID: string;
    logDate: string;
    files: Array<{
      __typename: 'LogBookFile';
      key: string;
      fileName?: string | null;
      contentType?: string | null;
      sizeBytes?: number | null;
    }>;
    notes?: string | null;
    createdAt: string;
    createdBy: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
  };
};

export type UpdateLogBookEntryMutationVariables = {
  input: UpdateLogBookEntryInput;
};

export type UpdateLogBookEntryMutation = {
  updateLogBookEntry: {
    __typename: 'LogBookEntry';
    orgID: string;
    plantID: string;
    logDate: string;
    files: Array<{
      __typename: 'LogBookFile';
      key: string;
      fileName?: string | null;
      contentType?: string | null;
      sizeBytes?: number | null;
    }>;
    notes?: string | null;
    createdAt: string;
    createdBy: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
  };
};

export type DeleteLogBookEntryMutationVariables = {
  input: DeleteLogBookEntryInput;
};

export type DeleteLogBookEntryMutation = {
  deleteLogBookEntry: {
    __typename: 'LogBookEntry';
    orgID: string;
    plantID: string;
    logDate: string;
    files: Array<{
      __typename: 'LogBookFile';
      key: string;
      fileName?: string | null;
      contentType?: string | null;
      sizeBytes?: number | null;
    }>;
    notes?: string | null;
    createdAt: string;
    createdBy: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
  };
};

export type CreateEmployeePunchMutationVariables = {
  input: CreateEmployeePunchInput;
};

export type CreateEmployeePunchMutation = {
  createEmployeePunch: {
    __typename: 'EmployeePunch';
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    date: string;
    type: PunchType;
    ts: string;
    source: PunchSource;
    method?: string | null;
    location?: string | null;
    markedByUserID?: string | null;
    notes?: string | null;
    createdAt: string;
  };
};

export type UpsertEmployeeAttendanceDayMutationVariables = {
  input: UpsertEmployeeAttendanceDayInput;
};

export type UpsertEmployeeAttendanceDayMutation = {
  upsertEmployeeAttendanceDay: {
    __typename: 'EmployeeAttendanceDay';
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    date: string;
    status: EmployeeAttendanceStatus;
    checkInAt?: string | null;
    checkOutAt?: string | null;
    punchCount: number;
    lastPunchType?: PunchType | null;
    lastPunchAt?: string | null;
    notes?: string | null;
    markedByUserID?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type RegisterEmployeeFaceMutationVariables = {
  input: RegisterEmployeeFaceInput;
};

export type RegisterEmployeeFaceMutation = {
  registerEmployeeFace: {
    __typename: 'FaceRegistrationResult';
    success: boolean;
    message: string;
    faceId?: string | null;
    userID: string;
  };
};

export type MarkAttendanceWithFaceMutationVariables = {
  input: MarkAttendanceWithFaceInput;
};

export type MarkAttendanceWithFaceMutation = {
  markAttendanceWithFace: {
    __typename: 'FaceAttendanceResult';
    success: boolean;
    message: string;
    userID: string;
    confidence: number;
    punchType: PunchType;
    timestamp: string;
    punchID: string;
  };
};

export type MarkManualAttendanceMutationVariables = {
  input: MarkManualAttendanceInput;
};

export type MarkManualAttendanceMutation = {
  markManualAttendance: {
    __typename: 'ManualAttendanceResult';
    success: boolean;
    message: string;
    userID: string;
    punchType: PunchType;
    timestamp: string;
    punchID: string;
    method: string;
    location?: string | null;
  };
};

export type CreateManualRuntimeEntryMutationVariables = {
  input: CreateManualRuntimeEntryInput;
};

export type CreateManualRuntimeEntryMutation = {
  createManualRuntimeEntry: {
    __typename: 'ManualRuntimeEntry';
    loggerID: string;
    date: string;
    plantID?: string | null;
    orgID?: string | null;
    startCumulativeRuntime: number;
    endCumulativeRuntime: number;
    todaysRuntime: number;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
};

export type UpdateManualRuntimeEntryMutationVariables = {
  input: UpdateManualRuntimeEntryInput;
};

export type UpdateManualRuntimeEntryMutation = {
  updateManualRuntimeEntry?: {
    __typename: 'ManualRuntimeEntry';
    loggerID: string;
    date: string;
    plantID?: string | null;
    orgID?: string | null;
    startCumulativeRuntime: number;
    endCumulativeRuntime: number;
    todaysRuntime: number;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type CreateAttendanceRegularizationRequestMutationVariables = {
  input: CreateAttendanceRegularizationInput;
};

export type CreateAttendanceRegularizationRequestMutation = {
  createAttendanceRegularizationRequest: {
    __typename: 'AttendanceRegularizationRequest';
    requestID: string;
    userID: string;
    userEmail?: string | null;
    orgID: string;
    plantID: string;
    date: string;
    currentStatus: EmployeeAttendanceStatus;
    requestedStatus: EmployeeAttendanceStatus;
    reason: AttendanceRegularizationReason;
    description: string;
    attachments?: Array<string> | null;
    status: AttendanceRegularizationStatus;
    submittedAt: string;
    submittedBy: string;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    reviewComments?: string | null;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type ApproveAttendanceRegularizationMutationVariables = {
  input: ApproveAttendanceRegularizationInput;
};

export type ApproveAttendanceRegularizationMutation = {
  approveAttendanceRegularization: {
    __typename: 'AttendanceRegularizationRequest';
    requestID: string;
    userID: string;
    userEmail?: string | null;
    orgID: string;
    plantID: string;
    date: string;
    currentStatus: EmployeeAttendanceStatus;
    requestedStatus: EmployeeAttendanceStatus;
    reason: AttendanceRegularizationReason;
    description: string;
    attachments?: Array<string> | null;
    status: AttendanceRegularizationStatus;
    submittedAt: string;
    submittedBy: string;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    reviewComments?: string | null;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type RejectAttendanceRegularizationMutationVariables = {
  input: RejectAttendanceRegularizationInput;
};

export type RejectAttendanceRegularizationMutation = {
  rejectAttendanceRegularization: {
    __typename: 'AttendanceRegularizationRequest';
    requestID: string;
    userID: string;
    userEmail?: string | null;
    orgID: string;
    plantID: string;
    date: string;
    currentStatus: EmployeeAttendanceStatus;
    requestedStatus: EmployeeAttendanceStatus;
    reason: AttendanceRegularizationReason;
    description: string;
    attachments?: Array<string> | null;
    status: AttendanceRegularizationStatus;
    submittedAt: string;
    submittedBy: string;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    reviewComments?: string | null;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CancelAttendanceRegularizationMutationVariables = {
  input: CancelAttendanceRegularizationInput;
};

export type CancelAttendanceRegularizationMutation = {
  cancelAttendanceRegularization: {
    __typename: 'AttendanceRegularizationRequest';
    requestID: string;
    userID: string;
    userEmail?: string | null;
    orgID: string;
    plantID: string;
    date: string;
    currentStatus: EmployeeAttendanceStatus;
    requestedStatus: EmployeeAttendanceStatus;
    reason: AttendanceRegularizationReason;
    description: string;
    attachments?: Array<string> | null;
    status: AttendanceRegularizationStatus;
    submittedAt: string;
    submittedBy: string;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    reviewComments?: string | null;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreatePayslipMutationVariables = {
  input: CreatePayslipInput;
};

export type CreatePayslipMutation = {
  createPayslip: {
    __typename: 'Payslip';
    payslipID: string;
    userID: string;
    year: number;
    month: number;
    officeID: string;
    orgID: string;
    status: PayslipStatus;
    basicSalary: number;
    allowances?: {
      __typename: 'PayslipAllowances';
      hra?: number | null;
      transport?: number | null;
      medical?: number | null;
      bonus?: number | null;
      overtime?: number | null;
      other?: number | null;
      total: number;
    } | null;
    deductions?: {
      __typename: 'PayslipDeductions';
      pf?: number | null;
      esi?: number | null;
      tax?: number | null;
      loan?: number | null;
      advance?: number | null;
      other?: number | null;
      total: number;
    } | null;
    grossSalary: number;
    netSalary: number;
    payPeriodStart: string;
    payPeriodEnd: string;
    generatedDate: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    paidAt?: string | null;
    documents?: Array<{
      __typename: 'PayslipDocument';
      documentID: string;
      type: PayslipDocumentType;
      fileName: string;
      fileSize: number;
      s3Key?: string | null;
      uploadedAt: string;
      uploadedBy: string;
    }> | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UploadPayslipMutationVariables = {
  input: UploadPayslipInput;
};

export type UploadPayslipMutation = {
  uploadPayslip: {
    __typename: 'Payslip';
    payslipID: string;
    userID: string;
    year: number;
    month: number;
    officeID: string;
    orgID: string;
    status: PayslipStatus;
    basicSalary: number;
    allowances?: {
      __typename: 'PayslipAllowances';
      hra?: number | null;
      transport?: number | null;
      medical?: number | null;
      bonus?: number | null;
      overtime?: number | null;
      other?: number | null;
      total: number;
    } | null;
    deductions?: {
      __typename: 'PayslipDeductions';
      pf?: number | null;
      esi?: number | null;
      tax?: number | null;
      loan?: number | null;
      advance?: number | null;
      other?: number | null;
      total: number;
    } | null;
    grossSalary: number;
    netSalary: number;
    payPeriodStart: string;
    payPeriodEnd: string;
    generatedDate: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    paidAt?: string | null;
    documents?: Array<{
      __typename: 'PayslipDocument';
      documentID: string;
      type: PayslipDocumentType;
      fileName: string;
      fileSize: number;
      s3Key?: string | null;
      uploadedAt: string;
      uploadedBy: string;
    }> | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type DeletePayslipMutationVariables = {
  userID: string;
  year: number;
  month: number;
};

export type DeletePayslipMutation = {
  deletePayslip: {
    __typename: 'DeletePayslipResult';
    success: boolean;
    message: string;
    deletedPayslipID?: string | null;
  };
};

export type GetPayslipDownloadUrlMutationVariables = {
  year: number;
  month: number;
};

export type GetPayslipDownloadUrlMutation = {
  getPayslipDownloadUrl: {
    __typename: 'PayslipDownloadUrl';
    downloadUrl: string;
    expiresIn: number;
  };
};

export type CreateReimbursementClaimMutationVariables = {
  input: CreateReimbursementClaimInput;
};

export type CreateReimbursementClaimMutation = {
  createReimbursementClaim: {
    __typename: 'RaiseReimbursement';
    claimID: string;
    userID: string;
    plantID: string;
    orgID: string;
    claimType: ReimbursementClaimType;
    amount: number;
    currency: string;
    description: string;
    category: ReimbursementCategory;
    expenseDate: string;
    status: ReimbursementStatus;
    paymentMethod: PaymentMethod;
    bankDetails?: {
      __typename: 'BankDetails';
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
      branchName?: string | null;
    } | null;
    upiDetails?: {
      __typename: 'UPIDetails';
      upiID: string;
      upiName: string;
    } | null;
    proofDocuments: Array<{
      __typename: 'ReimbursementDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      uploadedAt: string;
      s3Key: string;
      s3Bucket: string;
    }>;
    submittedAt: string;
    submittedBy: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    processedBy?: string | null;
    processedAt?: string | null;
    paidAt?: string | null;
    transactionID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateReimbursementClaimMutationVariables = {
  input: UpdateReimbursementClaimInput;
};

export type UpdateReimbursementClaimMutation = {
  updateReimbursementClaim: {
    __typename: 'RaiseReimbursement';
    claimID: string;
    userID: string;
    plantID: string;
    orgID: string;
    claimType: ReimbursementClaimType;
    amount: number;
    currency: string;
    description: string;
    category: ReimbursementCategory;
    expenseDate: string;
    status: ReimbursementStatus;
    paymentMethod: PaymentMethod;
    bankDetails?: {
      __typename: 'BankDetails';
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
      branchName?: string | null;
    } | null;
    upiDetails?: {
      __typename: 'UPIDetails';
      upiID: string;
      upiName: string;
    } | null;
    proofDocuments: Array<{
      __typename: 'ReimbursementDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      uploadedAt: string;
      s3Key: string;
      s3Bucket: string;
    }>;
    submittedAt: string;
    submittedBy: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    processedBy?: string | null;
    processedAt?: string | null;
    paidAt?: string | null;
    transactionID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type ApproveReimbursementClaimMutationVariables = {
  input: ApproveReimbursementClaimInput;
};

export type ApproveReimbursementClaimMutation = {
  approveReimbursementClaim: {
    __typename: 'RaiseReimbursement';
    claimID: string;
    userID: string;
    plantID: string;
    orgID: string;
    claimType: ReimbursementClaimType;
    amount: number;
    currency: string;
    description: string;
    category: ReimbursementCategory;
    expenseDate: string;
    status: ReimbursementStatus;
    paymentMethod: PaymentMethod;
    bankDetails?: {
      __typename: 'BankDetails';
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
      branchName?: string | null;
    } | null;
    upiDetails?: {
      __typename: 'UPIDetails';
      upiID: string;
      upiName: string;
    } | null;
    proofDocuments: Array<{
      __typename: 'ReimbursementDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      uploadedAt: string;
      s3Key: string;
      s3Bucket: string;
    }>;
    submittedAt: string;
    submittedBy: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    processedBy?: string | null;
    processedAt?: string | null;
    paidAt?: string | null;
    transactionID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type RejectReimbursementClaimMutationVariables = {
  input: RejectReimbursementClaimInput;
};

export type RejectReimbursementClaimMutation = {
  rejectReimbursementClaim: {
    __typename: 'RaiseReimbursement';
    claimID: string;
    userID: string;
    plantID: string;
    orgID: string;
    claimType: ReimbursementClaimType;
    amount: number;
    currency: string;
    description: string;
    category: ReimbursementCategory;
    expenseDate: string;
    status: ReimbursementStatus;
    paymentMethod: PaymentMethod;
    bankDetails?: {
      __typename: 'BankDetails';
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
      branchName?: string | null;
    } | null;
    upiDetails?: {
      __typename: 'UPIDetails';
      upiID: string;
      upiName: string;
    } | null;
    proofDocuments: Array<{
      __typename: 'ReimbursementDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      uploadedAt: string;
      s3Key: string;
      s3Bucket: string;
    }>;
    submittedAt: string;
    submittedBy: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    processedBy?: string | null;
    processedAt?: string | null;
    paidAt?: string | null;
    transactionID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type ProcessReimbursementPaymentMutationVariables = {
  input: ProcessReimbursementPaymentInput;
};

export type ProcessReimbursementPaymentMutation = {
  processReimbursementPayment: {
    __typename: 'RaiseReimbursement';
    claimID: string;
    userID: string;
    plantID: string;
    orgID: string;
    claimType: ReimbursementClaimType;
    amount: number;
    currency: string;
    description: string;
    category: ReimbursementCategory;
    expenseDate: string;
    status: ReimbursementStatus;
    paymentMethod: PaymentMethod;
    bankDetails?: {
      __typename: 'BankDetails';
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
      branchName?: string | null;
    } | null;
    upiDetails?: {
      __typename: 'UPIDetails';
      upiID: string;
      upiName: string;
    } | null;
    proofDocuments: Array<{
      __typename: 'ReimbursementDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      uploadedAt: string;
      s3Key: string;
      s3Bucket: string;
    }>;
    submittedAt: string;
    submittedBy: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    processedBy?: string | null;
    processedAt?: string | null;
    paidAt?: string | null;
    transactionID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type DeleteReimbursementClaimMutationVariables = {
  claimID: string;
};

export type DeleteReimbursementClaimMutation = {
  deleteReimbursementClaim: {
    __typename: 'RaiseReimbursement';
    claimID: string;
    userID: string;
    plantID: string;
    orgID: string;
    claimType: ReimbursementClaimType;
    amount: number;
    currency: string;
    description: string;
    category: ReimbursementCategory;
    expenseDate: string;
    status: ReimbursementStatus;
    paymentMethod: PaymentMethod;
    bankDetails?: {
      __typename: 'BankDetails';
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
      branchName?: string | null;
    } | null;
    upiDetails?: {
      __typename: 'UPIDetails';
      upiID: string;
      upiName: string;
    } | null;
    proofDocuments: Array<{
      __typename: 'ReimbursementDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      uploadedAt: string;
      s3Key: string;
      s3Bucket: string;
    }>;
    submittedAt: string;
    submittedBy: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    processedBy?: string | null;
    processedAt?: string | null;
    paidAt?: string | null;
    transactionID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UploadReimbursementDocumentMutationVariables = {
  input: UploadReimbursementDocumentInput;
};

export type UploadReimbursementDocumentMutation = {
  uploadReimbursementDocument: {
    __typename: 'ReimbursementDocument';
    documentID: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    documentType: DocumentType;
    uploadedAt: string;
    s3Key: string;
    s3Bucket: string;
  };
};

export type UploadPayslipDocumentMutationVariables = {
  input: UploadPayslipDocumentInput;
};

export type UploadPayslipDocumentMutation = {
  uploadPayslipDocument: {
    __typename: 'PayslipDocument';
    documentID: string;
    type: PayslipDocumentType;
    fileName: string;
    fileSize: number;
    s3Key?: string | null;
    uploadedAt: string;
    uploadedBy: string;
  };
};

export type UploadGenericDocumentMutationVariables = {
  input: UploadGenericDocumentInput;
};

export type UploadGenericDocumentMutation = {
  uploadGenericDocument: {
    __typename: 'GenericDocument';
    documentID: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    documentType: DocumentType;
    s3Key: string;
    s3Bucket: string;
    uploadedAt: string;
    uploadedBy: string;
    orgID: string;
    tags?: Array<string> | null;
    description?: string | null;
    isPublic: boolean;
    downloadCount: number;
    expiresAt?: string | null;
  };
};

export type GetReimbursementUploadUrlMutationVariables = {
  input: GetReimbursementUploadUrlInput;
};

export type GetReimbursementUploadUrlMutation = {
  getReimbursementUploadUrl: {
    __typename: 'PresignedUploadUrl';
    uploadUrl: string;
    s3Key: string;
    expiresIn: number;
    maxFileSize: number;
  };
};

export type GetPayslipUploadUrlMutationVariables = {
  input: GetPayslipUploadUrlInput;
};

export type GetPayslipUploadUrlMutation = {
  getPayslipUploadUrl: {
    __typename: 'PresignedUploadUrl';
    uploadUrl: string;
    s3Key: string;
    expiresIn: number;
    maxFileSize: number;
  };
};

export type GetGenericDocumentUploadUrlMutationVariables = {
  input: GetGenericDocumentUploadUrlInput;
};

export type GetGenericDocumentUploadUrlMutation = {
  getGenericDocumentUploadUrl: {
    __typename: 'PresignedUploadUrl';
    uploadUrl: string;
    s3Key: string;
    expiresIn: number;
    maxFileSize: number;
  };
};

export type InitiatePasswordResetMutationVariables = {
  input: InitiatePasswordResetInput;
};

export type InitiatePasswordResetMutation = {
  initiatePasswordReset: {
    __typename: 'PasswordResetInitiationResult';
    success: boolean;
    message: string;
    expiresIn?: string | null;
  };
};

export type VerifyResetCodeMutationVariables = {
  input: VerifyResetCodeInput;
};

export type VerifyResetCodeMutation = {
  verifyResetCode: {
    __typename: 'PasswordResetVerificationResult';
    success: boolean;
    message: string;
  };
};

export type CompletePasswordResetMutationVariables = {
  input: CompletePasswordResetInput;
};

export type CompletePasswordResetMutation = {
  completePasswordReset: {
    __typename: 'PasswordResetCompletionResult';
    success: boolean;
    message: string;
  };
};

export type CreateOfficeLocationMutationVariables = {
  input: CreateOfficeLocationInput;
};

export type CreateOfficeLocationMutation = {
  createOfficeLocation: {
    __typename: 'OfficeLocation';
    officeID: string;
    orgID: string;
    plantID?: string | null;
    name: string;
    officeType: OfficeType;
    address: {
      __typename: 'OfficeAddress';
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      coordinates?: {
        __typename: 'GPSCoordinates';
        latitude: number;
        longitude: number;
      } | null;
    };
    contactInfo?: {
      __typename: 'OfficeContactInfo';
      phone?: string | null;
      email?: string | null;
      managerName?: string | null;
      managerPhone?: string | null;
    } | null;
    geofenceRadius?: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateOfficeLocationMutationVariables = {
  input: UpdateOfficeLocationInput;
};

export type UpdateOfficeLocationMutation = {
  updateOfficeLocation: {
    __typename: 'OfficeLocation';
    officeID: string;
    orgID: string;
    plantID?: string | null;
    name: string;
    officeType: OfficeType;
    address: {
      __typename: 'OfficeAddress';
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      coordinates?: {
        __typename: 'GPSCoordinates';
        latitude: number;
        longitude: number;
      } | null;
    };
    contactInfo?: {
      __typename: 'OfficeContactInfo';
      phone?: string | null;
      email?: string | null;
      managerName?: string | null;
      managerPhone?: string | null;
    } | null;
    geofenceRadius?: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type DeleteOfficeLocationMutationVariables = {
  input: DeleteOfficeLocationInput;
};

export type DeleteOfficeLocationMutation = {
  deleteOfficeLocation: {
    __typename: 'OfficeLocation';
    officeID: string;
    orgID: string;
    plantID?: string | null;
    name: string;
    officeType: OfficeType;
    address: {
      __typename: 'OfficeAddress';
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      coordinates?: {
        __typename: 'GPSCoordinates';
        latitude: number;
        longitude: number;
      } | null;
    };
    contactInfo?: {
      __typename: 'OfficeContactInfo';
      phone?: string | null;
      email?: string | null;
      managerName?: string | null;
      managerPhone?: string | null;
    } | null;
    geofenceRadius?: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type SetMyOfficeMutationVariables = {
  officeID: string;
};

export type SetMyOfficeMutation = {
  setMyOffice: {
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateLeavePolicyMutationVariables = {
  input: CreateLeavePolicyInput;
};

export type CreateLeavePolicyMutation = {
  createLeavePolicy: {
    __typename: 'LeavePolicy';
    policyID: string;
    orgID: string;
    plantID?: string | null;
    leaveType: LeaveType;
    totalDaysPerYear: number;
    eligibleGenders: Array<Gender>;
    eligibleRoles: Array<string>;
    carryForwardAllowed: boolean;
    maxCarryForwardDays?: number | null;
    minServiceMonths?: number | null;
    maxConsecutiveDays?: number | null;
    requiresApproval: boolean;
    approvalLevels: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateLeavePolicyMutationVariables = {
  input: UpdateLeavePolicyInput;
};

export type UpdateLeavePolicyMutation = {
  updateLeavePolicy: {
    __typename: 'LeavePolicy';
    policyID: string;
    orgID: string;
    plantID?: string | null;
    leaveType: LeaveType;
    totalDaysPerYear: number;
    eligibleGenders: Array<Gender>;
    eligibleRoles: Array<string>;
    carryForwardAllowed: boolean;
    maxCarryForwardDays?: number | null;
    minServiceMonths?: number | null;
    maxConsecutiveDays?: number | null;
    requiresApproval: boolean;
    approvalLevels: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type DeleteLeavePolicyMutationVariables = {
  orgID: string;
  leaveType: LeaveType;
};

export type DeleteLeavePolicyMutation = {
  deleteLeavePolicy: {
    __typename: 'LeavePolicy';
    policyID: string;
    orgID: string;
    plantID?: string | null;
    leaveType: LeaveType;
    totalDaysPerYear: number;
    eligibleGenders: Array<Gender>;
    eligibleRoles: Array<string>;
    carryForwardAllowed: boolean;
    maxCarryForwardDays?: number | null;
    minServiceMonths?: number | null;
    maxConsecutiveDays?: number | null;
    requiresApproval: boolean;
    approvalLevels: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type InitializeUserLeaveBalancesMutationVariables = {
  input: InitializeUserLeaveBalancesInput;
};

export type InitializeUserLeaveBalancesMutation = {
  initializeUserLeaveBalances: Array<{
    __typename: 'LeaveBalance';
    balanceID: string;
    userID: string;
    year: number;
    leaveType: LeaveType;
    totalAllocated: number;
    used: number;
    pending: number;
    available: number;
    carryForward: number;
    lastUpdated: string;
  }>;
};

export type AdjustLeaveBalanceMutationVariables = {
  input: AdjustLeaveBalanceInput;
};

export type AdjustLeaveBalanceMutation = {
  adjustLeaveBalance: {
    __typename: 'LeaveBalance';
    balanceID: string;
    userID: string;
    year: number;
    leaveType: LeaveType;
    totalAllocated: number;
    used: number;
    pending: number;
    available: number;
    carryForward: number;
    lastUpdated: string;
  };
};

export type CarryForwardLeaveBalancesMutationVariables = {
  input: CarryForwardLeaveBalancesInput;
};

export type CarryForwardLeaveBalancesMutation = {
  carryForwardLeaveBalances: Array<{
    __typename: 'LeaveBalance';
    balanceID: string;
    userID: string;
    year: number;
    leaveType: LeaveType;
    totalAllocated: number;
    used: number;
    pending: number;
    available: number;
    carryForward: number;
    lastUpdated: string;
  }>;
};

export type ApplyForLeaveMutationVariables = {
  input: ApplyForLeaveInput;
};

export type ApplyForLeaveMutation = {
  applyForLeave: {
    __typename: 'LeaveApplication';
    applicationID: string;
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    appliedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    attachments?: Array<{
      __typename: 'LeaveAttachment';
      attachmentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      s3Key: string;
      uploadedAt: string;
    }> | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateLeaveApplicationMutationVariables = {
  input: UpdateLeaveApplicationInput;
};

export type UpdateLeaveApplicationMutation = {
  updateLeaveApplication: {
    __typename: 'LeaveApplication';
    applicationID: string;
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    appliedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    attachments?: Array<{
      __typename: 'LeaveAttachment';
      attachmentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      s3Key: string;
      uploadedAt: string;
    }> | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CancelLeaveApplicationMutationVariables = {
  input: CancelLeaveApplicationInput;
};

export type CancelLeaveApplicationMutation = {
  cancelLeaveApplication: {
    __typename: 'LeaveApplication';
    applicationID: string;
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    appliedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    attachments?: Array<{
      __typename: 'LeaveAttachment';
      attachmentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      s3Key: string;
      uploadedAt: string;
    }> | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type ApproveLeaveApplicationMutationVariables = {
  input: ApproveLeaveApplicationInput;
};

export type ApproveLeaveApplicationMutation = {
  approveLeaveApplication: {
    __typename: 'LeaveApplication';
    applicationID: string;
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    appliedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    attachments?: Array<{
      __typename: 'LeaveAttachment';
      attachmentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      s3Key: string;
      uploadedAt: string;
    }> | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type RejectLeaveApplicationMutationVariables = {
  input: RejectLeaveApplicationInput;
};

export type RejectLeaveApplicationMutation = {
  rejectLeaveApplication: {
    __typename: 'LeaveApplication';
    applicationID: string;
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    appliedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    attachments?: Array<{
      __typename: 'LeaveAttachment';
      attachmentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      s3Key: string;
      uploadedAt: string;
    }> | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type BulkApproveLeaveApplicationsMutationVariables = {
  input: BulkApproveLeaveApplicationsInput;
};

export type BulkApproveLeaveApplicationsMutation = {
  bulkApproveLeaveApplications: Array<{
    __typename: 'LeaveApplication';
    applicationID: string;
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    appliedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    attachments?: Array<{
      __typename: 'LeaveAttachment';
      attachmentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      s3Key: string;
      uploadedAt: string;
    }> | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type BulkRejectLeaveApplicationsMutationVariables = {
  input: BulkRejectLeaveApplicationsInput;
};

export type BulkRejectLeaveApplicationsMutation = {
  bulkRejectLeaveApplications: Array<{
    __typename: 'LeaveApplication';
    applicationID: string;
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    appliedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    attachments?: Array<{
      __typename: 'LeaveAttachment';
      attachmentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      s3Key: string;
      uploadedAt: string;
    }> | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type CreateOfficeCalendarMutationVariables = {
  input: CreateOfficeCalendarInput;
};

export type CreateOfficeCalendarMutation = {
  createOfficeCalendar: {
    __typename: 'OfficeCalendar';
    officeID: string;
    date: string;
    dayType: DayType;
    isWorkingDay: boolean;
    holidayName?: string | null;
    description?: string | null;
    workingHours?: {
      __typename: 'DayWorkingHours';
      startTime: string;
      endTime: string;
      breakStartTime?: string | null;
      breakEndTime?: string | null;
      totalHours: number;
    } | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  };
};

export type UpdateOfficeCalendarMutationVariables = {
  input: UpdateOfficeCalendarInput;
};

export type UpdateOfficeCalendarMutation = {
  updateOfficeCalendar: {
    __typename: 'OfficeCalendar';
    officeID: string;
    date: string;
    dayType: DayType;
    isWorkingDay: boolean;
    holidayName?: string | null;
    description?: string | null;
    workingHours?: {
      __typename: 'DayWorkingHours';
      startTime: string;
      endTime: string;
      breakStartTime?: string | null;
      breakEndTime?: string | null;
      totalHours: number;
    } | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  };
};

export type DeleteOfficeCalendarMutationVariables = {
  officeID: string;
  date: string;
};

export type DeleteOfficeCalendarMutation = {
  deleteOfficeCalendar: {
    __typename: 'OfficeCalendar';
    officeID: string;
    date: string;
    dayType: DayType;
    isWorkingDay: boolean;
    holidayName?: string | null;
    description?: string | null;
    workingHours?: {
      __typename: 'DayWorkingHours';
      startTime: string;
      endTime: string;
      breakStartTime?: string | null;
      breakEndTime?: string | null;
      totalHours: number;
    } | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  };
};

export type BulkCreateHolidaysMutationVariables = {
  input: BulkCreateHolidaysInput;
};

export type BulkCreateHolidaysMutation = {
  bulkCreateHolidays: Array<{
    __typename: 'OfficeCalendar';
    officeID: string;
    date: string;
    dayType: DayType;
    isWorkingDay: boolean;
    holidayName?: string | null;
    description?: string | null;
    workingHours?: {
      __typename: 'DayWorkingHours';
      startTime: string;
      endTime: string;
      breakStartTime?: string | null;
      breakEndTime?: string | null;
      totalHours: number;
    } | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  }>;
};

export type BulkUpdateCalendarDaysMutationVariables = {
  input: BulkUpdateCalendarDaysInput;
};

export type BulkUpdateCalendarDaysMutation = {
  bulkUpdateCalendarDays: Array<{
    __typename: 'OfficeCalendar';
    officeID: string;
    date: string;
    dayType: DayType;
    isWorkingDay: boolean;
    holidayName?: string | null;
    description?: string | null;
    workingHours?: {
      __typename: 'DayWorkingHours';
      startTime: string;
      endTime: string;
      breakStartTime?: string | null;
      breakEndTime?: string | null;
      totalHours: number;
    } | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  }>;
};

export type UniversalCreateMutationVariables = {
  tableName: string;
  data: string;
};

export type UniversalCreateMutation = {
  universalCreate: {
    __typename: 'UniversalResponse';
    success: boolean;
    message: string;
    data?: string | null;
    tableName: string;
    operation: string;
    timestamp: string;
  };
};

export type UniversalUpdateMutationVariables = {
  tableName: string;
  id: string;
  data: string;
};

export type UniversalUpdateMutation = {
  universalUpdate: {
    __typename: 'UniversalResponse';
    success: boolean;
    message: string;
    data?: string | null;
    tableName: string;
    operation: string;
    timestamp: string;
  };
};

export type UniversalDeleteMutationVariables = {
  tableName: string;
  id: string;
};

export type UniversalDeleteMutation = {
  universalDelete: {
    __typename: 'UniversalResponse';
    success: boolean;
    message: string;
    data?: string | null;
    tableName: string;
    operation: string;
    timestamp: string;
  };
};

export type UniversalBatchOperationMutationVariables = {
  operations: Array<UniversalBatchOperationInput>;
};

export type UniversalBatchOperationMutation = {
  universalBatchOperation: {
    __typename: 'UniversalBatchResponse';
    success: boolean;
    message: string;
    results: Array<{
      __typename: 'UniversalResponse';
      success: boolean;
      message: string;
      data?: string | null;
      tableName: string;
      operation: string;
      timestamp: string;
    }>;
    successCount: number;
    failureCount: number;
    timestamp: string;
  };
};

export type UniversalCreateGroupMutationVariables = {
  groupName: string;
  description?: string | null;
  userPoolId?: string | null;
};

export type UniversalCreateGroupMutation = {
  universalCreateGroup: {
    __typename: 'UniversalGroupResponse';
    success: boolean;
    message: string;
    groups: Array<{
      __typename: 'CognitoGroup';
      groupName: string;
      description?: string | null;
      precedence?: number | null;
      roleArn?: string | null;
      userPoolId?: string | null;
      createdAt?: string | null;
      lastModifiedDate?: string | null;
    }>;
    users: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    groupDetails?: string | null;
    timestamp: string;
  };
};

export type UniversalUpdateGroupMutationVariables = {
  groupName: string;
  newGroupName?: string | null;
  description?: string | null;
};

export type UniversalUpdateGroupMutation = {
  universalUpdateGroup: {
    __typename: 'UniversalGroupResponse';
    success: boolean;
    message: string;
    groups: Array<{
      __typename: 'CognitoGroup';
      groupName: string;
      description?: string | null;
      precedence?: number | null;
      roleArn?: string | null;
      userPoolId?: string | null;
      createdAt?: string | null;
      lastModifiedDate?: string | null;
    }>;
    users: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    groupDetails?: string | null;
    timestamp: string;
  };
};

export type UniversalDeleteGroupMutationVariables = {
  groupName: string;
};

export type UniversalDeleteGroupMutation = {
  universalDeleteGroup: {
    __typename: 'UniversalGroupResponse';
    success: boolean;
    message: string;
    groups: Array<{
      __typename: 'CognitoGroup';
      groupName: string;
      description?: string | null;
      precedence?: number | null;
      roleArn?: string | null;
      userPoolId?: string | null;
      createdAt?: string | null;
      lastModifiedDate?: string | null;
    }>;
    users: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    groupDetails?: string | null;
    timestamp: string;
  };
};

export type UniversalManageGroupMembershipMutationVariables = {
  groupName: string;
  usernames: Array<string>;
  action: GroupMembershipAction;
};

export type UniversalManageGroupMembershipMutation = {
  universalManageGroupMembership: {
    __typename: 'UniversalGroupResponse';
    success: boolean;
    message: string;
    groups: Array<{
      __typename: 'CognitoGroup';
      groupName: string;
      description?: string | null;
      precedence?: number | null;
      roleArn?: string | null;
      userPoolId?: string | null;
      createdAt?: string | null;
      lastModifiedDate?: string | null;
    }>;
    users: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    groupDetails?: string | null;
    timestamp: string;
  };
};

export type CreateBookingMutationVariables = {
  input: CreateBookingInput;
};

export type CreateBookingMutation = {
  createBooking: {
    __typename: 'Booking';
    bookingID: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    country: string;
    state: string;
    subject: string;
    message: string;
    visitType: VisitType;
    preferredDate?: string | null;
    preferredTime?: string | null;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string | null;
    notes?: string | null;
    orgID?: string | null;
    plantID?: string | null;
  };
};

export type UpdateBookingMutationVariables = {
  input: UpdateBookingInput;
};

export type UpdateBookingMutation = {
  updateBooking: {
    __typename: 'Booking';
    bookingID: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    country: string;
    state: string;
    subject: string;
    message: string;
    visitType: VisitType;
    preferredDate?: string | null;
    preferredTime?: string | null;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string | null;
    notes?: string | null;
    orgID?: string | null;
    plantID?: string | null;
  };
};

export type DeleteBookingMutationVariables = {
  bookingID: string;
};

export type DeleteBookingMutation = {
  deleteBooking: {
    __typename: 'Booking';
    bookingID: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    country: string;
    state: string;
    subject: string;
    message: string;
    visitType: VisitType;
    preferredDate?: string | null;
    preferredTime?: string | null;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string | null;
    notes?: string | null;
    orgID?: string | null;
    plantID?: string | null;
  };
};

export type CancelBookingMutationVariables = {
  bookingID: string;
  reason?: string | null;
};

export type CancelBookingMutation = {
  cancelBooking: {
    __typename: 'Booking';
    bookingID: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    country: string;
    state: string;
    subject: string;
    message: string;
    visitType: VisitType;
    preferredDate?: string | null;
    preferredTime?: string | null;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string | null;
    notes?: string | null;
    orgID?: string | null;
    plantID?: string | null;
  };
};

export type RescheduleBookingMutationVariables = {
  bookingID: string;
  newDate: string;
  newTime?: string | null;
};

export type RescheduleBookingMutation = {
  rescheduleBooking: {
    __typename: 'Booking';
    bookingID: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    country: string;
    state: string;
    subject: string;
    message: string;
    visitType: VisitType;
    preferredDate?: string | null;
    preferredTime?: string | null;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string | null;
    notes?: string | null;
    orgID?: string | null;
    plantID?: string | null;
  };
};

export type AssignBookingMutationVariables = {
  bookingID: string;
  assignedTo: string;
};

export type AssignBookingMutation = {
  assignBooking: {
    __typename: 'Booking';
    bookingID: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    country: string;
    state: string;
    subject: string;
    message: string;
    visitType: VisitType;
    preferredDate?: string | null;
    preferredTime?: string | null;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string | null;
    notes?: string | null;
    orgID?: string | null;
    plantID?: string | null;
  };
};

export type GetOrganizationQueryVariables = {
  orgID: string;
};

export type GetOrganizationQuery = {
  getOrganization?: {
    __typename: 'Organization';
    orgID: string;
    name: string;
    industry?: string | null;
    location?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListOrganizationsQueryVariables = {};

export type ListOrganizationsQuery = {
  listOrganizations: Array<{
    __typename: 'Organization';
    orgID: string;
    name: string;
    industry?: string | null;
    location?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type GetPlantQueryVariables = {
  plantID: string;
};

export type GetPlantQuery = {
  getPlant?: {
    __typename: 'Plant';
    orgID: string;
    plantID: string;
    name: string;
    location?: string | null;
    plantType?: PlantType | null;
    parentHubID?: string | null;
    plantHeadID?: string | null;
    supervisorID?: string | null;
    driverIDs?: Array<string | null> | null;
    electricityCostPKWH?: string | null;
    dieselCostPL?: string | null;
    additionalSupport?: boolean | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListPlantsByOrganizationQueryVariables = {
  orgID: string;
  nextToken?: string | null;
};

export type ListPlantsByOrganizationQuery = {
  listPlantsByOrganization: Array<{
    __typename: 'Plant';
    orgID: string;
    plantID: string;
    name: string;
    location?: string | null;
    plantType?: PlantType | null;
    parentHubID?: string | null;
    plantHeadID?: string | null;
    supervisorID?: string | null;
    driverIDs?: Array<string | null> | null;
    electricityCostPKWH?: string | null;
    dieselCostPL?: string | null;
    additionalSupport?: boolean | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type GetUserQueryVariables = {
  id: string;
};

export type GetUserQuery = {
  getUser?: {
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListUsersByOrgQueryVariables = {
  orgID: string;
};

export type ListUsersByOrgQuery = {
  listUsersByOrg: Array<{
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type ListUsersByTypeQueryVariables = {
  userType: UserType;
};

export type ListUsersByTypeQuery = {
  listUsersByType: Array<{
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type ListUsersByTypeAndGroupQueryVariables = {
  userType: UserType;
  groupName: string;
};

export type ListUsersByTypeAndGroupQuery = {
  listUsersByTypeAndGroup: Array<{
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type ListAllUsersQueryVariables = {};

export type ListAllUsersQuery = {
  listAllUsers: Array<{
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    userType: UserType;
    role: string;
    orgID?: string | null;
    accessiblePlantIDs?: Array<string | null> | null;
    assignedOfficeID?: string | null;
    status?: string | null;
    pushToken?: string | null;
    cognitoGroups?: Array<string> | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type GetCognitoUserQueryVariables = {
  username: string;
};

export type GetCognitoUserQuery = {
  getCognitoUser: {
    __typename: 'CognitoUserResponse';
    success: boolean;
    message: string;
    user?: {
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    } | null;
  };
};

export type ListCognitoUsersQueryVariables = {
  limit?: number | null;
  nextToken?: string | null;
};

export type ListCognitoUsersQuery = {
  listCognitoUsers: {
    __typename: 'CognitoUserConnection';
    items: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    nextToken?: string | null;
  };
};

export type SearchCognitoUsersQueryVariables = {
  filter: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type SearchCognitoUsersQuery = {
  searchCognitoUsers: {
    __typename: 'CognitoUserConnection';
    items: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    nextToken?: string | null;
  };
};

export type ListAvailableUsersQueryVariables = {
  limit?: number | null;
  nextToken?: string | null;
};

export type ListAvailableUsersQuery = {
  listAvailableUsers: {
    __typename: 'CognitoUserConnection';
    items: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    nextToken?: string | null;
  };
};

export type ListUsersByStatusQueryVariables = {
  status: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListUsersByStatusQuery = {
  listUsersByStatus: {
    __typename: 'CognitoUserConnection';
    items: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    nextToken?: string | null;
  };
};

export type GetCognitoGroupQueryVariables = {
  groupName: string;
};

export type GetCognitoGroupQuery = {
  getCognitoGroup: {
    __typename: 'CognitoGroup';
    groupName: string;
    description?: string | null;
    precedence?: number | null;
    roleArn?: string | null;
    userPoolId?: string | null;
    createdAt?: string | null;
    lastModifiedDate?: string | null;
  };
};

export type ListCognitoGroupsQueryVariables = {};

export type ListCognitoGroupsQuery = {
  listCognitoGroups: Array<{
    __typename: 'CognitoGroup';
    groupName: string;
    description?: string | null;
    precedence?: number | null;
    roleArn?: string | null;
    userPoolId?: string | null;
    createdAt?: string | null;
    lastModifiedDate?: string | null;
  }>;
};

export type ListUsersInCognitoGroupQueryVariables = {
  groupName: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListUsersInCognitoGroupQuery = {
  listUsersInCognitoGroup: {
    __typename: 'CognitoUserConnection';
    items: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    nextToken?: string | null;
  };
};

export type ListGroupsForCognitoUserQueryVariables = {
  username: string;
};

export type ListGroupsForCognitoUserQuery = {
  listGroupsForCognitoUser: Array<{
    __typename: 'CognitoGroup';
    groupName: string;
    description?: string | null;
    precedence?: number | null;
    roleArn?: string | null;
    userPoolId?: string | null;
    createdAt?: string | null;
    lastModifiedDate?: string | null;
  }>;
};

export type DebugCognitoUserQueryVariables = {
  email: string;
};

export type DebugCognitoUserQuery = {
  debugCognitoUser: {
    __typename: 'DebugUserResult';
    username: string;
    attempts: Array<{
      __typename: 'DebugUserAttempt';
      username: string;
      success: boolean;
      user?: {
        __typename: 'CognitoUser';
        username: string;
        email?: string | null;
        name?: string | null;
        userType?: string | null;
        role?: string | null;
        status?: string | null;
        enabled: boolean;
        userCreateDate?: string | null;
        userLastModifiedDate?: string | null;
      } | null;
      error?: string | null;
      errorType?: string | null;
    }>;
    groups?: Array<string> | null;
    groupsError?: string | null;
    summary: {
      __typename: 'DebugUserSummary';
      userFound: boolean;
      groupsFound: boolean;
      totalAttempts: number;
      successfulAttempts: number;
    };
  };
};

export type DebugEnvironmentQueryVariables = {};

export type DebugEnvironmentQuery = {
  debugEnvironment: {
    __typename: 'DebugEnvironmentResult';
    success: boolean;
    environment: {
      __typename: 'DebugEnvironment';
      userPoolId: string;
      region: string;
      timestamp: string;
      connectivity?: string | null;
      totalUsers?: number | null;
      error?: {
        __typename: 'DebugError';
        name?: string | null;
        message?: string | null;
        code?: string | null;
      } | null;
    };
  };
};

export type ListUsersByOfficeQueryVariables = {
  officeID: string;
  nextToken?: string | null;
};

export type ListUsersByOfficeQuery = {
  listUsersByOffice?: {
    __typename: 'UserConnection';
    items: Array<{
      __typename: 'User';
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      userType: UserType;
      role: string;
      orgID?: string | null;
      accessiblePlantIDs?: Array<string | null> | null;
      assignedOfficeID?: string | null;
      status?: string | null;
      pushToken?: string | null;
      cognitoGroups?: Array<string> | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListUsersWithoutOfficeQueryVariables = {
  orgID?: string | null;
  nextToken?: string | null;
};

export type ListUsersWithoutOfficeQuery = {
  listUsersWithoutOffice?: {
    __typename: 'UserConnection';
    items: Array<{
      __typename: 'User';
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      userType: UserType;
      role: string;
      orgID?: string | null;
      accessiblePlantIDs?: Array<string | null> | null;
      assignedOfficeID?: string | null;
      status?: string | null;
      pushToken?: string | null;
      cognitoGroups?: Array<string> | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListUsersByCognitoGroupQueryVariables = {
  groupName: string;
  nextToken?: string | null;
};

export type ListUsersByCognitoGroupQuery = {
  listUsersByCognitoGroup?: {
    __typename: 'CognitoUserConnection';
    items: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListTractorsQueryVariables = {};

export type ListTractorsQuery = {
  listTractors: Array<{
    __typename: 'Tractor';
    vin: string;
    alias?: string | null;
    registerNumber?: string | null;
    plantID?: string | null;
    orgID?: string | null;
    model?: string | null;
    color?: string | null;
    loggerID?: string | null;
    currentImplement?: string | null;
    serviceStatus?: string | null;
    armLength?: string | null;
    dofChargeStatus?: string | null;
    user?: string | null;
    minValue?: number | null;
    maxValue?: number | null;
    midValue?: number | null;
    tractorNextBatchValue?: number | null;
    components?: {
      __typename: 'TractorComponents';
      vin: string;
      componentType?: TractorComponentTypeEnum | null;
      id?: string | null;
      battery33KWid?: string | null;
      battery12Vid?: string | null;
      motorId?: string | null;
      controllerID?: string | null;
      transmissionID?: string | null;
      transmissionMake?: TransmissionMakeEnum | null;
      displayID?: string | null;
      tempCardID?: string | null;
      canCardID?: string | null;
      footAccID?: string | null;
      handAccID?: string | null;
      fTyreSize?: string | null;
      rTyreSize?: string | null;
      fTyreBrand?: TyreBrandEnum | null;
      rTyreBrand?: TyreBrandEnum | null;
      couplerType?: CouplerTypeEnum | null;
      oRingType?: O_RingEnum | null;
      clutchFingerSetting?: string | null;
      bmsVersion?: number | null;
    } | null;
    dispatchInfo?: {
      __typename: 'DispatchInfo';
      assemblyRolloutDate?: string | null;
      pdiDate?: string | null;
      handoverDate?: string | null;
      dispatchPlan?: DispatchPlanEnum | null;
      dispatchLocation?: string | null;
      totalTestHours?: number | null;
      testType?: Array<TractorTestTypeEnum | null> | null;
      liveLocation?: string | null;
      saleType?: SaleTypeEnum | null;
    } | null;
    commissionDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }>;
};

export type ListTractorsByUserQueryVariables = {
  userID: string;
};

export type ListTractorsByUserQuery = {
  listTractorsByUser: Array<{
    __typename: 'Tractor';
    vin: string;
    alias?: string | null;
    registerNumber?: string | null;
    plantID?: string | null;
    orgID?: string | null;
    model?: string | null;
    color?: string | null;
    loggerID?: string | null;
    currentImplement?: string | null;
    serviceStatus?: string | null;
    armLength?: string | null;
    dofChargeStatus?: string | null;
    user?: string | null;
    minValue?: number | null;
    maxValue?: number | null;
    midValue?: number | null;
    tractorNextBatchValue?: number | null;
    components?: {
      __typename: 'TractorComponents';
      vin: string;
      componentType?: TractorComponentTypeEnum | null;
      id?: string | null;
      battery33KWid?: string | null;
      battery12Vid?: string | null;
      motorId?: string | null;
      controllerID?: string | null;
      transmissionID?: string | null;
      transmissionMake?: TransmissionMakeEnum | null;
      displayID?: string | null;
      tempCardID?: string | null;
      canCardID?: string | null;
      footAccID?: string | null;
      handAccID?: string | null;
      fTyreSize?: string | null;
      rTyreSize?: string | null;
      fTyreBrand?: TyreBrandEnum | null;
      rTyreBrand?: TyreBrandEnum | null;
      couplerType?: CouplerTypeEnum | null;
      oRingType?: O_RingEnum | null;
      clutchFingerSetting?: string | null;
      bmsVersion?: number | null;
    } | null;
    dispatchInfo?: {
      __typename: 'DispatchInfo';
      assemblyRolloutDate?: string | null;
      pdiDate?: string | null;
      handoverDate?: string | null;
      dispatchPlan?: DispatchPlanEnum | null;
      dispatchLocation?: string | null;
      totalTestHours?: number | null;
      testType?: Array<TractorTestTypeEnum | null> | null;
      liveLocation?: string | null;
      saleType?: SaleTypeEnum | null;
    } | null;
    commissionDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }>;
};

export type ListTractorsByPlantQueryVariables = {
  plantID: string;
};

export type ListTractorsByPlantQuery = {
  listTractorsByPlant: Array<{
    __typename: 'Tractor';
    vin: string;
    alias?: string | null;
    registerNumber?: string | null;
    plantID?: string | null;
    orgID?: string | null;
    model?: string | null;
    color?: string | null;
    loggerID?: string | null;
    currentImplement?: string | null;
    serviceStatus?: string | null;
    armLength?: string | null;
    dofChargeStatus?: string | null;
    user?: string | null;
    minValue?: number | null;
    maxValue?: number | null;
    midValue?: number | null;
    tractorNextBatchValue?: number | null;
    components?: {
      __typename: 'TractorComponents';
      vin: string;
      componentType?: TractorComponentTypeEnum | null;
      id?: string | null;
      battery33KWid?: string | null;
      battery12Vid?: string | null;
      motorId?: string | null;
      controllerID?: string | null;
      transmissionID?: string | null;
      transmissionMake?: TransmissionMakeEnum | null;
      displayID?: string | null;
      tempCardID?: string | null;
      canCardID?: string | null;
      footAccID?: string | null;
      handAccID?: string | null;
      fTyreSize?: string | null;
      rTyreSize?: string | null;
      fTyreBrand?: TyreBrandEnum | null;
      rTyreBrand?: TyreBrandEnum | null;
      couplerType?: CouplerTypeEnum | null;
      oRingType?: O_RingEnum | null;
      clutchFingerSetting?: string | null;
      bmsVersion?: number | null;
    } | null;
    dispatchInfo?: {
      __typename: 'DispatchInfo';
      assemblyRolloutDate?: string | null;
      pdiDate?: string | null;
      handoverDate?: string | null;
      dispatchPlan?: DispatchPlanEnum | null;
      dispatchLocation?: string | null;
      totalTestHours?: number | null;
      testType?: Array<TractorTestTypeEnum | null> | null;
      liveLocation?: string | null;
      saleType?: SaleTypeEnum | null;
    } | null;
    commissionDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }>;
};

export type ListTractorsByOrgQueryVariables = {
  orgID: string;
};

export type ListTractorsByOrgQuery = {
  listTractorsByOrg: Array<{
    __typename: 'Tractor';
    vin: string;
    alias?: string | null;
    registerNumber?: string | null;
    plantID?: string | null;
    orgID?: string | null;
    model?: string | null;
    color?: string | null;
    loggerID?: string | null;
    currentImplement?: string | null;
    serviceStatus?: string | null;
    armLength?: string | null;
    dofChargeStatus?: string | null;
    user?: string | null;
    minValue?: number | null;
    maxValue?: number | null;
    midValue?: number | null;
    tractorNextBatchValue?: number | null;
    components?: {
      __typename: 'TractorComponents';
      vin: string;
      componentType?: TractorComponentTypeEnum | null;
      id?: string | null;
      battery33KWid?: string | null;
      battery12Vid?: string | null;
      motorId?: string | null;
      controllerID?: string | null;
      transmissionID?: string | null;
      transmissionMake?: TransmissionMakeEnum | null;
      displayID?: string | null;
      tempCardID?: string | null;
      canCardID?: string | null;
      footAccID?: string | null;
      handAccID?: string | null;
      fTyreSize?: string | null;
      rTyreSize?: string | null;
      fTyreBrand?: TyreBrandEnum | null;
      rTyreBrand?: TyreBrandEnum | null;
      couplerType?: CouplerTypeEnum | null;
      oRingType?: O_RingEnum | null;
      clutchFingerSetting?: string | null;
      bmsVersion?: number | null;
    } | null;
    dispatchInfo?: {
      __typename: 'DispatchInfo';
      assemblyRolloutDate?: string | null;
      pdiDate?: string | null;
      handoverDate?: string | null;
      dispatchPlan?: DispatchPlanEnum | null;
      dispatchLocation?: string | null;
      totalTestHours?: number | null;
      testType?: Array<TractorTestTypeEnum | null> | null;
      liveLocation?: string | null;
      saleType?: SaleTypeEnum | null;
    } | null;
    commissionDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }>;
};

export type GetTractorQueryVariables = {
  vin: string;
};

export type GetTractorQuery = {
  getTractor?: {
    __typename: 'Tractor';
    vin: string;
    alias?: string | null;
    registerNumber?: string | null;
    plantID?: string | null;
    orgID?: string | null;
    model?: string | null;
    color?: string | null;
    loggerID?: string | null;
    currentImplement?: string | null;
    serviceStatus?: string | null;
    armLength?: string | null;
    dofChargeStatus?: string | null;
    user?: string | null;
    minValue?: number | null;
    maxValue?: number | null;
    midValue?: number | null;
    tractorNextBatchValue?: number | null;
    components?: {
      __typename: 'TractorComponents';
      vin: string;
      componentType?: TractorComponentTypeEnum | null;
      id?: string | null;
      battery33KWid?: string | null;
      battery12Vid?: string | null;
      motorId?: string | null;
      controllerID?: string | null;
      transmissionID?: string | null;
      transmissionMake?: TransmissionMakeEnum | null;
      displayID?: string | null;
      tempCardID?: string | null;
      canCardID?: string | null;
      footAccID?: string | null;
      handAccID?: string | null;
      fTyreSize?: string | null;
      rTyreSize?: string | null;
      fTyreBrand?: TyreBrandEnum | null;
      rTyreBrand?: TyreBrandEnum | null;
      couplerType?: CouplerTypeEnum | null;
      oRingType?: O_RingEnum | null;
      clutchFingerSetting?: string | null;
      bmsVersion?: number | null;
    } | null;
    dispatchInfo?: {
      __typename: 'DispatchInfo';
      assemblyRolloutDate?: string | null;
      pdiDate?: string | null;
      handoverDate?: string | null;
      dispatchPlan?: DispatchPlanEnum | null;
      dispatchLocation?: string | null;
      totalTestHours?: number | null;
      testType?: Array<TractorTestTypeEnum | null> | null;
      liveLocation?: string | null;
      saleType?: SaleTypeEnum | null;
    } | null;
    commissionDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type ListTractorDocumentsQueryVariables = {
  vin: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListTractorDocumentsQuery = {
  listTractorDocuments?: {
    __typename: 'MediaConnection';
    items: Array<{
      __typename: 'Media';
      key: string;
      kind: string;
      contentType: string;
      sizeBytes: number;
      createdAt: string;
      variants: Array<string>;
      uploaderID?: string | null;
      vin?: string | null;
      documentID?: string | null;
      title?: string | null;
      description?: string | null;
      docType?: string | null;
      files?: Array<string> | null;
      tags?: Array<string> | null;
      uploadedBy?: string | null;
      uploadedAt?: string | null;
      updatedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetTelemetryByTractorQueryVariables = {
  loggerID: string;
};

export type GetTelemetryByTractorQuery = {
  getTelemetryByTractor?: Array<{
    __typename: 'Telemetry';
    tractorID: string;
    timestamp: string;
    timestamp_epoch?: number | null;
    TTL?: number | null;
    hex_ID?: string | null;
    hex_timestamp?: string | null;
    status?: string | null;
    Lat?: string | null;
    Long?: string | null;
    SOC?: number | null;
    SOH?: number | null;
    Charge?: number | null;
    LimpMode?: number | null;
    BatteryV?: number | null;
    BatteryI?: number | null;
    BatteryT?: number | null;
    MinCellV?: number | null;
    MaxCellV?: number | null;
    MaxRPM?: number | null;
    MotorT?: number | null;
    Roll?: number | null;
    Pitch?: number | null;
    Yaw?: number | null;
    Throttle?: number | null;
    WHM?: number | null;
    OutputPower?: number | null;
    TimeEla?: number | null;
    CumulativeRuntime?: number | null;
    MaxBatteryI?: number | null;
    Ecode?: number | null;
    FaultDiag?: number | null;
    ModuleTAtFault?: number | null;
    OutputFreqAtFault?: number | null;
    OutputIAtFault?: number | null;
    OutputVAtFault?: number | null;
    OutputDCBusVAtFault?: number | null;
    DiagInfoLastFault?: number | null;
    ModuleTLastFault?: number | null;
    OperatingFreqLastFault?: number | null;
    OutputILastFault?: number | null;
    OutputVLastFault?: number | null;
    BusVLastFault?: number | null;
  } | null> | null;
};

export type GetRuntimeHourByTractorQueryVariables = {
  loggerID: string;
};

export type GetRuntimeHourByTractorQuery = {
  getRuntimeHourByTractor?: {
    __typename: 'Telemetry';
    tractorID: string;
    timestamp: string;
    timestamp_epoch?: number | null;
    TTL?: number | null;
    hex_ID?: string | null;
    hex_timestamp?: string | null;
    status?: string | null;
    Lat?: string | null;
    Long?: string | null;
    SOC?: number | null;
    SOH?: number | null;
    Charge?: number | null;
    LimpMode?: number | null;
    BatteryV?: number | null;
    BatteryI?: number | null;
    BatteryT?: number | null;
    MinCellV?: number | null;
    MaxCellV?: number | null;
    MaxRPM?: number | null;
    MotorT?: number | null;
    Roll?: number | null;
    Pitch?: number | null;
    Yaw?: number | null;
    Throttle?: number | null;
    WHM?: number | null;
    OutputPower?: number | null;
    TimeEla?: number | null;
    CumulativeRuntime?: number | null;
    MaxBatteryI?: number | null;
    Ecode?: number | null;
    FaultDiag?: number | null;
    ModuleTAtFault?: number | null;
    OutputFreqAtFault?: number | null;
    OutputIAtFault?: number | null;
    OutputVAtFault?: number | null;
    OutputDCBusVAtFault?: number | null;
    DiagInfoLastFault?: number | null;
    ModuleTLastFault?: number | null;
    OperatingFreqLastFault?: number | null;
    OutputILastFault?: number | null;
    OutputVLastFault?: number | null;
    BusVLastFault?: number | null;
  } | null;
};

export type GetEarliestRuntimeHourByTractorDateQueryVariables = {
  loggerID: string;
  timestamp: string;
};

export type GetEarliestRuntimeHourByTractorDateQuery = {
  getEarliestRuntimeHourByTractorDate?: {
    __typename: 'Telemetry';
    tractorID: string;
    timestamp: string;
    timestamp_epoch?: number | null;
    TTL?: number | null;
    hex_ID?: string | null;
    hex_timestamp?: string | null;
    status?: string | null;
    Lat?: string | null;
    Long?: string | null;
    SOC?: number | null;
    SOH?: number | null;
    Charge?: number | null;
    LimpMode?: number | null;
    BatteryV?: number | null;
    BatteryI?: number | null;
    BatteryT?: number | null;
    MinCellV?: number | null;
    MaxCellV?: number | null;
    MaxRPM?: number | null;
    MotorT?: number | null;
    Roll?: number | null;
    Pitch?: number | null;
    Yaw?: number | null;
    Throttle?: number | null;
    WHM?: number | null;
    OutputPower?: number | null;
    TimeEla?: number | null;
    CumulativeRuntime?: number | null;
    MaxBatteryI?: number | null;
    Ecode?: number | null;
    FaultDiag?: number | null;
    ModuleTAtFault?: number | null;
    OutputFreqAtFault?: number | null;
    OutputIAtFault?: number | null;
    OutputVAtFault?: number | null;
    OutputDCBusVAtFault?: number | null;
    DiagInfoLastFault?: number | null;
    ModuleTLastFault?: number | null;
    OperatingFreqLastFault?: number | null;
    OutputILastFault?: number | null;
    OutputVLastFault?: number | null;
    BusVLastFault?: number | null;
  } | null;
};

export type GetLatestRuntimeHourByTractorDateQueryVariables = {
  loggerID: string;
  timestamp: string;
};

export type GetLatestRuntimeHourByTractorDateQuery = {
  getLatestRuntimeHourByTractorDate?: {
    __typename: 'Telemetry';
    tractorID: string;
    timestamp: string;
    timestamp_epoch?: number | null;
    TTL?: number | null;
    hex_ID?: string | null;
    hex_timestamp?: string | null;
    status?: string | null;
    Lat?: string | null;
    Long?: string | null;
    SOC?: number | null;
    SOH?: number | null;
    Charge?: number | null;
    LimpMode?: number | null;
    BatteryV?: number | null;
    BatteryI?: number | null;
    BatteryT?: number | null;
    MinCellV?: number | null;
    MaxCellV?: number | null;
    MaxRPM?: number | null;
    MotorT?: number | null;
    Roll?: number | null;
    Pitch?: number | null;
    Yaw?: number | null;
    Throttle?: number | null;
    WHM?: number | null;
    OutputPower?: number | null;
    TimeEla?: number | null;
    CumulativeRuntime?: number | null;
    MaxBatteryI?: number | null;
    Ecode?: number | null;
    FaultDiag?: number | null;
    ModuleTAtFault?: number | null;
    OutputFreqAtFault?: number | null;
    OutputIAtFault?: number | null;
    OutputVAtFault?: number | null;
    OutputDCBusVAtFault?: number | null;
    DiagInfoLastFault?: number | null;
    ModuleTLastFault?: number | null;
    OperatingFreqLastFault?: number | null;
    OutputILastFault?: number | null;
    OutputVLastFault?: number | null;
    BusVLastFault?: number | null;
  } | null;
};

export type GetFilteredTelemetryByTractorQueryVariables = {
  loggerID: string;
  start_time: string;
  end_time: string;
  nextToken?: string | null;
};

export type GetFilteredTelemetryByTractorQuery = {
  getFilteredTelemetryByTractor?: {
    __typename: 'PaginatedTelemetry';
    items?: Array<{
      __typename: 'Telemetry';
      tractorID: string;
      timestamp: string;
      timestamp_epoch?: number | null;
      TTL?: number | null;
      hex_ID?: string | null;
      hex_timestamp?: string | null;
      status?: string | null;
      Lat?: string | null;
      Long?: string | null;
      SOC?: number | null;
      SOH?: number | null;
      Charge?: number | null;
      LimpMode?: number | null;
      BatteryV?: number | null;
      BatteryI?: number | null;
      BatteryT?: number | null;
      MinCellV?: number | null;
      MaxCellV?: number | null;
      MaxRPM?: number | null;
      MotorT?: number | null;
      Roll?: number | null;
      Pitch?: number | null;
      Yaw?: number | null;
      Throttle?: number | null;
      WHM?: number | null;
      OutputPower?: number | null;
      TimeEla?: number | null;
      CumulativeRuntime?: number | null;
      MaxBatteryI?: number | null;
      Ecode?: number | null;
      FaultDiag?: number | null;
      ModuleTAtFault?: number | null;
      OutputFreqAtFault?: number | null;
      OutputIAtFault?: number | null;
      OutputVAtFault?: number | null;
      OutputDCBusVAtFault?: number | null;
      DiagInfoLastFault?: number | null;
      ModuleTLastFault?: number | null;
      OperatingFreqLastFault?: number | null;
      OutputILastFault?: number | null;
      OutputVLastFault?: number | null;
      BusVLastFault?: number | null;
    } | null> | null;
    nextToken?: string | null;
  } | null;
};

export type GetLatestTelemetryByBatteryIThresholdQueryVariables = {
  loggerID: string;
  threshold: number;
};

export type GetLatestTelemetryByBatteryIThresholdQuery = {
  getLatestTelemetryByBatteryIThreshold?: {
    __typename: 'Telemetry';
    tractorID: string;
    timestamp: string;
    timestamp_epoch?: number | null;
    TTL?: number | null;
    hex_ID?: string | null;
    hex_timestamp?: string | null;
    status?: string | null;
    Lat?: string | null;
    Long?: string | null;
    SOC?: number | null;
    SOH?: number | null;
    Charge?: number | null;
    LimpMode?: number | null;
    BatteryV?: number | null;
    BatteryI?: number | null;
    BatteryT?: number | null;
    MinCellV?: number | null;
    MaxCellV?: number | null;
    MaxRPM?: number | null;
    MotorT?: number | null;
    Roll?: number | null;
    Pitch?: number | null;
    Yaw?: number | null;
    Throttle?: number | null;
    WHM?: number | null;
    OutputPower?: number | null;
    TimeEla?: number | null;
    CumulativeRuntime?: number | null;
    MaxBatteryI?: number | null;
    Ecode?: number | null;
    FaultDiag?: number | null;
    ModuleTAtFault?: number | null;
    OutputFreqAtFault?: number | null;
    OutputIAtFault?: number | null;
    OutputVAtFault?: number | null;
    OutputDCBusVAtFault?: number | null;
    DiagInfoLastFault?: number | null;
    ModuleTLastFault?: number | null;
    OperatingFreqLastFault?: number | null;
    OutputILastFault?: number | null;
    OutputVLastFault?: number | null;
    BusVLastFault?: number | null;
  } | null;
};

export type GetManualRuntimeEntryQueryVariables = {
  loggerID: string;
  date: string;
};

export type GetManualRuntimeEntryQuery = {
  getManualRuntimeEntry?: {
    __typename: 'ManualRuntimeEntry';
    loggerID: string;
    date: string;
    plantID?: string | null;
    orgID?: string | null;
    startCumulativeRuntime: number;
    endCumulativeRuntime: number;
    todaysRuntime: number;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type GetManualRuntimeByDateQueryVariables = {
  loggerID: string;
  date: string;
};

export type GetManualRuntimeByDateQuery = {
  getManualRuntimeByDate?: {
    __typename: 'ManualRuntimeEntry';
    loggerID: string;
    date: string;
    plantID?: string | null;
    orgID?: string | null;
    startCumulativeRuntime: number;
    endCumulativeRuntime: number;
    todaysRuntime: number;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type ListManualRuntimeEntriesQueryVariables = {
  loggerID?: string | null;
  plantID?: string | null;
  orgID?: string | null;
  date?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListManualRuntimeEntriesQuery = {
  listManualRuntimeEntries?: {
    __typename: 'ManualRuntimeEntryConnection';
    items: Array<{
      __typename: 'ManualRuntimeEntry';
      loggerID: string;
      date: string;
      plantID?: string | null;
      orgID?: string | null;
      startCumulativeRuntime: number;
      endCumulativeRuntime: number;
      todaysRuntime: number;
      createdAt?: string | null;
      updatedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetUsageSegmentQueryVariables = {
  tractorID: string;
  startTime: string;
};

export type GetUsageSegmentQuery = {
  getUsageSegment?: {
    __typename: 'UsageSegment';
    tractorID: string;
    type: SegmentType;
    startTime: string;
    endTime?: string | null;
    durationSec?: number | null;
    durationFormatted?: string | null;
    durationSecLogged?: number | null;
    durationLogged?: string | null;
    initialSOC?: number | null;
    finalSOC?: number | null;
    kwhConsumed?: number | null;
    kwhCharged?: number | null;
    distanceTravelled?: number | null;
    costSavings?: number | null;
    treesSaved?: number | null;
    disconnects?: {
      __typename: 'DisconnectsM';
      totalCount?: number | null;
      totalDuration?: number | null;
      locations?: Array<{
        __typename: 'StartEndLoc';
        startLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
        endLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
      }> | null;
    } | null;
    parameterMetrics?: {
      __typename: 'ParameterMetrics';
      SOC?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      SOH?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryI?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxRPM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      WHM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MotorT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MinCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      Throttle?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      CumulativeRuntime?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
    } | null;
    faultMetrics?: {
      __typename: 'FaultMetrics';
      Ecode?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      FaultDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      WarningDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
    } | null;
    createdAt?: string | null;
  } | null;
};

export type ListUsageSegmentsQueryVariables = {
  tractorID: string;
  startTime?: string | null;
  endTime?: string | null;
  limit?: number | null;
  nextToken?: string | null;
  sortOrder?: SortOrder | null;
};

export type ListUsageSegmentsQuery = {
  listUsageSegments?: {
    __typename: 'PaginatedUsageSegment';
    items?: Array<{
      __typename: 'UsageSegment';
      tractorID: string;
      type: SegmentType;
      startTime: string;
      endTime?: string | null;
      durationSec?: number | null;
      durationFormatted?: string | null;
      durationSecLogged?: number | null;
      durationLogged?: string | null;
      initialSOC?: number | null;
      finalSOC?: number | null;
      kwhConsumed?: number | null;
      kwhCharged?: number | null;
      distanceTravelled?: number | null;
      costSavings?: number | null;
      treesSaved?: number | null;
      disconnects?: {
        __typename: 'DisconnectsM';
        totalCount?: number | null;
        totalDuration?: number | null;
        locations?: Array<{
          __typename: 'StartEndLoc';
        }> | null;
      } | null;
      parameterMetrics?: {
        __typename: 'ParameterMetrics';
        SOC?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        SOH?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        BatteryV?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        BatteryI?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        BatteryT?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MaxRPM?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        WHM?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MotorT?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MinCellV?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MaxCellV?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        Throttle?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        CumulativeRuntime?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
      } | null;
      faultMetrics?: {
        __typename: 'FaultMetrics';
        Ecode?: Array<{
          __typename: 'FaultValues';
          metric?: FaultTypeEnum | null;
          value?: number | null;
          startTime?: string | null;
          endTime?: string | null;
          Ecode?: number | null;
          FaultDiag?: number | null;
          ModuleTAtFault?: number | null;
          OutputFreqAtFault?: number | null;
          OutputIAtFault?: number | null;
          OutputVAtFault?: number | null;
          OutputDCBusVAtFault?: number | null;
          DiagInfoLastFault?: number | null;
          ModuleTLastFault?: number | null;
          OperatingFreqLastFault?: number | null;
          OutputILastFault?: number | null;
          OutputVLastFault?: number | null;
          BusVLastFault?: number | null;
        }> | null;
        FaultDiag?: Array<{
          __typename: 'FaultValues';
          metric?: FaultTypeEnum | null;
          value?: number | null;
          startTime?: string | null;
          endTime?: string | null;
          Ecode?: number | null;
          FaultDiag?: number | null;
          ModuleTAtFault?: number | null;
          OutputFreqAtFault?: number | null;
          OutputIAtFault?: number | null;
          OutputVAtFault?: number | null;
          OutputDCBusVAtFault?: number | null;
          DiagInfoLastFault?: number | null;
          ModuleTLastFault?: number | null;
          OperatingFreqLastFault?: number | null;
          OutputILastFault?: number | null;
          OutputVLastFault?: number | null;
          BusVLastFault?: number | null;
        }> | null;
        WarningDiag?: Array<{
          __typename: 'FaultValues';
          metric?: FaultTypeEnum | null;
          value?: number | null;
          startTime?: string | null;
          endTime?: string | null;
          Ecode?: number | null;
          FaultDiag?: number | null;
          ModuleTAtFault?: number | null;
          OutputFreqAtFault?: number | null;
          OutputIAtFault?: number | null;
          OutputVAtFault?: number | null;
          OutputDCBusVAtFault?: number | null;
          DiagInfoLastFault?: number | null;
          ModuleTLastFault?: number | null;
          OperatingFreqLastFault?: number | null;
          OutputILastFault?: number | null;
          OutputVLastFault?: number | null;
          BusVLastFault?: number | null;
        }> | null;
      } | null;
      createdAt?: string | null;
    } | null> | null;
    nextToken?: string | null;
  } | null;
};

export type ListUsageSegmentsByTypeQueryVariables = {
  tractorID: string;
  type: SegmentType;
  startTime?: string | null;
  endTime?: string | null;
  limit?: number | null;
  nextToken?: string | null;
  sortOrder?: SortOrder | null;
};

export type ListUsageSegmentsByTypeQuery = {
  listUsageSegmentsByType?: {
    __typename: 'PaginatedUsageSegment';
    items?: Array<{
      __typename: 'UsageSegment';
      tractorID: string;
      type: SegmentType;
      startTime: string;
      endTime?: string | null;
      durationSec?: number | null;
      durationFormatted?: string | null;
      durationSecLogged?: number | null;
      durationLogged?: string | null;
      initialSOC?: number | null;
      finalSOC?: number | null;
      kwhConsumed?: number | null;
      kwhCharged?: number | null;
      distanceTravelled?: number | null;
      costSavings?: number | null;
      treesSaved?: number | null;
      disconnects?: {
        __typename: 'DisconnectsM';
        totalCount?: number | null;
        totalDuration?: number | null;
        locations?: Array<{
          __typename: 'StartEndLoc';
        }> | null;
      } | null;
      parameterMetrics?: {
        __typename: 'ParameterMetrics';
        SOC?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        SOH?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        BatteryV?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        BatteryI?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        BatteryT?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MaxRPM?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        WHM?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MotorT?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MinCellV?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MaxCellV?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        Throttle?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        CumulativeRuntime?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
      } | null;
      faultMetrics?: {
        __typename: 'FaultMetrics';
        Ecode?: Array<{
          __typename: 'FaultValues';
          metric?: FaultTypeEnum | null;
          value?: number | null;
          startTime?: string | null;
          endTime?: string | null;
          Ecode?: number | null;
          FaultDiag?: number | null;
          ModuleTAtFault?: number | null;
          OutputFreqAtFault?: number | null;
          OutputIAtFault?: number | null;
          OutputVAtFault?: number | null;
          OutputDCBusVAtFault?: number | null;
          DiagInfoLastFault?: number | null;
          ModuleTLastFault?: number | null;
          OperatingFreqLastFault?: number | null;
          OutputILastFault?: number | null;
          OutputVLastFault?: number | null;
          BusVLastFault?: number | null;
        }> | null;
        FaultDiag?: Array<{
          __typename: 'FaultValues';
          metric?: FaultTypeEnum | null;
          value?: number | null;
          startTime?: string | null;
          endTime?: string | null;
          Ecode?: number | null;
          FaultDiag?: number | null;
          ModuleTAtFault?: number | null;
          OutputFreqAtFault?: number | null;
          OutputIAtFault?: number | null;
          OutputVAtFault?: number | null;
          OutputDCBusVAtFault?: number | null;
          DiagInfoLastFault?: number | null;
          ModuleTLastFault?: number | null;
          OperatingFreqLastFault?: number | null;
          OutputILastFault?: number | null;
          OutputVLastFault?: number | null;
          BusVLastFault?: number | null;
        }> | null;
        WarningDiag?: Array<{
          __typename: 'FaultValues';
          metric?: FaultTypeEnum | null;
          value?: number | null;
          startTime?: string | null;
          endTime?: string | null;
          Ecode?: number | null;
          FaultDiag?: number | null;
          ModuleTAtFault?: number | null;
          OutputFreqAtFault?: number | null;
          OutputIAtFault?: number | null;
          OutputVAtFault?: number | null;
          OutputDCBusVAtFault?: number | null;
          DiagInfoLastFault?: number | null;
          ModuleTLastFault?: number | null;
          OperatingFreqLastFault?: number | null;
          OutputILastFault?: number | null;
          OutputVLastFault?: number | null;
          BusVLastFault?: number | null;
        }> | null;
      } | null;
      createdAt?: string | null;
    } | null> | null;
    nextToken?: string | null;
  } | null;
};

export type GetAnalyticsQueryVariables = {
  tractorID: string;
  PeriodType: PeriodType;
  timeSegment: string;
};

export type GetAnalyticsQuery = {
  getAnalytics?: {
    __typename: 'Analytics';
    tractorID: string;
    PeriodType: PeriodType;
    timeSegment: string;
    startTime?: string | null;
    endTime?: string | null;
    cumulative?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    trips?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    charges?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    standby?: {
      __typename: 'CumulativeM';
      totalCount?: number | null;
      totalDuration?: number | null;
      totalLoggedDuration?: number | null;
      totalDistance?: number | null;
      totalKwhDelivered?: number | null;
      totalKwhCharged?: number | null;
      totalDisconnectCount?: number | null;
      totalDisconnectDuration?: number | null;
      totalCostSavings?: number | null;
      totalTreesSaved?: number | null;
    } | null;
    disconnects?: {
      __typename: 'DisconnectsM';
      totalCount?: number | null;
      totalDuration?: number | null;
      locations?: Array<{
        __typename: 'StartEndLoc';
        startLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
        endLoc?: {
          __typename: 'GPSCoord';
          lat?: string | null;
          lng?: string | null;
        } | null;
      }> | null;
    } | null;
    anomalies?: {
      __typename: 'AnomaliesM';
      totalCount?: number | null;
    } | null;
    parameterMetrics?: {
      __typename: 'ParameterMetrics';
      SOC?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      SOH?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryI?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      BatteryT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxRPM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      WHM?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MotorT?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MinCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      MaxCellV?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      Throttle?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
      CumulativeRuntime?: {
        __typename: 'MinMaxM';
        avg?: number | null;
        min?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
        max?: {
          __typename: 'MinMaxEntry';
          value?: number | null;
          ts?: string | null;
        } | null;
      } | null;
    } | null;
    faultMetrics?: {
      __typename: 'FaultMetrics';
      Ecode?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      FaultDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
      WarningDiag?: Array<{
        __typename: 'FaultValues';
        metric?: FaultTypeEnum | null;
        value?: number | null;
        startTime?: string | null;
        endTime?: string | null;
        Ecode?: number | null;
        FaultDiag?: number | null;
        ModuleTAtFault?: number | null;
        OutputFreqAtFault?: number | null;
        OutputIAtFault?: number | null;
        OutputVAtFault?: number | null;
        OutputDCBusVAtFault?: number | null;
        DiagInfoLastFault?: number | null;
        ModuleTLastFault?: number | null;
        OperatingFreqLastFault?: number | null;
        OutputILastFault?: number | null;
        OutputVLastFault?: number | null;
        BusVLastFault?: number | null;
      }> | null;
    } | null;
  } | null;
};

export type ListAnalyticsByPeriodTypeQueryVariables = {
  tractorID: string;
  PeriodType: PeriodType;
  startSegment?: string | null;
  endSegment?: string | null;
  limit?: number | null;
  nextToken?: string | null;
  sortOrder?: SortOrder | null;
};

export type ListAnalyticsByPeriodTypeQuery = {
  listAnalyticsByPeriodType?: {
    __typename: 'PaginatedAnalytics';
    items?: Array<{
      __typename: 'Analytics';
      tractorID: string;
      PeriodType: PeriodType;
      timeSegment: string;
      startTime?: string | null;
      endTime?: string | null;
      cumulative?: {
        __typename: 'CumulativeM';
        totalCount?: number | null;
        totalDuration?: number | null;
        totalLoggedDuration?: number | null;
        totalDistance?: number | null;
        totalKwhDelivered?: number | null;
        totalKwhCharged?: number | null;
        totalDisconnectCount?: number | null;
        totalDisconnectDuration?: number | null;
        totalCostSavings?: number | null;
        totalTreesSaved?: number | null;
      } | null;
      trips?: {
        __typename: 'CumulativeM';
        totalCount?: number | null;
        totalDuration?: number | null;
        totalLoggedDuration?: number | null;
        totalDistance?: number | null;
        totalKwhDelivered?: number | null;
        totalKwhCharged?: number | null;
        totalDisconnectCount?: number | null;
        totalDisconnectDuration?: number | null;
        totalCostSavings?: number | null;
        totalTreesSaved?: number | null;
      } | null;
      charges?: {
        __typename: 'CumulativeM';
        totalCount?: number | null;
        totalDuration?: number | null;
        totalLoggedDuration?: number | null;
        totalDistance?: number | null;
        totalKwhDelivered?: number | null;
        totalKwhCharged?: number | null;
        totalDisconnectCount?: number | null;
        totalDisconnectDuration?: number | null;
        totalCostSavings?: number | null;
        totalTreesSaved?: number | null;
      } | null;
      standby?: {
        __typename: 'CumulativeM';
        totalCount?: number | null;
        totalDuration?: number | null;
        totalLoggedDuration?: number | null;
        totalDistance?: number | null;
        totalKwhDelivered?: number | null;
        totalKwhCharged?: number | null;
        totalDisconnectCount?: number | null;
        totalDisconnectDuration?: number | null;
        totalCostSavings?: number | null;
        totalTreesSaved?: number | null;
      } | null;
      disconnects?: {
        __typename: 'DisconnectsM';
        totalCount?: number | null;
        totalDuration?: number | null;
        locations?: Array<{
          __typename: 'StartEndLoc';
        }> | null;
      } | null;
      anomalies?: {
        __typename: 'AnomaliesM';
        totalCount?: number | null;
      } | null;
      parameterMetrics?: {
        __typename: 'ParameterMetrics';
        SOC?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        SOH?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        BatteryV?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        BatteryI?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        BatteryT?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MaxRPM?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        WHM?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MotorT?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MinCellV?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        MaxCellV?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        Throttle?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
        CumulativeRuntime?: {
          __typename: 'MinMaxM';
          avg?: number | null;
        } | null;
      } | null;
      faultMetrics?: {
        __typename: 'FaultMetrics';
        Ecode?: Array<{
          __typename: 'FaultValues';
          metric?: FaultTypeEnum | null;
          value?: number | null;
          startTime?: string | null;
          endTime?: string | null;
          Ecode?: number | null;
          FaultDiag?: number | null;
          ModuleTAtFault?: number | null;
          OutputFreqAtFault?: number | null;
          OutputIAtFault?: number | null;
          OutputVAtFault?: number | null;
          OutputDCBusVAtFault?: number | null;
          DiagInfoLastFault?: number | null;
          ModuleTLastFault?: number | null;
          OperatingFreqLastFault?: number | null;
          OutputILastFault?: number | null;
          OutputVLastFault?: number | null;
          BusVLastFault?: number | null;
        }> | null;
        FaultDiag?: Array<{
          __typename: 'FaultValues';
          metric?: FaultTypeEnum | null;
          value?: number | null;
          startTime?: string | null;
          endTime?: string | null;
          Ecode?: number | null;
          FaultDiag?: number | null;
          ModuleTAtFault?: number | null;
          OutputFreqAtFault?: number | null;
          OutputIAtFault?: number | null;
          OutputVAtFault?: number | null;
          OutputDCBusVAtFault?: number | null;
          DiagInfoLastFault?: number | null;
          ModuleTLastFault?: number | null;
          OperatingFreqLastFault?: number | null;
          OutputILastFault?: number | null;
          OutputVLastFault?: number | null;
          BusVLastFault?: number | null;
        }> | null;
        WarningDiag?: Array<{
          __typename: 'FaultValues';
          metric?: FaultTypeEnum | null;
          value?: number | null;
          startTime?: string | null;
          endTime?: string | null;
          Ecode?: number | null;
          FaultDiag?: number | null;
          ModuleTAtFault?: number | null;
          OutputFreqAtFault?: number | null;
          OutputIAtFault?: number | null;
          OutputVAtFault?: number | null;
          OutputDCBusVAtFault?: number | null;
          DiagInfoLastFault?: number | null;
          ModuleTLastFault?: number | null;
          OperatingFreqLastFault?: number | null;
          OutputILastFault?: number | null;
          OutputVLastFault?: number | null;
          BusVLastFault?: number | null;
        }> | null;
      } | null;
    } | null> | null;
    nextToken?: string | null;
  } | null;
};

export type GetLoggerQueryVariables = {
  loggerID: string;
};

export type GetLoggerQuery = {
  getLogger?: {
    __typename: 'Logger';
    loggerID: string;
    platform: LoggerPlatform;
    status: string;
    attachedToVIN?: string | null;
    attachedAt?: string | null;
    detachedAt?: string | null;
    notes?: string | null;
  } | null;
};

export type ListLoggersQueryVariables = {};

export type ListLoggersQuery = {
  listLoggers: Array<{
    __typename: 'Logger';
    loggerID: string;
    platform: LoggerPlatform;
    status: string;
    attachedToVIN?: string | null;
    attachedAt?: string | null;
    detachedAt?: string | null;
    notes?: string | null;
  }>;
};

export type GetDriverQueryVariables = {
  driverID: string;
};

export type GetDriverQuery = {
  getDriver?: {
    __typename: 'Driver';
    driverID: string;
    name: string;
    phone?: string | null;
    aadhaarMasked?: string | null;
    licenseNumber?: string | null;
    licenseExpiry?: string | null;
    status: DriverStatus;
    orgID: string;
    plantID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListDriversByPlantQueryVariables = {
  plantID: string;
  status?: DriverStatus | null;
  nextToken?: string | null;
};

export type ListDriversByPlantQuery = {
  listDriversByPlant?: {
    __typename: 'DriverConnection';
    items: Array<{
      __typename: 'Driver';
      driverID: string;
      name: string;
      phone?: string | null;
      aadhaarMasked?: string | null;
      licenseNumber?: string | null;
      licenseExpiry?: string | null;
      status: DriverStatus;
      orgID: string;
      plantID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListDriversByOrgQueryVariables = {
  orgID: string;
  status?: DriverStatus | null;
  nextToken?: string | null;
};

export type ListDriversByOrgQuery = {
  listDriversByOrg?: {
    __typename: 'DriverConnection';
    items: Array<{
      __typename: 'Driver';
      driverID: string;
      name: string;
      phone?: string | null;
      aadhaarMasked?: string | null;
      licenseNumber?: string | null;
      licenseExpiry?: string | null;
      status: DriverStatus;
      orgID: string;
      plantID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListComplianceByDriverQueryVariables = {
  driverID: string;
  startDueDate?: string | null;
  endDueDate?: string | null;
  nextToken?: string | null;
};

export type ListComplianceByDriverQuery = {
  listComplianceByDriver?: {
    __typename: 'ComplianceConnection';
    items: Array<{
      __typename: 'ComplianceRecord';
      driverID: string;
      type: string;
      dueDate: string;
      status?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListAttendanceByDriverQueryVariables = {
  driverID: string;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListAttendanceByDriverQuery = {
  listAttendanceByDriver?: {
    __typename: 'AttendanceConnection';
    items: Array<{
      __typename: 'Attendance';
      driverID: string;
      date: string;
      shift?: Shift | null;
      orgID: string;
      plantID: string;
      status: AttendanceStatus;
      checkInAt?: string | null;
      checkOutAt?: string | null;
      markedByUserID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListAttendanceByPlantDateQueryVariables = {
  plantID: string;
  date: string;
  shift?: Shift | null;
  nextToken?: string | null;
};

export type ListAttendanceByPlantDateQuery = {
  listAttendanceByPlantDate?: {
    __typename: 'AttendanceConnection';
    items: Array<{
      __typename: 'Attendance';
      driverID: string;
      date: string;
      shift?: Shift | null;
      orgID: string;
      plantID: string;
      status: AttendanceStatus;
      checkInAt?: string | null;
      checkOutAt?: string | null;
      markedByUserID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListAssignmentsByDriverQueryVariables = {
  driverID: string;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListAssignmentsByDriverQuery = {
  listAssignmentsByDriver?: {
    __typename: 'AssignmentConnection';
    items: Array<{
      __typename: 'Assignment';
      driverID: string;
      date: string;
      shift: Shift;
      orgID: string;
      plantID: string;
      tractorVIN: string;
      loggerID?: string | null;
      startTime: string;
      endTime?: string | null;
      status: AssignmentStatus;
      assignedByUserID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListAssignmentsByTractorDateQueryVariables = {
  tractorVIN: string;
  date: string;
  nextToken?: string | null;
};

export type ListAssignmentsByTractorDateQuery = {
  listAssignmentsByTractorDate?: {
    __typename: 'AssignmentConnection';
    items: Array<{
      __typename: 'Assignment';
      driverID: string;
      date: string;
      shift: Shift;
      orgID: string;
      plantID: string;
      tractorVIN: string;
      loggerID?: string | null;
      startTime: string;
      endTime?: string | null;
      status: AssignmentStatus;
      assignedByUserID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListPerformanceByDriverQueryVariables = {
  driverID: string;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListPerformanceByDriverQuery = {
  listPerformanceByDriver?: {
    __typename: 'PerformanceConnection';
    items: Array<{
      __typename: 'PerformanceLog';
      driverID: string;
      date: string;
      orgID: string;
      plantID: string;
      hoursDriven?: number | null;
      tripsCompleted?: number | null;
      energyUsedKwh?: number | null;
      incidentsCount?: number | null;
      incidents?: Array<string> | null;
      notes?: string | null;
      enteredByUserID?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetComplaintQueryVariables = {
  complaintID: string;
};

export type GetComplaintQuery = {
  getComplaint?: {
    __typename: 'Complaint';
    complaintID: string;
    orgID: string;
    plantID?: string | null;
    tractorVIN?: string | null;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    source: ComplaintSource;
    problemType: ComplaintProblemType;
    problemSubType?: string | null;
    maintenanceType?: MaintenanceType | null;
    description: string;
    priority?: ComplaintPriority | null;
    state: ComplaintState;
    assigneeUserID?: string | null;
    slaDeadline?: string | null;
    resolutionTimeline?: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string | null;
    rating?: number | null;
    feedback?: string | null;
    ratedAt?: string | null;
    pmsBaselineRuntime?: number | null;
    pmsCurrentRuntime?: number | null;
    pmsHoursAccumulated?: number | null;
    pmsBaselineDate?: string | null;
    breakdownDate?: string | null;
    breakdownType?: string | null;
    driverName?: string | null;
    shift?: string | null;
    location?: string | null;
    motorRunningHoursAtBreakdown?: number | null;
    daysVehicleOffRoad?: number | null;
    daysVehicleRemainedOffRoad?: number | null;
    delayReason?: string | null;
    actionRequired?: string | null;
    serviceManagerName?: string | null;
    attachments?: Array<{
      __typename: 'Attachment';
      key: string;
      label?: string | null;
      uploadedBy?: string | null;
      uploadedAt: string;
    }> | null;
    events?: Array<{
      __typename: 'ComplaintEvent';
      ts: string;
      type: TicketEventType;
      by?: string | null;
      note?: string | null;
      meta?: string | null;
    }> | null;
  } | null;
};

export type ListComplaintsByTractorQueryVariables = {
  tractorVIN: string;
  nextToken?: string | null;
};

export type ListComplaintsByTractorQuery = {
  listComplaintsByTractor?: {
    __typename: 'ComplaintConnection';
    items: Array<{
      __typename: 'Complaint';
      complaintID: string;
      orgID: string;
      plantID?: string | null;
      tractorVIN?: string | null;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      source: ComplaintSource;
      problemType: ComplaintProblemType;
      problemSubType?: string | null;
      maintenanceType?: MaintenanceType | null;
      description: string;
      priority?: ComplaintPriority | null;
      state: ComplaintState;
      assigneeUserID?: string | null;
      slaDeadline?: string | null;
      resolutionTimeline?: string | null;
      createdAt: string;
      updatedAt: string;
      closedAt?: string | null;
      rating?: number | null;
      feedback?: string | null;
      ratedAt?: string | null;
      pmsBaselineRuntime?: number | null;
      pmsCurrentRuntime?: number | null;
      pmsHoursAccumulated?: number | null;
      pmsBaselineDate?: string | null;
      breakdownDate?: string | null;
      breakdownType?: string | null;
      driverName?: string | null;
      shift?: string | null;
      location?: string | null;
      motorRunningHoursAtBreakdown?: number | null;
      daysVehicleOffRoad?: number | null;
      daysVehicleRemainedOffRoad?: number | null;
      delayReason?: string | null;
      actionRequired?: string | null;
      serviceManagerName?: string | null;
      attachments?: Array<{
        __typename: 'Attachment';
        key: string;
        label?: string | null;
        uploadedBy?: string | null;
        uploadedAt: string;
      }> | null;
      events?: Array<{
        __typename: 'ComplaintEvent';
        ts: string;
        type: TicketEventType;
        by?: string | null;
        note?: string | null;
        meta?: string | null;
      }> | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListComplaintsByClientQueryVariables = {
  userID: string;
  nextToken?: string | null;
};

export type ListComplaintsByClientQuery = {
  listComplaintsByClient?: {
    __typename: 'ComplaintConnection';
    items: Array<{
      __typename: 'Complaint';
      complaintID: string;
      orgID: string;
      plantID?: string | null;
      tractorVIN?: string | null;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      source: ComplaintSource;
      problemType: ComplaintProblemType;
      problemSubType?: string | null;
      maintenanceType?: MaintenanceType | null;
      description: string;
      priority?: ComplaintPriority | null;
      state: ComplaintState;
      assigneeUserID?: string | null;
      slaDeadline?: string | null;
      resolutionTimeline?: string | null;
      createdAt: string;
      updatedAt: string;
      closedAt?: string | null;
      rating?: number | null;
      feedback?: string | null;
      ratedAt?: string | null;
      pmsBaselineRuntime?: number | null;
      pmsCurrentRuntime?: number | null;
      pmsHoursAccumulated?: number | null;
      pmsBaselineDate?: string | null;
      breakdownDate?: string | null;
      breakdownType?: string | null;
      driverName?: string | null;
      shift?: string | null;
      location?: string | null;
      motorRunningHoursAtBreakdown?: number | null;
      daysVehicleOffRoad?: number | null;
      daysVehicleRemainedOffRoad?: number | null;
      delayReason?: string | null;
      actionRequired?: string | null;
      serviceManagerName?: string | null;
      attachments?: Array<{
        __typename: 'Attachment';
        key: string;
        label?: string | null;
        uploadedBy?: string | null;
        uploadedAt: string;
      }> | null;
      events?: Array<{
        __typename: 'ComplaintEvent';
        ts: string;
        type: TicketEventType;
        by?: string | null;
        note?: string | null;
        meta?: string | null;
      }> | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListComplaintsByPlantQueryVariables = {
  plantID: string;
  nextToken?: string | null;
};

export type ListComplaintsByPlantQuery = {
  listComplaintsByPlant?: {
    __typename: 'ComplaintConnection';
    items: Array<{
      __typename: 'Complaint';
      complaintID: string;
      orgID: string;
      plantID?: string | null;
      tractorVIN?: string | null;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      source: ComplaintSource;
      problemType: ComplaintProblemType;
      problemSubType?: string | null;
      maintenanceType?: MaintenanceType | null;
      description: string;
      priority?: ComplaintPriority | null;
      state: ComplaintState;
      assigneeUserID?: string | null;
      slaDeadline?: string | null;
      resolutionTimeline?: string | null;
      createdAt: string;
      updatedAt: string;
      closedAt?: string | null;
      rating?: number | null;
      feedback?: string | null;
      ratedAt?: string | null;
      pmsBaselineRuntime?: number | null;
      pmsCurrentRuntime?: number | null;
      pmsHoursAccumulated?: number | null;
      pmsBaselineDate?: string | null;
      breakdownDate?: string | null;
      breakdownType?: string | null;
      driverName?: string | null;
      shift?: string | null;
      location?: string | null;
      motorRunningHoursAtBreakdown?: number | null;
      daysVehicleOffRoad?: number | null;
      daysVehicleRemainedOffRoad?: number | null;
      delayReason?: string | null;
      actionRequired?: string | null;
      serviceManagerName?: string | null;
      attachments?: Array<{
        __typename: 'Attachment';
        key: string;
        label?: string | null;
        uploadedBy?: string | null;
        uploadedAt: string;
      }> | null;
      events?: Array<{
        __typename: 'ComplaintEvent';
        ts: string;
        type: TicketEventType;
        by?: string | null;
        note?: string | null;
        meta?: string | null;
      }> | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListComplaintsByOrgQueryVariables = {
  orgID: string;
  nextToken?: string | null;
};

export type ListComplaintsByOrgQuery = {
  listComplaintsByOrg?: {
    __typename: 'ComplaintConnection';
    items: Array<{
      __typename: 'Complaint';
      complaintID: string;
      orgID: string;
      plantID?: string | null;
      tractorVIN?: string | null;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      source: ComplaintSource;
      problemType: ComplaintProblemType;
      problemSubType?: string | null;
      maintenanceType?: MaintenanceType | null;
      description: string;
      priority?: ComplaintPriority | null;
      state: ComplaintState;
      assigneeUserID?: string | null;
      slaDeadline?: string | null;
      resolutionTimeline?: string | null;
      createdAt: string;
      updatedAt: string;
      closedAt?: string | null;
      rating?: number | null;
      feedback?: string | null;
      ratedAt?: string | null;
      pmsBaselineRuntime?: number | null;
      pmsCurrentRuntime?: number | null;
      pmsHoursAccumulated?: number | null;
      pmsBaselineDate?: string | null;
      breakdownDate?: string | null;
      breakdownType?: string | null;
      driverName?: string | null;
      shift?: string | null;
      location?: string | null;
      motorRunningHoursAtBreakdown?: number | null;
      daysVehicleOffRoad?: number | null;
      daysVehicleRemainedOffRoad?: number | null;
      delayReason?: string | null;
      actionRequired?: string | null;
      serviceManagerName?: string | null;
      attachments?: Array<{
        __typename: 'Attachment';
        key: string;
        label?: string | null;
        uploadedBy?: string | null;
        uploadedAt: string;
      }> | null;
      events?: Array<{
        __typename: 'ComplaintEvent';
        ts: string;
        type: TicketEventType;
        by?: string | null;
        note?: string | null;
        meta?: string | null;
      }> | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListComplaintsByAssigneeQueryVariables = {
  userID: string;
  nextToken?: string | null;
};

export type ListComplaintsByAssigneeQuery = {
  listComplaintsByAssignee?: {
    __typename: 'ComplaintConnection';
    items: Array<{
      __typename: 'Complaint';
      complaintID: string;
      orgID: string;
      plantID?: string | null;
      tractorVIN?: string | null;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      source: ComplaintSource;
      problemType: ComplaintProblemType;
      problemSubType?: string | null;
      maintenanceType?: MaintenanceType | null;
      description: string;
      priority?: ComplaintPriority | null;
      state: ComplaintState;
      assigneeUserID?: string | null;
      slaDeadline?: string | null;
      resolutionTimeline?: string | null;
      createdAt: string;
      updatedAt: string;
      closedAt?: string | null;
      rating?: number | null;
      feedback?: string | null;
      ratedAt?: string | null;
      pmsBaselineRuntime?: number | null;
      pmsCurrentRuntime?: number | null;
      pmsHoursAccumulated?: number | null;
      pmsBaselineDate?: string | null;
      breakdownDate?: string | null;
      breakdownType?: string | null;
      driverName?: string | null;
      shift?: string | null;
      location?: string | null;
      motorRunningHoursAtBreakdown?: number | null;
      daysVehicleOffRoad?: number | null;
      daysVehicleRemainedOffRoad?: number | null;
      delayReason?: string | null;
      actionRequired?: string | null;
      serviceManagerName?: string | null;
      attachments?: Array<{
        __typename: 'Attachment';
        key: string;
        label?: string | null;
        uploadedBy?: string | null;
        uploadedAt: string;
      }> | null;
      events?: Array<{
        __typename: 'ComplaintEvent';
        ts: string;
        type: TicketEventType;
        by?: string | null;
        note?: string | null;
        meta?: string | null;
      }> | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListComplaintsByStatusQueryVariables = {
  state: ComplaintState;
  nextToken?: string | null;
};

export type ListComplaintsByStatusQuery = {
  listComplaintsByStatus?: {
    __typename: 'ComplaintConnection';
    items: Array<{
      __typename: 'Complaint';
      complaintID: string;
      orgID: string;
      plantID?: string | null;
      tractorVIN?: string | null;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      source: ComplaintSource;
      problemType: ComplaintProblemType;
      problemSubType?: string | null;
      maintenanceType?: MaintenanceType | null;
      description: string;
      priority?: ComplaintPriority | null;
      state: ComplaintState;
      assigneeUserID?: string | null;
      slaDeadline?: string | null;
      resolutionTimeline?: string | null;
      createdAt: string;
      updatedAt: string;
      closedAt?: string | null;
      rating?: number | null;
      feedback?: string | null;
      ratedAt?: string | null;
      pmsBaselineRuntime?: number | null;
      pmsCurrentRuntime?: number | null;
      pmsHoursAccumulated?: number | null;
      pmsBaselineDate?: string | null;
      breakdownDate?: string | null;
      breakdownType?: string | null;
      driverName?: string | null;
      shift?: string | null;
      location?: string | null;
      motorRunningHoursAtBreakdown?: number | null;
      daysVehicleOffRoad?: number | null;
      daysVehicleRemainedOffRoad?: number | null;
      delayReason?: string | null;
      actionRequired?: string | null;
      serviceManagerName?: string | null;
      attachments?: Array<{
        __typename: 'Attachment';
        key: string;
        label?: string | null;
        uploadedBy?: string | null;
        uploadedAt: string;
      }> | null;
      events?: Array<{
        __typename: 'ComplaintEvent';
        ts: string;
        type: TicketEventType;
        by?: string | null;
        note?: string | null;
        meta?: string | null;
      }> | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListComplaintEventsQueryVariables = {
  complaintID: string;
  nextToken?: string | null;
};

export type ListComplaintEventsQuery = {
  listComplaintEvents: Array<{
    __typename: 'ComplaintEvent';
    ts: string;
    type: TicketEventType;
    by?: string | null;
    note?: string | null;
    meta?: string | null;
  }>;
};

export type GetJobCardQueryVariables = {
  jobCardID: string;
};

export type GetJobCardQuery = {
  getJobCard?: {
    __typename: 'JobCard';
    jobCardID: string;
    jobCardNumber: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    loggerID?: string | null;
    raisedByUserID?: string | null;
    repairCategory: RepairCategory;
    problemType: string;
    description: string;
    priority: string;
    isVOR: boolean;
    status: JobCardStatus;
    slaDeadline: string;
    slaHours: number;
    slaStatus: SLAStatus;
    slaPercentage: number;
    estimatedHours?: number | null;
    actualHours?: number | null;
    assignedTechnicianID?: string | null;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    totalCost: number;
    downtimeHours: number;
    delayReasons?: Array<{
      __typename: 'DelayRecord';
      reason: DelayReason;
      notes?: string | null;
      recordedAt: string;
      recordedBy?: string | null;
    }> | null;
    customerFeedback?: string | null;
    createdAt: string;
    updatedAt: string;
    startedAt?: string | null;
    completedAt?: string | null;
    closedAt?: string | null;
  } | null;
};

export type ListJobCardsByPlantQueryVariables = {
  plantID: string;
  status?: JobCardStatus | null;
  nextToken?: string | null;
};

export type ListJobCardsByPlantQuery = {
  listJobCardsByPlant?: {
    __typename: 'JobCardConnection';
    items: Array<{
      __typename: 'JobCard';
      jobCardID: string;
      jobCardNumber: string;
      orgID: string;
      plantID: string;
      tractorVIN: string;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      repairCategory: RepairCategory;
      problemType: string;
      description: string;
      priority: string;
      isVOR: boolean;
      status: JobCardStatus;
      slaDeadline: string;
      slaHours: number;
      slaStatus: SLAStatus;
      slaPercentage: number;
      estimatedHours?: number | null;
      actualHours?: number | null;
      assignedTechnicianID?: string | null;
      labourCost: number;
      partsCost: number;
      vendorCost: number;
      totalCost: number;
      downtimeHours: number;
      delayReasons?: Array<{
        __typename: 'DelayRecord';
        reason: DelayReason;
        notes?: string | null;
        recordedAt: string;
        recordedBy?: string | null;
      }> | null;
      customerFeedback?: string | null;
      createdAt: string;
      updatedAt: string;
      startedAt?: string | null;
      completedAt?: string | null;
      closedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListJobCardsByTractorQueryVariables = {
  tractorVIN: string;
  nextToken?: string | null;
};

export type ListJobCardsByTractorQuery = {
  listJobCardsByTractor?: {
    __typename: 'JobCardConnection';
    items: Array<{
      __typename: 'JobCard';
      jobCardID: string;
      jobCardNumber: string;
      orgID: string;
      plantID: string;
      tractorVIN: string;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      repairCategory: RepairCategory;
      problemType: string;
      description: string;
      priority: string;
      isVOR: boolean;
      status: JobCardStatus;
      slaDeadline: string;
      slaHours: number;
      slaStatus: SLAStatus;
      slaPercentage: number;
      estimatedHours?: number | null;
      actualHours?: number | null;
      assignedTechnicianID?: string | null;
      labourCost: number;
      partsCost: number;
      vendorCost: number;
      totalCost: number;
      downtimeHours: number;
      delayReasons?: Array<{
        __typename: 'DelayRecord';
        reason: DelayReason;
        notes?: string | null;
        recordedAt: string;
        recordedBy?: string | null;
      }> | null;
      customerFeedback?: string | null;
      createdAt: string;
      updatedAt: string;
      startedAt?: string | null;
      completedAt?: string | null;
      closedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListJobCardsByOrgQueryVariables = {
  orgID: string;
  nextToken?: string | null;
};

export type ListJobCardsByOrgQuery = {
  listJobCardsByOrg?: {
    __typename: 'JobCardConnection';
    items: Array<{
      __typename: 'JobCard';
      jobCardID: string;
      jobCardNumber: string;
      orgID: string;
      plantID: string;
      tractorVIN: string;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      repairCategory: RepairCategory;
      problemType: string;
      description: string;
      priority: string;
      isVOR: boolean;
      status: JobCardStatus;
      slaDeadline: string;
      slaHours: number;
      slaStatus: SLAStatus;
      slaPercentage: number;
      estimatedHours?: number | null;
      actualHours?: number | null;
      assignedTechnicianID?: string | null;
      labourCost: number;
      partsCost: number;
      vendorCost: number;
      totalCost: number;
      downtimeHours: number;
      delayReasons?: Array<{
        __typename: 'DelayRecord';
        reason: DelayReason;
        notes?: string | null;
        recordedAt: string;
        recordedBy?: string | null;
      }> | null;
      customerFeedback?: string | null;
      createdAt: string;
      updatedAt: string;
      startedAt?: string | null;
      completedAt?: string | null;
      closedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListJobCardsBySLAQueryVariables = {
  orgID: string;
  slaStatus: SLAStatus;
  nextToken?: string | null;
};

export type ListJobCardsBySLAQuery = {
  listJobCardsBySLA?: {
    __typename: 'JobCardConnection';
    items: Array<{
      __typename: 'JobCard';
      jobCardID: string;
      jobCardNumber: string;
      orgID: string;
      plantID: string;
      tractorVIN: string;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      repairCategory: RepairCategory;
      problemType: string;
      description: string;
      priority: string;
      isVOR: boolean;
      status: JobCardStatus;
      slaDeadline: string;
      slaHours: number;
      slaStatus: SLAStatus;
      slaPercentage: number;
      estimatedHours?: number | null;
      actualHours?: number | null;
      assignedTechnicianID?: string | null;
      labourCost: number;
      partsCost: number;
      vendorCost: number;
      totalCost: number;
      downtimeHours: number;
      delayReasons?: Array<{
        __typename: 'DelayRecord';
        reason: DelayReason;
        notes?: string | null;
        recordedAt: string;
        recordedBy?: string | null;
      }> | null;
      customerFeedback?: string | null;
      createdAt: string;
      updatedAt: string;
      startedAt?: string | null;
      completedAt?: string | null;
      closedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListJobCardsByAssigneeQueryVariables = {
  technicianID: string;
  status?: JobCardStatus | null;
  nextToken?: string | null;
};

export type ListJobCardsByAssigneeQuery = {
  listJobCardsByAssignee?: {
    __typename: 'JobCardConnection';
    items: Array<{
      __typename: 'JobCard';
      jobCardID: string;
      jobCardNumber: string;
      orgID: string;
      plantID: string;
      tractorVIN: string;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      repairCategory: RepairCategory;
      problemType: string;
      description: string;
      priority: string;
      isVOR: boolean;
      status: JobCardStatus;
      slaDeadline: string;
      slaHours: number;
      slaStatus: SLAStatus;
      slaPercentage: number;
      estimatedHours?: number | null;
      actualHours?: number | null;
      assignedTechnicianID?: string | null;
      labourCost: number;
      partsCost: number;
      vendorCost: number;
      totalCost: number;
      downtimeHours: number;
      delayReasons?: Array<{
        __typename: 'DelayRecord';
        reason: DelayReason;
        notes?: string | null;
        recordedAt: string;
        recordedBy?: string | null;
      }> | null;
      customerFeedback?: string | null;
      createdAt: string;
      updatedAt: string;
      startedAt?: string | null;
      completedAt?: string | null;
      closedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListDelayedJobCardsQueryVariables = {
  orgID: string;
  plantID?: string | null;
  nextToken?: string | null;
};

export type ListDelayedJobCardsQuery = {
  listDelayedJobCards?: {
    __typename: 'JobCardConnection';
    items: Array<{
      __typename: 'JobCard';
      jobCardID: string;
      jobCardNumber: string;
      orgID: string;
      plantID: string;
      tractorVIN: string;
      loggerID?: string | null;
      raisedByUserID?: string | null;
      repairCategory: RepairCategory;
      problemType: string;
      description: string;
      priority: string;
      isVOR: boolean;
      status: JobCardStatus;
      slaDeadline: string;
      slaHours: number;
      slaStatus: SLAStatus;
      slaPercentage: number;
      estimatedHours?: number | null;
      actualHours?: number | null;
      assignedTechnicianID?: string | null;
      labourCost: number;
      partsCost: number;
      vendorCost: number;
      totalCost: number;
      downtimeHours: number;
      delayReasons?: Array<{
        __typename: 'DelayRecord';
        reason: DelayReason;
        notes?: string | null;
        recordedAt: string;
        recordedBy?: string | null;
      }> | null;
      customerFeedback?: string | null;
      createdAt: string;
      updatedAt: string;
      startedAt?: string | null;
      completedAt?: string | null;
      closedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetVORRequestQueryVariables = {
  vorID: string;
};

export type GetVORRequestQuery = {
  getVORRequest?: {
    __typename: 'VORRequest';
    vorID: string;
    orgID: string;
    plantID: string;
    tractorVIN: string;
    complaintID?: string | null;
    requiredParts: Array<{
      __typename: 'RequiredPart';
      sku: string;
      quantity: number;
      description?: string | null;
      vendorSupportRequired: boolean;
      vendorOption?: Vendor | null;
    }>;
    urgency: VORUrgency;
    reason: string;
    status: VORStatus;
    requestedBy: string;
    approvedBy?: string | null;
    dispatchedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string | null;
    dispatchedAt?: string | null;
    deliveredAt?: string | null;
  } | null;
};

export type ListVORRequestsQueryVariables = {
  orgID: string;
  status?: VORStatus | null;
  nextToken?: string | null;
};

export type ListVORRequestsQuery = {
  listVORRequests?: {
    __typename: 'VORRequestConnection';
    items: Array<{
      __typename: 'VORRequest';
      vorID: string;
      orgID: string;
      plantID: string;
      tractorVIN: string;
      complaintID?: string | null;
      requiredParts: Array<{
        __typename: 'RequiredPart';
        sku: string;
        quantity: number;
        description?: string | null;
        vendorSupportRequired: boolean;
        vendorOption?: Vendor | null;
      }>;
      urgency: VORUrgency;
      reason: string;
      status: VORStatus;
      requestedBy: string;
      approvedBy?: string | null;
      dispatchedBy?: string | null;
      createdAt: string;
      updatedAt: string;
      approvedAt?: string | null;
      dispatchedAt?: string | null;
      deliveredAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetVendorRequestQueryVariables = {
  complaintID: string;
  vendorRequestID: string;
};

export type GetVendorRequestQuery = {
  getVendorRequest?: {
    __typename: 'VendorRequest';
    vendorRequestID: string;
    complaintID: string;
    orgID: string;
    plantID: string;
    tractorVIN?: string | null;
    vendorRequired: boolean;
    vendorType?: Vendor | null;
    description: string;
    status: VendorRequestStatus;
    requestedBy: string;
    resolvedBy?: string | null;
    resolutionNotes?: string | null;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
  } | null;
};

export type ListVendorRequestsByComplaintQueryVariables = {
  complaintID: string;
  nextToken?: string | null;
};

export type ListVendorRequestsByComplaintQuery = {
  listVendorRequestsByComplaint?: {
    __typename: 'VendorRequestConnection';
    items: Array<{
      __typename: 'VendorRequest';
      vendorRequestID: string;
      complaintID: string;
      orgID: string;
      plantID: string;
      tractorVIN?: string | null;
      vendorRequired: boolean;
      vendorType?: Vendor | null;
      description: string;
      status: VendorRequestStatus;
      requestedBy: string;
      resolvedBy?: string | null;
      resolutionNotes?: string | null;
      createdAt: string;
      updatedAt: string;
      resolvedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListVendorRequestsByOrgQueryVariables = {
  orgID: string;
  status?: VendorRequestStatus | null;
  nextToken?: string | null;
};

export type ListVendorRequestsByOrgQuery = {
  listVendorRequestsByOrg?: {
    __typename: 'VendorRequestConnection';
    items: Array<{
      __typename: 'VendorRequest';
      vendorRequestID: string;
      complaintID: string;
      orgID: string;
      plantID: string;
      tractorVIN?: string | null;
      vendorRequired: boolean;
      vendorType?: Vendor | null;
      description: string;
      status: VendorRequestStatus;
      requestedBy: string;
      resolvedBy?: string | null;
      resolutionNotes?: string | null;
      createdAt: string;
      updatedAt: string;
      resolvedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetPMSScheduleQueryVariables = {
  tractorVIN: string;
};

export type GetPMSScheduleQuery = {
  getPMSSchedule?: {
    __typename: 'PMSSchedule';
    scheduleID: string;
    tractorVIN: string;
    orgID: string;
    plantID: string;
    intervalHours: number;
    intervalMonths: number;
    lastPMSDate?: string | null;
    lastPMSHourMeter?: number | null;
    nextPMSDueDate: string;
    nextPMSDueHourMeter: number;
    status: PMSStatus;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListOverduePMSQueryVariables = {
  orgID: string;
  plantID?: string | null;
  nextToken?: string | null;
};

export type ListOverduePMSQuery = {
  listOverduePMS?: {
    __typename: 'PMSScheduleConnection';
    items: Array<{
      __typename: 'PMSSchedule';
      scheduleID: string;
      tractorVIN: string;
      orgID: string;
      plantID: string;
      intervalHours: number;
      intervalMonths: number;
      lastPMSDate?: string | null;
      lastPMSHourMeter?: number | null;
      nextPMSDueDate: string;
      nextPMSDueHourMeter: number;
      status: PMSStatus;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetPMSAlertsQueryVariables = {
  orgID: string;
  plantID?: string | null;
  nextToken?: string | null;
};

export type GetPMSAlertsQuery = {
  getPMSAlerts?: {
    __typename: 'PMSAlertConnection';
    items: Array<{
      __typename: 'PMSAlert';
      tractorVIN: string;
      orgID: string;
      plantID: string;
      currentHourMeter: number;
      lastPMSDate?: string | null;
      lastPMSHourMeter?: number | null;
      hoursSinceLastPMS: number;
      monthsSinceLastPMS: number;
      alertType: PMSAlertType;
      alertMessage: string;
      needsImmediateAttention: boolean;
      createdAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetPMSTrackerQueryVariables = {
  tractorVIN: string;
};

export type GetPMSTrackerQuery = {
  getPMSTracker?: {
    __typename: 'PMSTracker';
    trackerID: string;
    tractorVIN: string;
    orgID: string;
    plantID: string;
    intervalHours: number;
    baselineRuntime: number;
    currentRuntime?: number | null;
    hoursSinceLastPMS?: number | null;
    activeComplaintID?: string | null;
    status: PMSTrackerStatus;
    lastResetAt?: string | null;
    lastResetBy?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListPMSTrackersByOrgQueryVariables = {
  orgID: string;
  nextToken?: string | null;
};

export type ListPMSTrackersByOrgQuery = {
  listPMSTrackersByOrg?: {
    __typename: 'PMSTrackerConnection';
    items: Array<{
      __typename: 'PMSTracker';
      trackerID: string;
      tractorVIN: string;
      orgID: string;
      plantID: string;
      intervalHours: number;
      baselineRuntime: number;
      currentRuntime?: number | null;
      hoursSinceLastPMS?: number | null;
      activeComplaintID?: string | null;
      status: PMSTrackerStatus;
      lastResetAt?: string | null;
      lastResetBy?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type CheckPMSAlertQueryVariables = {
  tractorVIN: string;
};

export type CheckPMSAlertQuery = {
  checkPMSAlert?: {
    __typename: 'PMSTrackerAlert';
    tractorVIN: string;
    trackerID: string;
    baselineRuntime: number;
    currentRuntime: number;
    hoursSinceLastPMS: number;
    intervalHours: number;
    hoursRemaining: number;
    alertRequired: boolean;
    status: PMSTrackerStatus;
    activeComplaintID?: string | null;
  } | null;
};

export type ListPMSHistoryQueryVariables = {
  tractorVIN: string;
  nextToken?: string | null;
};

export type ListPMSHistoryQuery = {
  listPMSHistory?: {
    __typename: 'PMSHistoryConnection';
    items: Array<{
      __typename: 'PMSHistory';
      historyID: string;
      tractorVIN: string;
      orgID: string;
      complaintID?: string | null;
      baselineRuntime: number;
      resetRuntime: number;
      hoursAccumulated: number;
      resetAt: string;
      resetBy: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListAllPMSStatusQueryVariables = {};

export type ListAllPMSStatusQuery = {
  listAllPMSStatus: Array<{
    __typename: 'PMSLiveStatus';
    tractorID: string;
    totalRuntimeHours: number;
    baselineRuntime: number;
    hoursAccumulated: number;
    hoursRemaining: number;
    percentComplete: number;
    intervalHours: number;
    status: PMSTrackerStatus;
    alertRequired: boolean;
    activeComplaintID?: string | null;
    lastResetAt?: string | null;
    trackerExists: boolean;
  }>;
};

export type GetPMSStatusQueryVariables = {
  tractorID: string;
};

export type GetPMSStatusQuery = {
  getPMSStatus?: {
    __typename: 'PMSLiveStatus';
    tractorID: string;
    totalRuntimeHours: number;
    baselineRuntime: number;
    hoursAccumulated: number;
    hoursRemaining: number;
    percentComplete: number;
    intervalHours: number;
    status: PMSTrackerStatus;
    alertRequired: boolean;
    activeComplaintID?: string | null;
    lastResetAt?: string | null;
    trackerExists: boolean;
  } | null;
};

export type GetWeeklyCheckScheduleQueryVariables = {
  scheduleID: string;
};

export type GetWeeklyCheckScheduleQuery = {
  getWeeklyCheckSchedule?: {
    __typename: 'WeeklyCheckSchedule';
    scheduleID: string;
    orgID: string;
    plantID: string;
    weekStartDate: string;
    assignedTractors: Array<string>;
    assignedTechnicianID: string;
    status: WeeklyCheckStatus;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListWeeklyChecksByTechnicianQueryVariables = {
  technicianID: string;
  status?: WeeklyCheckStatus | null;
  nextToken?: string | null;
};

export type ListWeeklyChecksByTechnicianQuery = {
  listWeeklyChecksByTechnician?: {
    __typename: 'WeeklyCheckConnection';
    items: Array<{
      __typename: 'WeeklyCheckSchedule';
      scheduleID: string;
      orgID: string;
      plantID: string;
      weekStartDate: string;
      assignedTractors: Array<string>;
      assignedTechnicianID: string;
      status: WeeklyCheckStatus;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListWeeklyChecksByPlantQueryVariables = {
  plantID: string;
  weekStartDate?: string | null;
  nextToken?: string | null;
};

export type ListWeeklyChecksByPlantQuery = {
  listWeeklyChecksByPlant?: {
    __typename: 'WeeklyCheckConnection';
    items: Array<{
      __typename: 'WeeklyCheckSchedule';
      scheduleID: string;
      orgID: string;
      plantID: string;
      weekStartDate: string;
      assignedTractors: Array<string>;
      assignedTechnicianID: string;
      status: WeeklyCheckStatus;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetDelayAnalyticsBySiteQueryVariables = {
  orgID: string;
  plantID: string;
  startDate: string;
  endDate: string;
};

export type GetDelayAnalyticsBySiteQuery = {
  getDelayAnalyticsBySite?: {
    __typename: 'DelayAnalytics';
    orgID: string;
    plantID?: string | null;
    startDate: string;
    endDate: string;
    totalJobs: number;
    delayedJobs: number;
    delayPercentage: number;
    reasonBreakdown: Array<{
      __typename: 'ReasonCount';
      reason: string;
      count: number;
      percentage: number;
      avgDelayHours?: number | null;
    }>;
    repeatFailures: Array<{
      __typename: 'RepeatFailurePattern';
      tractorVIN: string;
      reason: string;
      occurrences: number;
      lastOccurrence: string;
      firstOccurrence: string;
      avgTimeBetweenOccurrences?: number | null;
    }>;
    avgDelayHours?: number | null;
  } | null;
};

export type GetDelayAnalyticsByRegionQueryVariables = {
  orgID: string;
  startDate: string;
  endDate: string;
};

export type GetDelayAnalyticsByRegionQuery = {
  getDelayAnalyticsByRegion?: {
    __typename: 'DelayAnalytics';
    orgID: string;
    plantID?: string | null;
    startDate: string;
    endDate: string;
    totalJobs: number;
    delayedJobs: number;
    delayPercentage: number;
    reasonBreakdown: Array<{
      __typename: 'ReasonCount';
      reason: string;
      count: number;
      percentage: number;
      avgDelayHours?: number | null;
    }>;
    repeatFailures: Array<{
      __typename: 'RepeatFailurePattern';
      tractorVIN: string;
      reason: string;
      occurrences: number;
      lastOccurrence: string;
      firstOccurrence: string;
      avgTimeBetweenOccurrences?: number | null;
    }>;
    avgDelayHours?: number | null;
  } | null;
};

export type GetTopDelayReasonsQueryVariables = {
  orgID: string;
  plantID?: string | null;
  startDate: string;
  endDate: string;
  limit?: number | null;
};

export type GetTopDelayReasonsQuery = {
  getTopDelayReasons: Array<{
    __typename: 'ReasonCount';
    reason: string;
    count: number;
    percentage: number;
    avgDelayHours?: number | null;
  }>;
};

export type GetRepeatFailurePatternsQueryVariables = {
  orgID: string;
  tractorVIN?: string | null;
  startDate: string;
  endDate: string;
  minOccurrences?: number | null;
};

export type GetRepeatFailurePatternsQuery = {
  getRepeatFailurePatterns: Array<{
    __typename: 'RepeatFailurePattern';
    tractorVIN: string;
    reason: string;
    occurrences: number;
    lastOccurrence: string;
    firstOccurrence: string;
    avgTimeBetweenOccurrences?: number | null;
  }>;
};

export type GetSLAComplianceReportQueryVariables = {
  orgID: string;
  plantID?: string | null;
  startDate: string;
  endDate: string;
};

export type GetSLAComplianceReportQuery = {
  getSLAComplianceReport?: {
    __typename: 'SLAComplianceReport';
    orgID: string;
    plantID?: string | null;
    startDate: string;
    endDate: string;
    totalJobs: number;
    onTimeJobs: number;
    delayedJobs: number;
    compliancePercentage: number;
    avgCompletionTime?: number | null;
    byCategory: Array<{
      __typename: 'CategoryCompliance';
      category: string;
      totalJobs: number;
      onTimeJobs: number;
      compliancePercentage: number;
    }>;
    byPriority: Array<{
      __typename: 'PriorityCompliance';
      priority: string;
      totalJobs: number;
      onTimeJobs: number;
      compliancePercentage: number;
    }>;
    trend: Array<{
      __typename: 'DailyCompliance';
      date: string;
      totalJobs: number;
      onTimeJobs: number;
      compliancePercentage: number;
    }>;
  } | null;
};

export type GetTechnicianProductivityReportQueryVariables = {
  technicianID: string;
  startDate: string;
  endDate: string;
};

export type GetTechnicianProductivityReportQuery = {
  getTechnicianProductivityReport?: {
    __typename: 'TechnicianProductivityReport';
    technicianID: string;
    startDate: string;
    endDate: string;
    totalJobsAssigned: number;
    totalJobsCompleted: number;
    completionRate: number;
    avgCompletionTime?: number | null;
    onTimeJobs: number;
    delayedJobs: number;
    slaComplianceRate: number;
    totalLabourHours?: number | null;
    avgLabourHoursPerJob?: number | null;
    jobsByCategory: Array<{
      __typename: 'CategoryCount';
      category: string;
      count: number;
    }>;
    jobsByPriority: Array<{
      __typename: 'PriorityCount';
      priority: string;
      count: number;
    }>;
  } | null;
};

export type GetPlantPerformanceReportQueryVariables = {
  plantID: string;
  startDate: string;
  endDate: string;
};

export type GetPlantPerformanceReportQuery = {
  getPlantPerformanceReport?: {
    __typename: 'PlantPerformanceReport';
    plantID: string;
    startDate: string;
    endDate: string;
    totalJobs: number;
    completedJobs: number;
    delayedJobs: number;
    avgCompletionTime?: number | null;
    slaComplianceRate: number;
    totalCost: number;
    avgCostPerJob?: number | null;
    totalDowntimeHours?: number | null;
    topDelayReasons: Array<{
      __typename: 'ReasonCount';
      reason: string;
      count: number;
      percentage: number;
      avgDelayHours?: number | null;
    }>;
    technicianPerformance: Array<{
      __typename: 'TechnicianSummary';
      technicianID: string;
      jobsCompleted: number;
      avgCompletionTime?: number | null;
      slaComplianceRate: number;
    }>;
  } | null;
};

export type GetCostPerTractorQueryVariables = {
  tractorVIN: string;
  startDate: string;
  endDate: string;
};

export type GetCostPerTractorQuery = {
  getCostPerTractor?: {
    __typename: 'TractorCostReport';
    tractorVIN: string;
    startDate: string;
    endDate: string;
    totalJobs: number;
    totalCost: number;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    avgCostPerJob?: number | null;
    totalDowntimeHours?: number | null;
    costByCategory: Array<{
      __typename: 'CategoryCost';
      category: string;
      jobCount: number;
      totalCost: number;
      avgCost?: number | null;
    }>;
    costTrend: Array<{
      __typename: 'MonthlyCost';
      month: string;
      totalCost: number;
      jobCount: number;
    }>;
  } | null;
};

export type GetCostPerSiteQueryVariables = {
  plantID: string;
  startDate: string;
  endDate: string;
};

export type GetCostPerSiteQuery = {
  getCostPerSite?: {
    __typename: 'SiteCostReport';
    plantID: string;
    startDate: string;
    endDate: string;
    totalJobs: number;
    totalCost: number;
    labourCost: number;
    partsCost: number;
    vendorCost: number;
    avgCostPerJob?: number | null;
    costByTractor: Array<{
      __typename: 'TractorCostSummary';
      tractorVIN: string;
      jobCount: number;
      totalCost: number;
      avgCost?: number | null;
    }>;
    costByCategory: Array<{
      __typename: 'CategoryCost';
      category: string;
      jobCount: number;
      totalCost: number;
      avgCost?: number | null;
    }>;
    monthlyTrend: Array<{
      __typename: 'MonthlyCost';
      month: string;
      totalCost: number;
      jobCount: number;
    }>;
  } | null;
};

export type GetInventoryAgingReportQueryVariables = {
  plantID: string;
  thresholdDays?: number | null;
};

export type GetInventoryAgingReportQuery = {
  getInventoryAgingReport?: {
    __typename: 'InventoryAgingReport';
    plantID: string;
    generatedAt: string;
    totalItems: number;
    totalValue?: number | null;
    agingBuckets: Array<{
      __typename: 'AgingBucket';
      daysRange: string;
      itemCount: number;
      totalValue?: number | null;
      percentage: number;
    }>;
    slowMovingItems: Array<{
      __typename: 'SlowMovingPart';
      sku: string;
      description?: string | null;
      currentStock: number;
      lastMovementDate?: string | null;
      daysSinceLastMovement: number;
      estimatedValue?: number | null;
      recommendedAction?: string | null;
    }>;
  } | null;
};

export type GetSlowMovingPartsReportQueryVariables = {
  plantID: string;
  thresholdDays: number;
  limit?: number | null;
};

export type GetSlowMovingPartsReportQuery = {
  getSlowMovingPartsReport: Array<{
    __typename: 'SlowMovingPart';
    sku: string;
    description?: string | null;
    currentStock: number;
    lastMovementDate?: string | null;
    daysSinceLastMovement: number;
    estimatedValue?: number | null;
    recommendedAction?: string | null;
  }>;
};

export type GetSkuQueryVariables = {
  sku: string;
};

export type GetSkuQuery = {
  getSku?: {
    __typename: 'SkuMaster';
    sku: string;
    orgID?: string | null;
    name: string;
    description?: string | null;
    category: InventoryCategory;
    unit?: string | null;
    qtyPerUnit?: number | null;
    qtyForNxtBatch?: number | null;
    totalQtyForNxtBatch?: number | null;
    avlblQtyHapur?: number | null;
    partsRequired?: number | null;
    minQty?: number | null;
    midQty?: number | null;
    maxQty?: number | null;
    stockAvailability?: StockAvailability | null;
    modelApplicability?: {
      __typename: 'SkuModelApplicability';
      x45h2: number;
      x45c2: number;
      x45c2L: number;
      x45c4: number;
      h55c2: number;
      h55c2L: number;
      h55c4: number;
      x60c2: number;
      x60c2L: number;
      x60c4: number;
      x75c4: number;
    } | null;
    modelPartsRequired?: {
      __typename: 'SkuModelPartsRequired';
      x45h2: number;
      x45c2: number;
      x45c2L: number;
      x45c4: number;
      h55c2: number;
      h55c2L: number;
      h55c4: number;
      x60c2: number;
      x60c2L: number;
      x60c4: number;
      x75c4: number;
    } | null;
    typicalPricePaise?: number | null;
    specs?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListSkusQueryVariables = {
  category?: InventoryCategory | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListSkusQuery = {
  listSkus?: {
    __typename: 'SkuMasterConnection';
    items: Array<{
      __typename: 'SkuMaster';
      sku: string;
      orgID?: string | null;
      name: string;
      description?: string | null;
      category: InventoryCategory;
      unit?: string | null;
      qtyPerUnit?: number | null;
      qtyForNxtBatch?: number | null;
      totalQtyForNxtBatch?: number | null;
      avlblQtyHapur?: number | null;
      partsRequired?: number | null;
      minQty?: number | null;
      midQty?: number | null;
      maxQty?: number | null;
      stockAvailability?: StockAvailability | null;
      modelApplicability?: {
        __typename: 'SkuModelApplicability';
        x45h2: number;
        x45c2: number;
        x45c2L: number;
        x45c4: number;
        h55c2: number;
        h55c2L: number;
        h55c4: number;
        x60c2: number;
        x60c2L: number;
        x60c4: number;
        x75c4: number;
      } | null;
      modelPartsRequired?: {
        __typename: 'SkuModelPartsRequired';
        x45h2: number;
        x45c2: number;
        x45c2L: number;
        x45c4: number;
        h55c2: number;
        h55c2L: number;
        h55c4: number;
        x60c2: number;
        x60c2L: number;
        x60c4: number;
        x75c4: number;
      } | null;
      typicalPricePaise?: number | null;
      specs?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListSkusByOrgQueryVariables = {
  orgID: string;
  category?: InventoryCategory | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListSkusByOrgQuery = {
  listSkusByOrg?: {
    __typename: 'SkuMasterConnection';
    items: Array<{
      __typename: 'SkuMaster';
      sku: string;
      orgID?: string | null;
      name: string;
      description?: string | null;
      category: InventoryCategory;
      unit?: string | null;
      qtyPerUnit?: number | null;
      qtyForNxtBatch?: number | null;
      totalQtyForNxtBatch?: number | null;
      avlblQtyHapur?: number | null;
      partsRequired?: number | null;
      minQty?: number | null;
      midQty?: number | null;
      maxQty?: number | null;
      stockAvailability?: StockAvailability | null;
      modelApplicability?: {
        __typename: 'SkuModelApplicability';
        x45h2: number;
        x45c2: number;
        x45c2L: number;
        x45c4: number;
        h55c2: number;
        h55c2L: number;
        h55c4: number;
        x60c2: number;
        x60c2L: number;
        x60c4: number;
        x75c4: number;
      } | null;
      modelPartsRequired?: {
        __typename: 'SkuModelPartsRequired';
        x45h2: number;
        x45c2: number;
        x45c2L: number;
        x45c4: number;
        h55c2: number;
        h55c2L: number;
        h55c4: number;
        x60c2: number;
        x60c2L: number;
        x60c4: number;
        x75c4: number;
      } | null;
      typicalPricePaise?: number | null;
      specs?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetPlantStockQueryVariables = {
  plantID: string;
  sku: string;
  category: InventoryCategory;
};

export type GetPlantStockQuery = {
  getPlantStock?: {
    __typename: 'PlantStock';
    orgID: string;
    plantID: string;
    sku: string;
    category: InventoryCategory;
    stock: number;
    reservedQty: number;
    minStock?: number | null;
    maxStock?: number | null;
    reorderLevel?: number | null;
    safetyNormPercentage?: number | null;
    locationBin?: string | null;
    updatedAt: string;
  } | null;
};

export type ListStockByPlantQueryVariables = {
  plantID: string;
  category: InventoryCategory;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListStockByPlantQuery = {
  listStockByPlant?: {
    __typename: 'PlantStockConnection';
    items: Array<{
      __typename: 'PlantStock';
      orgID: string;
      plantID: string;
      sku: string;
      category: InventoryCategory;
      stock: number;
      reservedQty: number;
      minStock?: number | null;
      maxStock?: number | null;
      reorderLevel?: number | null;
      safetyNormPercentage?: number | null;
      locationBin?: string | null;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetOrgStockSummaryQueryVariables = {
  orgID: string;
  sku: string;
  category: InventoryCategory;
};

export type GetOrgStockSummaryQuery = {
  getOrgStockSummary?: {
    __typename: 'OrgStockSummary';
    orgID: string;
    sku: string;
    category: InventoryCategory;
    orgTotalStock: number;
    orgTotalReserved: number;
    orgTotalAvailable: number;
    plants: Array<{
      __typename: 'PlantStockBreakdown';
      plantID: string;
      sku: string;
      category: InventoryCategory;
      totalReceived: number;
      stock: number;
      reservedQty: number;
      available: number;
      minStock?: number | null;
      locationBin?: string | null;
      updatedAt: string;
    }>;
  } | null;
};

export type ListOrgStockSummariesQueryVariables = {
  orgID: string;
  category?: InventoryCategory | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListOrgStockSummariesQuery = {
  listOrgStockSummaries?: {
    __typename: 'OrgStockSummaryConnection';
    items: Array<{
      __typename: 'OrgStockSummary';
      orgID: string;
      sku: string;
      category: InventoryCategory;
      orgTotalStock: number;
      orgTotalReserved: number;
      orgTotalAvailable: number;
      plants: Array<{
        __typename: 'PlantStockBreakdown';
        plantID: string;
        sku: string;
        category: InventoryCategory;
        totalReceived: number;
        stock: number;
        reservedQty: number;
        available: number;
        minStock?: number | null;
        locationBin?: string | null;
        updatedAt: string;
      }>;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListInventoryLogsQueryVariables = {
  plantID: string;
  from?: string | null;
  to?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListInventoryLogsQuery = {
  listInventoryLogs?: {
    __typename: 'InventoryLogConnection';
    items: Array<{
      __typename: 'InventoryLog';
      orgID: string;
      plantID: string;
      sku: string;
      ts: string;
      delta: number;
      reason: InventoryLogReason;
      ticketID?: string | null;
      before?: number | null;
      after?: number | null;
      meta?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetSerialQueryVariables = {
  serial: string;
};

export type GetSerialQuery = {
  getSerial?: {
    __typename: 'SerialMaster';
    serial: string;
    orgID: string;
    sku: string;
    state: SerialState;
    plantID?: string | null;
    loggerID?: string | null;
    tractorVIN?: string | null;
    lastTicketID?: string | null;
    costPaise?: number | null;
    warrantyTill?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListSerialEventsQueryVariables = {
  serial: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListSerialEventsQuery = {
  listSerialEvents?: {
    __typename: 'SerialEventConnection';
    items: Array<{
      __typename: 'SerialEvent';
      serial: string;
      ts: string;
      type: string;
      meta?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListSerialsByStateQueryVariables = {
  state: SerialState;
  sku?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListSerialsByStateQuery = {
  listSerialsByState?: {
    __typename: 'SerialMasterConnection';
    items: Array<{
      __typename: 'SerialMaster';
      serial: string;
      orgID: string;
      sku: string;
      state: SerialState;
      plantID?: string | null;
      loggerID?: string | null;
      tractorVIN?: string | null;
      lastTicketID?: string | null;
      costPaise?: number | null;
      warrantyTill?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListSerialsByPlantQueryVariables = {
  plantID: string;
  state?: SerialState | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListSerialsByPlantQuery = {
  listSerialsByPlant?: {
    __typename: 'SerialMasterConnection';
    items: Array<{
      __typename: 'SerialMaster';
      serial: string;
      orgID: string;
      sku: string;
      state: SerialState;
      plantID?: string | null;
      loggerID?: string | null;
      tractorVIN?: string | null;
      lastTicketID?: string | null;
      costPaise?: number | null;
      warrantyTill?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListSerialsByTractorQueryVariables = {
  loggerID: string;
  state?: SerialState | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListSerialsByTractorQuery = {
  listSerialsByTractor?: {
    __typename: 'SerialMasterConnection';
    items: Array<{
      __typename: 'SerialMaster';
      serial: string;
      orgID: string;
      sku: string;
      state: SerialState;
      plantID?: string | null;
      loggerID?: string | null;
      tractorVIN?: string | null;
      lastTicketID?: string | null;
      costPaise?: number | null;
      warrantyTill?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListGoodsReceiptsQueryVariables = {
  plantID: string;
  from?: string | null;
  to?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListGoodsReceiptsQuery = {
  listGoodsReceipts?: {
    __typename: 'GoodsReceiptConnection';
    items: Array<{
      __typename: 'GoodsReceipt';
      receiptID: string;
      orgID: string;
      plantID: string;
      supplier?: string | null;
      billURL?: string | null;
      items: Array<{
        __typename: 'ReceiptLine';
        sku: string;
        qty: number;
        serials?: Array<string> | null;
        landedCostPaise?: number | null;
      }>;
      createdAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListReservationsByPlantQueryVariables = {
  plantID: string;
  status?: ReservationStatus | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListReservationsByPlantQuery = {
  listReservationsByPlant?: {
    __typename: 'ReservationConnection';
    items: Array<{
      __typename: 'Reservation';
      resID: string;
      orgID: string;
      ticketID: string;
      plantID: string;
      sku: string;
      qty: number;
      serials?: Array<string> | null;
      status: ReservationStatus;
      expiresAt?: string | null;
      createdAt: string;
      updatedAt: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      pickedBy?: string | null;
      pickedAt?: string | null;
      verifiedBy?: string | null;
      verifiedAt?: string | null;
      deliveredBy?: string | null;
      deliveredAt?: string | null;
      cancelledBy?: string | null;
      cancelledAt?: string | null;
      notes?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListReservationsByTicketQueryVariables = {
  ticketID: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListReservationsByTicketQuery = {
  listReservationsByTicket?: {
    __typename: 'ReservationConnection';
    items: Array<{
      __typename: 'Reservation';
      resID: string;
      orgID: string;
      ticketID: string;
      plantID: string;
      sku: string;
      qty: number;
      serials?: Array<string> | null;
      status: ReservationStatus;
      expiresAt?: string | null;
      createdAt: string;
      updatedAt: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      pickedBy?: string | null;
      pickedAt?: string | null;
      verifiedBy?: string | null;
      verifiedAt?: string | null;
      deliveredBy?: string | null;
      deliveredAt?: string | null;
      cancelledBy?: string | null;
      cancelledAt?: string | null;
      notes?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListGoodsIssuesByTicketQueryVariables = {
  ticketID: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListGoodsIssuesByTicketQuery = {
  listGoodsIssuesByTicket?: {
    __typename: 'GoodsIssueConnection';
    items: Array<{
      __typename: 'GoodsIssue';
      issueID: string;
      orgID: string;
      ticketID: string;
      plantID: string;
      items: Array<{
        __typename: 'IssueLine';
        sku: string;
        qty: number;
        serials?: Array<string> | null;
      }>;
      transportDocURL?: string | null;
      createdAt: string;
      verifiedAt?: string | null;
      verifiedBy?: string | null;
      deliveredAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListTransfersBySourceQueryVariables = {
  srcPlantID: string;
  from?: string | null;
  to?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListTransfersBySourceQuery = {
  listTransfersBySource?: {
    __typename: 'TransferOrderConnection';
    items: Array<{
      __typename: 'TransferOrder';
      transferID: string;
      orgID: string;
      srcPlantID: string;
      dstPlantID: string;
      status: TransferStatus;
      items: Array<{
        __typename: 'TransferLine';
        sku: string;
        qty: number;
        serials?: Array<string> | null;
      }>;
      createdAt: string;
      dispatchedAt?: string | null;
      receivedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListTransfersByDestQueryVariables = {
  dstPlantID: string;
  from?: string | null;
  to?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListTransfersByDestQuery = {
  listTransfersByDest?: {
    __typename: 'TransferOrderConnection';
    items: Array<{
      __typename: 'TransferOrder';
      transferID: string;
      orgID: string;
      srcPlantID: string;
      dstPlantID: string;
      status: TransferStatus;
      items: Array<{
        __typename: 'TransferLine';
        sku: string;
        qty: number;
        serials?: Array<string> | null;
      }>;
      createdAt: string;
      dispatchedAt?: string | null;
      receivedAt?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetWarrantyClaimQueryVariables = {
  claimID: string;
};

export type GetWarrantyClaimQuery = {
  getWarrantyClaim?: {
    __typename: 'WarrantyClaim';
    claimID: string;
    orgID: string;
    partID: string;
    serial?: string | null;
    ticketID: string;
    reason?: string | null;
    status: WarrantyStatus;
    vendorRMA?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListWarrantyByPartQueryVariables = {
  partID: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListWarrantyByPartQuery = {
  listWarrantyByPart?: {
    __typename: 'WarrantyClaimConnection';
    items: Array<{
      __typename: 'WarrantyClaim';
      claimID: string;
      orgID: string;
      partID: string;
      serial?: string | null;
      ticketID: string;
      reason?: string | null;
      status: WarrantyStatus;
      vendorRMA?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetInventoryAnalyticsByPlantQueryVariables = {
  plantID: string;
  period: InventoryPeriodType;
  key: string;
};

export type GetInventoryAnalyticsByPlantQuery = {
  getInventoryAnalyticsByPlant?: {
    __typename: 'InventoryAnalytics';
    orgID: string;
    plantID?: string | null;
    period: InventoryPeriodType;
    key: string;
    receiptsQty: number;
    issuesQty: number;
    transfersIn: number;
    transfersOut: number;
    stockoutHours?: number | null;
    fillRate?: number | null;
    leadTimeApproveToDispatchSec?: number | null;
    leadTimeDispatchToDeliverSec?: number | null;
    shrinkageQty?: number | null;
    warrantyReturnRate?: number | null;
    partsCostPaise?: number | null;
    transportCostPaise?: number | null;
    updatedAt: string;
  } | null;
};

export type ListInventoryAnalyticsByPlantQueryVariables = {
  plantID: string;
  period: InventoryPeriodType;
  fromKey?: string | null;
  toKey?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListInventoryAnalyticsByPlantQuery = {
  listInventoryAnalyticsByPlant?: {
    __typename: 'InventoryAnalyticsConnection';
    items: Array<{
      __typename: 'InventoryAnalytics';
      orgID: string;
      plantID?: string | null;
      period: InventoryPeriodType;
      key: string;
      receiptsQty: number;
      issuesQty: number;
      transfersIn: number;
      transfersOut: number;
      stockoutHours?: number | null;
      fillRate?: number | null;
      leadTimeApproveToDispatchSec?: number | null;
      leadTimeDispatchToDeliverSec?: number | null;
      shrinkageQty?: number | null;
      warrantyReturnRate?: number | null;
      partsCostPaise?: number | null;
      transportCostPaise?: number | null;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListEntityMediaQueryVariables = {
  input: ListEntityMediaInput;
};

export type ListEntityMediaQuery = {
  listEntityMedia: Array<{
    __typename: 'Media';
    key: string;
    kind: string;
    contentType: string;
    sizeBytes: number;
    createdAt: string;
    variants: Array<string>;
    uploaderID?: string | null;
    vin?: string | null;
    documentID?: string | null;
    title?: string | null;
    description?: string | null;
    docType?: string | null;
    files?: Array<string> | null;
    tags?: Array<string> | null;
    uploadedBy?: string | null;
    uploadedAt?: string | null;
    updatedAt?: string | null;
  }>;
};

export type GetLogBookEntryQueryVariables = {
  orgID: string;
  plantID: string;
  logDate: string;
};

export type GetLogBookEntryQuery = {
  getLogBookEntry?: {
    __typename: 'LogBookEntry';
    orgID: string;
    plantID: string;
    logDate: string;
    files: Array<{
      __typename: 'LogBookFile';
      key: string;
      fileName?: string | null;
      contentType?: string | null;
      sizeBytes?: number | null;
    }>;
    notes?: string | null;
    createdAt: string;
    createdBy: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
  } | null;
};

export type ListLogBookEntriesByPlantQueryVariables = {
  orgID: string;
  plantID: string;
  fromDate?: string | null;
  toDate?: string | null;
  limit?: number | null;
  nextToken?: string | null;
  sortOrder?: SortOrder | null;
};

export type ListLogBookEntriesByPlantQuery = {
  listLogBookEntriesByPlant?: {
    __typename: 'LogBookEntryConnection';
    items: Array<{
      __typename: 'LogBookEntry';
      orgID: string;
      plantID: string;
      logDate: string;
      files: Array<{
        __typename: 'LogBookFile';
        key: string;
        fileName?: string | null;
        contentType?: string | null;
        sizeBytes?: number | null;
      }>;
      notes?: string | null;
      createdAt: string;
      createdBy: string;
      updatedAt?: string | null;
      updatedBy?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListLogBookEntriesByOrgQueryVariables = {
  orgID: string;
  fromDate?: string | null;
  toDate?: string | null;
  limit?: number | null;
  nextToken?: string | null;
  sortOrder?: SortOrder | null;
};

export type ListLogBookEntriesByOrgQuery = {
  listLogBookEntriesByOrg?: {
    __typename: 'LogBookEntryConnection';
    items: Array<{
      __typename: 'LogBookEntry';
      orgID: string;
      plantID: string;
      logDate: string;
      files: Array<{
        __typename: 'LogBookFile';
        key: string;
        fileName?: string | null;
        contentType?: string | null;
        sizeBytes?: number | null;
      }>;
      notes?: string | null;
      createdAt: string;
      createdBy: string;
      updatedAt?: string | null;
      updatedBy?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetEmployeeAttendanceDayQueryVariables = {
  userID: string;
  date: string;
};

export type GetEmployeeAttendanceDayQuery = {
  getEmployeeAttendanceDay?: {
    __typename: 'EmployeeAttendanceDay';
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    date: string;
    status: EmployeeAttendanceStatus;
    checkInAt?: string | null;
    checkOutAt?: string | null;
    punchCount: number;
    lastPunchType?: PunchType | null;
    lastPunchAt?: string | null;
    notes?: string | null;
    markedByUserID?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListEmployeeAttendanceByUserQueryVariables = {
  userID: string;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListEmployeeAttendanceByUserQuery = {
  listEmployeeAttendanceByUser?: {
    __typename: 'EmployeeAttendanceDayConnection';
    items: Array<{
      __typename: 'EmployeeAttendanceDay';
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      date: string;
      status: EmployeeAttendanceStatus;
      checkInAt?: string | null;
      checkOutAt?: string | null;
      punchCount: number;
      lastPunchType?: PunchType | null;
      lastPunchAt?: string | null;
      notes?: string | null;
      markedByUserID?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListEmployeeAttendanceByDateQueryVariables = {
  date: string;
  nextToken?: string | null;
};

export type ListEmployeeAttendanceByDateQuery = {
  listEmployeeAttendanceByDate?: {
    __typename: 'EmployeeAttendanceDayConnection';
    items: Array<{
      __typename: 'EmployeeAttendanceDay';
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      date: string;
      status: EmployeeAttendanceStatus;
      checkInAt?: string | null;
      checkOutAt?: string | null;
      punchCount: number;
      lastPunchType?: PunchType | null;
      lastPunchAt?: string | null;
      notes?: string | null;
      markedByUserID?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListEmployeePunchesByUserDayQueryVariables = {
  userID: string;
  date: string;
  nextToken?: string | null;
};

export type ListEmployeePunchesByUserDayQuery = {
  listEmployeePunchesByUserDay?: {
    __typename: 'EmployeePunchConnection';
    items: Array<{
      __typename: 'EmployeePunch';
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      date: string;
      type: PunchType;
      ts: string;
      source: PunchSource;
      method?: string | null;
      location?: string | null;
      markedByUserID?: string | null;
      notes?: string | null;
      createdAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListEmployeePunchesByDateQueryVariables = {
  date: string;
  nextToken?: string | null;
};

export type ListEmployeePunchesByDateQuery = {
  listEmployeePunchesByDate?: {
    __typename: 'EmployeePunchConnection';
    items: Array<{
      __typename: 'EmployeePunch';
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      date: string;
      type: PunchType;
      ts: string;
      source: PunchSource;
      method?: string | null;
      location?: string | null;
      markedByUserID?: string | null;
      notes?: string | null;
      createdAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetFaceRegistrationQueryVariables = {
  userID: string;
};

export type GetFaceRegistrationQuery = {
  getFaceRegistration?: {
    __typename: 'FaceRegistration';
    userID: string;
    faceId: string;
    s3Key: string;
    officeID: string;
    orgID: string;
    registeredAt: string;
    updatedAt: string;
  } | null;
};

export type GetAttendanceRegularizationRequestQueryVariables = {
  requestID: string;
};

export type GetAttendanceRegularizationRequestQuery = {
  getAttendanceRegularizationRequest?: {
    __typename: 'AttendanceRegularizationRequest';
    requestID: string;
    userID: string;
    userEmail?: string | null;
    orgID: string;
    plantID: string;
    date: string;
    currentStatus: EmployeeAttendanceStatus;
    requestedStatus: EmployeeAttendanceStatus;
    reason: AttendanceRegularizationReason;
    description: string;
    attachments?: Array<string> | null;
    status: AttendanceRegularizationStatus;
    submittedAt: string;
    submittedBy: string;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    reviewComments?: string | null;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListAttendanceRegularizationsByUserQueryVariables = {
  userID: string;
  status?: AttendanceRegularizationStatus | null;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListAttendanceRegularizationsByUserQuery = {
  listAttendanceRegularizationsByUser?: {
    __typename: 'AttendanceRegularizationConnection';
    items: Array<{
      __typename: 'AttendanceRegularizationRequest';
      requestID: string;
      userID: string;
      userEmail?: string | null;
      orgID: string;
      plantID: string;
      date: string;
      currentStatus: EmployeeAttendanceStatus;
      requestedStatus: EmployeeAttendanceStatus;
      reason: AttendanceRegularizationReason;
      description: string;
      attachments?: Array<string> | null;
      status: AttendanceRegularizationStatus;
      submittedAt: string;
      submittedBy: string;
      reviewedBy?: string | null;
      reviewedAt?: string | null;
      reviewComments?: string | null;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListAttendanceRegularizationsQueryVariables = {
  status?: AttendanceRegularizationStatus | null;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListAttendanceRegularizationsQuery = {
  listAttendanceRegularizations?: {
    __typename: 'AttendanceRegularizationConnection';
    items: Array<{
      __typename: 'AttendanceRegularizationRequest';
      requestID: string;
      userID: string;
      userEmail?: string | null;
      orgID: string;
      plantID: string;
      date: string;
      currentStatus: EmployeeAttendanceStatus;
      requestedStatus: EmployeeAttendanceStatus;
      reason: AttendanceRegularizationReason;
      description: string;
      attachments?: Array<string> | null;
      status: AttendanceRegularizationStatus;
      submittedAt: string;
      submittedBy: string;
      reviewedBy?: string | null;
      reviewedAt?: string | null;
      reviewComments?: string | null;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListAttendanceRegularizationsByApproverQueryVariables = {
  approverID: string;
  status?: AttendanceRegularizationStatus | null;
  nextToken?: string | null;
};

export type ListAttendanceRegularizationsByApproverQuery = {
  listAttendanceRegularizationsByApprover?: {
    __typename: 'AttendanceRegularizationConnection';
    items: Array<{
      __typename: 'AttendanceRegularizationRequest';
      requestID: string;
      userID: string;
      userEmail?: string | null;
      orgID: string;
      plantID: string;
      date: string;
      currentStatus: EmployeeAttendanceStatus;
      requestedStatus: EmployeeAttendanceStatus;
      reason: AttendanceRegularizationReason;
      description: string;
      attachments?: Array<string> | null;
      status: AttendanceRegularizationStatus;
      submittedAt: string;
      submittedBy: string;
      reviewedBy?: string | null;
      reviewedAt?: string | null;
      reviewComments?: string | null;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListAttendanceRegularizationsByStatusQueryVariables = {
  status: AttendanceRegularizationStatus;
  plantID?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListAttendanceRegularizationsByStatusQuery = {
  listAttendanceRegularizationsByStatus?: {
    __typename: 'AttendanceRegularizationConnection';
    items: Array<{
      __typename: 'AttendanceRegularizationRequest';
      requestID: string;
      userID: string;
      userEmail?: string | null;
      orgID: string;
      plantID: string;
      date: string;
      currentStatus: EmployeeAttendanceStatus;
      requestedStatus: EmployeeAttendanceStatus;
      reason: AttendanceRegularizationReason;
      description: string;
      attachments?: Array<string> | null;
      status: AttendanceRegularizationStatus;
      submittedAt: string;
      submittedBy: string;
      reviewedBy?: string | null;
      reviewedAt?: string | null;
      reviewComments?: string | null;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetOfficeLocationQueryVariables = {
  officeID: string;
};

export type GetOfficeLocationQuery = {
  getOfficeLocation?: {
    __typename: 'OfficeLocation';
    officeID: string;
    orgID: string;
    plantID?: string | null;
    name: string;
    officeType: OfficeType;
    address: {
      __typename: 'OfficeAddress';
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      coordinates?: {
        __typename: 'GPSCoordinates';
        latitude: number;
        longitude: number;
      } | null;
    };
    contactInfo?: {
      __typename: 'OfficeContactInfo';
      phone?: string | null;
      email?: string | null;
      managerName?: string | null;
      managerPhone?: string | null;
    } | null;
    geofenceRadius?: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListOfficeLocationsByOrgQueryVariables = {
  orgID: string;
  nextToken?: string | null;
};

export type ListOfficeLocationsByOrgQuery = {
  listOfficeLocationsByOrg?: {
    __typename: 'OfficeLocationConnection';
    items: Array<{
      __typename: 'OfficeLocation';
      officeID: string;
      orgID: string;
      plantID?: string | null;
      name: string;
      officeType: OfficeType;
      address: {
        __typename: 'OfficeAddress';
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        coordinates?: {
          __typename: 'GPSCoordinates';
          latitude: number;
          longitude: number;
        } | null;
      };
      contactInfo?: {
        __typename: 'OfficeContactInfo';
        phone?: string | null;
        email?: string | null;
        managerName?: string | null;
        managerPhone?: string | null;
      } | null;
      geofenceRadius?: number | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListOfficeLocationsByPlantQueryVariables = {
  plantID: string;
  nextToken?: string | null;
};

export type ListOfficeLocationsByPlantQuery = {
  listOfficeLocationsByPlant?: {
    __typename: 'OfficeLocationConnection';
    items: Array<{
      __typename: 'OfficeLocation';
      officeID: string;
      orgID: string;
      plantID?: string | null;
      name: string;
      officeType: OfficeType;
      address: {
        __typename: 'OfficeAddress';
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        coordinates?: {
          __typename: 'GPSCoordinates';
          latitude: number;
          longitude: number;
        } | null;
      };
      contactInfo?: {
        __typename: 'OfficeContactInfo';
        phone?: string | null;
        email?: string | null;
        managerName?: string | null;
        managerPhone?: string | null;
      } | null;
      geofenceRadius?: number | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListOfficeLocationsByTypeQueryVariables = {
  officeType: OfficeType;
  nextToken?: string | null;
};

export type ListOfficeLocationsByTypeQuery = {
  listOfficeLocationsByType?: {
    __typename: 'OfficeLocationConnection';
    items: Array<{
      __typename: 'OfficeLocation';
      officeID: string;
      orgID: string;
      plantID?: string | null;
      name: string;
      officeType: OfficeType;
      address: {
        __typename: 'OfficeAddress';
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        coordinates?: {
          __typename: 'GPSCoordinates';
          latitude: number;
          longitude: number;
        } | null;
      };
      contactInfo?: {
        __typename: 'OfficeContactInfo';
        phone?: string | null;
        email?: string | null;
        managerName?: string | null;
        managerPhone?: string | null;
      } | null;
      geofenceRadius?: number | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListActiveOfficesByOrgQueryVariables = {
  orgID: string;
  nextToken?: string | null;
};

export type ListActiveOfficesByOrgQuery = {
  listActiveOfficesByOrg?: {
    __typename: 'OfficeLocationConnection';
    items: Array<{
      __typename: 'OfficeLocation';
      officeID: string;
      orgID: string;
      plantID?: string | null;
      name: string;
      officeType: OfficeType;
      address: {
        __typename: 'OfficeAddress';
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        coordinates?: {
          __typename: 'GPSCoordinates';
          latitude: number;
          longitude: number;
        } | null;
      };
      contactInfo?: {
        __typename: 'OfficeContactInfo';
        phone?: string | null;
        email?: string | null;
        managerName?: string | null;
        managerPhone?: string | null;
      } | null;
      geofenceRadius?: number | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListActiveOfficesByPlantQueryVariables = {
  plantID: string;
  nextToken?: string | null;
};

export type ListActiveOfficesByPlantQuery = {
  listActiveOfficesByPlant?: {
    __typename: 'OfficeLocationConnection';
    items: Array<{
      __typename: 'OfficeLocation';
      officeID: string;
      orgID: string;
      plantID?: string | null;
      name: string;
      officeType: OfficeType;
      address: {
        __typename: 'OfficeAddress';
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        coordinates?: {
          __typename: 'GPSCoordinates';
          latitude: number;
          longitude: number;
        } | null;
      };
      contactInfo?: {
        __typename: 'OfficeContactInfo';
        phone?: string | null;
        email?: string | null;
        managerName?: string | null;
        managerPhone?: string | null;
      } | null;
      geofenceRadius?: number | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetMyPayslipQueryVariables = {
  year: number;
  month: number;
};

export type GetMyPayslipQuery = {
  getMyPayslip?: {
    __typename: 'Payslip';
    payslipID: string;
    userID: string;
    year: number;
    month: number;
    officeID: string;
    orgID: string;
    status: PayslipStatus;
    basicSalary: number;
    allowances?: {
      __typename: 'PayslipAllowances';
      hra?: number | null;
      transport?: number | null;
      medical?: number | null;
      bonus?: number | null;
      overtime?: number | null;
      other?: number | null;
      total: number;
    } | null;
    deductions?: {
      __typename: 'PayslipDeductions';
      pf?: number | null;
      esi?: number | null;
      tax?: number | null;
      loan?: number | null;
      advance?: number | null;
      other?: number | null;
      total: number;
    } | null;
    grossSalary: number;
    netSalary: number;
    payPeriodStart: string;
    payPeriodEnd: string;
    generatedDate: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    paidAt?: string | null;
    documents?: Array<{
      __typename: 'PayslipDocument';
      documentID: string;
      type: PayslipDocumentType;
      fileName: string;
      fileSize: number;
      s3Key?: string | null;
      uploadedAt: string;
      uploadedBy: string;
    }> | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListMyPayslipsQueryVariables = {
  year?: number | null;
  nextToken?: string | null;
};

export type ListMyPayslipsQuery = {
  listMyPayslips?: {
    __typename: 'PayslipConnection';
    items: Array<{
      __typename: 'Payslip';
      payslipID: string;
      userID: string;
      year: number;
      month: number;
      officeID: string;
      orgID: string;
      status: PayslipStatus;
      basicSalary: number;
      allowances?: {
        __typename: 'PayslipAllowances';
        hra?: number | null;
        transport?: number | null;
        medical?: number | null;
        bonus?: number | null;
        overtime?: number | null;
        other?: number | null;
        total: number;
      } | null;
      deductions?: {
        __typename: 'PayslipDeductions';
        pf?: number | null;
        esi?: number | null;
        tax?: number | null;
        loan?: number | null;
        advance?: number | null;
        other?: number | null;
        total: number;
      } | null;
      grossSalary: number;
      netSalary: number;
      payPeriodStart: string;
      payPeriodEnd: string;
      generatedDate: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      paidAt?: string | null;
      documents?: Array<{
        __typename: 'PayslipDocument';
        documentID: string;
        type: PayslipDocumentType;
        fileName: string;
        fileSize: number;
        s3Key?: string | null;
        uploadedAt: string;
        uploadedBy: string;
      }> | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListPayslipsByOfficeQueryVariables = {
  officeID: string;
  year?: number | null;
  month?: number | null;
  nextToken?: string | null;
};

export type ListPayslipsByOfficeQuery = {
  listPayslipsByOffice?: {
    __typename: 'PayslipConnection';
    items: Array<{
      __typename: 'Payslip';
      payslipID: string;
      userID: string;
      year: number;
      month: number;
      officeID: string;
      orgID: string;
      status: PayslipStatus;
      basicSalary: number;
      allowances?: {
        __typename: 'PayslipAllowances';
        hra?: number | null;
        transport?: number | null;
        medical?: number | null;
        bonus?: number | null;
        overtime?: number | null;
        other?: number | null;
        total: number;
      } | null;
      deductions?: {
        __typename: 'PayslipDeductions';
        pf?: number | null;
        esi?: number | null;
        tax?: number | null;
        loan?: number | null;
        advance?: number | null;
        other?: number | null;
        total: number;
      } | null;
      grossSalary: number;
      netSalary: number;
      payPeriodStart: string;
      payPeriodEnd: string;
      generatedDate: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      paidAt?: string | null;
      documents?: Array<{
        __typename: 'PayslipDocument';
        documentID: string;
        type: PayslipDocumentType;
        fileName: string;
        fileSize: number;
        s3Key?: string | null;
        uploadedAt: string;
        uploadedBy: string;
      }> | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListPayslipsByOrgQueryVariables = {
  orgID: string;
  year?: number | null;
  month?: number | null;
  nextToken?: string | null;
};

export type ListPayslipsByOrgQuery = {
  listPayslipsByOrg?: {
    __typename: 'PayslipConnection';
    items: Array<{
      __typename: 'Payslip';
      payslipID: string;
      userID: string;
      year: number;
      month: number;
      officeID: string;
      orgID: string;
      status: PayslipStatus;
      basicSalary: number;
      allowances?: {
        __typename: 'PayslipAllowances';
        hra?: number | null;
        transport?: number | null;
        medical?: number | null;
        bonus?: number | null;
        overtime?: number | null;
        other?: number | null;
        total: number;
      } | null;
      deductions?: {
        __typename: 'PayslipDeductions';
        pf?: number | null;
        esi?: number | null;
        tax?: number | null;
        loan?: number | null;
        advance?: number | null;
        other?: number | null;
        total: number;
      } | null;
      grossSalary: number;
      netSalary: number;
      payPeriodStart: string;
      payPeriodEnd: string;
      generatedDate: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      paidAt?: string | null;
      documents?: Array<{
        __typename: 'PayslipDocument';
        documentID: string;
        type: PayslipDocumentType;
        fileName: string;
        fileSize: number;
        s3Key?: string | null;
        uploadedAt: string;
        uploadedBy: string;
      }> | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListPayslipsByStatusQueryVariables = {
  status: PayslipStatus;
  year?: number | null;
  month?: number | null;
  nextToken?: string | null;
};

export type ListPayslipsByStatusQuery = {
  listPayslipsByStatus?: {
    __typename: 'PayslipConnection';
    items: Array<{
      __typename: 'Payslip';
      payslipID: string;
      userID: string;
      year: number;
      month: number;
      officeID: string;
      orgID: string;
      status: PayslipStatus;
      basicSalary: number;
      allowances?: {
        __typename: 'PayslipAllowances';
        hra?: number | null;
        transport?: number | null;
        medical?: number | null;
        bonus?: number | null;
        overtime?: number | null;
        other?: number | null;
        total: number;
      } | null;
      deductions?: {
        __typename: 'PayslipDeductions';
        pf?: number | null;
        esi?: number | null;
        tax?: number | null;
        loan?: number | null;
        advance?: number | null;
        other?: number | null;
        total: number;
      } | null;
      grossSalary: number;
      netSalary: number;
      payPeriodStart: string;
      payPeriodEnd: string;
      generatedDate: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      paidAt?: string | null;
      documents?: Array<{
        __typename: 'PayslipDocument';
        documentID: string;
        type: PayslipDocumentType;
        fileName: string;
        fileSize: number;
        s3Key?: string | null;
        uploadedAt: string;
        uploadedBy: string;
      }> | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetUserPayslipQueryVariables = {
  userID: string;
  year: number;
  month: number;
};

export type GetUserPayslipQuery = {
  getUserPayslip?: {
    __typename: 'Payslip';
    payslipID: string;
    userID: string;
    year: number;
    month: number;
    officeID: string;
    orgID: string;
    status: PayslipStatus;
    basicSalary: number;
    allowances?: {
      __typename: 'PayslipAllowances';
      hra?: number | null;
      transport?: number | null;
      medical?: number | null;
      bonus?: number | null;
      overtime?: number | null;
      other?: number | null;
      total: number;
    } | null;
    deductions?: {
      __typename: 'PayslipDeductions';
      pf?: number | null;
      esi?: number | null;
      tax?: number | null;
      loan?: number | null;
      advance?: number | null;
      other?: number | null;
      total: number;
    } | null;
    grossSalary: number;
    netSalary: number;
    payPeriodStart: string;
    payPeriodEnd: string;
    generatedDate: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    paidAt?: string | null;
    documents?: Array<{
      __typename: 'PayslipDocument';
      documentID: string;
      type: PayslipDocumentType;
      fileName: string;
      fileSize: number;
      s3Key?: string | null;
      uploadedAt: string;
      uploadedBy: string;
    }> | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type GetOfficeCalendarQueryVariables = {
  officeID: string;
  date: string;
};

export type GetOfficeCalendarQuery = {
  getOfficeCalendar?: {
    __typename: 'OfficeCalendar';
    officeID: string;
    date: string;
    dayType: DayType;
    isWorkingDay: boolean;
    holidayName?: string | null;
    description?: string | null;
    workingHours?: {
      __typename: 'DayWorkingHours';
      startTime: string;
      endTime: string;
      breakStartTime?: string | null;
      breakEndTime?: string | null;
      totalHours: number;
    } | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  } | null;
};

export type ListOfficeCalendarByMonthQueryVariables = {
  officeID: string;
  year: number;
  month: number;
  nextToken?: string | null;
};

export type ListOfficeCalendarByMonthQuery = {
  listOfficeCalendarByMonth?: {
    __typename: 'OfficeCalendarConnection';
    items: Array<{
      __typename: 'OfficeCalendar';
      officeID: string;
      date: string;
      dayType: DayType;
      isWorkingDay: boolean;
      holidayName?: string | null;
      description?: string | null;
      workingHours?: {
        __typename: 'DayWorkingHours';
        startTime: string;
        endTime: string;
        breakStartTime?: string | null;
        breakEndTime?: string | null;
        totalHours: number;
      } | null;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListOfficeCalendarByDateRangeQueryVariables = {
  officeID: string;
  startDate: string;
  endDate: string;
  nextToken?: string | null;
};

export type ListOfficeCalendarByDateRangeQuery = {
  listOfficeCalendarByDateRange?: {
    __typename: 'OfficeCalendarConnection';
    items: Array<{
      __typename: 'OfficeCalendar';
      officeID: string;
      date: string;
      dayType: DayType;
      isWorkingDay: boolean;
      holidayName?: string | null;
      description?: string | null;
      workingHours?: {
        __typename: 'DayWorkingHours';
        startTime: string;
        endTime: string;
        breakStartTime?: string | null;
        breakEndTime?: string | null;
        totalHours: number;
      } | null;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListHolidaysByOfficeQueryVariables = {
  officeID: string;
  year: number;
  nextToken?: string | null;
};

export type ListHolidaysByOfficeQuery = {
  listHolidaysByOffice?: {
    __typename: 'OfficeCalendarConnection';
    items: Array<{
      __typename: 'OfficeCalendar';
      officeID: string;
      date: string;
      dayType: DayType;
      isWorkingDay: boolean;
      holidayName?: string | null;
      description?: string | null;
      workingHours?: {
        __typename: 'DayWorkingHours';
        startTime: string;
        endTime: string;
        breakStartTime?: string | null;
        breakEndTime?: string | null;
        totalHours: number;
      } | null;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetReimbursementClaimQueryVariables = {
  claimID: string;
};

export type GetReimbursementClaimQuery = {
  getReimbursementClaim?: {
    __typename: 'RaiseReimbursement';
    claimID: string;
    userID: string;
    plantID: string;
    orgID: string;
    claimType: ReimbursementClaimType;
    amount: number;
    currency: string;
    description: string;
    category: ReimbursementCategory;
    expenseDate: string;
    status: ReimbursementStatus;
    paymentMethod: PaymentMethod;
    bankDetails?: {
      __typename: 'BankDetails';
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
      branchName?: string | null;
    } | null;
    upiDetails?: {
      __typename: 'UPIDetails';
      upiID: string;
      upiName: string;
    } | null;
    proofDocuments: Array<{
      __typename: 'ReimbursementDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      uploadedAt: string;
      s3Key: string;
      s3Bucket: string;
    }>;
    submittedAt: string;
    submittedBy: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    processedBy?: string | null;
    processedAt?: string | null;
    paidAt?: string | null;
    transactionID?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListReimbursementClaimsByUserQueryVariables = {
  userID: string;
  status?: ReimbursementStatus | null;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListReimbursementClaimsByUserQuery = {
  listReimbursementClaimsByUser?: {
    __typename: 'ReimbursementConnection';
    items: Array<{
      __typename: 'RaiseReimbursement';
      claimID: string;
      userID: string;
      plantID: string;
      orgID: string;
      claimType: ReimbursementClaimType;
      amount: number;
      currency: string;
      description: string;
      category: ReimbursementCategory;
      expenseDate: string;
      status: ReimbursementStatus;
      paymentMethod: PaymentMethod;
      bankDetails?: {
        __typename: 'BankDetails';
        accountHolderName: string;
        accountNumber: string;
        ifscCode: string;
        bankName: string;
        branchName?: string | null;
      } | null;
      upiDetails?: {
        __typename: 'UPIDetails';
        upiID: string;
        upiName: string;
      } | null;
      proofDocuments: Array<{
        __typename: 'ReimbursementDocument';
        documentID: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        documentType: DocumentType;
        uploadedAt: string;
        s3Key: string;
        s3Bucket: string;
      }>;
      submittedAt: string;
      submittedBy: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      processedBy?: string | null;
      processedAt?: string | null;
      paidAt?: string | null;
      transactionID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListReimbursementClaimsQueryVariables = {
  status?: ReimbursementStatus | null;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListReimbursementClaimsQuery = {
  listReimbursementClaims?: {
    __typename: 'ReimbursementConnection';
    items: Array<{
      __typename: 'RaiseReimbursement';
      claimID: string;
      userID: string;
      plantID: string;
      orgID: string;
      claimType: ReimbursementClaimType;
      amount: number;
      currency: string;
      description: string;
      category: ReimbursementCategory;
      expenseDate: string;
      status: ReimbursementStatus;
      paymentMethod: PaymentMethod;
      bankDetails?: {
        __typename: 'BankDetails';
        accountHolderName: string;
        accountNumber: string;
        ifscCode: string;
        bankName: string;
        branchName?: string | null;
      } | null;
      upiDetails?: {
        __typename: 'UPIDetails';
        upiID: string;
        upiName: string;
      } | null;
      proofDocuments: Array<{
        __typename: 'ReimbursementDocument';
        documentID: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        documentType: DocumentType;
        uploadedAt: string;
        s3Key: string;
        s3Bucket: string;
      }>;
      submittedAt: string;
      submittedBy: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      processedBy?: string | null;
      processedAt?: string | null;
      paidAt?: string | null;
      transactionID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListReimbursementClaimsByApproverQueryVariables = {
  approverID: string;
  status?: ReimbursementStatus | null;
  nextToken?: string | null;
};

export type ListReimbursementClaimsByApproverQuery = {
  listReimbursementClaimsByApprover?: {
    __typename: 'ReimbursementConnection';
    items: Array<{
      __typename: 'RaiseReimbursement';
      claimID: string;
      userID: string;
      plantID: string;
      orgID: string;
      claimType: ReimbursementClaimType;
      amount: number;
      currency: string;
      description: string;
      category: ReimbursementCategory;
      expenseDate: string;
      status: ReimbursementStatus;
      paymentMethod: PaymentMethod;
      bankDetails?: {
        __typename: 'BankDetails';
        accountHolderName: string;
        accountNumber: string;
        ifscCode: string;
        bankName: string;
        branchName?: string | null;
      } | null;
      upiDetails?: {
        __typename: 'UPIDetails';
        upiID: string;
        upiName: string;
      } | null;
      proofDocuments: Array<{
        __typename: 'ReimbursementDocument';
        documentID: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        documentType: DocumentType;
        uploadedAt: string;
        s3Key: string;
        s3Bucket: string;
      }>;
      submittedAt: string;
      submittedBy: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      processedBy?: string | null;
      processedAt?: string | null;
      paidAt?: string | null;
      transactionID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListReimbursementClaimsByStatusQueryVariables = {
  status: ReimbursementStatus;
  plantID?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListReimbursementClaimsByStatusQuery = {
  listReimbursementClaimsByStatus?: {
    __typename: 'ReimbursementConnection';
    items: Array<{
      __typename: 'RaiseReimbursement';
      claimID: string;
      userID: string;
      plantID: string;
      orgID: string;
      claimType: ReimbursementClaimType;
      amount: number;
      currency: string;
      description: string;
      category: ReimbursementCategory;
      expenseDate: string;
      status: ReimbursementStatus;
      paymentMethod: PaymentMethod;
      bankDetails?: {
        __typename: 'BankDetails';
        accountHolderName: string;
        accountNumber: string;
        ifscCode: string;
        bankName: string;
        branchName?: string | null;
      } | null;
      upiDetails?: {
        __typename: 'UPIDetails';
        upiID: string;
        upiName: string;
      } | null;
      proofDocuments: Array<{
        __typename: 'ReimbursementDocument';
        documentID: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        documentType: DocumentType;
        uploadedAt: string;
        s3Key: string;
        s3Bucket: string;
      }>;
      submittedAt: string;
      submittedBy: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      processedBy?: string | null;
      processedAt?: string | null;
      paidAt?: string | null;
      transactionID?: string | null;
      notes?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetLeavePolicyQueryVariables = {
  orgID: string;
  leaveType: LeaveType;
};

export type GetLeavePolicyQuery = {
  getLeavePolicy?: {
    __typename: 'LeavePolicy';
    policyID: string;
    orgID: string;
    plantID?: string | null;
    leaveType: LeaveType;
    totalDaysPerYear: number;
    eligibleGenders: Array<Gender>;
    eligibleRoles: Array<string>;
    carryForwardAllowed: boolean;
    maxCarryForwardDays?: number | null;
    minServiceMonths?: number | null;
    maxConsecutiveDays?: number | null;
    requiresApproval: boolean;
    approvalLevels: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListLeavePoliciesByOrgQueryVariables = {
  orgID: string;
  nextToken?: string | null;
};

export type ListLeavePoliciesByOrgQuery = {
  listLeavePoliciesByOrg?: {
    __typename: 'LeavePolicyConnection';
    items: Array<{
      __typename: 'LeavePolicy';
      policyID: string;
      orgID: string;
      plantID?: string | null;
      leaveType: LeaveType;
      totalDaysPerYear: number;
      eligibleGenders: Array<Gender>;
      eligibleRoles: Array<string>;
      carryForwardAllowed: boolean;
      maxCarryForwardDays?: number | null;
      minServiceMonths?: number | null;
      maxConsecutiveDays?: number | null;
      requiresApproval: boolean;
      approvalLevels: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetUserLeaveBalanceQueryVariables = {
  userID: string;
  year: number;
  leaveType: LeaveType;
};

export type GetUserLeaveBalanceQuery = {
  getUserLeaveBalance?: {
    __typename: 'LeaveBalance';
    balanceID: string;
    userID: string;
    year: number;
    leaveType: LeaveType;
    totalAllocated: number;
    used: number;
    pending: number;
    available: number;
    carryForward: number;
    lastUpdated: string;
  } | null;
};

export type ListUserLeaveBalancesQueryVariables = {
  userID: string;
  year: number;
  nextToken?: string | null;
};

export type ListUserLeaveBalancesQuery = {
  listUserLeaveBalances?: {
    __typename: 'LeaveBalanceConnection';
    items: Array<{
      __typename: 'LeaveBalance';
      balanceID: string;
      userID: string;
      year: number;
      leaveType: LeaveType;
      totalAllocated: number;
      used: number;
      pending: number;
      available: number;
      carryForward: number;
      lastUpdated: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListLeaveBalancesQueryVariables = {
  year: number;
  leaveType?: LeaveType | null;
  nextToken?: string | null;
};

export type ListLeaveBalancesQuery = {
  listLeaveBalances?: {
    __typename: 'LeaveBalanceConnection';
    items: Array<{
      __typename: 'LeaveBalance';
      balanceID: string;
      userID: string;
      year: number;
      leaveType: LeaveType;
      totalAllocated: number;
      used: number;
      pending: number;
      available: number;
      carryForward: number;
      lastUpdated: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetLeaveApplicationQueryVariables = {
  applicationID: string;
};

export type GetLeaveApplicationQuery = {
  getLeaveApplication?: {
    __typename: 'LeaveApplication';
    applicationID: string;
    userID: string;
    orgID: string;
    plantID: string;
    officeID?: string | null;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    appliedAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    attachments?: Array<{
      __typename: 'LeaveAttachment';
      attachmentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      s3Key: string;
      uploadedAt: string;
    }> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListLeaveApplicationsByUserQueryVariables = {
  userID: string;
  status?: LeaveStatus | null;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListLeaveApplicationsByUserQuery = {
  listLeaveApplicationsByUser?: {
    __typename: 'LeaveApplicationConnection';
    items: Array<{
      __typename: 'LeaveApplication';
      applicationID: string;
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      leaveType: LeaveType;
      startDate: string;
      endDate: string;
      totalDays: number;
      reason: string;
      status: LeaveStatus;
      appliedAt: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      cancelledAt?: string | null;
      cancelledBy?: string | null;
      cancellationReason?: string | null;
      attachments?: Array<{
        __typename: 'LeaveAttachment';
        attachmentID: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        s3Key: string;
        uploadedAt: string;
      }> | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListLeaveApplicationsByApproverQueryVariables = {
  approverID: string;
  status?: LeaveStatus | null;
  nextToken?: string | null;
};

export type ListLeaveApplicationsByApproverQuery = {
  listLeaveApplicationsByApprover?: {
    __typename: 'LeaveApplicationConnection';
    items: Array<{
      __typename: 'LeaveApplication';
      applicationID: string;
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      leaveType: LeaveType;
      startDate: string;
      endDate: string;
      totalDays: number;
      reason: string;
      status: LeaveStatus;
      appliedAt: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      cancelledAt?: string | null;
      cancelledBy?: string | null;
      cancellationReason?: string | null;
      attachments?: Array<{
        __typename: 'LeaveAttachment';
        attachmentID: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        s3Key: string;
        uploadedAt: string;
      }> | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListLeaveApplicationsQueryVariables = {
  status?: LeaveStatus | null;
  month?: string | null;
  nextToken?: string | null;
};

export type ListLeaveApplicationsQuery = {
  listLeaveApplications?: {
    __typename: 'LeaveApplicationConnection';
    items: Array<{
      __typename: 'LeaveApplication';
      applicationID: string;
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      leaveType: LeaveType;
      startDate: string;
      endDate: string;
      totalDays: number;
      reason: string;
      status: LeaveStatus;
      appliedAt: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      cancelledAt?: string | null;
      cancelledBy?: string | null;
      cancellationReason?: string | null;
      attachments?: Array<{
        __typename: 'LeaveAttachment';
        attachmentID: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        s3Key: string;
        uploadedAt: string;
      }> | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListLeaveApplicationsByStatusQueryVariables = {
  status: LeaveStatus;
  startDate?: string | null;
  endDate?: string | null;
  nextToken?: string | null;
};

export type ListLeaveApplicationsByStatusQuery = {
  listLeaveApplicationsByStatus?: {
    __typename: 'LeaveApplicationConnection';
    items: Array<{
      __typename: 'LeaveApplication';
      applicationID: string;
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      leaveType: LeaveType;
      startDate: string;
      endDate: string;
      totalDays: number;
      reason: string;
      status: LeaveStatus;
      appliedAt: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      cancelledAt?: string | null;
      cancelledBy?: string | null;
      cancellationReason?: string | null;
      attachments?: Array<{
        __typename: 'LeaveAttachment';
        attachmentID: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        s3Key: string;
        uploadedAt: string;
      }> | null;
      createdAt: string;
      updatedAt: string;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetPlantLeaveCalendarQueryVariables = {
  plantID: string;
  startDate: string;
  endDate: string;
};

export type GetPlantLeaveCalendarQuery = {
  getPlantLeaveCalendar: Array<{
    __typename: 'LeaveCalendarEntry';
    date: string;
    userID: string;
    userName: string;
    leaveType: LeaveType;
    applicationID: string;
    status: LeaveStatus;
  }>;
};

export type GetUserLeaveCalendarQueryVariables = {
  userID: string;
  startDate: string;
  endDate: string;
};

export type GetUserLeaveCalendarQuery = {
  getUserLeaveCalendar: Array<{
    __typename: 'LeaveCalendarEntry';
    date: string;
    userID: string;
    userName: string;
    leaveType: LeaveType;
    applicationID: string;
    status: LeaveStatus;
  }>;
};

export type GetUnifiedAttendanceDataQueryVariables = {
  userID: string;
  startDate: string;
  endDate: string;
  officeID?: string | null;
};

export type GetUnifiedAttendanceDataQuery = {
  getUnifiedAttendanceData: {
    __typename: 'UnifiedAttendanceResponse';
    attendanceRecords: Array<{
      __typename: 'EmployeeAttendanceDay';
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      date: string;
      status: EmployeeAttendanceStatus;
      checkInAt?: string | null;
      checkOutAt?: string | null;
      punchCount: number;
      lastPunchType?: PunchType | null;
      lastPunchAt?: string | null;
      notes?: string | null;
      markedByUserID?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    punchRecords: Array<{
      __typename: 'EmployeePunch';
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      date: string;
      type: PunchType;
      ts: string;
      source: PunchSource;
      method?: string | null;
      location?: string | null;
      markedByUserID?: string | null;
      notes?: string | null;
      createdAt: string;
    }>;
    leaveApplications: Array<{
      __typename: 'LeaveApplication';
      applicationID: string;
      userID: string;
      orgID: string;
      plantID: string;
      officeID?: string | null;
      leaveType: LeaveType;
      startDate: string;
      endDate: string;
      totalDays: number;
      reason: string;
      status: LeaveStatus;
      appliedAt: string;
      approvedBy?: string | null;
      approvedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectionReason?: string | null;
      cancelledAt?: string | null;
      cancelledBy?: string | null;
      cancellationReason?: string | null;
      attachments?: Array<{
        __typename: 'LeaveAttachment';
        attachmentID: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        s3Key: string;
        uploadedAt: string;
      }> | null;
      createdAt: string;
      updatedAt: string;
    }>;
    officeCalendarDays: Array<{
      __typename: 'UnifiedOfficeCalendarDay';
      officeID: string;
      date: string;
      dayType: string;
      isWorkingDay: boolean;
      holidayName?: string | null;
      description?: string | null;
    }>;
    statistics: {
      __typename: 'AttendanceStatistics';
      totalDays: number;
      presentDays: number;
      absentDays: number;
      leaveDays: number;
      halfDays: number;
      holidayDays: number;
      lateDays: number;
      avgHoursPerDay?: number | null;
      totalHours?: number | null;
    };
  };
};

export type UniversalQueryQueryVariables = {
  tableName: string;
  filters?: Array<UniversalFilterInput> | null;
  limit?: number | null;
  nextToken?: string | null;
  sortOrder?: SortOrder | null;
};

export type UniversalQueryQuery = {
  universalQuery: {
    __typename: 'UniversalQueryResponse';
    success: boolean;
    message: string;
    data: Array<string>;
    tableName: string;
    count: number;
    nextToken?: string | null;
    timestamp: string;
  };
};

export type UniversalGroupQueryQueryVariables = {
  groupName?: string | null;
  includeUsers?: boolean | null;
  includeGroupDetails?: boolean | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type UniversalGroupQueryQuery = {
  universalGroupQuery: {
    __typename: 'UniversalGroupResponse';
    success: boolean;
    message: string;
    groups: Array<{
      __typename: 'CognitoGroup';
      groupName: string;
      description?: string | null;
      precedence?: number | null;
      roleArn?: string | null;
      userPoolId?: string | null;
      createdAt?: string | null;
      lastModifiedDate?: string | null;
    }>;
    users: Array<{
      __typename: 'CognitoUser';
      username: string;
      email?: string | null;
      name?: string | null;
      userType?: string | null;
      role?: string | null;
      status?: string | null;
      enabled: boolean;
      userCreateDate?: string | null;
      userLastModifiedDate?: string | null;
    }>;
    groupDetails?: string | null;
    timestamp: string;
  };
};

export type GetGenericDocumentQueryVariables = {
  documentID: string;
};

export type GetGenericDocumentQuery = {
  getGenericDocument: {
    __typename: 'GenericDocument';
    documentID: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    documentType: DocumentType;
    s3Key: string;
    s3Bucket: string;
    uploadedAt: string;
    uploadedBy: string;
    orgID: string;
    tags?: Array<string> | null;
    description?: string | null;
    isPublic: boolean;
    downloadCount: number;
    expiresAt?: string | null;
  };
};

export type ListGenericDocumentsQueryVariables = {
  orgID: string;
  documentType?: DocumentType | null;
  tags?: Array<string> | null;
  isPublic?: boolean | null;
  uploadedBy?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListGenericDocumentsQuery = {
  listGenericDocuments: {
    __typename: 'GenericDocumentConnection';
    items: Array<{
      __typename: 'GenericDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      s3Key: string;
      s3Bucket: string;
      uploadedAt: string;
      uploadedBy: string;
      orgID: string;
      tags?: Array<string> | null;
      description?: string | null;
      isPublic: boolean;
      downloadCount: number;
      expiresAt?: string | null;
    }>;
    nextToken?: string | null;
    totalCount: number;
  };
};

export type ListMyDocumentsQueryVariables = {
  documentType?: DocumentType | null;
  tags?: Array<string> | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListMyDocumentsQuery = {
  listMyDocuments: {
    __typename: 'GenericDocumentConnection';
    items: Array<{
      __typename: 'GenericDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      s3Key: string;
      s3Bucket: string;
      uploadedAt: string;
      uploadedBy: string;
      orgID: string;
      tags?: Array<string> | null;
      description?: string | null;
      isPublic: boolean;
      downloadCount: number;
      expiresAt?: string | null;
    }>;
    nextToken?: string | null;
    totalCount: number;
  };
};

export type SearchDocumentsQueryVariables = {
  orgID: string;
  searchText: string;
  documentType?: DocumentType | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type SearchDocumentsQuery = {
  searchDocuments: {
    __typename: 'GenericDocumentConnection';
    items: Array<{
      __typename: 'GenericDocument';
      documentID: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      documentType: DocumentType;
      s3Key: string;
      s3Bucket: string;
      uploadedAt: string;
      uploadedBy: string;
      orgID: string;
      tags?: Array<string> | null;
      description?: string | null;
      isPublic: boolean;
      downloadCount: number;
      expiresAt?: string | null;
    }>;
    nextToken?: string | null;
    totalCount: number;
  };
};

export type GetGenericDocumentDownloadUrlQueryVariables = {
  documentID: string;
};

export type GetGenericDocumentDownloadUrlQuery = {
  getGenericDocumentDownloadUrl: {
    __typename: 'DocumentDownloadUrl';
    downloadUrl: string;
    expiresIn: number;
    fileName: string;
    fileSize: number;
    mimeType: string;
  };
};

export type DeleteGenericDocumentQueryVariables = {
  documentID: string;
};

export type DeleteGenericDocumentQuery = {
  deleteGenericDocument: boolean;
};

export type GetERPItemQueryVariables = {
  pk: string;
  sk: string;
};

export type GetERPItemQuery = {
  getERPItem?: {
    __typename: 'ERPItem';
    PK: string;
    SK: string;
    entity_type?: string | null;
    data?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    partCode?: string | null;
    partName?: string | null;
    category?: string | null;
    uom?: string | null;
    perUnitTractor?: number | null;
    batchQty?: number | null;
    availableQtyHapur?: number | null;
    partsRequired?: number | null;
    machine?: {
      __typename: 'ERPPartMachineQuantities';
      X45H2?: number | null;
      X60C2L?: number | null;
      X45C4?: number | null;
      X60C2?: number | null;
      X60C4?: number | null;
    } | null;
    availableForTractor?: number | null;
    location?: string | null;
    availableQtyAmount?: number | null;
    suppliers?: Array<{
      __typename: 'ERPSupplierEntry';
      name: string;
      priority: number;
    }> | null;
    perTractorCost?: number | null;
    price?: number | null;
    priceWithGST?: number | null;
    gstRate?: number | null;
    amountRequired?: number | null;
    advanceAvailable?: number | null;
    leadTimeWeeks?: number | null;
    creditTerms?: string | null;
    orderedQty?: number | null;
    balanceQty?: number | null;
    daysForFirstPayment?: number | null;
    moq?: number | null;
    leadTimeDays?: number | null;
    paymentAtPOPercent?: number | null;
    balancePaymentPercent?: number | null;
    creditDays?: number | null;
    poData?: Array<{
      __typename: 'ERPPODataEntry';
      poDate?: string | null;
      firstPayment?: number | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: string | null;
      secondPaymentAmount?: number | null;
    }> | null;
    orderingPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    leadTimePlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlan?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
    paymentPlanWithTaxes?: Array<{
      __typename: 'ERPWeekPlanEntry';
      week: string;
      month: string;
      quantity: number;
      year: number;
      weekNumber: number;
      poDate?: string | null;
      firstPaymentDate?: string | null;
      deliveryDate?: string | null;
      balancePaymentDays?: number | null;
      secondPaymentDays?: number | null;
      firstPaymentAmount?: number | null;
      secondPaymentAmount?: number | null;
      paymentStatus?: string | null;
    }> | null;
  } | null;
};

export type ListERPItemsByPKQueryVariables = {
  pk: string;
  skBeginsWith?: string | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListERPItemsByPKQuery = {
  listERPItemsByPK?: {
    __typename: 'ERPItemConnection';
    items: Array<{
      __typename: 'ERPItem';
      PK: string;
      SK: string;
      entity_type?: string | null;
      data?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      partCode?: string | null;
      partName?: string | null;
      category?: string | null;
      uom?: string | null;
      perUnitTractor?: number | null;
      batchQty?: number | null;
      availableQtyHapur?: number | null;
      partsRequired?: number | null;
      machine?: {
        __typename: 'ERPPartMachineQuantities';
        X45H2?: number | null;
        X60C2L?: number | null;
        X45C4?: number | null;
        X60C2?: number | null;
        X60C4?: number | null;
      } | null;
      availableForTractor?: number | null;
      location?: string | null;
      availableQtyAmount?: number | null;
      suppliers?: Array<{
        __typename: 'ERPSupplierEntry';
        name: string;
        priority: number;
      }> | null;
      perTractorCost?: number | null;
      price?: number | null;
      priceWithGST?: number | null;
      gstRate?: number | null;
      amountRequired?: number | null;
      advanceAvailable?: number | null;
      leadTimeWeeks?: number | null;
      creditTerms?: string | null;
      orderedQty?: number | null;
      balanceQty?: number | null;
      daysForFirstPayment?: number | null;
      moq?: number | null;
      leadTimeDays?: number | null;
      paymentAtPOPercent?: number | null;
      balancePaymentPercent?: number | null;
      creditDays?: number | null;
      poData?: Array<{
        __typename: 'ERPPODataEntry';
        poDate?: string | null;
        firstPayment?: number | null;
        deliveryDate?: string | null;
        balancePaymentDays?: number | null;
        secondPaymentDays?: string | null;
        secondPaymentAmount?: number | null;
      }> | null;
      orderingPlan?: Array<{
        __typename: 'ERPWeekPlanEntry';
        week: string;
        month: string;
        quantity: number;
        year: number;
        weekNumber: number;
        poDate?: string | null;
        firstPaymentDate?: string | null;
        deliveryDate?: string | null;
        balancePaymentDays?: number | null;
        secondPaymentDays?: number | null;
        firstPaymentAmount?: number | null;
        secondPaymentAmount?: number | null;
        paymentStatus?: string | null;
      }> | null;
      leadTimePlan?: Array<{
        __typename: 'ERPWeekPlanEntry';
        week: string;
        month: string;
        quantity: number;
        year: number;
        weekNumber: number;
        poDate?: string | null;
        firstPaymentDate?: string | null;
        deliveryDate?: string | null;
        balancePaymentDays?: number | null;
        secondPaymentDays?: number | null;
        firstPaymentAmount?: number | null;
        secondPaymentAmount?: number | null;
        paymentStatus?: string | null;
      }> | null;
      paymentPlan?: Array<{
        __typename: 'ERPWeekPlanEntry';
        week: string;
        month: string;
        quantity: number;
        year: number;
        weekNumber: number;
        poDate?: string | null;
        firstPaymentDate?: string | null;
        deliveryDate?: string | null;
        balancePaymentDays?: number | null;
        secondPaymentDays?: number | null;
        firstPaymentAmount?: number | null;
        secondPaymentAmount?: number | null;
        paymentStatus?: string | null;
      }> | null;
      paymentPlanWithTaxes?: Array<{
        __typename: 'ERPWeekPlanEntry';
        week: string;
        month: string;
        quantity: number;
        year: number;
        weekNumber: number;
        poDate?: string | null;
        firstPaymentDate?: string | null;
        deliveryDate?: string | null;
        balancePaymentDays?: number | null;
        secondPaymentDays?: number | null;
        firstPaymentAmount?: number | null;
        secondPaymentAmount?: number | null;
        paymentStatus?: string | null;
      }> | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type GetBookingQueryVariables = {
  bookingID: string;
};

export type GetBookingQuery = {
  getBooking?: {
    __typename: 'Booking';
    bookingID: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    country: string;
    state: string;
    subject: string;
    message: string;
    visitType: VisitType;
    preferredDate?: string | null;
    preferredTime?: string | null;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string | null;
    notes?: string | null;
    orgID?: string | null;
    plantID?: string | null;
  } | null;
};

export type ListBookingsQueryVariables = {
  input: ListBookingsInput;
};

export type ListBookingsQuery = {
  listBookings?: {
    __typename: 'BookingConnection';
    items: Array<{
      __typename: 'Booking';
      bookingID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      city: string;
      country: string;
      state: string;
      subject: string;
      message: string;
      visitType: VisitType;
      preferredDate?: string | null;
      preferredTime?: string | null;
      status: BookingStatus;
      createdAt: string;
      updatedAt: string;
      assignedTo?: string | null;
      notes?: string | null;
      orgID?: string | null;
      plantID?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListBookingsByOrgQueryVariables = {
  orgID: string;
  status?: BookingStatus | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListBookingsByOrgQuery = {
  listBookingsByOrg?: {
    __typename: 'BookingConnection';
    items: Array<{
      __typename: 'Booking';
      bookingID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      city: string;
      country: string;
      state: string;
      subject: string;
      message: string;
      visitType: VisitType;
      preferredDate?: string | null;
      preferredTime?: string | null;
      status: BookingStatus;
      createdAt: string;
      updatedAt: string;
      assignedTo?: string | null;
      notes?: string | null;
      orgID?: string | null;
      plantID?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListBookingsByPlantQueryVariables = {
  plantID: string;
  status?: BookingStatus | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListBookingsByPlantQuery = {
  listBookingsByPlant?: {
    __typename: 'BookingConnection';
    items: Array<{
      __typename: 'Booking';
      bookingID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      city: string;
      country: string;
      state: string;
      subject: string;
      message: string;
      visitType: VisitType;
      preferredDate?: string | null;
      preferredTime?: string | null;
      status: BookingStatus;
      createdAt: string;
      updatedAt: string;
      assignedTo?: string | null;
      notes?: string | null;
      orgID?: string | null;
      plantID?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListBookingsByStatusQueryVariables = {
  status: BookingStatus;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListBookingsByStatusQuery = {
  listBookingsByStatus?: {
    __typename: 'BookingConnection';
    items: Array<{
      __typename: 'Booking';
      bookingID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      city: string;
      country: string;
      state: string;
      subject: string;
      message: string;
      visitType: VisitType;
      preferredDate?: string | null;
      preferredTime?: string | null;
      status: BookingStatus;
      createdAt: string;
      updatedAt: string;
      assignedTo?: string | null;
      notes?: string | null;
      orgID?: string | null;
      plantID?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListBookingsByAssigneeQueryVariables = {
  assignedTo: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListBookingsByAssigneeQuery = {
  listBookingsByAssignee?: {
    __typename: 'BookingConnection';
    items: Array<{
      __typename: 'Booking';
      bookingID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      city: string;
      country: string;
      state: string;
      subject: string;
      message: string;
      visitType: VisitType;
      preferredDate?: string | null;
      preferredTime?: string | null;
      status: BookingStatus;
      createdAt: string;
      updatedAt: string;
      assignedTo?: string | null;
      notes?: string | null;
      orgID?: string | null;
      plantID?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};

export type ListBookingsByDateRangeQueryVariables = {
  startDate: string;
  endDate: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListBookingsByDateRangeQuery = {
  listBookingsByDateRange?: {
    __typename: 'BookingConnection';
    items: Array<{
      __typename: 'Booking';
      bookingID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      city: string;
      country: string;
      state: string;
      subject: string;
      message: string;
      visitType: VisitType;
      preferredDate?: string | null;
      preferredTime?: string | null;
      status: BookingStatus;
      createdAt: string;
      updatedAt: string;
      assignedTo?: string | null;
      notes?: string | null;
      orgID?: string | null;
      plantID?: string | null;
    }>;
    nextToken?: string | null;
  } | null;
};
