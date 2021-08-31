import {
  Heading,
  Button,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Code,
  Stack,
  chakra,
} from "@chakra-ui/react";
import Input from "../../components/forms/input";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Layout from "../../components/layout";

type FormData = {
  token: string;
  username: string;

  agreeTermsOfService: "yes";
  notMinor: "yes" | "no";
  thanksCode?: string;
};

const postUser = async (body: Record<string, any>) => {
  const res = await fetch(
    "https://pixe.la/v1/users",

    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    // TODO: define custom error
    const error = new Error("API request failed");
    // @ts-ignore
    error.info = await res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function PostUser() {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      token: "",
    },
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<any>(null);

  const onSubmit = async () => {
    try {
      const response = await postUser(getValues());
      console.log(response);
      setResponse(response);
      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Layout>
      <Heading as="h1" size="lg">
        POST - /v1/users
      </Heading>

      <chakra.p py="4">Create a new Pixela user.</chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          {/* TODO: add validation rule: [a-z][a-z0-9-]{1,32} */}
          <Input name="username" required register={register} errors={errors} />
          {/* TODO: add validation rule: [ -~]{8,128} */}
          <Input name="token" required register={register} errors={errors} />

          <FormControl isInvalid={!!errors.agreeTermsOfService}>
            <FormLabel htmlFor="agreeTermsOfService">
              agreeTermsOfService
            </FormLabel>
            <Checkbox
              {...register("agreeTermsOfService", {
                required: "This is required.",
              })}
              value="yes"
            >
              yes
            </Checkbox>
            <FormErrorMessage>
              {errors.agreeTermsOfService?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.notMinor}>
            <FormLabel>notMinor</FormLabel>
            <Controller
              name="notMinor"
              control={control}
              rules={{ required: "This is required." }}
              render={({ field: { onChange, value } }) => {
                return (
                  <RadioGroup onChange={onChange} value={value}>
                    <Stack spacing={4} direction="row">
                      <Radio value="yes">yes</Radio>
                      <Radio value="no">no</Radio>
                    </Stack>
                  </RadioGroup>
                );
              }}
            />
            <FormErrorMessage>{errors.notMinor?.message}</FormErrorMessage>
          </FormControl>
          <Input name="thanksCode" register={register} errors={errors} />
          <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
            Execute
          </Button>
        </Stack>
      </form>
      <Heading size="md" pt="12" pb="4">
        Response
      </Heading>
      {response && (
        <Code display="block" whiteSpace="pre">
          {JSON.stringify(response, null, 2)}
        </Code>
      )}
      {error && (
        <>
          <Alert status="error">
            <AlertIcon />
            {error.status}
          </Alert>
          <Code colorScheme="red" display="block" whiteSpace="pre">
            {JSON.stringify(error.info, null, 2)}
          </Code>
        </>
      )}
    </Layout>
  );
}
