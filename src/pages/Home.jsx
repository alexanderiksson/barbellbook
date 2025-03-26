import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="content flex justify-center items-center h-screen">
            <Link
                to="/workout"
                className="bg-red-500 px-4 py-2 rounded inline-flex justify-center items-center"
            >
                Start workout
            </Link>
        </div>
    );
}
