import {
  Heading,
  Button,
  Alert,
  AlertIcon,
  Code,
  Stack,
  chakra,
  FormControl,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";
import Input from "../../components/forms/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import Layout from "../../components/layout";

type FormData = {
  username: string;
  graphId: string;
};

const fetcher = async (username: string, graphId: string) => {
  const res = await fetch(
    `https://pixe.la/v1/users/${username}/graphs/${graphId}/stats`
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

export default function GetGraphStats() {
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
    shouldFetch ? [getValues().username, getValues().graphId] : null,
    fetcher
  );

  const onSubmit = () => {
    setShouldFetch(true);
  };

  return (
    <Layout>
      <Heading as="h1" size="lg">
        GET - /v1/users/&lt;username&gt;/graphs/stats
      </Heading>

      <chakra.p py="4">
        Based on the registered information, get various statistics.
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input name="username" required register={register} errors={errors} />
          <Input name="graphId" required register={register} errors={errors} />
          <Button type="submit" colorScheme="teal" isLoading={isValidating}>
            Execute
          </Button>
        </Stack>
      </form>

      <Heading size="md" pt="12" pb="4">
        Response
      </Heading>
      <Stack spacing={4}>
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
      </Stack>
    </Layout>
  );
}
