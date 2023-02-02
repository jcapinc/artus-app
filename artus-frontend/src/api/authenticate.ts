import { APIURL } from '../config';
export type AuthenticationSuccessResponse = {
  token: string;
  tokenExpiresUTC: string;
  ld: {
    customerNumber: string;
    numberOfUsers: number;
    numberOfExternalUsers: 0;
    softwareTier: 3;
    subscriptionID: "0002";
    eulaSignature: "Victor Parrish (vparrish@creativeinfo.net) accepted the EULA at 05/10/2021 18:47:08.165 UTC";
    isTrial: false;
    trialEndDate: "2021-04-26T00:00:00";
    hubKey: "pjuSX9zWX0t+Jo3T8SQy807BEJ1NZftTgHoWfEn83P4=";
    licensesAvailable: 17;
    externalLicensesAvailable: 0;
  };
  email: string;
  customerNumber: string;
  rememberMe: boolean;
  password: null;
  confirmPassword: null;
  firstName: string;
  lastName: string;
  role: string;
  permissionSet: string;
  timeZone: string;
  lockedOut: boolean;
  resetPassOnNextLogin: boolean;
  signatureData: null;
  linkedCustomer: {
    id: string;
    uiid: null;
    externalID: null;
    inactive: boolean;
    createdOn: string;
    modifiedOn: string;
    createdBy: null;
    modifiedBy: null;
    userFields: null;
  };
  siteInfo: {
    id: string;
    uiid: string;
    externalID: null | string;
    inactive: boolean;
    createdOn: string;
    modifiedOn: string;
    createdBy: null | string;
    modifiedBy: null | string;
    userFields: null | unknown;
  };
  tziDs: null | unknown;
};

export type Credentials = {
  username: string;
  password: string;
  customerNumber: string;
  rememberMe: boolean;
};

export type Error = {
  title: string | null;
  description: string | null;
};

export type attemptLoginProps = {
  credentials: Credentials;
  onError: (error: Error) => void;
  onSuccess: (result: AuthenticationSuccessResponse) => void;
  timeout?: number;
};

export async function attemptLogin({
  credentials,
  onError,
  onSuccess,
  timeout = 8000,
}: attemptLoginProps) {
  const controller = new AbortController();
  const timeoutID = setTimeout(() => controller.abort(), timeout);
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "jeffs.linux@gmail.com",
        password: "Cw6$4*kLF9",
        customerNumber: "0002",
        rememberMe: true,
      }),
    };
    const response = await fetch(
      APIURL + "authenticate",
      options
    );
    clearTimeout(timeoutID);
    const body = await response.json();
    if (isAuthenticationSuccessResponse(body)) {
      return onSuccess(body);
    }
    return onError({
      title: "API Error",
      description: "The login results did not conform to expectations",
    });
  } catch (error) {
    if (error && typeof error === "object" && "toString" in error) {
      return onError({
        title: null,
        description: error.toString(),
      });
    }
    onError({
      title: "Error",
      description: "An Unexpected Error Occured",
    });
    return console.error(error);
  }
}

export function isAuthenticationSuccessResponse(
  candidate: unknown
): candidate is AuthenticationSuccessResponse {
  return !!(candidate && typeof candidate === "object" && "token" in candidate);
}
