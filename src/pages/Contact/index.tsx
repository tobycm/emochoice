import { Box, Button, Space, Text, TextInput, Textarea, Title } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useEffect } from "react";
import { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

export default function Contact() {
  const form = useForm({
    initialValues: {
      name: "",
      message: "",
      email: "",
    },

    validate: {
      name: isNotEmpty("Enter your full name"),
      message: isNotEmpty("Enter your message"),
      email: isEmail("Invalid email"),
    },
  });

  useEffect(() => {
    setDocumentTitle("Contact");
  }, []);

  return (
    <Box className={classes.container}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2591.5775601812793!2d-119.59203682298623!3d49.49248627142508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54826353ea4cc04b%3A0x8f64bf2deb6375fd!2sEmochoice%20Canada!5e0!3m2!1sen!2sus!4v1697402584985!5m2!1sen!2sus"
        loading="lazy"
        className={classes.map}
      ></iframe>
      <Box component="form" onSubmit={form.onSubmit(() => {})}>
        <Title>Get in Touch with Us</Title>
        <Space h="md" />
        <Text>If you'd like to contact us about a general inquiry, please fill out the form below, or contact our location directly.</Text>
        <Space h="md" />
        <Box className={classes.input}>
          <TextInput withAsterisk label="Full name" placeholder="John Smith" {...form.getInputProps("name")} id="name" />
        </Box>
        <Space h="md" />
        <Box className={classes.input}>
          <TextInput label="Pronouns" placeholder="he/him/his" id="pronouns" />
        </Box>
        <Space h="md" />
        <Box className={classes.input}>
          <TextInput withAsterisk label="Email" placeholder="johnsmith@email.com" {...form.getInputProps("email")} id="email" />
        </Box>
        <Space h="md" />
        <Box className={classes.input}>
          <Textarea
            withAsterisk
            label="Message"
            autosize
            minRows={5}
            maxRows={5}
            placeholder="Feel free to leave a message!"
            {...form.getInputProps("message")}
            id="message"
          />
        </Box>
        <Space h="md" />
        <Button variant="filled" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
