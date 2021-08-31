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
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";

import Layout from "../../components/layout";

type FormData = {
  username: string;
  token: string;
  graphId: string;
};

const deleteGraph = async (
  username: string,
  token: string,
  graphId: string
) => {
  const res = await fetch(
    `https://pixe.la/v1/users/${username}/graphs/${graphId}`,

    {
      method: "DELETE",
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

const DEFAULT_VALUES = {
  username: "",
  token: "",
  graphId: "",
};

export default function DeleteGraph() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: DEFAULT_VALUES,
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<any>(null);

  const onSubmit = async () => {
    const { username, token, graphId } = getValues();
    try {
      const response = await deleteGraph(username, token, graphId);
      console.log(response);
      setResponse(response);
      setError(null);
    } catch (error) {
      setResponse(null);
      setError(error);
    }
  };

  return (
    <Layout>
      <Heading as="h1" size="lg">
        DELETE - /v1/users/&lt;username&gt;/graphs/&lt;graphID&gt;
      </Heading>

      <chakra.p py="4">Delete predefined pixelation graph definition.</chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel htmlFor="username">username</FormLabel>
            <Input
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
              type="text"
              {...register("token", {
                required: "This is required.",
              })}
            />
            <FormErrorMessage>
              {errors.token && errors.token.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.graphId}>
            <FormLabel>graphId</FormLabel>
            <Input
              type="text"
              {...register("graphId", {
                required: "This is required.",
              })}
            />
            <FormErrorMessage>
              {errors.graphId && errors.graphId.message}
            </FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
            Execute
          </Button>
        </Stack>
      </form>
      <Stack spacing={4}>
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
      </Stack>
    </Layout>
  );
}
