import { useEffect } from "react";
import useNavbarStore from "../store/navbarStore";

export default function Dashboard(){

    const { setTitle } = useNavbarStore(state => state)

    useEffect(() => {
        setTitle('Dashboard')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);    

    return (
        <p>Dashboard</p>
    )
}