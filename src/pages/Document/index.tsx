import { Box, Container, Loader, Text, Title } from "@mantine/core";
import { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";
import { getDocument } from "../../lib/database";
import { monthsKey } from "../../lib/utils";

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
    return (
      <Box h="50vh" w="100%" display={"flex"} style={{ alignItems: "center", justifyContent: "center" }}>
        <Loader size="lg" mt={"lg"} />
      </Box>
    );
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
