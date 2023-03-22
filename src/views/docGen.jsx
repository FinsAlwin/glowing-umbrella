import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getPetition, getCombinedDocx, getFinalDoc } from '../Api/petition';
import CustomTab from '../components/customTabs';

export default function DocGen() {
  const { petitionId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [isloading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [docCreated, setDocCreated] = useState(false);

  useEffect(() => {
    if (petitionId) {
      setIsLoading(true);
      const payload = {
        petitionId: petitionId,
      };
      getPetition(payload)
        .then(async response => {
          if (response.status == 200) {
            setData(response.data.data);
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [petitionId]);

  useEffect(() => {
    if (!downloadUrl) {
      setIsLoading(true);
      const payload = {
        petitionId: petitionId,
        userId: localStorage.getItem('userId'),
      };
      getFinalDoc(payload)
        .then(async response => {
          if (response.status == 200) {
            setDownloadUrl(response.data.data.url);
            setIsLoading(false);
          } else {
            setDocCreated(false);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [downloadUrl]);

  const handleGenDocx = async () => {
    setIsLoading(true);
    const payload = {
      petitionId: petitionId,
      userId: localStorage.getItem('userId'),
    };

    getCombinedDocx(payload)
      .then(async response => {
        if (response.status == 200) {
          setIsLoading(false);
          navigate('/');
        } else {
          setIsLoading(false);
          setDocCreated(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDownload = async () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    await link.setAttribute('download', 'file');
    await document.body.appendChild(link);
    await link.click();
    await link.remove();
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
      {data && !isloading && (
        <Box
          borderWidth="1px"
          rounded="lg"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          p={6}
          m="10px auto"
          as="form"
          maxWidth="900px"
        >
          <CustomTab data={data} />
        </Box>
      )}
      &nbsp;
      <Box>
        <Flex w="100%" justifyContent="center">
          {downloadUrl && (
            <>
              <Button
                onClick={handleDownload}
                colorScheme="purple"
                size="lg"
                variant="outline"
              >
                Download Generated Document
              </Button>
              &nbsp;
            </>
          )}
          <Button onClick={handleGenDocx} colorScheme="teal" size="lg">
            Generate Full Document
          </Button>
        </Flex>
      </Box>
    </>
  );
}
