import useFirebaseApp from "./useFirebaseApp";
import {getFirestore} from "@firebase/firestore";

export default function useFirestore(){
    const app = useFirebaseApp();
    return getFirestore(app);
}