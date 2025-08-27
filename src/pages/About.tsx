import BackButton from "../components/common/BackButton";
import PageHeading from "../components/common/PageHeading";

export default function About() {
    return (
        <div className="content">
            <BackButton to="/settings" label="Settings" />

            <PageHeading>About This App</PageHeading>

            <div className="space-y-4">
                <p>
                    BarbellBook is a web-based workout logger that lets you effortlessly track your
                    sets, reps, and progress.
                </p>
                <p>
                    Your data is securely saved locally in your browser, so you stay in control
                    without any sign-ups or cloud storage.
                </p>
                <p>Perfect for lifters of all levels to stay motivated and reach their goals.</p>
            </div>
        </div>
    );
}
