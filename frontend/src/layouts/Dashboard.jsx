import { Outlet } from "react-router-dom";

export default function layoutDashboard () {
    return (
        <>
            <h1>DASHBOARD</h1>


            <Outlet key="layout-dashboard" />
        </>

    )
}