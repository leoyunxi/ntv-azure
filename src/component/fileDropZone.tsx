import {
  Dropzone,
  ExtFile,
  FileCard,
  FileInputButton,
  FileMosaicProps,
  FullScreen,
  ImagePreview,
  VideoPreview,
} from '@files-ui/react';
import React from 'react';

const BASE_URL = '';

export default function FileDropzone() {
  const [extFiles, setExtFiles] = React.useState<ExtFile[]>([]);
  const [imageSrc, setImageSrc] = React.useState<File | string | undefined>(undefined);
  const [videoSrc, setVideoSrc] = React.useState<File | string | undefined>(undefined);
  const updateFiles = (incommingFiles: ExtFile[]) => {
    console.log('incomming files', incommingFiles);
    setExtFiles(incommingFiles);
  };
  const onDelete = (id: FileMosaicProps['id']) => {
    setExtFiles(extFiles.filter(x => x.id !== id));
  };
  const handleSee = (imageSource: File | string | undefined) => {
    setImageSrc(imageSource);
  };
  const handleWatch = (videoSource: File | string | undefined) => {
    setVideoSrc(videoSource);
  };
  const handleStart = (filesToUpload: ExtFile[]) => {
    console.log('advanced demo start upload', filesToUpload);
  };
  const handleFinish = (uploadedFiles: ExtFile[]) => {
    console.log('advanced demo finish upload', uploadedFiles);
  };
  const handleAbort = (id: FileMosaicProps['id']) => {
    setExtFiles(
      extFiles.map(ef => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: 'aborted' };
        } else return { ...ef };
      })
    );
  };
  const handleCancel = (id: FileMosaicProps['id']) => {
    setExtFiles(
      extFiles.map(ef => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: undefined };
        } else return { ...ef };
      })
    );
  };
  function uuidv4() {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <Dropzone
        onChange={updateFiles}
        minHeight='280px'
        value={extFiles}
        maxFiles={1}
        // FmaxFileSize={2998000 * 20}
        label={'ファイルをドラグ＆ドロップする'}
        accept='image/*, video/*'
        fakeUpload
        uploadConfig={{
          // autoUpload: true
          url: BASE_URL + new Date(),
          method: 'POST',
          cleanOnUpload: true,
        }}
        onUploadStart={handleStart}
        onUploadFinish={handleFinish}
        actionButtons={{
          position: 'after',
        }}
        // headerConfig={{
        //   customHeader: <></>,
        // }}
        // header={false}
        footer={false}
        color=''
        behaviour={'replace'}
        background='radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 80%);'
      >
        {extFiles.map(file => (
          <FileCard
            key={file.id}
            {...file}
            onDelete={onDelete}
            onSee={handleSee}
            onWatch={handleWatch}
            onAbort={handleAbort}
            onCancel={handleCancel}
            preview
          />
        ))}
      </Dropzone>
      <FullScreen open={imageSrc !== undefined} onClose={() => setImageSrc(undefined)}>
        <ImagePreview src={imageSrc} />
      </FullScreen>
      <FullScreen open={videoSrc !== undefined} onClose={() => setVideoSrc(undefined)}>
        <VideoPreview src={videoSrc} autoPlay controls />
      </FullScreen>
      <div className='flex justify-center'>
        <FileInputButton
          onChange={updateFiles}
          value={extFiles}
          accept={'image/*, video/*'}
          // maxFileSize={28 * 1024}
          maxFiles={2}
          behaviour='replace'
          label='選択する'
        />
      </div>
    </>
  );
}
