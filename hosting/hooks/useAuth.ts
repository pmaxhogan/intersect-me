import {getAuth} from "firebase/auth";
import useFirebaseApp from "./useFirebaseApp";

export default function useAuth(){
    const app = useFirebaseApp();
    return getAuth(app);
}