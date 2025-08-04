import { Button } from "../components/common/Buttons";
import { CgSmileSad } from "react-icons/cg";

export default function NotFound() {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <CgSmileSad size={40} />
            <h1 className="text-2xl">Page not found</h1>
            <Button variant="blue" onClick={() => history.back()}>
                Go back
            </Button>
        </div>
    );
}
