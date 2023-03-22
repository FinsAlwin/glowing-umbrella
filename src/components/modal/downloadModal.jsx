import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';

export default function DownloadModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDownload = async () => {
    const link = document.createElement('a');
    link.href = props.downloadUrl;
    await link.setAttribute('download', 'file');
    await document.body.appendChild(link);
    await link.click();
    await link.remove();
    // window.location.reload();
    props.onDownload();
  };

  return (
    <>
      <Modal isOpen={props.modalIsOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Download File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button colorScheme="purple" onClick={handleDownload}>
              Download File
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
