interface ErrorProps {
    msg?: string;
}

export default function Error({ msg = "Something went wrong" }: ErrorProps) {
    return (
        <p className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-neutral-200">
            {msg}
        </p>
    );
}
