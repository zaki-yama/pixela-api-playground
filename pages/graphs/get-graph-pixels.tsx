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
  token: string;
  graphId: string;
  from?: string;
  to?: string;
  withBody?: boolean;
};

const fetcher = async (
  method: string,
  url: string,
  token: string,
  from: string,
  to: string,
  withBody: boolean
) => {
  const queryParams = new URLSearchParams();
  if (from) queryParams.set("from", from);
  if (to) queryParams.set("to", to);
  if (withBody) queryParams.set("withBody", withBody.toString());

  const res = await fetch(
    `https://pixe.la/v1/users${url}?${queryParams}`,

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

export default function GetGraphPixels() {
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
          "GET",
          `/${getValues().username}/graphs/${getValues().graphId}/pixels`,
          getValues().token,
          getValues().from,
          getValues().to,
          getValues().withBody,
        ]
      : null,
    fetcher
  );

  const onSubmit = () => {
    setShouldFetch(true);
  };

  return (
    <Layout>
      <Heading as="h1" size="lg">
        GET - /v1/users/&lt;username&gt;/graphs/pixels
      </Heading>

      <chakra.p py="4">
        Get a Date list of Pixel registered in the graph specified by graphID.
        <br />
        You can specify a period with from and to parameters.
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input name="username" required register={register} errors={errors} />
          <Input name="token" required register={register} errors={errors} />
          <Input name="graphId" required register={register} errors={errors} />
          <Input name="from" register={register} errors={errors} />
          <Input name="to" register={register} errors={errors} />
          <FormControl>
            <FormLabel>withBody</FormLabel>
            <Checkbox {...register("withBody")} value="true">
              true
            </Checkbox>
          </FormControl>
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
