import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import axios from "axios";
import { Button } from "../../../components/form/button";
import { useForm } from "../../../hook/useForm";
import { ButtonSelectControl } from "../../../components/form/buttonSelect/buttonSelectControl";

export const confirmServiceFormSchema = z.object({
  day: z.number(),
  hour: z.number(),
});

// type ConfirmServiceFormValues = z.infer<typeof confirmServiceFormSchema>;
interface ConfirmServiceDialogContentProps {
  serviceId: string;
  placeId: string;
}
export const ConfirmServiceDialogContent = ({
  serviceId,
  placeId,
}: ConfirmServiceDialogContentProps) => {
  const emailPasswordSignInForm = useForm({
    defaultValues: { day: 1, hour: 1 },

    schema: confirmServiceFormSchema,
  });

  const addVisitMutation = useMutation({
    mutationKey: ["add-visit"],
    mutationFn: () =>
      axios.post(
        "/my-visits",
        {
          serviceId,
          placeId,
        },
        { withCredentials: true },
      ),
    // onSuccess: () => {
    //   // navigate("/");
    //   // queryClient.invalidateQueries();
    // },
  });

  const onSubmitEmailPasswordSignIn = async () => {
    addVisitMutation.mutate();
  };
  return (
    <form
      onSubmit={emailPasswordSignInForm.handleSubmit(
        onSubmitEmailPasswordSignIn,
      )}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <ButtonSelectControl
          className="md:justify-center"
          control={emailPasswordSignInForm.control}
          name="day"
          options={[
            {
              value: "1",
              colorVariants: "gray",
              colorVariantsActive: "darkGray",
              text: "123123",
            },
          ]}
        />
        <ButtonSelectControl
          className="md:justify-center"
          control={emailPasswordSignInForm.control}
          name="hour"
          options={[
            {
              value: "1",
              colorVariants: "gray",
              colorVariantsActive: "darkGray",
              text: "123123",
            },
          ]}
        />
      </div>

      <Button type="submit" isLoading={addVisitMutation.isPending} color="gray">
        Umów
      </Button>
    </form>
  );
};
