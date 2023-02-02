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
