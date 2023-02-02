import { APIURL } from "../config";

export type CustomerRecord = {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shipToAddress1: string;
  shipToAddress2: string;
  shipToCity: string;
  shipToState: string;
  shipToZip: string;
  shipToCountry: string;
  phone: string;
  mobilePhone: string;
  fax: string;
  email: string;
  emailTickets: boolean;
  notes: string;
  priceSheet: null | unknown;
  hasEscrowPayments: boolean;
  escrowBalance: number;
  requireTicketPayment: boolean;
  escrowMinimumBalance: number;
  ticketForm: string;
  ticketCopies: number;
  printPricing: boolean;
  taxExempt: boolean;
  qboID: string;
  id: string;
  uiid: string;
  externalID: string;
  inactive: boolean;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
  userFields: null | unknown;
};

type fetchCustomersProps = {
  token: string;
  sqlQuery?: string;
};

const defaultQuery = "SELECT * FROM customer";
export function fetchCustomers({
  sqlQuery = defaultQuery,
  token,
}: fetchCustomersProps) {
  return fetch(APIURL + "customer/list", {
    body: JSON.stringify({ sqlQuery, pairs: [] }),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}

export function isCustomerRecord(
  candidate: unknown
): candidate is CustomerRecord {
  return (
    !!candidate &&
    typeof candidate === "object" &&
    "email" in candidate &&
    "id" in candidate
  );
}

/// Array.isArray(something)

export function isCustomerRecordList(
  candidate: unknown
): candidate is CustomerRecord[] {
  return (
    Array.isArray(candidate) &&
    (candidate.length === 0 || isCustomerRecord(candidate[0]))
  );
}
