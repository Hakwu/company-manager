import { Outlet } from "react-router-dom";

export default function Layout(props) {
    return(
        <div>
            <section>
                <div style={{height: 100, backgroundColor:'yellow'}}>Nav</div>
            </section>
            <section>
                <Outlet />
            </section>
        </div>
    )
}
