import { Box, Button, Modal, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { OrderData } from "../../pages/Product";

export interface ModalState {
  open: boolean;
  fileUploaded: boolean;
}

export default function CustomImageModal(props: {
  modalState: ModalState;
  setModalState: (modalState: ModalState) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  customImage: File | null;
  setCustomImage: (customImage: File | null) => void;
  form: UseFormReturnType<OrderData>;
}) {
  const { modalState, setModalState, image, setImage, customImage, setCustomImage, form } = props;

  return (
    <Modal
      opened={modalState.open}
      onClose={() => {
        setModalState({ open: false, fileUploaded: modalState.fileUploaded });
        setCustomImage(image);
      }}
      title={"Preview"}
      size="lg"
      centered
    >
      <Box>
        <Box display={"flex"} style={{ justifyContent: "center" }} w="100%">
          <canvas id="previewCanvas" style={{ maxWidth: "100%" }}></canvas>
        </Box>
        {modalState.fileUploaded && (
          <Box>
            <Box mb={"md"}>
              <Text>
                If the image is stretched excessively or does not fully occupy the available space, you may want to consider adjusting the scaling on
                your device.
              </Text>
            </Box>
            <Box display={"flex"} style={{ justifyContent: "center" }}>
              <Button
                variant="light"
                onClick={() => {
                  setModalState({ open: false, fileUploaded: modalState.fileUploaded });
                  setCustomImage(image);
                }}
                style={{ margin: "10px" }}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                onClick={() => {
                  setModalState({ open: false, fileUploaded: modalState.fileUploaded });
                  setImage(customImage);
                  form.setFieldValue("fileInput", customImage);
                }}
                style={{ margin: "10px" }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
