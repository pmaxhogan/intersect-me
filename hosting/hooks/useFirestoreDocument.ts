import useFirestore from "./useFirestore";
import {useEffect, useState} from "react";
import {doc, DocumentSnapshot, Firestore, onSnapshot} from "firebase/firestore";
import {FirebaseError} from "@firebase/util";
import useUser from "./useUser";


export default function useFirestoreDocument(collection: string, id: string | null) {
    const firestore: Firestore = useFirestore();
    const {user, loading: userLoading, auth} = useUser();
    const [firestoreDoc, setFirestoreDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<FirebaseError | null>(null);


    useEffect(() => {
        console.log("useFirestoreDocument", collection, id);
        if (!id) {
            setFirestoreDoc(null);
            setLoading(false);
            return;
        } else {
            return onSnapshot(doc(firestore, collection, id), (snap: DocumentSnapshot<any>) => {
                setFirestoreDoc(snap.data());
                setLoading(false);
            }, (error: FirebaseError) => {
                setError(error);
                setLoading(false);
            });
        }
    }, [user?.uid, collection, id]);

    return {firestoreDoc, loading, error};
}