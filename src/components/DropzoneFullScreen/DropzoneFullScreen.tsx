import { useState } from 'react';
import { Group, Text, Button, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone,MIME_TYPES} from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';

import { useTranslation } from 'react-i18next'

export function DropzoneFullScreenComp() {
  const [active, setActive] = useState(true);
  const {t ,i18n} = useTranslation();
  const maxSize = 300;
  return (
    <>
    <Dropzone.FullScreen
      
      accept={[
          MIME_TYPES.pdf,
          MIME_TYPES.docx,
          MIME_TYPES.doc,
          MIME_TYPES.pptx,
          MIME_TYPES.ppt,
      ]}
      maxFiles={1}
      maxSize={maxSize * 1024}
      onReject={(files) =>{
        console.log(files)
        if(files[0].errors[0].code == "file-invalid-type")
          return notifications.show({
            title: t("dropzone_invalidFileType_title"),
            message: t("dropzone_invalidFileType_content"),
            color: 'red',
          });
        if(files.length > 1)
          return notifications.show({
            title: t("dropzone_maxFilesExceded_title"),
            message: t("dropzone_maxFilesExceded_content"),
            color: 'red',
          });
        if(files[0].errors[0].code == "file-too-large")
          return notifications.show({
            title: t("dropzone_maxSizeExceded_title"),
            message: t("dropzone_maxSizeExceded_content",{maxSize: maxSize+"KB"}),
            color: 'red',
          });
      }}
      onDrop={(files) => {
          console.log(files);
          setActive(false);
      }}
    >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone.FullScreen>
    </>
  );
}