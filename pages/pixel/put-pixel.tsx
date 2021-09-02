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
  date: string;
  quantity?: string;
  optionalData?: string;
};

const putPixel = async (
  username: string,
  token: string,
  graphId: string,
  date: string,
  body: Record<string, any>
) => {
  const res = await fetch(
    `https://pixe.la/v1/users/${username}/graphs/${graphId}/${date}`,

    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-USER-TOKEN": token,
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

export default function PutPixel() {
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
      date: "",
      quantity: "",
      optionalData: "",
    },
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<any>(null);

  const onSubmit = async () => {
    const { username, token, graphId, date, ...body } = getValues();
    try {
      const response = await putPixel(username, token, graphId, date, body);
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
        PUT - /v1/users/&lt;username&gt;/graphs/&lt;graphID&gt;/&lt;yyyyMMdd&gt;
      </Heading>

      <chakra.p py="4">
        Update the quantity already registered as a &quot;Pixel&quot;. If target
        &quot;Pixel&quot; not exist, create a new &quot;Pixel&quot; and set
        quantity.
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input name="username" required register={register} errors={errors} />
          <Input name="token" required register={register} errors={errors} />
          <Input name="graphId" required register={register} errors={errors} />
          <Date name="date" required register={register} errors={errors} />
          <Input name="quantity" required register={register} errors={errors} />
          <Input name="optionalData" register={register} errors={errors} />
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
