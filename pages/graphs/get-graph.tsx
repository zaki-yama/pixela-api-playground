import {
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Code,
  Stack,
  chakra,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import Layout from "../../components/layout";

type FormData = {
  username: string;
  token: string;
};

const fetcher = async (method: string, url: string, token: string) => {
  const res = await fetch(
    `https://pixe.la/v1/users${url}`,

    {
      method,
      headers: {
        "X-USER-TOKEN": token,
      },
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

export default function GetGraphs() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [shouldFetch, setShouldFetch] = useState(false);
  const {
    isValidating,
    data: graphs,
    error,
  } = useSWR(
    shouldFetch
      ? ["GET", `/${getValues().username}/graphs`, getValues().token]
      : null,
    fetcher
  );

  const onSubmit = () => {
    setShouldFetch(true);
  };

  console.log(errors);
  return (
    <Layout>
      <Heading as="h1" size="lg">
        GET - /v1/users/&lt;username&gt;/graphs
      </Heading>

      <chakra.p py="4">
        Get all predefined pixelation graph definitions.
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel htmlFor="username">username</FormLabel>
            <Input
              id="username"
              type="text"
              {...register("username", {
                required: "This is required.",
              })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.token}>
            <FormLabel htmlFor="token">token</FormLabel>
            <Input
              id="token"
              type="text"
              {...register("token", {
                required: "This is required.",
              })}
            />
            <FormErrorMessage>
              {errors.token && errors.token.message}
            </FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="teal" isLoading={isValidating}>
            Execute
          </Button>
        </Stack>
      </form>
      <Heading size="md" pt="12" pb="4">
        Response
      </Heading>
      <Code display="block" whiteSpace="pre">
        {JSON.stringify(graphs, null, 2)}
      </Code>
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
