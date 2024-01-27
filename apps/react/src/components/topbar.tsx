"use client";
import tw from "tailwind-styled-components";
import { Button, LinkButton } from "./form/button";
import { useAuth } from "../context/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

interface TopBarProps {}

export const TopBar = ({}: TopBarProps) => {
  const auth = useAuth();
  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => axios.post("/auth/logout", {}, { withCredentials: true }),
    onSuccess: () => {
      location.reload();
    },

    gcTime: 1000 * 10,
  });
  return (
    <Container>
      <LeftWrapper>
        <LinkButton to="/" color="gray">
          Oferty
        </LinkButton>
      </LeftWrapper>
      <Link to="/">
        <CenterWrapper>LOGO</CenterWrapper>
      </Link>
      <RightWrapper>
        {auth.isAuthenticated ? (
          <>
            <LinkButton color="gray" to="/my-visits">
              Moje wizyty
            </LinkButton>
            <Button
              color="gray"
              onClick={() => {
                logoutMutation.mutate();
              }}
            >
              Wyloguj
            </Button>
          </>
        ) : (
          <>
            <LinkButton color="gray" to="/login">
              Logowanie
            </LinkButton>
            <LinkButton color="gray" to="/register">
              Rejestracja
            </LinkButton>
          </>
        )}
      </RightWrapper>
    </Container>
  );
};

const Container = tw.nav`bg-white h-14 md:h-16 flex gap-2 justify-between border-b border-gray-100 lg:grid lg:grid-cols-[1fr,max-content,1fr] px-3 xl:px-4 items-center sticky top-0 z-50`;
const LeftWrapper = tw.div`hidden lg:flex gap-2`;
const CenterWrapper = tw.div`text-2xl md:text-2xl md:flex items-center gap-1 font-normal`;
const RightWrapper = tw.div`justify-end gap-2 flex items-center`;
