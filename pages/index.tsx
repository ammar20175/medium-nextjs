import Banner from "@/components/Banner";
import Header from "@/components/Header";
import Head from "next/head";
import { sanityClient } from "../sanity";
import { BlogPost } from "../typings";
import Post from "@/components/Post";

interface Props {
	posts: [BlogPost];
}

export default function Home({ posts }: Props) {
	return (
		<div className="">
			<Head>
				<title>Medium</title>
			</Head>

			<Header />
			<Banner />

			<section className="max-w-7xl mx-4 lg:mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
				{posts.map(({ _id, slug, title, description, author, mainImage }) => (
					<Post
						key={_id}
						_id={_id}
						slug={slug}
						title={title}
						description={description}
						author={author}
						mainImage={mainImage}
					/>
				))}
			</section>
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
