import React from 'react';
import {
  Thumbnail,
  Banner,
  Stack,
  DropZone,
  DisplayText,
  Button,
} from '@shopify/polaris';
import { Company } from '../../Data/companyCreate';

interface Props {
  company: Company;
}

interface State {
  files: File[];
  rejectedFiles: File[];
  hasError: boolean;
}

class ImageUpload extends React.Component<Props, State> {
  state: State = {
    files: [],
    rejectedFiles: [],
    hasError: false,
  };

  render() {
    const { files, hasError, rejectedFiles } = this.state;
    const {
      company: { image, name },
    } = this.props;

    const fileUpload = !files.length && (
      <Stack vertical alignment="center">
        <br />
        <DisplayText size="small">Current Image:</DisplayText>
        <img src={image} alt={`${name} logo`} />
        <Button>Change Image</Button>
        <br />
      </Stack>
    );
    const uploadedFiles = files.length > 0 && (
      <Stack vertical>
        {files.map((file) => (
          <Stack alignment="center" key={file.name}>
            <Thumbnail
              size="large"
              alt="file upload"
              source={window.URL.createObjectURL(file)}
            />
          </Stack>
        ))}
      </Stack>
    );

    const errorMessage = hasError && (
      <Banner title="Image could not be uploaded:" status="critical">
        {rejectedFiles.map(
          ({ name: fileName, type }: any) =>
            `Image ${fileName} with the file type ${type} is not supported. File type must be .gif, .jpg, .png or .svg.`,
        )}
      </Banner>
    );

    return (
      <Stack vertical>
        {errorMessage}
        <DropZone
          accept="image/jpeg, image/x-png, image/png, image/jpg"
          type="image"
          allowMultiple={false}
          onDrop={(f, acceptedFiles, rfs) => {
            this.setState(({ files: prevFiles }) => ({
              files: [...prevFiles, ...acceptedFiles],
              rejectedFiles: rfs,
              hasError: rejectedFiles.length > 0,
            }));
          }}
        >
          {uploadedFiles}
          {fileUpload}
        </DropZone>
      </Stack>
    );
  }
}

export default ImageUpload;
