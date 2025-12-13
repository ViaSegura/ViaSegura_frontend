interface fetchAPIProps {
  url: string;
  options: any;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAPI = async ({ url, options }: fetchAPIProps) => {
  const response = await fetch(`${baseURL}/${url}`, options);

  return response;
};
