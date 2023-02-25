type AppleSong = {
    id: string;
    type: string;
    href: string;
    attributes: {
        albumName: string;
        discNumber: number;
        genreNames: string[];
        hasLyrics: boolean;
        trackNumber: number;
        releaseDate: string;
        durationInMillis: number;
        name: string;
        artistName: string;
        artwork: {
            width: number;
            height: number;
            url: string;
            hasP3: boolean;
        };
        playParams?: {
            id: string;
            kind: string;
            isLibrary: boolean;
            reporting: boolean;
            catalogId: string;
            reportingId: string;
        };
        contentRating?: string;
    };
}

type ApplePage = {
    data: {id: string }[];
    meta: {
        total: number,
    };
    resources: {
        "library-songs": {
            [key: string]: AppleSong
        };
    }
}
