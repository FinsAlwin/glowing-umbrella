import {
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  Divider,
  Center,
  Button,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import DocPreview from '../docPreview';
import NewContent from '../petitionForm/newContent';
import { useState, useEffect } from 'react';

export default function CustomTab(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(props.data);
  }, [data]);
  return (
    <>
      {data && (
        <Tabs orientation="vertical" variant="unstyled">
          {data && data.files && data.petition && (
            <TabList>
              {data.files
                .filter(item => !item.slug.includes('annexure'))
                .map((item, index) => (
                  <Tab
                    key={index}
                    _selected={{ color: 'white', bg: 'green.400' }}
                  >
                    {item.title}
                  </Tab>
                ))}
              {/* {annexureTabs} */}
              {Array.from({ length: data.petition.annexureNo }).map((_, i) => (
                <Tab key={i} _selected={{ color: 'white', bg: 'green.400' }}>
                  ANNEXURE P-{i + 1}
                </Tab>
              ))}
            </TabList>
          )}
          &nbsp;
          <Center>
            <Divider orientation="vertical" />
          </Center>
          {data && data.files && data.petition && (
            <TabPanels>
              {data.files
                .filter(item => !item.slug.includes('annexure'))
                .map((item, index) => (
                  <TabPanel key={index}>
                    <DocPreview url={item.url} />

                    <Divider />
                  </TabPanel>
                ))}

              {Array.from({ length: data.petition.annexureNo }).map((_, i) => (
                <TabPanel key={i}>
                  <NewContent number={i} />
                </TabPanel>
              ))}
            </TabPanels>
          )}
        </Tabs>
      )}
    </>
  );
}
