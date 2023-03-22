import { Center, Text } from '@chakra-ui/react';

export default function DocPreview(props) {
  return (
    <Center>
      <iframe
        src={`https://view.officeapps.live.com/op/view.aspx?src=${props.url}&wdOrigin=BROWSELINK`}
        width="100%"
        height="623px"
      ></iframe>
    </Center>
  );
}
