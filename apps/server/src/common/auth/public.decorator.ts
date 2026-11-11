import { Reflector } from "@nestjs/core";

export const IS_PUBLIC_KEY = "is_public_key";

export const Public = Reflector.createDecorator<boolean>({
    key: IS_PUBLIC_KEY,
    transform: () => true,
});
