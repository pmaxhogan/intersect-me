

interface offsetOpts {
    offset: number;
}

export type fetchApiCallback<T> = (arg0?: offsetOpts) => Promise<{
    body: {
        items: T[],
        next: string | null,
        limit: number
    }
}>;

export interface SavedTrackObject {
    track: {
        href: string;
        album: {
            images: { url: string }[];
        };
        id: string;
        name: string;
        artists: Artists[];
        duration_ms: number;
        type: string;
        is_local: boolean;
    };
}

interface Artists {
    name: string
}
