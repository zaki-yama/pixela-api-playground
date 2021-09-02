import {
  Heading,
  Button,
  Stack,
  chakra,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import Input from "../../components/forms/input";
import { useForm } from "react-hook-form";

import Layout from "../../components/layout";

type FormData = {
  username: string;
  graphId: string;
  mode?: "simple" | "simple-short";
};

export default function GetGraphDef() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = () => {
    const { username, graphId, mode } = getValues();
    const query = mode && `?mode=${mode}`;
    window.open(
      `https://pixe.la/v1/users/${username}/graphs/${graphId}.html${query}`
    );
  };

  return (
    <Layout>
      <Heading as="h1" size="lg">
        GET - /v1/users/&lt;username&gt;/graphs/&lt;graphID&gt;.html
      </Heading>

      <chakra.p py="4">
        Displays the details of the graph in html format.
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input name="username" required register={register} errors={errors} />
          <Input name="graphId" required register={register} errors={errors} />
          <FormControl>
            <FormLabel>mode</FormLabel>
            <Select {...register("mode")}>
              <option value=""></option>
              <option value="simple">simple</option>
              <option value="simple-short">simple-short</option>
            </Select>
          </FormControl>

          <Button type="submit" colorScheme="teal">
            Open graph page
          </Button>
        </Stack>
      </form>
    </Layout>
  );
}
