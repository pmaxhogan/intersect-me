import {useEffect, useState} from "react";
import {User} from "@firebase/auth";
import useAuth from "./useAuth";

export default function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();

    useEffect(() => {
        return auth.onAuthStateChanged((user: User | null) => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    return { user, loading, auth };
}