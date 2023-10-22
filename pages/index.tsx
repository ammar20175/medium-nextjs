import Banner from "@/components/Banner";
import Header from "@/components/Header";
import Head from "next/head";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
interface Props {
	posts: [Post];
}

export default function Home({ posts }: Props) {
	return (
		<div className="">
			<Head>
				<title>Medium</title>
			</Head>

			<Header />
			<Banner />
		</div>
	);
}

export const getServerSideProps = async () => {
	const query = `*[_type == "post"]{
    _id,
    title,
    author->{
      name,
      image
    },
    description,
    mainImage,
    slug
  }`;

	const posts = await sanityClient.fetch(query);

	return {
		props: {
			posts,
		},
	};
};
