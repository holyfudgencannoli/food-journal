
export type EntryType = {
    id: number;
    title: string;
    body: string; 
    start: string;
    end: string;
    created_at: string
}

export type CreateEntryParams = {
    title: string;
    body: string;  
    start: string;
    end: string;
    created_at: string
}



export type UpdateEntryParams = {
    title?: string;
    body?: string;  
    start?: string;
    end?: string;
    created_at?: string
}
