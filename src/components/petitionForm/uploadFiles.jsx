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
  Stack,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { createFile } from '../../Api/files';
import { Icon } from '@chakra-ui/react';
import { FaFileWord, FaFilePdf } from 'react-icons/fa';
import AWS from 'aws-sdk';
import * as pdfjsLib from 'pdfjs-dist/webpack';

// pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

AWS.config.update({
  accessKeyId: 'AKIA5TYZ6MVO4SDW6E4B',
  secretAccessKey: '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',
  region: 'ap-south-1',
  signatureVersion: 'v4',
});

export default function UploadFiles(props) {
  const { petitionId } = useParams();
  const [isImage, setIsImage] = useState(false);
  const [isDocx, setIsDocx] = useState(false);
  const [isPdf, setIsPDF] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [imageArray, setImageArray] = useState(null);
  const toast = useToast();
  const s3 = new AWS.S3();

  const handleFileChange = event => {
    const files = event.target.files;
    const allowedFileTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const filteredFiles = Object.values(files).filter(file =>
      allowedFileTypes.includes(file.type)
    );

    const maxSizeInBytes = 2097152; // 2MB
    const maxAllowedWidth = 2480; // 8.27in * 300dpi = 2480px
    const maxAllowedHeight = 3508; // 11.69in * 300dpi = 3508px

    const validatedFiles = filteredFiles.filter(file => {
      // Check file size
      if (file.size > maxSizeInBytes) {
        console.log(`${file.name} is too large. Maximum file size is 2MB.`);
        return false;
      }

      // Check file dimensions
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      return new Promise(resolve => {
        img.onload = function () {
          const { width, height } = this;
          if (width > maxAllowedWidth || height > maxAllowedHeight) {
            console.log(
              `${file.name} dimensions are too large. Maximum dimensions are A4 size (${maxAllowedWidth}px x ${maxAllowedHeight}px).`
            );
            resolve(false);
          }
          resolve(true);
        };
      });
    });

    setSelectedFiles(prevSelectedFiles => [
      ...prevSelectedFiles,
      ...validatedFiles,
    ]);
  };

  const handleRemoveClick = file => {
    setSelectedFiles(prevSelectedFiles =>
      prevSelectedFiles.filter(f => f !== file)
    );
  };

  const handleSaveFile = async type => {
    if (selectedFiles.length !== 0) {
      if (type === 'image') {
        const images = await uploadFilesAws(selectedFiles);

        const payload = {
          petitionId: petitionId,
          title: props.title,
          html: null,
          image: images,
          pdf: null,
          docx: null,
          userId: localStorage.getItem('userId'),
        };

        await createFile(payload)
          .then(async response => {
            if (response.status == 200) {
              toast({
                title: 'Files Saved',
                description: 'Your New files have been uploaded successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
              setSelectedFiles([]);
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
          });
      } else if (type === 'docs') {
        const images = await uploadFilesAws(selectedFiles);
        const payload = {
          petitionId: petitionId,
          title: props.title,
          html: null,
          image: null,
          pdf: null,
          docx: [],
          userId: localStorage.getItem('userId'),
        };

        // createFile(payload)
        //   .then(async response => {
        //     if (response.status == 200) {
        //       toast({
        //         title: 'Files Saved',
        //         description: 'Your New files have been uploaded successfully',
        //         status: 'success',
        //         duration: 5000,
        //         isClosable: true,
        //       });
        //       setSelectedFiles([]);
        //     }
        //   })
        //   .catch(error => {
        //     toast({
        //       title: 'Files Exist',
        //       description: 'Files already exist',
        //       status: 'error',
        //       duration: 5000,
        //       isClosable: true,
        //     });
        //     // console.error(error);
        //   });
      } else if (type === 'pdf') {
        const image = await imageToPdf(selectedFiles);
        const payload = {
          petitionId: petitionId,
          title: props.title,
          html: null,
          image: image[0],
          pdf: null,
          docx: null,
          userId: localStorage.getItem('userId'),
        };

        await createFile(payload)
          .then(async response => {
            if (response.status == 200) {
              toast({
                title: 'Files Saved',
                description: 'Your New files have been uploaded successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
              setSelectedFiles([]);
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
          });
      }
    } else {
      toast({
        title: 'No Files',
        description: 'Please choose File to upload',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const uploadFilesAws = async files => {
    let imageArray = [];

    await Promise.all(
      files.map(async file => {
        const params = {
          Bucket: 'docslaw/Files',
          Key: `${Date.now()}.${file.name}`,
          Body: file,
        };
        const { Location } = await s3.upload(params).promise();

        imageArray.push(`${Location}`);
      })
    );

    return imageArray;
  };

  const imageToPdf = async files => {
    const convertedImages = await Promise.all(
      files.map(async file => {
        const fileReader = new FileReader();
        const data = await new Promise(resolve => {
          fileReader.onloadend = () => resolve(fileReader.result);
          fileReader.readAsArrayBuffer(file);
        });

        const pdf = await pdfjsLib.getDocument(data).promise;
        const numPages = pdf.numPages;
        const imageUrls = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const scale = 2;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;

          const imageBlob = await new Promise(resolve =>
            canvas.toBlob(resolve, 'image/jpeg', 1)
          );
          imageBlob.name = `${file.name}_${i}.jpeg`;

          const imageUrl = await uploadFilesAws([imageBlob]);
          imageUrls.push(imageUrl[0]);
        }

        return imageUrls;
      })
    );

    return convertedImages;
  };

  return (
    <>
      <Stack direction="row" spacing={4} align="center">
        <Button
          colorScheme="gray"
          variant="outline"
          onClick={() => {
            props.isFile(true);
            setIsImage(true);
            setIsDocx(false);
            setIsPDF(false);
          }}
        >
          Image
        </Button>
        <Button
          colorScheme="gray"
          variant="outline"
          onClick={() => {
            props.isFile(true);
            setIsImage(false);
            setIsDocx(true);
            setIsPDF(false);
          }}
        >
          .doc
        </Button>
        <Button
          colorScheme="gray"
          variant="outline"
          onClick={() => {
            props.isFile(true);
            setIsImage(false);
            setIsDocx(false);
            setIsPDF(true);
          }}
        >
          Pdf
        </Button>
      </Stack>

      {selectedFiles.map(file => (
        <Box key={file.name} position="relative" m="2">
          {file.type.startsWith('image/') ? (
            <Image src={URL.createObjectURL(file)} maxH="80px" mr="2" />
          ) : (
            <Flex align="center">
              {file.type === 'application/pdf' ? (
                <Icon as={FaFilePdf} />
              ) : (
                <Icon as={FaFileWord} />
              )}
              <Box>{file.name}</Box>
            </Flex>
          )}
          <Button
            size="sm"
            position="absolute"
            top="-5px"
            right="-5px"
            onClick={() => handleRemoveClick(file)}
          >
            X
          </Button>
        </Box>
      ))}

      {isImage && props.fileOpen && (
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
              Upload Image
            </FormLabel>
            <Input
              type="file"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={handleFileChange}
              accept="image/*"
            />
          </FormControl>
          {selectedFiles.length !== 0 && (
            <Flex w="100%" justifyContent="right">
              <Button
                mt="4"
                onClick={() => handleSaveFile('image')}
                colorScheme="purple"
              >
                Save File
              </Button>
            </Flex>
          )}
        </>
      )}
      {isDocx && props.fileOpen && (
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
              Upload .doc
            </FormLabel>
            <Input
              type="file"
              multiple
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          </FormControl>

          {selectedFiles.length !== 0 && (
            <Flex w="100%" justifyContent="right">
              <Button
                mt="4"
                onClick={() => handleSaveFile('docs')}
                colorScheme="purple"
              >
                Save File
              </Button>
            </Flex>
          )}
        </>
      )}
      {isPdf && props.fileOpen && (
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
              Upload PDF
            </FormLabel>
            <Input
              type="file"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </FormControl>
          {selectedFiles.length !== 0 && (
            <Flex w="100%" justifyContent="right">
              <Button
                mt="4"
                onClick={() => handleSaveFile('pdf')}
                colorScheme="purple"
              >
                Save File
              </Button>
            </Flex>
          )}
        </>
      )}
    </>
  );
}
