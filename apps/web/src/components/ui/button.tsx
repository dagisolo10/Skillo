import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
    "group/button cursor-pointer inline-flex shrink-0 items-center duration-100 justify-center font-bold tracking-wider select-none outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                outline: "bg-card text-foreground hover:bg-muted shadow-neo active-sink",
                destructive: "bg-red-500 text-white hover:bg-red-600 shadow-neo active-sink",
                ghost: "border-transparent bg-transparent hover:bg-muted hover:text-foreground",
                default: "bg-primary text-foreground hover:bg-primary/70 shadow-neo active-sink",
                secondary: "bg-secondary text-foreground hover:bg-secondary/70 shadow-neo active-sink",
                link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
            },
            size: {
                icon: "size-10 p-0",
                "icon-xs": "size-7 p-0",
                "icon-sm": "size-9 p-0",
                "icon-lg": "size-12 p-0",
                sm: "h-9 gap-1.5 px-3 text-xs",
                default: "h-11 gap-2 px-4 text-xs",
                xs: "h-7 gap-1 px-2.5 text-[10px]",
                lg: "h-12 gap-2 px-6 text-sm font-black",
            },
        },
        compoundVariants: [
            {
                variant: ["default", "outline", "secondary", "destructive"],
                size: ["xs", "sm", "icon-xs", "icon-sm"],
                className: "shadow-neo-sm active-sink-sm",
            },
        ],
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant = "default",
    size = "default",
    ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
    return (
        <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
}

export { Button };
