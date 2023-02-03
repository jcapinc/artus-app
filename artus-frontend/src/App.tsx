import React from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import { ChakraProvider, Container } from "@chakra-ui/react";
import "./App.css";
import {
  AuthenticationSuccessResponse,
  isAuthenticationSuccessResponse,
} from "./api/authenticate";
import CustomerList from "./components/CustomerList";
import theme from './theme';

function App() {
  const hydratedLoginDetails = JSON.parse(
    localStorage.getItem("login-details") || "{}"
  );
  const defaultLoginDetails = isAuthenticationSuccessResponse(
    hydratedLoginDetails
  )
    ? hydratedLoginDetails
    : null;
  const [loginDetails, setLoginDetails] =
    React.useState<AuthenticationSuccessResponse | null>(defaultLoginDetails);
  const saveLoginDetails = (details: AuthenticationSuccessResponse) => {
    setLoginDetails(details);
    localStorage.setItem("login-details", JSON.stringify(details));
  };
  return (
    <ChakraProvider theme={theme}>
      {!loginDetails ? (
        <LoginForm setLoginDetails={saveLoginDetails} />
      ) : (
        <Container maxW="1400px">
          <CustomerList token={loginDetails.token} />
        </Container>
      )}
    </ChakraProvider>
  );
}

export default App;
