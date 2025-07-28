"use client";
import LoginButton from "@/components/LoginButton";
//import LoginButton from "./LoginButton";
import { SignedOut, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

function HeaderProfileBtn() {
    return (
    <div className="flex items-center gap-3">
        <UserButton>
            <UserButton.MenuItems>
                <UserButton.Link
                    label="Profile"
                    labelIcon={<User className="size-4" />}
                    href="/profile"
                />
            </UserButton.MenuItems>
        </UserButton>

        <SignedOut>
            <div className="flex items-center">
                <LoginButton />
            </div>
        </SignedOut>
    </div>
);
}
export default HeaderProfileBtn;
