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
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [form, setForm] = useState<FormData>({
    username: "",
    token: "",
  });
  const [shouldFetch, setShouldFetch] = useState(false);
  const {
    isValidating,
    data: graphs,
    error,
  } = useSWR(
    shouldFetch ? ["GET", `/${form.username}/graphs`, form.token] : null,
    fetcher
  );
  console.log(error);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    key: keyof FormData
  ) => {
    setShouldFetch(false);
    setForm({ ...form, [key]: event.target.value });
  };

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
          <FormControl>
            <FormLabel>token</FormLabel>
            <Input
              type="text"
              onChange={(e) => handleChange(e, "token")}
              value={form.token}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
            Execute
          </Button>
        </Stack>
      </form>
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
