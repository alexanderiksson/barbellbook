import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";

export default function Stats() {
    return (
        <div className="content">
            <BackButton to="/history" label="Back" />
            <PageHeading>Stats</PageHeading>
        </div>
    );
}
