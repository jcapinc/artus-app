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
  InputRightElement,
} from "@chakra-ui/react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  CustomerRecord,
  fetchCustomers,
  isCustomerRecordList,
} from "../../api/customers";
import "./CustomerList.css";

type CustomerListProps = {
  token: string;
};

function debounce(method: Function, delay: number = 300) {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => method.apply(this, args), delay);
  };
}

const filterKeys: (keyof CustomerRecord)[] = [
  "address1",
  "address2",
  "city",
  "country",
  "email",
  "uiid",
  "zip",
  "phone"
];

export default function CustomerList({ token }: CustomerListProps) {
  const [loading, setLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<CustomerRecord[]>([]);
  const [filteredCustomers, setFilteredCustomers] = React.useState<
    CustomerRecord[]
  >([]);
  const [search, setSearch] = React.useState<string>("");
  React.useEffect(() => {
    setLoading(true);
    (async function () {
      const response = await fetchCustomers({ token });
      const body = await response.json();
      if (isCustomerRecordList(body)) {
        setCustomers(body);
        setFilteredCustomers(body);
      }
      setLoading(false);
    })();
  }, [token]);

  const filterCustomers = debounce((value: string) => {
    setFilteredCustomers(
      customers.filter((customer) => {
        return filterKeys.reduce((carry, key) => {
          return carry || `${customer[key]}`.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }, false);
      })
    );
  });
  const SearchKeyUpHandler: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    filterCustomers(event.currentTarget.value, 500);
  };
  const SearchChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setSearch(event.target.value);
  };

  const SearchCloseHandler: React.MouseEventHandler = () => {
    setSearch("");
    setFilteredCustomers(customers);
  };
  return !loading ? (
    <Box maxW="1400px">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search"
          onKeyUp={SearchKeyUpHandler}
          onChange={SearchChangeHandler}
          value={search}
        />
        {search.length > 0 && (
          <InputRightElement onClick={SearchCloseHandler}>
            <CloseIcon color="gray.500" />
          </InputRightElement>
        )}
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
              {filteredCustomers.map(
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
