import {
  Heading,
  Button,
  Box,
  Select,
  Checkbox,
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
import { useForm } from "react-hook-form";
import { useState } from "react";
import useSWR from "swr";

import Layout from "../../components/layout";

type Form = {
  username: string;
  graphId: string;
  date?: string;
  mode?: "short" | "badge" | "line";
  appearance?: "dark";
};

const fetcher = async (
  method: string,
  url: string,
  date?: string,
  mode?: string,
  apperance?: string
) => {
  const queryParams = new URLSearchParams();
  if (date) queryParams.set("date", date);
  if (mode) queryParams.set("mode", mode);
  if (apperance) queryParams.set("appearance", apperance);

  const res = await fetch(
    `https://pixe.la/v1/users${url}?${queryParams.toString()}`,

    {
      method,
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

  return res.text();
};

const DEFAULT_VALUES = {
  username: "",
  graphId: "",
};

export default function GetSvg() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Form>({ defaultValues: DEFAULT_VALUES });
  const [shouldFetch, setShouldFetch] = useState(false);
  const {
    isValidating,
    data: svg,
    error,
  } = useSWR(
    shouldFetch
      ? [
          "GET",
          `/${getValues().username}/graphs/${getValues().graphId}`,
          getValues().date,
          getValues().mode,
          getValues().appearance,
        ]
      : null,
    fetcher
  );
  console.log(error);

  const onSubmit = () => {
    setShouldFetch(true);
  };

  return (
    <Layout>
      <Heading as="h1" size="lg">
        GET - /v1/users/&lt;username&gt;/graphs/&lt;graphID&gt;
      </Heading>

      <chakra.p py="4">
        Based on the registered information, express the graph in SVG format
        diagram.
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input
            name="username"
            required
            register={register}
            errors={errors}
          ></Input>
          <Input
            name="graphId"
            required
            register={register}
            errors={errors}
          ></Input>
          <Input name="date" register={register} errors={errors}></Input>
          <FormControl>
            <FormLabel htmlFor="mode">mode</FormLabel>
            <Select {...register("mode")}>
              <option value=""></option>
              <option value="short">short</option>
              <option value="badge">badge</option>
              <option value="line">line</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="appearance">appearance</FormLabel>
            <Checkbox {...register("appearance")} value="dark">
              dark
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
        {svg && <Box py={8} dangerouslySetInnerHTML={{ __html: svg }}></Box>}
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
