import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logo from '../images/logo/logo.png';
import { useNavigate } from 'react-router-dom';

const Links = ['Home', 'Create Petition'];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}
  >
    {children}
  </Link>
);
const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/home');
  };

  const handleCreatePetition = () => {
    navigate('/create-petition');
  };
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Image
                borderRadius="full"
                boxSize="50px"
                src={logo}
                alt="Dan Abramov"
              />
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              <Button colorScheme="teal" variant="ghost" onClick={handleHome}>
                Home
              </Button>

              <Button
                colorScheme="teal"
                variant="ghost"
                onClick={handleCreatePetition}
              >
                Create Petition
              </Button>
            </HStack>
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map(link => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
    // <Box>
    //   <Flex
    //     bg={useColorModeValue('white', 'gray.800')}
    //     color={useColorModeValue('gray.600', 'white')}
    //     minH={'60px'}
    //     py={{ base: 2 }}
    //     px={{ base: 4 }}
    //     borderBottom={1}
    //     borderStyle={'solid'}
    //     borderColor={useColorModeValue('gray.200', 'gray.900')}
    //     align={'center'}
    //   >
    //     <Flex
    //       flex={{ base: 1, md: 'auto' }}
    //       ml={{ base: -2 }}
    //       display={{ base: 'flex', md: 'none' }}
    //     >
    //       <IconButton
    //         onClick={onToggle}
    //         icon={
    //           isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
    //         }
    //         variant={'ghost'}
    //         aria-label={'Toggle Navigation'}
    //       />
    //     </Flex>
    //     <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
    //       <Image
    //         borderRadius="full"
    //         boxSize="50px"
    //         src={logo}
    //         alt="Dan Abramov"
    //       />
    //     </Flex>
    //   </Flex>
    // </Box>
  );
};

export default Header;
