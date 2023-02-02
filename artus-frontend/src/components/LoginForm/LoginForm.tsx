import React from "react";
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Checkbox,
  Container,
} from "@chakra-ui/react";
import {
  attemptLogin,
  Credentials,
  Error,
  AuthenticationSuccessResponse,
} from "../../api/authenticate";

export type LoginFormProps = {
  onSubmit: (credentials: Credentials) => void;
  error?: Error | null;
  disabled?: boolean;
};

export function LoginForm({
  onSubmit,
  error = null,
  disabled = false,
}: LoginFormProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [customerNumber, setCustomerNumber] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  return (
    <Stack>
      {error ? (
        <Alert status="error">
          <AlertIcon />
          {error.title ? <AlertTitle>{error.title}</AlertTitle> : null}
          {error.description ? (
            <AlertDescription>{error.description}</AlertDescription>
          ) : null}
        </Alert>
      ) : null}
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          size="md"
          placeholder="Username"
          onChange={(e) => setUsername(e.currentTarget.value)}
          disabled={disabled}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          size="md"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.currentTarget.value)}
          disabled={disabled}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Customer Number</FormLabel>
        <Input
          size="md"
          placeholder="Customer Number"
          onChange={(e) => setCustomerNumber(e.currentTarget.value)}
          disabled={disabled}
        />
      </FormControl>
      <FormControl>
        <Checkbox size="sm" onChange={() => setRememberMe(!rememberMe)}>
          Remember this device?
        </Checkbox>
      </FormControl>
      <FormControl>
        <Button
          onClick={() =>
            onSubmit({ username, password, customerNumber, rememberMe })
          }
          disabled={disabled}
        >
          Log In
        </Button>
      </FormControl>
    </Stack>
  );
}

type LoginProps = {
  setLoginDetails: (details: AuthenticationSuccessResponse) => void;
};

export function Login({ setLoginDetails }: LoginProps) {
  const [error, setError] = React.useState<Error | null>(null);
  const [disabled, setDisabled] = React.useState(false);
  const onSubmit = (credentials: Credentials) => {
    setDisabled(true);
    attemptLogin({
      credentials,
      onError(error) {
        setError(error);
        setDisabled(false);
      },
      onSuccess(response) {
        setError(null);
        setDisabled(false);
        setLoginDetails(response);
      },
    });
  };
  return (
    <Container maxW="sm"> 
      <LoginForm onSubmit={onSubmit} error={error} disabled={disabled} />
    </Container>
  );
}

export default Login;
