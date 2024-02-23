export interface userDetails {
    username: string | null;
    email: string | null;
    creadorInfo: {
        logo: string|null;
        support_link: string|null;
        support_type: number;
    } | null;
}