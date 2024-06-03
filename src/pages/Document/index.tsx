import { Box, Container, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";
import { getDocument } from "../../lib/database";
import LoaderBox, { monthsKey } from "../../lib/utils";

export default function Document({ id }: { id: string }) {
  const document = useQuery({ queryKey: ["document", id], queryFn: () => getDocument(id) });

  if (document.isFetching) return <LoaderBox />;

  if (document.isError) return <LoaderBox text="Error loading data. Please refresh!" />;

  if (!document.data) return <LoaderBox text="No data found!" />; // This should never happen

  return (
    <Container>
      <SmallChangeHelmet title={document.data.title} description="" location={document.data.title.toLowerCase().replace(" ", "-")} />
      <Title mb="md">{document.data.title}</Title>
      <Text mb="xl">
        Last updated: {document.data.updated.slice(8, 10)} {monthsKey[document.data.updated.slice(5, 7) as keyof typeof monthsKey]},{" "}
        {document.data.updated.slice(0, 4)}
      </Text>
      <Box mb="xl" dangerouslySetInnerHTML={{ __html: document.data.content }} />
    </Container>
  );
}
