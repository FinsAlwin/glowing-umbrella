import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  ChakraProvider,
  theme,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useState } from 'react';
import { login } from '../Api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsloading(true);
    login(username, password)
      .then(async response => {
        if (response.status == 200) {
          await localStorage.setItem('token', response.data.token);
          await localStorage.setItem(
            'data',
            JSON.stringify(response.data.data)
          );
          await localStorage.setItem('userId', response.data.user.id);

          navigate(`/home`);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <ChakraProvider theme={theme}>
      {isloading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <Flex align="center" justify="center" h="100vh">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        </div>
      )}
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Username*</FormLabel>
                <Input
                  type="text"
                  onChange={e => setUsername(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password*</FormLabel>
                <Input
                  type="password"
                  onChange={e => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  onClick={handleLogin}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}
