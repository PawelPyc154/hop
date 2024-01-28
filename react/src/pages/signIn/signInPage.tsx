import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../../main";
import { z } from "zod";
import { Button } from "../../components/form/button";
import { useForm } from "../../hook/useForm";
import { passwordSchema, usernameSchema } from "../../utils/zod";
import {
  ChildrenWrapper,
  LayoutWithHeading,
} from "../../components/layoutWithHeading";
import { InputControl } from "../../components/form/input/inputControl";
import tw from "tailwind-styled-components";
import { Link, useNavigate } from "react-router-dom";

export const emailPasswordSignInSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

type EmailPasswordSignUpFormValues = z.infer<typeof emailPasswordSignInSchema>;

export const SignInPage = () => {
  const emailPasswordSignInForm = useForm({
    defaultValues: { username: "Login1", password: "Tajne123$" },

    schema: emailPasswordSignInSchema,
  });
  const navigate = useNavigate();
  // const places = useQuery({
  //   queryKey: ["places", ""],
  //   queryFn: async () =>
  //     axios
  //       .get<{
  //         items: {
  //           _id: string;
  //           title: string;
  //           description: string;
  //           image: string;
  //           services: { _id: string; title: string; price: string }[];
  //         }[];
  //       }>("/auth/sign-in")
  //       .then((r) => r.data),
  // });
  // console.log(places.data);
  const emailPasswordSignInMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: () =>
      axios.post(
        "/auth/sign-in",
        {
          username: "Login1",
          password: "Tajne123$",
        },
        // { withCredentials: true },
      ),
    onSuccess: () => {
      navigate("/");
      queryClient.invalidateQueries();
    },
    onError() {
      emailPasswordSignInForm.setError("username", {
        message: "Nieprawidłowe dane logowania",
        type: "custom",
      });
      emailPasswordSignInForm.setError("password", {
        message: "Nieprawidłowe dane logowania",
        type: "custom",
      });
    },
  });

  const onSubmitEmailPasswordSignIn = async (
    values: EmailPasswordSignUpFormValues,
  ) => {
    emailPasswordSignInMutation.mutate();
  };
  return (
    <LayoutWithHeading title="Logowanie">
      <ChildrenWrapper>
        <Section>
          <form
            onSubmit={emailPasswordSignInForm.handleSubmit(
              onSubmitEmailPasswordSignIn,
            )}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <InputControl
                label={"Login"}
                control={emailPasswordSignInForm.control}
                name="username"
                isRequired
                rules={{ deps: ["password"] }}
              />
              <InputControl
                type="password"
                label={"Hasło"}
                control={emailPasswordSignInForm.control}
                name="password"
                isRequired
                rules={{ deps: ["username"] }}
              />
            </div>
            <Button
              type="submit"
              isLoading={emailPasswordSignInMutation.isPending}
              color="gray"
            >
              Zaloguj
            </Button>
          </form>
        </Section>
      </ChildrenWrapper>

      <div className="flex justify-center gap-1 text-center">
        Nie masz jeszcze konta
        <Link className="text-blue-600" to={"/register"}>
          Rejestracja
        </Link>
      </div>
    </LayoutWithHeading>
  );
};

const Section = tw.section`grid gap-4 p-4 xl:p-6`;
