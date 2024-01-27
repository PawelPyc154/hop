// import { PlaceCategory, placeCategories } from "types";
import { LinkButton } from "../../../components/form/button";
import tw from "tailwind-styled-components";

const categoryMap: Record<any, string> = {
  hairdresser: "Fryzjer",
  barber: "Barber",
  "beauty-studio": "Studio piękności",
  nails: "Kosmetyczka",
  massage: "Masażysta",
  pets: "Zwierzęta",
  physiotherapy: "Fizjoterapełta",
  dentist: "Dentysta",
};

export const Categories = () => {
  return (
    <Container>
      <LinkButton color="white" to={`/`}>
        Wszystkie
      </LinkButton>
      {[].map((category) => (
        <>
          <LinkButton color="white" to={`/places/${category}`}>
            {categoryMap[category]}
          </LinkButton>
        </>
      ))}
    </Container>
  );
};
const Container = tw.div`flex justify-center gap-4 flex-wrap`;
