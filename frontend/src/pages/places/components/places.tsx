import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import tw from "tailwind-styled-components";
import { Button, LinkButton } from "../../../components/form/button";
import { Heading } from "../../../components/common/heading";
import { DialogTrigger } from "../../../components/common/dialog/dialogTrigger";
import { ConfirmServiceDialogContent } from "./confirmServiceDialogContent";
import { useAuth } from "../../../context/auth";
import { Spinner } from "../../../components/common/spinner";

export const Places = () => {
  const { category } = useParams<"category">();
  const places = useQuery({
    queryKey: ["places", category],
    queryFn: async () =>
      axios
        .get<{
          items: {
            _id: string;
            title: string;
            description: string;
            image: string;
            services: { _id: string; title: string; price: string }[];
          }[];
        }>(`/places`, {
          params: { category: category },
        })
        .then((r) => r.data),
  });
  const { isAuthenticated } = useAuth();

  if (places.isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      {places.data?.items.map(
        ({ _id, title, description, services, image }) => (
          <Wrapper key={_id}>
            <Info>
              <ImageWrapper>
                <Image height={"200px"} width={"200px"} src={image} />
              </ImageWrapper>
              <InfoWrapper>
                <Heading size="3xl" tag="h2">
                  {title}
                </Heading>
                <Description>{description}</Description>
              </InfoWrapper>
            </Info>
            <Services>
              <Heading size="xl" tag="h3">
                Usługi:
              </Heading>
              <ServicesList>
                {services.map((item) => (
                  <Service key={item._id}>
                    <Heading size="sm" tag="h4" className="flex-1">
                      {item.title}
                    </Heading>

                    {`${item.price} PLN`}

                    {isAuthenticated ? (
                      <DialogTrigger
                        trigger={
                          <Button color={"gray"} size="md">
                            Umów
                          </Button>
                        }
                        title={item.title}
                      >
                        {() => (
                          <ConfirmServiceDialogContent
                            serviceId={item._id}
                            placeId={_id}
                          />
                        )}
                      </DialogTrigger>
                    ) : (
                      <LinkButton to={"/login"} color={"gray"} size="md">
                        Umów
                      </LinkButton>
                    )}
                  </Service>
                ))}
              </ServicesList>
            </Services>
          </Wrapper>
        ),
      )}
    </Container>
  );
};

const Container = tw.div`grid w-full gap-6 max-w-4xl mx-auto`;
const Wrapper = tw.div`bg-white rounded-md shadow-sm p-6 pb-4 grid gap-6`;
const Info = tw.div`md:grid-cols-[max-content,1fr] grid gap-4 justify-items-center`;
const InfoWrapper = tw.div``;
const Description = tw.div`text-base`;
const Services = tw.div`grid `;
const ServicesList = tw.div`grid divide-y`;
const Service = tw.div`flex gap-4 justify-between items-center py-2`;
const ImageWrapper = tw.div`overflow-hidden rounded-md`;
const Image = tw.img``;
