import { forwardRef } from "react";
import { BsPerson } from "react-icons/bs";
import tw from "tailwind-styled-components";

interface AvatarProps {}
export const Avatar = forwardRef<HTMLButtonElement, AvatarProps>(({}, ref) => (
  <Container ref={ref}>
    <BsPerson size={22} />
  </Container>
));
Avatar.displayName = "Avatar";

const Container = tw.button`flex shrink-0 font-medium items-center justify-center h-10 w-10 bg-gray-100 shadow-lg shadow-gray-100 rounded-full overflow-hidden`;
