const client_id = 'ju16a6m81mhid5ue1z3v2g0uh';

interface SlTokenResponse {
    data: {
        sl_token: string;
    };
}

export interface Post {
    id: string;
    from_id: string; // User ID
    from_name: string; // User Name
    created_time: string;
    message: string;
}

export interface PostsResponse {
    data: {
        page: number;
        posts: Post[];
    };
}

async function getSupermetricsRegisterToken(name: string, email: string): Promise<SlTokenResponse> {
    let response = await fetch('https://api.supermetrics.com/assignment/register', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(`name=${name}&email=${email}&client_id=${client_id}`)
    });

    return (await response.json() as SlTokenResponse);
}

async function getSupermetricsPosts(token: string, page: number): Promise<PostsResponse> {
    let response = await fetch(`https://api.supermetrics.com/assignment/posts?sl_token=${token}&page=${page}`);
    return await response.json();
}

async function getSupermetricsPostsByPages(token: string, pages: number[]): Promise<PostsResponse[]> {
    return await Promise.all(
        pages.map(async page => getSupermetricsPosts(token, page))
    );
}

export { getSupermetricsRegisterToken as getRegisterToken, getSupermetricsPostsByPages as getPosts };