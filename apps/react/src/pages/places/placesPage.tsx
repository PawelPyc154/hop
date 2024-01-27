import tw from "tailwind-styled-components";
import { Categories } from "./components/categories";
import { Places } from "./components/places";
import { useParams } from "react-router-dom";

export const PlacesPage = () => {
  return (
    <Container>
      <Categories />
      <Places />
    </Container>
  );
};

const Container = tw.div`px-4 pt-4 md:pt-10 pb-6 grid gap-4 md:gap-10`;
