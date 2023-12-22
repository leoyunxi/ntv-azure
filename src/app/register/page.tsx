'use client';
import FileDropzone from '@/component/fileDropZone';
import { categorys, genres, programNames } from '@/constant/conditionList';
import { setSearchResults } from '@/redux/features/searchResult/searchResultsSlice';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import { Card, Flex } from '@tremor/react';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { ZodError, z } from 'zod';

type MaterialData = {
  id: string;
  thumnail: string;
  recordStartTime: string;
  materialNo: string;
  genre: string;
  programName: string;
  category: string;
  title: string;
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const initialMaterialData: MaterialData = {
    id: '',
    thumnail: 'https://pbs.twimg.com/profile_images/614095297900347392/e94Ktqdu_400x400.png',
    recordStartTime: '',
    materialNo: '',
    genre: '政治',
    programName: 'every16時台',
    category: 'ニュース・報道',
    title: '',
  };

  const notEmtpyValid = z.string().refine(value => value.trim() !== '');
  const schema = z.object({
    materialNo: notEmtpyValid,
    genre: notEmtpyValid,
    category: notEmtpyValid,
    programName: notEmtpyValid,
    title: notEmtpyValid,
  });

  const [materialData, setMaterialData] = useState<MaterialData>(initialMaterialData);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleInputChange = (key: keyof MaterialData, value: string | any) => {
    const selectedValue = typeof value === 'string' ? value : value?.target?.value;

    setMaterialData(prevData => ({
      ...prevData,
      [key]: selectedValue,
    }));
  };

  const generateSelectOptions = (options: string[]) => {
    return options.map(option => (
      <SelectItem key={option} value={option}>
        {option}
      </SelectItem>
    ));
  };

  const handleSubmit = useCallback(async () => {
    try {
      // const materialDataString = JSON.stringify(materialData);

      schema.parse(materialData);

      const oldData = JSON.parse(localStorage.getItem('materialData') || '[]');
      const newData = [
        ...oldData,
        {
          ...materialData,
          id: uuidv4(),
          recordStartTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        },
      ];

      localStorage.setItem('materialData', JSON.stringify(newData));
      dispatch(setSearchResults(newData));

      // console.log(newData);

      setIsSuccess(true);
      onOpen();
      setMaterialData(initialMaterialData);
    } catch (error) {
      if (error instanceof ZodError) {
        setIsSuccess(false);
        onOpen();
      }
    }
  });

  return (
    <>
      <Flex justifyContent='start' alignItems='start'>
        <Card className='h-auto max-w-xs mx-6 my-1' decoration='top' decorationColor='blue'>
          <Flex flexDirection='col' justifyContent='start' alignItems='start' className='gap-8'>
            <h1 className='self-center text-2xl'>素材メタ情報</h1>
            <Input
              label='素材番号'
              labelPlacement='outside'
              className='max-w-full'
              variant='flat'
              value={materialData.materialNo}
              onValueChange={value => handleInputChange('materialNo', value)}
            />

            <Input
              label='素材タイトル'
              labelPlacement='outside'
              className='max-w-full'
              variant='flat'
              value={materialData.title}
              onValueChange={value => handleInputChange('title', value)}
            />

            <Select
              label='ジャンル'
              variant='flat'
              labelPlacement='outside'
              selectedKeys={[materialData.genre]}
              className='max-w-xs'
              onChange={value => handleInputChange('genre', value)}
            >
              {generateSelectOptions(genres)}
            </Select>

            <Select
              label='カテゴリ'
              variant='flat'
              labelPlacement='outside'
              selectedKeys={[materialData.category]}
              className='max-w-xs'
              onChange={value => handleInputChange('category', value)}
            >
              {generateSelectOptions(categorys)}
            </Select>

            <Select
              label='番組名'
              variant='flat'
              labelPlacement='outside'
              selectedKeys={[materialData.programName]}
              className='max-w-xs'
              onChange={value => handleInputChange('programName', value)}
            >
              {generateSelectOptions(programNames)}
            </Select>

            <Button
              onClick={handleSubmit}
              color='primary'
              className='w-full bg-gradient-to-tr text-white shadow-lg'
            >
              登録する
            </Button>
          </Flex>
        </Card>

        <Card className='h-[500px]  my-1' decoration='top' decorationColor='blue'>
          <FileDropzone></FileDropzone>
        </Card>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {onClose => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  {isSuccess ? <p>成功</p> : <p>エラー</p>}
                </ModalHeader>
                <ModalBody>
                  {isSuccess ? <p>素材データを登録しました。</p> : <p>データを入力してください</p>}
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='light' onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};

export default RegisterPage;
