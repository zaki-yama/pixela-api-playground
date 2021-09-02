import {
  Heading,
  Button,
  Alert,
  AlertIcon,
  Code,
  Stack,
  chakra,
  FormErrorMessage,
} from "@chakra-ui/react";
import Input from "../../components/forms/input";
import Date from "../../components/forms/date";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import Layout from "../../components/layout";

type FormData = {
  username: string;
  token: string;
  graphId: string;
  date: string;
};

const fetcher = async (
  username: string,
  token: string,
  graphId: string,
  date: string
) => {
  const res = await fetch(
    `https://pixe.la/v1/users/${username}/graphs/${graphId}/${date}`,
    {
      method: "GET",
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

export default function GetPixel() {
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
      ? [
          getValues().username,
          getValues().token,
          getValues().graphId,
          getValues().date,
        ]
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

      <chakra.p py="4">Get registered quantity as &quot;Pixel&quot;.</chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input name="username" required register={register} errors={errors} />
          <Input name="token" required register={register} errors={errors} />
          <Input name="graphId" required register={register} errors={errors} />
          <Date name="date" required register={register} errors={errors} />
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
