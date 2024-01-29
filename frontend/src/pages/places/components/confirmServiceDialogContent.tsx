import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import axios from "axios";
import { Button } from "../../../components/form/button";
import { useForm } from "../../../hook/useForm";
import { ButtonSelectControl } from "../../../components/form/buttonSelect/buttonSelectControl";
import { timeIntervals, next7Days } from "../../../utils/timeIntervals";
import { Heading } from "../../../components/common/heading";
import { queryClient } from "../../..//main";
import { useNavigate } from "react-router-dom";

const hours = timeIntervals({ min: 6, max: 17 });

const nextDays = next7Days();

export const confirmServiceFormSchema = z.object({
  day: z.string(),
  hour: z.string(),
});

type ConfirmServiceFormValues = z.infer<typeof confirmServiceFormSchema>;
interface ConfirmServiceDialogContentProps {
  serviceId: string;
  placeId: string;
}
export const ConfirmServiceDialogContent = ({
  serviceId,
  placeId,
}: ConfirmServiceDialogContentProps) => {
  const navigate = useNavigate();

  const emailPasswordSignInForm = useForm({
    schema: confirmServiceFormSchema,
  });

  const addVisitMutation = useMutation({
    mutationKey: ["add-visit"],
    mutationFn: (date: string) => {
      return axios.post(
        "/visits",
        {
          serviceId,
          placeId,
          visitDate: date,
        },
        { withCredentials: true },
      );
    },
    onSuccess: () => {
      navigate("/my-visits");
      queryClient.invalidateQueries();
    },
  });
  const onSubmitEmailPasswordSignIn = async (
    values: ConfirmServiceFormValues,
  ) => {
    const date = new Date(values.day);
    const [hour, minutes] = values.hour.split(":");
    date.setHours(Number(hour));
    date.setMinutes(Number(minutes));
    addVisitMutation.mutate(date.toISOString());
  };

  return (
    <form
      onSubmit={emailPasswordSignInForm.handleSubmit(
        onSubmitEmailPasswordSignIn,
      )}
      className="grid gap-8"
    >
      <div className="grid gap-4">
        <Heading size="2xl" tag="h3" className="text-center">
          Dzień
        </Heading>
        <ButtonSelectControl
          className="md:justify-center"
          control={emailPasswordSignInForm.control}
          name="day"
          options={nextDays.map((item) => ({
            value: item,
            colorVariants: "gray",
            colorVariantsActive: "darkGray",
            text: item,
          }))}
        />
        <Heading size="2xl" tag="h3" className="text-center">
          Godzina
        </Heading>
        <ButtonSelectControl
          control={emailPasswordSignInForm.control}
          name="hour"
          options={hours.map((item) => ({
            value: item,
            colorVariants: "gray",
            colorVariantsActive: "darkGray",
            text: item,
          }))}
        />
      </div>

      <Button type="submit" isLoading={addVisitMutation.isPending} color="gray">
        Umów
      </Button>
    </form>
  );
};
