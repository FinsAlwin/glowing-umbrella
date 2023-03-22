import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
  TableContainer,
  Flex,
  Center,
  Container,
} from '@chakra-ui/react';
import { getAllPetition, deletePetition } from '../Api/petition';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function Starter() {
  const [petitions, setPetition] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!petitions) {
      const payload = {
        userId: localStorage.getItem('userId'),
      };
      getAllPetition(payload)
        .then(async response => {
          if (response.status == 200) {
            setPetition(response.data.data);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [petitions]);

  const handleClick = (e, id) => {
    e.preventDefault();
    navigate(`/${id}`);
  };

  const handleDeletePetition = (e, id) => {
    e.preventDefault();
    const payload = {
      userId: localStorage.getItem('userId'),
      petitionId: id,
    };
    deletePetition(payload)
      .then(async response => {
        if (response.status == 200) {
          setPetition(response.data.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleNewPetition = e => {
    e.preventDefault();
    navigate('/create-petition');
  };

  return (
    <Container maxW="90%" centerContent>
      {petitions?.length !== 0 && (
        <TableContainer>
          <Table size="sm" variant="striped">
            <Thead>
              <Tr>
                <Th>Petition Title</Th>
                <Th>Is Urgent Application</Th>
                <Th>Petitioner Name</Th>
                <Th>Created Date</Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {petitions?.map((item, index) => (
                <Tr key={index}>
                  <Td
                    maxW="200px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {item.title}
                  </Td>
                  <Td
                    maxW="100px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {item.isUrgent ? ' True' : 'False'}
                  </Td>
                  <Td
                    maxW="100px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {item.petitionor.map(petitionor => petitionor.name)}
                  </Td>
                  <Td
                    maxW="100px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {moment(item.createdAt).format('DD.MM.YYYY HH:mm:ss')}
                  </Td>
                  <Td
                    maxW="100px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    <Button
                      colorScheme="teal"
                      size="xs"
                      onClick={e => handleClick(e, item._id)}
                    >
                      View
                    </Button>
                  </Td>
                  <Td
                    maxW="100px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    <Button
                      colorScheme="red"
                      size="xs"
                      onClick={e => handleDeletePetition(e, item._id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Petition Title</Th>
                <Th>Is Urgent Application</Th>
                <Th>Petitioner Name</Th>
                <Th>Created Date</Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      )}

      {petitions?.length === 0 && (
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Center>
            <Button colorScheme="purple" size="lg" onClick={handleNewPetition}>
              Create New Petition
            </Button>
          </Center>
        </Flex>
      )}
    </Container>
  );
}

export default Starter;

{
  /* <ColorModeSwitcher justifySelf="flex-end" />; */
}
