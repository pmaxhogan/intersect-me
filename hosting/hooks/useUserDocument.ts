import useUser from "./useUser";
import useFirestoreDocument from "./useFirestoreDocument";
import {UserMeta} from "../types/api";

export default function useUserDocument(): UserMeta {
    const {user} = useUser();
    return useFirestoreDocument("users", user?.uid ?? null).firestoreDoc as UserMeta;
}