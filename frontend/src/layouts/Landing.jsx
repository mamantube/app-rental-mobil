import { Outlet } from "react-router-dom";

export default function layoutLanding () {
    return (
        <>
            <h1>LANDING</h1>


            <Outlet key="layout-landing" />
        </>

    )
}