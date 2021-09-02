import {
  Heading,
  Button,
  Alert,
  AlertIcon,
  Code,
  Stack,
  chakra,
} from "@chakra-ui/react";
import Input from "../../components/forms/input";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Layout from "../../components/layout";
import Date from "../../components/forms/date";

type FormData = {
  username: string;
  token: string;
  graphId: string;
};

const incrementPixel = async (
  username: string,
  token: string,
  graphId: string
) => {
  const res = await fetch(
    `https://pixe.la/v1/users/${username}/graphs/${graphId}/increment`,
    {
      method: "PUT",
      headers: {
        "Content-Length": "0",
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

export default function IncrementPixel() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      token: "",
      graphId: "",
    },
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<any>(null);

  const onSubmit = async () => {
    const { username, token, graphId } = getValues();
    try {
      const response = await incrementPixel(username, token, graphId);
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
        PUT - /v1/users/&lt;username&gt;/graphs/&lt;graphID&gt;/increment
      </Heading>

      <chakra.p py="4">
        Increment quantity &quot;Pixel&quot; of the day (it is used
        &quot;timezone&quot; setting if Graph&apos;s &quot;timezone&quot; is
        specified, if not specified, calculates it in &quot;UTC&quot;).
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input name="username" required register={register} errors={errors} />
          <Input name="token" required register={register} errors={errors} />
          <Input name="graphId" required register={register} errors={errors} />
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
