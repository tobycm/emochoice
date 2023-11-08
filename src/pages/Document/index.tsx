import { Box, Container, Text, Title } from "@mantine/core";
import { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";
import { getDocument } from "../../lib/database";
import LoaderBox, { monthsKey } from "../../lib/utils";

interface DocumentProps {
  id: string;
}

const Document = (props: DocumentProps) => {
  const [document, setDocument] = useState<RecordModel>();

  useEffect(() => {
    getDocument(props.id).then((doc) => {
      setDocument(doc);
    });
  });

  if (!document) {
    return <LoaderBox />;
  }

  return (
    <Container>
      <Title mb="md">{document.title}</Title>
      <Text mb="xl">
        Last updated: {document.updated.slice(8, 10)} {monthsKey[document.updated.slice(5, 7) as keyof typeof monthsKey]},{" "}
        {document.updated.slice(0, 4)}
      </Text>
      <Box mb="xl" dangerouslySetInnerHTML={{ __html: document.content }} />
    </Container>
  );
};

export default Document;
