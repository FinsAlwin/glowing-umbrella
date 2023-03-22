import { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Center,
  Text,
  Flex,
  Image,
} from '@chakra-ui/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useParams } from 'react-router-dom';
import { createFile } from '../../Api/files';
import UploadFiles from './uploadFiles';
import { BiArrowBack } from 'react-icons/bi';

export default function NewContent(props) {
  const { petitionId } = useParams();

  const [richText, setRichText] = useState('');
  const [title, setTitle] = useState(`ANNEXURE P-${props.number + 1}`);
  const [isFIle, setIsFIle] = useState(false);
  const toast = useToast();

  const handleSaveFile = () => {
    const payload = {
      petitionId: petitionId,
      title: title,
      html: richText,
      image: null,
      pdf: null,
      docx: null,
      userId: localStorage.getItem('userId'),
    };

    createFile(payload)
      .then(async response => {
        if (response.status == 200) {
          toast({
            title: 'Files Saved',
            description: 'Your New files have been uploaded successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch(error => {
        toast({
          title: 'Files Exist',
          description: 'Files already exist',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        // console.error(error);
      });
  };

  async function handleEditorChange(event, editor) {
    setRichText(editor.getData());
  }

  const editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'undo',
        'redo',
      ],
    },
  };

  const handleReset = () => {
    setRichText('');
    setIsFIle(false);
  };

  return (
    <>
      <FormControl>
        <FormLabel
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%"
        >
          Title
        </FormLabel>
        <Input
          type="text"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={e => setTitle(e.target.value)}
          defaultValue={title}
          disabled
        />
      </FormControl>
      &nbsp;
      {!richText.length && (
        <>
          <UploadFiles
            isFile={e => setIsFIle(e)}
            title={title}
            fileOpen={isFIle}
          />
        </>
      )}
      &nbsp;
      {!isFIle && (
        <>
          <CKEditor
            config={editorConfig}
            editor={ClassicEditor}
            data=""
            onChange={handleEditorChange}
          />
          {richText.length !== 0 && (
            <Flex w="100%" justifyContent="right">
              <Button mt="4" onClick={handleSaveFile} colorScheme="purple">
                Save File
              </Button>
            </Flex>
          )}
        </>
      )}
      {(isFIle || richText.length !== 0) && (
        <Flex w="100%" justifyContent="left">
          <Button mt="4" colorScheme="gray" onClick={handleReset}>
            <BiArrowBack />
          </Button>
        </Flex>
      )}
    </>
  );
}
