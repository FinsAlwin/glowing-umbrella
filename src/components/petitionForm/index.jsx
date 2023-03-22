import React, { useState, useEffect } from 'react';
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Radio,
  Stack,
  RadioGroup,
  Grid,
  Spinner,
  GridItem,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { petitionSubmit } from '../../Api/petition';
import moment from 'moment';

export default function PetitionForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isStep, setIsStep] = useState(false);

  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);

  const [highCourt, setHighCourt] = useState('640acab82fd16bff3982768f');
  const [juridiction, setJuridiction] = useState('640acdf3aefa59a427c3db01');
  const [petitiontype, setPetitiontype] = useState('ADMIN.REPORT - [ADMR]');

  const [petitionerName, setPetitionerName] = useState('AAYUSHI GULAB');
  const [petitionerAdress1, setPetitionerAdressLine1] = useState(
    'D9 GEETANJALI ENCLAVE'
  );
  const [petitionerAdress2, setPetitionerAdressLine2] = useState('NEW DELHI');

  const [advocateFilledBy, setAdvocateFilledBy] = useState('GAUTAM KAMAL');
  const [advocateAddress1, setAdvocateAddress1] = useState(
    'I-51 JUNGPURA EXTENSTION'
  );
  const [advocateAddress2, setAdvocateAddress2] = useState('NEW DELHI');

  const [respondentName, setRespondentName] = useState('VANSH VERMA');
  const [respondentAdress1, setRespondentAdress1] = useState('FORUM GURGAON');
  const [respondentAdress2, setRespondentAdress2] = useState('NEW DELHI');

  const [petitionNumber, setPetitionNumber] = useState('2021089845FE');
  const [place, setPlace] = useState('DELHI');
  const [date, setDate] = useState('');

  const [petFillingtype, setPetFillingtype] = useState('INGACT021');
  const [dateOfListing, setDateOfListing] = useState('');
  const [isUrgent, setIsUrgent] = useState('1');

  const [value, setValue] = useState('1');

  const [isloading, setIsLoading] = useState(false);

  const [HighCourtList, setHighCourtList] = useState(null);
  const [JurisdictionList, setJurisdictionList] = useState(null);
  const [CaseType, setCaseType] = useState(null);

  const dataSet = localStorage.getItem('data');

  useEffect(() => {
    if (dataSet) {
      const dataLocal = JSON.parse(dataSet);

      setHighCourtList(dataLocal.highCourt);
      setJurisdictionList(dataLocal.jurisdiction);
      setCaseType(dataLocal.caseType);
    }
  }, [dataSet]);

  const handleDocProcessing = async () => {
    if (
      !highCourt ||
      !petitiontype ||
      !petitionerName ||
      !petitionerAdress1 ||
      !advocateFilledBy ||
      !advocateAddress1 ||
      !respondentName ||
      !respondentAdress1 ||
      place === '' ||
      date === ''
    ) {
      toast({
        title: 'Incomplete Form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setIsLoading(true);
      const payload = {
        title: 'WRIT PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA',
        place: place,
        date: moment(date).format('DD.MM.YYYY'),
        fillingType: petFillingtype,
        dateOfListing: moment(dateOfListing).format('DD.MM.YYYY'),
        isUrgent: isUrgent == '1' ? true : false,
        annexureNo: value,
        petitionNumber: petitionNumber,
        year: moment(date).format('YYYY'),
        petitionor: {
          name: petitionerName,
          address1: petitionerAdress1,
          address2: petitionerAdress2,
        },
        respondent: {
          name: respondentName,
          address1: respondentAdress1,
          address2: respondentAdress2,
        },
        petitionorAdvocate: {
          name: advocateFilledBy,
          address1: advocateAddress1,
          address2: advocateAddress2,
        },
        highCourtId: highCourt,
        jurisdictionId: juridiction,
        caseTypeId: petitiontype,
        userId: localStorage.getItem('userId'),
      };

      petitionSubmit(payload)
        .then(async response => {
          if (response.status == 200) {
            navigate(`/${response.data.data.petitionId}`);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  return (
    <>
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
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={6}
        m="10px auto"
        as="form"
        maxWidth="900px"
      >
        {step === 1 ? (
          <Form1
            isStep={false}
            highCourt={highCourt}
            juridiction={juridiction}
            petitiontype={petitiontype}
            handleHighcourtSelect={e => setHighCourt(e.target.value)}
            handleOptionChangeJurisdiction={e => setJuridiction(e.target.value)}
            handleOptionChangePetition={e => setPetitiontype(e.target.value)}
            HighCourtList={HighCourtList}
            optionsJurisdiction={JurisdictionList}
            optionsPetition={CaseType}
          />
        ) : step === 2 ? (
          <Form2
            petitionerName={petitionerName}
            petitionerAdress1={petitionerAdress1}
            petitionerAdress2={petitionerAdress2}
            respondentName={respondentName}
            respondentAdress1={respondentAdress1}
            respondentAdress2={respondentAdress2}
            advocateFilledBy={advocateFilledBy}
            advocateAddress1={advocateAddress1}
            advocateAddress2={advocateAddress2}
            setPetitionerName={e => setPetitionerName(e.target.value)}
            setPetitionerAdressLine1={e =>
              setPetitionerAdressLine1(e.target.value)
            }
            setPetitionerAdressLine2={e =>
              setPetitionerAdressLine2(e.target.value)
            }
            setAdvocateFilledBy={e => setAdvocateFilledBy(e.target.value)}
            setAdvocateAddress1={e => setAdvocateAddress1(e.target.value)}
            setAdvocateAddress2={e => setAdvocateAddress2(e.target.value)}
            setRespondentName={e => setRespondentName(e.target.value)}
            setRespondentAdress1={e => setRespondentAdress1(e.target.value)}
            setRespondentAdress2={e => setRespondentAdress2(e.target.value)}
          />
        ) : (
          <Form3
            petitionNumber={petitionNumber}
            place={place}
            date={date}
            petFillingtype={petFillingtype}
            dateOfListing={dateOfListing}
            isUrgent={isUrgent}
            value={value}
            setPetitionNumber={e => setPetitionNumber(e.target.value)}
            setPlace={e => setPlace(e.target.value)}
            setDate={e => setDate(e)}
            setPetFillingtype={e => setPetFillingtype(e.target.value)}
            setDateOfListing={e => setDateOfListing(e)}
            setIsUrgent={e => setIsUrgent(e)}
            setValue={e => setValue(e.target.value)}
          />
        )}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                }}
                isDisabled={step === 1 && !isStep}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3 && !isStep}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  handleDocProcessing();
                }}
              >
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  );
}

const Form1 = props => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [juridictionList, setJuridictionList] = useState(null);
  const [caseTypeList, setCaseTypeList] = useState(null);

  const isErrorhighCourt = props.highCourt === '';
  const isErrorjuridiction = props.juridiction === '';
  const isErrorpetitiontype = props.petitiontype === '';

  useEffect(() => {
    if (props.highCourt && props.optionsJurisdiction && props.optionsPetition) {
      setJuridictionList(
        filterById2(props.optionsJurisdiction, props.highCourt)
      );
      setCaseTypeList(filterById2(props.optionsPetition, props.highCourt));
    }
  }, [props.highCourt && props.optionsJurisdiction && props.optionsPetition]);

  const getJuridictionList = e => {
    setJuridictionList(filterById2(props.optionsJurisdiction, e.target.value));
  };

  const getCaseTypeList = e => {
    setCaseTypeList(filterById2(props.optionsPetition, e.target.value));
  };

  return (
    <>
      <Flex>
        <FormControl isInvalid={isErrorhighCourt}>
          <FormLabel htmlFor="first-name" fontWeight={'normal'}>
            High Court
          </FormLabel>

          <Select
            placeholder="Select High Court"
            focusBorderColor="brand.400"
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
            value={props.highCourt}
            onChange={e => {
              props.handleHighcourtSelect(e);
              getJuridictionList(e);
              getCaseTypeList(e);
            }}
          >
            {props.HighCourtList?.map((item, index) => (
              <option key={index} value={item._id}>
                {item.name}
              </option>
            ))}
          </Select>
        </FormControl>
        &nbsp;
        {juridictionList?.length !== 0 && (
          <FormControl isInvalid={isErrorjuridiction}>
            <FormLabel htmlFor="last-name" fontWeight={'normal'}>
              Juridiction
            </FormLabel>
            <Select
              placeholder="Select Jurisdiction"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={e => {
                props.handleOptionChangeJurisdiction(e);
              }}
              value={props.juridiction}
            >
              {juridictionList?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
      </Flex>
      <FormControl isInvalid={isErrorpetitiontype}>
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Case Type
        </FormLabel>
        <Select
          placeholder="Select Case Type"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={props.handleOptionChangePetition}
          value={props.petitiontype}
        >
          {caseTypeList?.map((item, index) => (
            <option key={index} value={item._id}>
              {item.name}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

const Form2 = props => {
  const isErrorpetitionerName = props.petitionerName === '';
  const isErrorpetitionerAdress1 = props.petitionerAdress1 === '';
  const isErroradvocateFilledBy = props.advocateFilledBy === '';

  const isErroradvocateAddress1 = props.advocateAddress1 === '';
  const isErrorrespondentName = props.respondentName === '';
  const isErrorrespondentAdress1 = props.respondentAdress1 === '';
  return (
    <>
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <GridItem colSpan={{ base: 1, lg: 1 }}>
          <Heading
            w="100%"
            textAlign={'center'}
            fontWeight="normal"
            as="h4"
            size="md"
          >
            DETAILS OF THE PETITIONER
          </Heading>
          <FormControl mt="2%" isInvalid={isErrorpetitionerName}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
              mt="2%"
            >
              Name of the Petitioner*
            </FormLabel>
            <Input
              isRequired
              type="text"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={props.setPetitionerName}
              defaultValue={props.petitionerName}
            />
          </FormControl>
          <FormControl mt="2%" isInvalid={isErrorpetitionerAdress1}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
              mt="2%"
            >
              Address of the Petitioner*
            </FormLabel>
            <Input
              isRequired
              type="text"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={props.setPetitionerAdressLine1}
              defaultValue={props.petitionerAdress1}
            />
          </FormControl>
          <FormControl mt="2%">
            <Input
              type="text"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={props.setPetitionerAdressLine2}
              defaultValue={props.petitionerAdress2}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 1 }}>
          <Heading
            w="100%"
            textAlign={'center'}
            fontWeight="normal"
            as="h4"
            size="md"
          >
            DETAILS OF THE PETITIONER’s ADVOCATE
          </Heading>

          <FormControl mt="2%" isInvalid={isErroradvocateFilledBy}>
            <FormLabel
              htmlFor="street_address"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
              mt="2%"
            >
              Filed By*
            </FormLabel>
            <Input
              type="text"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={props.setAdvocateFilledBy}
              defaultValue={props.advocateFilledBy}
            />
          </FormControl>
          <FormControl mt="2%" isInvalid={isErroradvocateAddress1}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
              mt="2%"
            >
              Address of the Advocate*
            </FormLabel>
            <Input
              type="text"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={props.setAdvocateAddress1}
              defaultValue={props.advocateAddress1}
            />
          </FormControl>
          <FormControl mt="2%">
            <Input
              type="text"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={props.setAdvocateAddress2}
              defaultValue={props.advocateAddress2}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Heading
            w="100%"
            textAlign={'center'}
            fontWeight="normal"
            as="h4"
            size="md"
          >
            DETAILS OF THE RESPONDENT
          </Heading>
          <FormControl mt="2%" isInvalid={isErrorrespondentName}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
              mt="2%"
            >
              Name of the Respondent*
            </FormLabel>
            <Input
              type="text"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={props.setRespondentName}
              defaultValue={props.respondentName}
            />
          </FormControl>
          <FormControl mt="2%" isInvalid={isErrorrespondentAdress1}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
              mt="2%"
            >
              Address of the Respondent*
            </FormLabel>
            <Input
              type="text"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={props.setRespondentAdress1}
              defaultValue={props.respondentAdress1}
            />
          </FormControl>
          <FormControl mt="2%">
            <Input
              type="text"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={props.setRespondentAdress2}
              defaultValue={props.respondentAdress2}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </>
  );
};

const Form3 = props => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const isErrorplace = props.place === '';
  const isErrordate = props.date === '';
  const isErrorpetFillingtype = props.petFillingtype === '';

  const isErrordateOfListing = props.dateOfListing === '';

  return (
    <>
      <FormControl mt="2%">
        <FormLabel
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%"
        >
          Petition Number
        </FormLabel>
        <Input
          type="text"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={props.setPetitionNumber}
          defaultValue={props.petitionNumber}
        />
      </FormControl>
      <Flex>
        <FormControl mt="2%" isInvalid={isErrorplace}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}
            mt="2%"
          >
            Place
          </FormLabel>
          <Input
            type="text"
            focusBorderColor="brand.400"
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
            onChange={props.setPlace}
            defaultValue={props.place}
          />
        </FormControl>
        &nbsp;
        <FormControl mt="2%" isInvalid={isErrordate}>
          <FormLabel
            htmlFor="street_address"
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}
            mt="2%"
          >
            Date
          </FormLabel>
          <DatePicker
            selected={props.date}
            onChange={props.setDate}
            customInput={
              <Input
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                focusBorderColor="brand.400"
              />
            }
            dateFormat="dd/MM/yyyy"
          />
        </FormControl>
      </Flex>
      <FormControl mt="2%" isInvalid={isErrorpetFillingtype}>
        <FormLabel
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%"
        >
          Filing Type
        </FormLabel>
        <Input
          type="text"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={props.setPetFillingtype}
          defaultValue={props.petFillingtype}
        />
      </FormControl>
      <FormControl mt="2%" isInvalid={isErrordateOfListing}>
        <FormLabel
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%"
        >
          Date for Listing
        </FormLabel>
        <DatePicker
          selected={props.dateOfListing}
          onChange={props.setDateOfListing}
          customInput={
            <Input
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              focusBorderColor="brand.400"
            />
          }
          dateFormat="dd/MM/yyyy"
        />
      </FormControl>
      <FormControl mt="2%">
        <FormLabel
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%"
        >
          Urgent Application?
        </FormLabel>
        <RadioGroup
          defaultValue="0"
          value={props.isUrgent}
          onChange={props.setIsUrgent}
        >
          <Stack spacing={5} direction="row">
            <Radio colorScheme="green" value="1">
              Yes
            </Radio>
            <Radio colorScheme="red" value="0">
              No
            </Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="last-name" fontWeight={'normal'}>
          No. of Annexures
        </FormLabel>
        <Select
          placeholder="Select No. of Annexures"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={props.setValue}
          defaultValue={props.value}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </Select>
      </FormControl>
    </>
  );
};

function filterById(jsonObject, id) {
  return jsonObject.filter(function (jsonObject) {
    return jsonObject['_id'] == id;
  });
}

function filterById2(jsonObject, id) {
  return jsonObject.filter(function (jsonObject) {
    return jsonObject['highCourtId'] == id;
  });
}
