import {
  Heading,
  Button,
  RadioGroup,
  Radio,
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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Layout from "../../components/layout";

type FormData = {
  username: string;
  token: string;
  graphId: string;
  name?: string;
  unit?: string;
  color?: "shibafu" | "momiji" | "sora" | "ichou" | "ajisai" | "kuro";
  timezone?: string;
  purgeCacheURLs?: string[];
  selfSufficient?: string;

  // limited to supporters
  isSecret?: boolean;
  publishOptionalData?: boolean;
};

type RequestBody = Omit<FormData, "username" | "token" | "graphId">;

const putGraph = async (
  username: string,
  token: string,
  graphId: string,
  params: RequestBody
) => {
  const body: RequestBody = (
    Object.keys(params) as (keyof RequestBody)[]
  ).reduce<RequestBody>((acc, curr) => {
    if (params[curr]) {
      // @ts-ignore
      acc[curr] = params[curr];
    }
    return acc;
  }, {});

  const res = await fetch(
    `https://pixe.la/v1/users/${username}/graphs/${graphId}`,

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

export default function PutGraph() {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      token: "",
      name: "",
      unit: "",
      color: "shibafu",
    },
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<any>(null);

  const onSubmit = async () => {
    const { username, token, graphId, ...body } = getValues();
    try {
      const response = await putGraph(username, token, graphId, body);
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
        PUT - /v1/users/&lt;username&gt;/graphs&lt;graphID&gt;
      </Heading>

      <chakra.p py="4">
        Update predefined pixelation graph definitions.
        <br />
        The items that can be updated are limited as compared with the
        pixelation graph definition creation.
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
            name="token"
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
          <Input name="name" register={register} errors={errors}></Input>
          <Input name="unit" register={register} errors={errors}></Input>
          <FormControl>
            <FormLabel>color</FormLabel>
            <Select
              {...register("color", {
                required: "This is required",
              })}
            >
              <option value="shibafu">shibafu (green)</option>
              <option value="momiji">momiji (red)</option>
              <option value="sora">sora (blue)</option>
              <option value="ichou">ichou (yellow)</option>
              <option value="ajisai">ajisai (purple)</option>
              <option value="kuro">kuro (black)</option>
            </Select>
          </FormControl>
          <Input name="timezone" register={register} errors={errors}></Input>
          <Input
            name="purgeCacheURLs"
            register={register}
            errors={errors}
          ></Input>
          <FormControl>
            <FormLabel>selfSufficient</FormLabel>
            <Select {...register("selfSufficient")}>
              <option value=""></option>
              <option value="increment">increment</option>
              <option value="decrement">decrement</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>isSecret</FormLabel>
            <Checkbox {...register("isSecret")} value="true">
              true
            </Checkbox>
          </FormControl>
          <FormControl>
            <FormLabel>publishOptionalData</FormLabel>
            <Checkbox {...register("publishOptionalData")} value="true">
              true
            </Checkbox>
          </FormControl>
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
