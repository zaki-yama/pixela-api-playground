import {
  Heading,
  Button,
  Box,
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
import Date from "../../components/forms/date";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useSWR from "swr";

import Layout from "../../components/layout";

type Form = {
  username: string;
  graphId: string;
  date: string;
  appearance?: "dark";
};

const fetcher = async (
  username: string,
  graphId: string,
  date: string,
  appearance?: string
) => {
  const queryParams = new URLSearchParams();
  if (date) queryParams.set("date", date);
  if (appearance) queryParams.set("appearance", appearance);

  const res = await fetch(
    `https://pixe.la/v1/users/${username}/graphs/${graphId}/${date}/retina`
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
  token: "",
  graphId: "",
};

export default function GetRetina() {
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
          getValues().username,
          getValues().graphId,
          getValues().date,
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
        GET -
        /v1/users/&lt;username&gt;/graphs/&lt;graphID&gt;/&lt;yyyyMMdd&gt;/retina
      </Heading>

      <chakra.p py="4">
        Displays the Pixel specified by <code>yyyyMMdd</code> in a higher
        resolution (hourly).
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input name="username" required register={register} errors={errors} />
          <Input name="graphId" required register={register} errors={errors} />
          <Date name="date" required register={register} errors={errors} />
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
