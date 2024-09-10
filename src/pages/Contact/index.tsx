import { Box, Button, NativeSelect, Space, Text, TextInput, Textarea, Title } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";
import { formatPhoneNumber } from "../../lib/utils";
import classes from "./index.module.css";

export default function Contact() {
  const [contactMethod, setContactMethod] = useState("Email & Phone number");
  const form = useForm({
    initialValues: {
      name: "",
      message: "",
      email: "",
      phone_number: "",
    },
    validate: {
      name: isNotEmpty("Enter your full name"),
      message: isNotEmpty("Enter your message"),
      email: contactMethod.includes("Email") ? isEmail("Enter a valid email") : undefined,
      phone_number: contactMethod.includes("Phone number") ? isNotEmpty("Enter a valid phone number") : undefined,
    },
  });

  return (
    <Box className={classes.container}>
      <SmallChangeHelmet title="Contact" description="Get in Touch with Emochoice Canada now!" location="contact" />
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2591.266085248253!2d-119.59623632444682!3d49.49836897142607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54826353ea4cc04b%3A0x8f64bf2deb6375fd!2sEmochoice%20Canada!5e0!3m2!1sen!2sca!4v1725927089435!5m2!1sen!2sca"
        loading="lazy"
        className={classes.map}
      />
      <Box
        component="form"
        onSubmit={form.onSubmit(async () => {
          try {
            const submitData = {
              name: form.values.name,
              message: form.values.message,
              contact: `${form.values.email}${form.values.email && form.values.phone_number && ", "}${form.values.phone_number}`,
            };
            // TODO: Refactor ;-;
            await fetch("https://api.emochoice.ca/contact", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(submitData),
            }).then((res) => {
              if (res.status !== 200) throw new Error("Error sending message. Please try again later.");
            });
            notifications.show({
              title: "Success",
              message: "Message sent successfully!",
              color: "emochoice-green",
              icon: <IconCheck stroke={2} />,
              autoClose: 5000,
              withCloseButton: true,
            });
            form.reset();
          } catch (err) {
            notifications.show({
              title: "Error",
              message: (err as Error).message,
              color: "red",
              icon: <IconX stroke={2} />,
              autoClose: 5000,
              withCloseButton: true,
            });
          }
        })}
      >
        <Title mb="md">Get in Touch with Us</Title>
        <Text mb="md">If you'd like to contact us about a general inquiry, please fill out the form below, or contact our location directly.</Text>
        <Box className={classes.input} mb="md">
          <TextInput withAsterisk label="Full name" placeholder="John Smith" {...form.getInputProps("name")} id="name" />
        </Box>
        <Box className={classes.input}>
          <NativeSelect
            required
            withAsterisk
            label="Contact Method"
            mb="md"
            value={contactMethod}
            onChange={(e) => {
              setContactMethod(e.currentTarget.value);
              if (e.currentTarget.value === "Email") form.setFieldValue("phone_number", "");
              if (e.currentTarget.value === "Phone number") form.setFieldValue("email", "");
            }}
            data={["Email", "Phone number", "Email & Phone number"]}
          />
          {contactMethod.includes("Email") && (
            <TextInput mb={"md"} withAsterisk label="Email" placeholder="johnsmith@email.com" {...form.getInputProps("email")} id="email" />
          )}
          {contactMethod.includes("Phone number") && (
            <TextInput
              mb={"md"}
              withAsterisk
              label="Phone number"
              placeholder="(123) 456-7890"
              {...form.getInputProps("phone_number")}
              id="phone_number"
              maxLength={14}
              onChange={(e) => {
                if (e.currentTarget.value.length == 0) return form.setFieldValue("phone_number", "");
                if (!/^[0-9() -]+$/.test(e.currentTarget.value)) return;
                form.setFieldValue(
                  "phone_number",
                  e.currentTarget.value.length < form.values.phone_number.length ? e.currentTarget.value : formatPhoneNumber(e.currentTarget.value),
                );
              }}
            />
          )}
        </Box>
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
