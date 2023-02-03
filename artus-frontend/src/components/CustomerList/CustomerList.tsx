import React from "react";
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  SkeletonText,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  CustomerRecord,
  fetchCustomers,
  isCustomerRecordList,
} from "../../api/customers";
import "./CustomerList.css";

type CustomerListProps = {
  token: string;
};

function limitCustomers(search: string, customers: CustomerRecord[]) {
  /*
  let iteration = 0;
  console.log("while loop version");
  while (iteration < customers.length) {
    const customer = customers[iteration];
    console.log({customer, iteration});
    iteration++;
  }

  console.log("for loop version");
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    console.log({customer, i})
  }

  console.log("for .. in version");
  for (const customerKey in customers) {
    const customer = customers[customerKey]
    console.log({customer, customerKey});
  }

  console.log("for .. of version");
  for (const customer of  customers) {
    console.log({customer});
  }

  console.log("the stupid do .. while version");
  iteration = 0;
  do {
    const customer = customers[iteration];
    console.log({iteration, customer })
    iteration ++;
  } while (iteration < customers.length);
  */

  const justName = customers.map((customer) => {
    return customer.ticketCopies;
  });
  //const keyField: keyof CustomerRecord = "address1";
  console.log("===========================================");
  (Object.keys(customers[0]) as (keyof CustomerRecord)[]).map((keyField) => {
    const customersByField = customers.reduce(
      (customersByCity: Record<string, CustomerRecord[]>, customer) => {
        if (customer[keyField] as any in customersByCity) {
          customersByCity[customer[keyField] as any].push(customer);
          return customersByCity;
        }
        customersByCity[customer[keyField] as any] = [customer];
        return customersByCity;
      },
      {}
    );
    console.log({ keyField, customersByField, justName });
  });
}

export default function CustomerList({ token }: CustomerListProps) {
  const [loading, setLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<CustomerRecord[]>([]);
  React.useEffect(() => {
    setLoading(true);
    (async function () {
      const response = await fetchCustomers({ token });
      const body = await response.json();
      if (isCustomerRecordList(body)) {
        setCustomers(body);
      }
      setLoading(false);
    })();
  }, [token]);
  limitCustomers("", customers);

  const SearchKeyUpHandler: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {};
  return !loading ? (
    <Box maxW="1400px">
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input type="text" placeholder="Search" onKeyUp={SearchKeyUpHandler} />
      </InputGroup>
      <Box borderWidth="1px" borderRadius="lg">
        <TableContainer className="customer-list" id="myCustomerList">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Address</Th>
                <Th>Phone</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map(
                ({
                  email,
                  uiid,
                  id,
                  city,
                  state,
                  zip,
                  address1,
                  address2,
                  country,
                  phone,
                }) => (
                  <Tr key={id}>
                    <Td>{uiid}</Td>
                    <Td>{!!email ? email : <i>No Email</i>}</Td>
                    <Td>
                      {!!address1 ? (
                        <p>
                          {address1}, {address2 ? `, ${address2} ` : ""}
                          {city}, {state}, {country} {zip}
                        </p>
                      ) : (
                        <i>No Address</i>
                      )}
                    </Td>
                    <Td>{!!phone ? phone : <i>No Phone</i>}</Td>
                  </Tr>
                )
              )}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Address</Th>
                <Th>Phone</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  ) : (
    <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="2" />
  );
}
