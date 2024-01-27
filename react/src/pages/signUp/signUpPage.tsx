import { useMutation } from "@tanstack/react-query";
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
import { CheckboxControl } from "../../components/form/checkbox/checkboxControl";
import { Link, useNavigate } from "react-router-dom";

export const emailPasswordSignUpSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    confirmConsents: z.literal<boolean>(true, {
      errorMap: () => ({ message: "Wymagane" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don'T match",
    path: ["confirmPassword"],
  });

type EmailPasswordSignUpFormValues = z.infer<typeof emailPasswordSignUpSchema>;

export const SignUpPage = () => {
  const emailPasswordSignUpForm = useForm({
    defaultValues: { username: "Login1", password: "Tajne123$" },

    schema: emailPasswordSignUpSchema,
  });

  const navigate = useNavigate();

  const emailPasswordSignUpMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) =>
      axios.post(
        "/auth/sign-up",
        {
          username,
          password,
        },
        { withCredentials: true }
      ),
    onSuccess: () => {
      navigate("/");
      queryClient.invalidateQueries();
    },
    onError() {
      emailPasswordSignUpForm.setError("username", {
        message: "Nieprawidłowe dane logowania",
        type: "custom",
      });
      emailPasswordSignUpForm.setError("password", {
        message: "Nieprawidłowe dane logowania",
        type: "custom",
      });
    },
  });

  const onSubmitEmailPasswordSignUp = async (
    values: EmailPasswordSignUpFormValues
  ) => {
    emailPasswordSignUpMutation.mutate({
      username: values.username,
      password: values.password,
    });
  };
  return (
    <LayoutWithHeading title="Rejestracja">
      <ChildrenWrapper>
        <Section>
          <form
            onSubmit={emailPasswordSignUpForm.handleSubmit(
              onSubmitEmailPasswordSignUp
            )}
            className="grid gap-4"
          >
            <div className="grid">
              <div className="grid gap-2">
                <InputControl
                  label={"Login"}
                  control={emailPasswordSignUpForm.control}
                  name="username"
                  isRequired
                />
                <InputControl
                  type="password"
                  label={"Hasło"}
                  control={emailPasswordSignUpForm.control}
                  name="password"
                  isRequired
                />
                <InputControl
                  type="password"
                  label={"Potwierdz hasło"}
                  control={emailPasswordSignUpForm.control}
                  name="confirmPassword"
                  isRequired
                />
              </div>

              <CheckboxControl
                className={"pt-4"}
                color="black"
                isRequiredText={true}
                name={"confirmConsents"}
                text={<div>Zgoda regulaminy</div>}
                control={emailPasswordSignUpForm.control}
              />
              <Button
                className={"mt-4"}
                type="submit"
                isLoading={emailPasswordSignUpMutation.isPending}
                color="gray"
              >
                Załóż konto
              </Button>
            </div>
          </form>
        </Section>
      </ChildrenWrapper>

      <div className="flex gap-1 text-center justify-center">
        Masz już konto?
        <Link className="text-blue-600" to={"/login"}>
          Zaloguj się
        </Link>
      </div>
    </LayoutWithHeading>
  );
};

const Section = tw.section`grid gap-4 p-4 xl:p-6`;
